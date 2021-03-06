import BaseManager from "../Core/BaseManager";
import LE from "../LitEngine/LE";
import UIBase from "./UIBase";
import GameCore from "../GameCore";
export default class UIManager extends BaseManager {

    public static Creat():UIManager {
        return new UIManager("UIManager");
    }
    private _uiFolder: string = "Prefab/";
    private _uiList: UIBase[] = [];
    public async Init() {
        var tobj = await LE.AssetLoader.LoadAssetAsync(this._uiFolder + "RootNode");
        var toort = cc.instantiate(tobj);
        GameCore.AddLayer(toort);
        this._node = toort;
    }

    public get uiRoot() {
        return this._node;
    }

    public CreatUI(res: any, uiName: string): UIBase {
        var tui = cc.instantiate(res);
        tui.parent = this.uiRoot;
        tui.setPosition(0, 0);
        this._uiList[uiName] = tui.getComponent(UIBase);
        return this._uiList[uiName];
    }

    public async ShowUI(uiName: string, type: typeof cc.Asset = cc.Asset) {
        if (this._uiList[uiName] == null) {
            var assetName = this._uiFolder + uiName;
            var tobj = await LE.AssetLoader.LoadAssetAsync(assetName,type);
            this.CreatUI(tobj, uiName);
        }
        else {
            this._uiList[uiName].node.active = true;
        }
        return this._uiList[uiName];
    }

    public HideUI(uiName: string) {
        if (this._uiList[uiName] == null) return;
        var tui = this._uiList[uiName];
        tui.node.active = false;
    }

    public DestoryUI(uiName: string) {
        if (this._uiList[uiName] != null) {
            var tui = this._uiList[uiName];
            tui.destroy();
            var index = this._uiList.indexOf(tui);
            if (index !== -1)
                this._uiList.splice(index, 1);
        }
        LE.AssetLoader.ReleaseAsset(this._uiFolder + uiName);
    }

    public Update(dt: number) {
        
    }
}
