import AssetObject from "./AssetLoad/AssetObject"
export default class AssetManager {
    private static _instance: AssetManager = null;

    private assets:AssetObject[] = [];
    private constructor(){

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
            completeCallback(erro, resobj);
        });
    }

    public static async LoadAssetAsync(url: string, type: typeof cc.Asset = cc.Asset) {
        var tobj = await AssetManager.instance.GetResAsync(url, type);
        if(!AssetManager.instance.assets.hasOwnProperty(url))
        {
            AssetManager.instance.assets[url] = new AssetObject(url);
        }
        AssetManager.instance.assets[url].retain();
        cc.log(AssetManager.instance.assets[url]);
        return tobj;
    }

    private async GetResAsync(pfbname: string, type: typeof cc.Asset): Promise<cc.Node> {
        return new Promise<cc.Node>(resolve => {
            cc.loader.loadRes(pfbname, type, function (erro, resobj) {
                if (erro) {
                    cc.error(erro.message || erro);
                }
                resolve(resobj);
            });

        });

    }

}
