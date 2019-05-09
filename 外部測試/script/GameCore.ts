import UIManager from "./Managers/UIManager"
import StateManager from "./Managers/StateManager";
import UpdateManager from "./Managers/UpdateManager";
import BaseManager from "./Managers/BaseManager";


export default class GameCore {
    //#region config
    /**
 * <p>缩放模式。默认值为 "noscale"。</p>
 * <p><ul>取值范围：
 * <li>"noscale" ：不缩放；</li>
 * <li>"exactfit" ：全屏不等比缩放；</li>
 * <li>"showall" ：最小比例缩放；</li>
 * <li>"noborder" ：最大比例缩放；</li>
 * <li>"full" ：不缩放，stage的宽高等于屏幕宽高；</li>
 * <li>"fixedwidth" ：宽度不变，高度根据屏幕比缩放；</li>
 * <li>"fixedheight" ：高度不变，宽度根据屏幕比缩放；</li>
 * <li>"fixedauto" ：根据宽高比，自动选择使用fixedwidth或fixedheight；</li>
 * </ul></p>
 */
    static width: number = 720;
    static height: number = 1280;
    static scaleMode: string = "showall";
    static screenMode: string = "none";
    static alignV: string = "center";
    static alignH: string = "middle";
    static startScene: any = "GameStart.scene";
    static sceneRoot: string = "";
    static debug: boolean = false;
    static stat: boolean = true;
    static physicsDebug: boolean = false;
    static exportSceneToJson: boolean = true;
    static dataUpdateInterval = 0.2;
    static openTryCache = false;
    //#endregion
    //#region core核心组件
    private static _core: GameCore = null;
    public static get Core()  {
        if (GameCore._core == null)  {
            GameCore._core = new GameCore();
        }

        return GameCore._core;
    }
    //#region layers
    private _layerLogic: Laya.Node;
    public static get layerLogic() {
        return GameCore.Core._layerLogic;
    }

    private _layerScene: Laya.Sprite;
    public static get layerScene() {
        return GameCore.Core._layerScene;
    }

    private _layerUI: Laya.Sprite;
    public static get layerUI() {
        return GameCore.Core._layerUI;
    }

    private _layerOver: Laya.Sprite;
    public static get layerOver() {
        return GameCore.Core._layerOver;
    }

    //#endregion

    //#region mgrs
    private _uiMgr:UIManager;
    public static get mgrUI()
    {
        return GameCore.Core._uiMgr;
    }

    private _stateMgr:StateManager;
    public static get mgrState()
    {
        return GameCore.Core._stateMgr;
    }
    private _mgrList: BaseManager[] = [];
    private _dataUpdateTimer = 0;
    //#endregion

    //#endregion  
    //#region 方法
    // "showall"
    private constructor() {

    }

    public static Init() {
        if (GameCore._core != null) return;
        GameCore.Core._layerLogic = Laya.stage.addChild(new Laya.Node()) as Laya.Node;
        GameCore.Core._layerScene = Laya.stage.addChild(new Laya.Sprite()) as Laya.Sprite;//可見最底层
        GameCore.Core._layerUI = Laya.stage.addChild(new Laya.Sprite()) as Laya.Sprite;
        GameCore.Core._layerOver = Laya.stage.addChild(new Laya.Sprite()) as Laya.Sprite;

        GameCore.Core._uiMgr = UIManager.Creat();
        GameCore.Core._stateMgr = StateManager.Creat();

        GameCore.Core._mgrList.push(GameCore.Core._uiMgr);
        GameCore.Core._mgrList.push(GameCore.Core._stateMgr);

        Laya.timer.frameLoop(1, GameCore.Core, GameCore.Core.Update);
    }

    public static DestroyCore() {
        if (GameCore._core != null) {
            GameCore._core.Destroy();
            GameCore._core = null;
        }
    }


    public Destroy() {
        this._layerLogic.destroy();
        this._layerScene.destroy();
        this._layerUI.destroy();
        this._layerOver.destroy();
        Laya.timer.clear(GameCore.Core, GameCore.Core.Update);
    }

    private Update()  {
        let dt = Laya.timer.delta;

        let self = this;
        let tinterval = GameCore.dataUpdateInterval;
        let topentry = GameCore.openTryCache;
        let ttimer = self._dataUpdateTimer + dt;    
        let tisUpdateData = false;
        if (ttimer >= tinterval)  {
            tisUpdateData = true;
            self._dataUpdateTimer = ttimer;
        }

        var tlist = this._mgrList;

        for (let index = 0; index < tlist.length; index++) {
            const element = tlist[index];
            if(topentry)
            {
               try {
                self.UpdateElement(element,dt,tisUpdateData);
               } catch (error) {
                   console.error(element.managerName + "---"+error);
               }
            }
            else
            {
                self.UpdateElement(element,dt,tisUpdateData);
            }
            
        }
    }

    private UpdateElement(element:BaseManager,dt:number,isUpdateData:boolean)
    {
        element.Update(dt);
        if (isUpdateData)
            element.UpdateData();
    }
    //#endregion
}