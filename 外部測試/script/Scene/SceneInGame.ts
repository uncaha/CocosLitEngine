import BaseScene from "./BaseScene";
import GameCore from "../GameCore";

export default class SceneInGame extends BaseScene {
    private _scene: Laya.Scene3D;
    constructor(url: string) {
        super(url);
    }

    public Load(fun: Laya.Handler) {
        super.Load(fun);
        this._maxLoadCount = 1;
        Laya.Scene3D.load(this.SceeneUrl, this.GetHandle("scene"));
    }
    public OnComplete(key, sc) {
        if (this._destroyed) return;
        switch (key) {
            case "scene":
                this._scene = sc;
                GameCore.layerScene.addChild(sc);
                break;
        }

        super.OnComplete(key, sc);
    }

    public Destroy() {
        if (this._scene != null)
            this._scene.destroy();
        super.Destroy();
    }
}