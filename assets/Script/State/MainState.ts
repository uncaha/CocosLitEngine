import { State } from "./StateBase";
import { GameModule } from "../Module/GameModule";

export default class MainState extends State.StateBase {
    constructor() {
        super("MainState");
    }
    public async OnEnter(pData?:any) {
        super.OnEnter(pData);
        var tmd = new GameModule.MainModule();
        this.module = tmd;
        await tmd.Init();
    }

    public OnExit() {
        super.OnExit();
    }

    protected OnLoaded()  {
        super.OnLoaded();
    }

}