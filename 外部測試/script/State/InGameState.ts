import StateBase from "./StateBase";
import GameCore from "../GameCore";
import BaseScene from "../Scene/BaseScene";
import SceneInGame from "../Scene/SceneInGame";
import InGameModule from "../Module/InGameModule";

export default class InGameState extends StateBase {

    constructor() {
        super("InGameState");
    }
    public OnEnter(fun: Laya.Handler) {
        super.OnEnter(fun);
        this._module = new InGameModule();
        this._module.Init(Laya.Handler.create(this, this.OnGameLoaded));
    }

    protected OnGameLoaded(obj)  {
        this.OnLoaded();
    }

    public OnExit() {
        super.OnExit();
    }

    protected OnLoaded()  {
        super.OnLoaded();
    }

    public Update(dt: number) {
        super.Update(dt);
    }

    public UpdateData() {
        super.UpdateData();
    }
}