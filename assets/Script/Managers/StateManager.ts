
import BaseManager from "../Core/BaseManager";
import { State } from "../State/StateBase";

export default class StateManager extends BaseManager {
    public static Creat(): StateManager {
        return new StateManager("StateManager");
    }

    private _curState: State.StateBase;

    public async Init()
    {

    }

    public async GotoState(state: State.StateBase,pData?:any) {
        let tlast = this._curState;

        if (tlast != null) {
            if (tlast.name == state.name || tlast.State == State.StateType.onEnter)
                return;
            tlast.OnExit();
        }
        this._curState = state;
        await state.OnEnter(pData);
    }

    public Update(dt: number) {
        var tcur = this._curState;
        if (tcur != null && tcur.State == State.StateType.Loaded) {
            tcur.Update(dt);
        }
    }

    public UpdateData() {
        var tcur = this._curState;
        if (tcur != null && tcur.State == State.StateType.Loaded) {
            tcur.UpdateData();
        }
    }
}