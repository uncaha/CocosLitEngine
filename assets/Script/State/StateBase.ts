
export module State{
    export enum StateType {
        none = 0,
        onEnter,
        onExit,
        Loaded,
    }
    export abstract class StateBase implements IUpdate {
        public readonly name: string;
        protected state: StateType = StateType.none;
        protected module : GameModuleBase;
        public get State()  {
            return this.state;
        }
        constructor(nstr: string) {
            this.name = nstr;
        }
        public async OnEnter(pData?:any) {
            this.state = StateType.onEnter;
        }
    
        public OnExit() {
            var tmodule = this.module;
            if (tmodule != null)
                tmodule.Destroy();
            this.state = StateType.onExit;
        }
    
        protected OnLoaded() {
            this.state = StateType.Loaded;
        }
    
        public Update(dt: number) {
            var tmodule = this.module;
            if(tmodule != null)
                tmodule.Update(dt);
        }
    
        public UpdateData() {
            var tmodule = this.module;
            if(tmodule != null)
                tmodule.UpdateData();
        }
    }
    
}
