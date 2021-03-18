export module Asset {
    export class AssetLoader {
        public constructor() {

        }

        public LoadAssetCallBack(url: string, completeCallback: ((error: Error, resource: any) => void), type: typeof cc.Asset = cc.Asset, pNeedRetain: boolean = true) {
            var tloader = this;
            tloader.GetAssetResObject(url, type, (erro, resobj) => {
                completeCallback(erro, resobj);
            });
        }

        public async LoadAssetAsync(url: string, type: typeof cc.Asset = cc.Asset, pNeedRetain: boolean = true) {
            var tloader = this;
            var tobj = await tloader.GetPromiseResAsync(url, type);
            return tobj;
        }

        public ReleaseAsset(owner: string) {
            cc.resources.release(owner);
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
            
            cc.resources.load(url, type, (erro, resobj) => {
                if (erro) {
                    cc.error(erro.message || erro);
                }
                completeCallback(erro, resobj);
            });
        }

    }
}
