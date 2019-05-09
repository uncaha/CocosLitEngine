import StateBase from "./StateBase";
import GameCore from "../GameCore";

export default class MainState extends StateBase {
    constructor() {
        super("MainState");
    }
    public OnEnter(fun: Laya.Handler) {
        super.OnEnter(fun);

        GameCore.mgrUI.ShowUI("UIMain", Laya.Handler.create(this, function () {
            this.OnLoaded();
        }));
    }

    public OnExit() {
        GameCore.mgrUI.DestoryUI("UIMain");
        super.OnExit();
    }

    protected OnLoaded()  {
        super.OnLoaded();
    }

}