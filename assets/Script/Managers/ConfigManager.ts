import BaseManager from "../Core/BaseManager";


export default class ConfigManager extends BaseManager {

    public static Creat(): ConfigManager {
        return new ConfigManager("ConfigManager");
    }

    private _loadCall: any;

    private _configList: any[] = [];
    private _cfgListObj: any;

    public async Init()
    {

    }

    protected OnListLoaded(pListobj)  {
        // this._cfgListObj = pListobj;
        // var assets: string[] = [];
        // var tlist = this._cfgListObj.configList;
        // for (let index = 0; index < tlist.length; index++) {
        //     assets.push(tlist[index].filePath);
        // }
        // Laya.loader.create(assets, Laya.Handler.create(this, this.OnCfgLoaded));
    }

    protected OnCfgLoaded()  {
        // let tcfglist = this._configList;
        // let tlist = this._cfgListObj.configList;
        // for (let index = 0; index < tlist.length; index++) {
        //     const elment = tlist[index];
        //     let tcfg = Laya.Loader.getRes(elment.filePath);
        //     tcfglist[elment.key] = tcfg;
        // }

        // if (this._loadCall != null)
        //     this._loadCall.run();

    }

    public GetConfig(key:string)
    {
        let tcfglist = this._configList;
        if(tcfglist[key] == null)
        {
            console.error("Cant not found config.key = " + key);
            return null;
        }
        return tcfglist[key];
    }

}