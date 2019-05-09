import BaseManager from "../Core/BaseManager";
import LE from "../LitEngine/LE";
import UIBase from "./UIBase";
export default class UIManager extends BaseManager {
    private _uiFolder: string = "Prefab/";
    private _uiList: UIBase[] = [];
    private _uiRoot: cc.Node;
    public async Init() {
        var tobj = await LE.AssetLoader.LoadAssetAsync(this._uiFolder + "RootNode");
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

    public async ShowUI(uiName: string, type: typeof cc.Asset = cc.Asset, completeCallback: (uiComp: UIBase) => void | null = null) {
        if (this._uiList[uiName] == null) {
            if (completeCallback != null) {
                var uim = this;
                var assetName = this._uiFolder + uiName;
                LE.AssetLoader.LoadAssetAsync(assetName, type, function (erro, resource) {
                    if(erro == null)
                    {
                        var tui = uim.CreatUI(resource, assetName);
                        if (completeCallback != null)
                            completeCallback(tui);
                    } 
                }
                );
            }
            else {
                var tobj = await LE.AssetLoader.LoadAssetAsync(this._uiFolder + uiName);
                this.CreatUI(tobj, uiName);
            }
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

    public UpdateManager(dt: number) {
    }
}
