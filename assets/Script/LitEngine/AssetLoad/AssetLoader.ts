export module LAsset{
    export class AssetLoader {
        private static _instance: AssetLoader = null;
    
        private assets: AssetObject[] = [];
        private constructor() {
    
        }
    
        public static get instance() {
            if (AssetLoader._instance == null)
                AssetLoader._instance = new AssetLoader();
            return AssetLoader._instance;
        }
    
        public static async LoadUrl(resources: string | string[] | { uuid?: string, url?: string, type?: string }, completeCallback: ((erro: Error, res: any) => void) | null = null) {
            if (completeCallback != null) {
                AssetLoader.instance.GetUrlObject(resources, function (err, resobj) {
                    completeCallback(err, resobj);
                });
            }
            else {
                return await AssetLoader.instance.GetUrlRes(resources);
            }
    
        }
    
        private async GetUrlRes(resources: string | string[] | { uuid?: string, url?: string, type?: string }): Promise<any> {
            return new Promise<any>(resolve => {
                AssetLoader.instance.GetUrlObject(resources, function (err, resobj) {
                    if (err) {
                        cc.error(err.message || err);
                    }
                    resolve(resobj);
                });
            });
        }
    
        private GetUrlObject(resources: string | string[] | { uuid?: string, url?: string, type?: string }, completeCallback: ((erro: Error, res: any) => void)) {
            cc.loader.load(resources, function (err, resobj) {
                if (err) {
                    cc.error(err.message || err);
                }
                completeCallback(err, resobj);
            });
        }
    
        public static async LoadAssetAsync(url: string, type: typeof cc.Asset = cc.Asset, completeCallback: ((error: Error, resource: any) => void) | null = null) {
    
            if (completeCallback != null) {
                AssetLoader.instance.GetAssetResObject(url, type, function (erro, resobj) {
                    if (resobj != null)
                        this.RetainAsset(url);
                    completeCallback(erro, resobj);
                });
            }
            else {
                var tobj = await AssetLoader.instance.GetPromiseAsync(url, type);
                if (tobj != null)
                    AssetLoader.instance.RetainAsset(url);
                return tobj;
            }
        }
    
        private RetainAsset(url: string) {
    
            var deps = cc.loader.getDependsRecursively(url);
    
            for (var i = 0; i < deps.length; ++i) {
                var tuuid = deps[i].toString();
                if (!AssetLoader.instance.assets.hasOwnProperty(tuuid)) {
                    this.assets[tuuid] = new AssetObject(tuuid);
                }
                this.assets[deps[i]].retain();
            }
        }
    
        public static async ReleaseAsset(owner: string) {
            var a = AssetLoader.instance;
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
    
        private async GetPromiseAsync(url: string, type: typeof cc.Asset = cc.Asset): Promise<any> {
            return new Promise<any>(resolve => {
                AssetLoader.instance.GetAssetResObject(url, type, function (erro, resobj) {
                    if (erro) {
                        cc.error(erro.message || erro);
                    }
                    resolve(resobj);
                });
            });
    
        }
    
        private GetAssetResObject(url: string, type: typeof cc.Asset, completeCallback: ((error: Error, resource: any) => void) | null) {
            cc.loader.loadRes(url, type, function (erro, resobj) {
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
