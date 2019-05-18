import { State } from "./StateBase";
import GameCore from "../GameCore";

export default class MainState extends State.StateBase {
    constructor() {
        super("MainState");
    }
    public async OnEnter(pData?:any) {
        super.OnEnter(pData);
        await GameCore.mgrUI.ShowUI("HelloWorld");
    }

    public OnExit() {
        super.OnExit();
    }

    protected OnLoaded()  {
        super.OnLoaded();
    }

}