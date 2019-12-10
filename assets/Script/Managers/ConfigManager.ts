import BaseManager from "../Core/BaseManager";
import LE from "../LitEngine/LE";
import ItemConfig from "../Config/ItemConfig"
export module Config{
    export class ConfigGroup {
        public _count: number;
        public get Count(): number {
            return this._count;
        }

        public Add(pId: string, pItem: any) {
            this[pId] = pItem;
            this._count++;
        }
    }
    export class ConfigManager extends BaseManager {

        public static Creat(): ConfigManager {
            return new ConfigManager("ConfigManager");
        }
    
        private configList: any[] = [];
    
        public async Init()
        {
            // let p = this;
            // let tcfg = await LE.AssetLoader.LoadAssetAsync("Config/ConfigList",cc.JsonAsset,false);
    
            // var tlist = tcfg.json.configList;
            // for (let i = 0; i < tlist.length; i++) {
            //     let e = tlist[i];
            //     let obj = await LE.AssetLoader.LoadAssetAsync(e.filePath,cc.JsonAsset,false);
            //     p.configList[e.key,obj.json];
            // }
            
            let p = this;
            p["ItemConfig"] = new ItemConfig();
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
}
