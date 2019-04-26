import BaseManager from "../Core/BaseManager";
import AssetManager from "../LitEngine/AssetManager";
import UIBase from "./UIBase";
export default class UIManager extends BaseManager {
    private _uiFolder: string = "Prefab/";
    private _uiList: UIBase[] = [];
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

    public CreatUI(res: any, uiName: string): UIBase {
        var tui = cc.instantiate(res);
        tui.parent = this.uiRoot;
        tui.setPosition(0, 0);
        this._uiList[uiName] = tui.getComponent(UIBase);
        return this._uiList[uiName];
    }

    public ShowUICallBack(uiName: string, completeCallback: (uiComp: UIBase) => void | null) {
        if (this._uiList[uiName] == null) {
            var uim = this;
            var assetName = this._uiFolder + uiName;
            AssetManager.LoadAssetCallBack(assetName, cc.Asset, function (erro, resource) {
                var tui = uim.CreatUI(resource, assetName);
                if (completeCallback != null)
                    completeCallback(tui);
            }
            );
        }
        else {
            this._uiList[uiName].node.active = true;
        }
    }

    public async ShowUI(uiName: string) {
        if (this._uiList[uiName] == null) {
            var tobj = await AssetManager.LoadAssetAsync(this._uiFolder + uiName);
            this.CreatUI(tobj, uiName);
        }
        else {
            this._uiList[uiName].node.active = true;
        }
        return this._uiList[uiName];
    }

    public DestoryUI(uiName: string) {
        if (this._uiList[uiName] != null) {
            var tui = this._uiList[uiName];
            tui.destroy();
            var index = this._uiList.indexOf(tui);
            if (index !== -1)
                this._uiList.splice(index, 1);
        }
        AssetManager.ReleaseAsset(this._uiFolder + uiName);
    }

    public UpdateManager(dt: number) {

    }
}
