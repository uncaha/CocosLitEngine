import BaseManager from "../Core/BaseManager";
import LE from "../LitEngine/LE";


export default class ConfigManager extends BaseManager {

    public static Creat(): ConfigManager {
        return new ConfigManager("ConfigManager");
    }

    private configList: any[] = [];

    public async Init()
    {
        let p = this;
        let tcfg = await LE.AssetLoader.LoadAssetAsync("Config/ConfigList.json",cc.Asset,false);

        var tlist = tcfg.json.configList;
        for (let i = 0; i < tlist.length; i++) {
            let e = tlist[i];
            let obj = await LE.AssetLoader.LoadAssetAsync(e.filePath,cc.JsonAsset,false);
            p.configList[e.key,obj.json];
        }
    }

    public GetConfig(key:string)
    {
        let tcfglist = this.configList;
        if(tcfglist[key] == null)
        {
            console.error("Cant not found config.key = " + key);
            return null;
        }
        return tcfglist[key];
    }

}