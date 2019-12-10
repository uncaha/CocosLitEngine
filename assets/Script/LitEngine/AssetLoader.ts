export module Asset {
    export class AssetLoader {
        private assets: AssetObject[] = [];
        public constructor() {

        }

        public async LoadUrlCallBack(resources: string | string[] | { uuid?: string, url?: string, type?: string }, completeCallback: ((erro: Error, res: any) => void)) {
            this.GetUrlObject(resources, (err, resobj) => {
                completeCallback(err, resobj);
            });
        }

        public async LoadUrl(resources: string | string[] | { uuid?: string, url?: string, type?: string }) {
            return await this.GetUrlRes(resources);
        }

        private async GetUrlRes(resources: string | string[] | { uuid?: string, url?: string, type?: string }): Promise<any> {
            var tloader = this;
            return new Promise<any>(resolve => {
                tloader.GetUrlObject(resources, (err, resobj) => {
                    if (err) {
                        cc.error(err.message || err);
                    }
                    resolve(resobj);
                });
            });
        }

        private GetUrlObject(resources: string | string[] | { uuid?: string, url?: string, type?: string }, completeCallback: ((erro: Error, res: any) => void)) {
            cc.loader.load(resources, (err, resobj) => {
                if (err) {
                    cc.error(err.message || err);
                }
                completeCallback(err, resobj);
            });
        }

        public LoadAssetCallBack(url: string, completeCallback: ((error: Error, resource: any) => void), type: typeof cc.Asset = cc.Asset, pNeedRetain: boolean = true) {
            var tloader = this;
            tloader.GetAssetResObject(url, type, (erro, resobj) => {
                if (resobj != null && pNeedRetain)
                    tloader.RetainAsset(url);
                completeCallback(erro, resobj);
            });
        }

        public async LoadAssetAsync(url: string, type: typeof cc.Asset = cc.Asset, pNeedRetain: boolean = true) {
            var tloader = this;
            var tobj = await tloader.GetPromiseResAsync(url, type);
            if (tobj != null && pNeedRetain) {
                tloader.RetainAsset(url);
            }
            return tobj;
        }

        private RetainAsset(url: string) {
            var tloader = this;
            var deps = cc.loader.getDependsRecursively(url);

            for (var i = 0; i < deps.length; ++i) {
                var tuuid = deps[i].toString();
                if (!tloader.assets.hasOwnProperty(tuuid)) {
                    this.assets[tuuid] = new AssetObject(tuuid);
                }
                this.assets[deps[i]].retain();
            }
        }

        public ReleaseAsset(owner: string) {
            var a = this;
            var deps = cc.loader.getDependsRecursively(owner);
            var reflist: string[] = [];
            for (var i = 0; i < deps.length; ++i) {
                var tuuid = deps[i].toString();
                if (a.assets.hasOwnProperty(tuuid)) {
                    var tobj = a.assets[tuuid];
                    tobj.Release();
                    if (tobj.assetUsedCount > 0) {
                        reflist.push(tuuid)
                    }
                }
            }
            for (let i = 0; i < reflist.length; i++) {
                var element = reflist[i];
                var index = deps.indexOf(element);
                if (index !== -1)
                    deps.splice(index, 1);

            }
            cc.loader.release(deps);
        }

        private async GetPromiseResAsync(url: string, type: typeof cc.Asset = cc.Asset): Promise<any> {
            var tloader = this;
            return new Promise<any>(resolve => {
                tloader.GetAssetResObject(url, type, (erro, resobj) => {
                    if (erro) {
                        cc.error(erro.message || erro);
                    }
                    resolve(resobj);
                });
            });

        }

        private GetAssetResObject(url: string, type: typeof cc.Asset, completeCallback: ((error: Error, resource: any) => void) | null) {
            cc.loader.loadRes(url, type, (erro, resobj) => {
                if (erro) {
                    cc.error(erro.message || erro);
                }
                completeCallback(erro, resobj);
            });
        }

    }

    export class AssetObject {
        private _assetKey: string;
        private _assetUsedCount: number = 0;
        constructor(assetKey: string) {
            this._assetKey = assetKey;
        }

        public get assetKey() {
            return this._assetKey;
        }

        public get assetUsedCount() {
            return this._assetUsedCount;
        }

        public retain() {
            this._assetUsedCount += 1;
        }

        public Release() {
            this._assetUsedCount -= 1;
            if (this._assetUsedCount < 0)
                this._assetUsedCount = 0;
        }
    }
}
