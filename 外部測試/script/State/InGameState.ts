import StateBase from "./StateBase";
import GameCore from "../GameCore";
import BaseScene from "../Scene/BaseScene";
import SceneInGame from "../Scene/SceneInGame";

export default class InGameState extends StateBase {

    private scene : BaseScene;
    constructor()  {
        super("InGameState");
    }
    public OnEnter(fun: Laya.Handler)  {
        super.OnEnter(fun);
        this.scene = new SceneInGame('testscene/level1.ls');
        var tstate = this;
        this.scene.Load(Laya.Handler.create(this,function(obj){
            GameCore.mgrUI.ShowUI("UIInGame",Laya.Handler.create(this,function(){
                this.OnLoaded();
            }));
        }));

    }

    public OnExit() {
        GameCore.mgrUI.DestoryUI("UIInGame");
        this.scene.Destroy();
        super.OnExit();
    }

    protected OnLoaded()
    {
        super.OnLoaded();
    }

    public Update(dt: number) {
        
    }
}