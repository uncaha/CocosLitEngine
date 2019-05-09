


export enum StateType {
    none = 0,
    onEnter,
    onExit,
    onNormal,
}
export default class StateBase {
    public readonly name: string;
    protected _state: StateType = StateType.none;
    protected _onLoaded: Laya.Handler;
    public get State()  {
        return this._state;
    }
    constructor(nstr: string) {
        this.name = nstr;
    }
    public OnEnter(fun: Laya.Handler) {
        this._state = StateType.onEnter;
        this._onLoaded = fun;
    }

    public OnExit() {
        this._state = StateType.onExit;
    }

    protected OnLoaded() {
        this._state = StateType.onNormal;
        if (this._onLoaded != null)
            this._onLoaded.run();
    }

    public Update(dt: number) {

    }

    public UpdateData() {

    }
}