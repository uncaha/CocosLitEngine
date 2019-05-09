import BaseScene from "../Scene/BaseScene";
import SceneInGame from "../Scene/SceneInGame";
import GameCore from "../GameCore";
export default class InGameModule implements GameModuleBase {
    protected _scene:BaseScene;
    protected _loadCompleteHandle:Laya.Handler;
    constructor() {
    }
    public Init(fun: Laya.Handler){
        this._scene = new SceneInGame('testscene/level1.ls');
        this._loadCompleteHandle = fun;
        this._scene.Load(Laya.Handler.create(this,this.OnSceneLoaded));
    }

    protected OnSceneLoaded(obj)
    {
        GameCore.mgrUI.ShowUI("UIInGame",Laya.Handler.create(this, this.OnUILoaded));
    }

    protected OnUILoaded()
    {
        if (this._loadCompleteHandle != null)
            this._loadCompleteHandle.run();
    }

    public Run(){}
    public Pause(){}
    public Resume(){}
    public Destroy(){
        if(this._scene != null)
            this._scene.Destroy();
        GameCore.mgrUI.DestoryUI("UIInGame");
    }

    public Update(dt: number) {

    }

    public UpdateData() {

    }
}