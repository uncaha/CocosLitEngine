
export module State{
    export enum StateType {
        none = 0,
        onEnter,
        onExit,
        Loaded,
    }
    export abstract class StateBase implements IUpdate {
        public readonly name: string;
        protected _state: StateType = StateType.none;
        protected _module : GameModuleBase;
        public get State()  {
            return this._state;
        }
        constructor(nstr: string) {
            this.name = nstr;
        }
        public async OnEnter(pData?:any) {
            this._state = StateType.onEnter;
        }
    
        public OnExit() {
            var tmodule = this._module;
            if (tmodule != null)
                tmodule.Destroy();
            this._state = StateType.onExit;
        }
    
        protected OnLoaded() {
            this._state = StateType.Loaded;
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
    
}
