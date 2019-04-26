import BaseManager from "../Core/BaseManager";
import AssetManager from "../LitEngine/AssetManager";
export default class UIManager extends BaseManager {
    private _uiFolder: string = "Prefab/";
    private _uiList: cc.Node[] = [];
    private _uiRoot: cc.Node;
    public async Init() {
        var tobj = await AssetManager.LoadAssetAsync(this._uiFolder + "RootNode");
        var toort = cc.instantiate(tobj);
        cc.game.addPersistRootNode(toort);
        this._uiRoot = toort;
    }

    public get uiRoot() {
        return this._uiRoot;
    }

    public async ShowUI(uiName: string) {
        if (this._uiList[uiName] == null) {
            var tobj = await AssetManager.LoadAssetAsync(this._uiFolder + uiName);
            var tui = cc.instantiate(tobj);
            tui.parent = this.uiRoot;
            tui.setPosition(0, 0);
            this._uiList[uiName] = tui;
        }
        else {
            this._uiList[uiName].active = true;
        }

        return this._uiList[uiName];

    }

    public UpdateManager(dt: number) {

    }
}
