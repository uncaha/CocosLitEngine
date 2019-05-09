
import GameCore from "../GameCore";
import BaseManager from "./BaseManager";
import StateBase, { StateType } from "../State/StateBase";

export default class StateManager extends BaseManager {
    public static Creat(): StateManager {
        return new StateManager(null);
    }

    private _curState: StateBase;
    private _lastState: StateBase;
    private constructor(nd: Laya.Node) {
        super(nd, "StateManager");
    }

    public GotoState(state: StateBase) {
        var tlast = this._curState;
        Laya.loader.clearUnLoaded();//必须确保切换前没有正在加载的资源.否则会有内存问题
        if (tlast != null) {
            if (tlast.name == state.name)
                return;
            this._lastState = tlast;
            this._lastState.OnExit();
        }
        this._curState = state;
        state.OnEnter(Laya.Handler.create(this, this.OnCurStateLoaded));
    }

    protected OnCurStateLoaded()  {
        // if (this._lastState != null)
        //     this._lastState.OnExit();
        Laya.Resource.destroyUnusedResources();
    }

    public Update(dt: number) {
        var tcur = this._curState;
        if (tcur != null && tcur.State == StateType.onNormal) {
            tcur.Update(dt);
        }
    }

    public UpdateData() {
        var tcur = this._curState;
        if (tcur != null && tcur.State == StateType.onNormal) {
            tcur.UpdateData();
        }
    }
}