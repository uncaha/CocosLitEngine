import AssetObject from "./AssetLoad/AssetObject"
export default class AssetManager {
    private static _instance: AssetManager = null;

    private assets: AssetObject[] = [];
    private constructor() {

    }

    public static get instance() {
        if (AssetManager._instance == null)
            AssetManager._instance = new AssetManager();
        return AssetManager._instance;
    }

    public static LoadAssetCallBack(url: string, type: typeof cc.Asset, completeCallback: ((error: Error, resource: any) => void) | null) {
        cc.loader.loadRes(url, type, function (erro, resobj) {
            if (erro) {
                cc.error(erro.message || erro);
            }
            AssetManager.instance.RetainAsset(url);
            completeCallback(erro, resobj);
        });
    }

    public static async LoadAssetAsync(url: string, type: typeof cc.Asset = cc.Asset) {
        var tobj = await AssetManager.instance.GetResAsync(url, type);
        AssetManager.instance.RetainAsset(url);
        return tobj;
    }

    private RetainAsset(url: string) {

        var deps = cc.loader.getDependsRecursively(url);

        for (var i = 0; i < deps.length; ++i) {
            var tuuid = deps[i].toString();
            if (!AssetManager.instance.assets.hasOwnProperty(tuuid)) {
                this.assets[tuuid] = new AssetObject(tuuid);
            }
            this.assets[deps[i]].retain();
        }
    }

    public static ReleaseAsset(owner: string) {
        AssetManager.instance.ReleaseAsset(owner);
    }

    private async ReleaseAsset(owner: string) {
        var deps = cc.loader.getDependsRecursively(owner);
        var reflist: string[] = [];
        for (var i = 0; i < deps.length; ++i) {
            var tuuid = deps[i].toString();
            if (AssetManager.instance.assets.hasOwnProperty(tuuid)) {
                var tobj = this.assets[tuuid];
                tobj.Release();
                if (tobj.assetUsedCount > 0) {
                    reflist[i] = tuuid;
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

    private async GetResAsync(pfbname: string, type: typeof cc.Asset): Promise<any> {
        return new Promise<any>(resolve => {
            cc.loader.loadRes(pfbname, type, function (erro, resobj) {
                if (erro) {
                    cc.error(erro.message || erro);
                }
                resolve(resobj);
            });

        });

    }

}
