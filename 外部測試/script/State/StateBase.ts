
export enum StateType {
    none = 0,
    onEnter,
    onExit,
    onNormal,
}
export default abstract class StateBase implements IUpdate {
    public readonly name: string;
    protected _state: StateType = StateType.none;
    protected _module : GameModuleBase;
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
        var tmodule = this._module;
        if (tmodule != null)
            tmodule.Destroy();
        this._state = StateType.onExit;
    }

    protected OnLoaded() {
        this._state = StateType.onNormal;
        if (this._onLoaded != null)
            this._onLoaded.run();
    }

    public Update(dt: number) {
        var tmodule = this._module;
        if(tmodule != null)
            tmodule.Update(dt);
    }

    public UpdateData() {
        var tmodule = this._module;
        if(tmodule != null)
            tmodule.UpdateData();
    }
}