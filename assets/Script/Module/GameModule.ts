import GameCore from "../GameCore";

export module GameModule{
    export class MainModule implements GameModuleBase{
        async Init() {
            await GameCore.mgrUI.ShowUI("HelloWorld");
        }
        ModuleEvent(...args: any) {

        }        
        Destroy() {

        }
        Update(dt: number) {

        }
        UpdateData() {

        }
        Run() {

        }
        Pause() {

        }
        Resume() {

        }


    }
}