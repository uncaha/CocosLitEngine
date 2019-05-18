import UIManager from "./UI/UIManager";
import BaseManager from "./Core/BaseManager";

import LE from "./LitEngine/LE";
import ConfigManager from "./Managers/ConfigManager";
import StateManager from "./Managers/StateManager";
import MainState from "./State/MainState";


// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameCore extends cc.Component {

    @property({ type: cc.Camera })
    camera: cc.Camera = null;
    @property({ type: cc.Asset })
    mainfiest: cc.Asset = null;

    private static _core: GameCore = null;

    //#region cfg
    static dataUpdateInterval = 0.2;
    static openTryCache = false;
    //#endregion
    private _dataUpdateTimer = 0;
    private _managers: BaseManager[] = [];
    //#region mgrs
    private _mgrUI: UIManager;
    public static get mgrUI(): UIManager {
        return GameCore._core._mgrUI;
    }

    private _mgrConfig: ConfigManager;
    public static get mgrConfig(): ConfigManager {
        return GameCore._core._mgrConfig;
    }

    private _mgrState: StateManager;
    public static get mgrState(): StateManager {
        return GameCore._core._mgrState;
    }
    //#endregion


    private _sceneLayer: cc.Node;

    private constructor() {
        super();
    }
    onLoad() {
        if (GameCore._core) return;
        GameCore._core = this;
        cc.game.addPersistRootNode(this.node);
        this._sceneLayer = new cc.Node("SceneNode");
        this.node.addChild(this._sceneLayer);
        this.Init();
    }

    async Init() {
        let g = this;
        g._mgrUI = UIManager.Creat();
        g._mgrConfig = ConfigManager.Creat();
        g._mgrState = StateManager.Creat();
        g._managers.push(g._mgrUI);
        g._managers.push(g._mgrState);
        for (let i = 0; i < g._managers.length; i++) {
            const e = g._managers[i];
            await e.Init();
        }

        await g._mgrState.GotoState(new MainState());

        //var tar = this;
        // let test =  LE.EventManager.RegEvent("GameCoreEvent", (...args)=>{this.testtt(args);});
        //  LE.EventManager.UnRegEvent("GameCoreEvent",test); 


        // LE.AudioManager.playMusic(this.audio);

        //#region testupdate
        /*
      if (cc.sys.isNative) {
          LE.UpdateManager.SetManifest(this.mainfiest);

          LE.UpdateManager.isNeedUpdate(function (arr) {
              switch (arr.state) {
                  case LE.UpdateManager.UpdateStateType.newVersion:
                      LE.UpdateManager.StartUpdate(function (arr) {
                          switch (arr.code) {
                              case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                                  console.log("ddd--" + arr.updateObj.byteProgress);
                                  break;
                              case jsb.EventAssetsManager.UPDATE_FINISHED:
                                  cc.audioEngine.stopAll();
                                  cc.game.restart();
                                  break;
                              default:
                                  console.log(arr.state + "|" + arr.code + "|" + arr.msg);
                                  break;
                          }

                      });
                      break;
                  case LE.UpdateManager.UpdateStateType.already:
                      break;
                  case LE.UpdateManager.UpdateStateType.checkFailed:
                      break;
              }
              console.log(arr.state + "|" + arr.msg);
          });
      }*/
        //#endregion

    }

    update(dt) {
        let g = this;

        let tinterval = GameCore.dataUpdateInterval;
        let topentry = GameCore.openTryCache;
        let ttimer = g._dataUpdateTimer + dt;
        let tisUpdateData = false;
        if (ttimer >= tinterval) {
            tisUpdateData = true;
            g._dataUpdateTimer = ttimer;
        }

        for (let i = 0; i < g._managers.length; i++) {
            const e = g._managers[i];
            if (topentry) {
                try {
                    g.UpdateElement(e, dt, tisUpdateData);
                } catch (error) {
                    console.error(e.managerName + "---" + error);
                }
            }
            else {
                g.UpdateElement(e, dt, tisUpdateData);
            }
        }
    }

    private UpdateElement(element: BaseManager, dt: number, isUpdateData: boolean) {
        element.Update(dt);
        if (isUpdateData)
            element.UpdateData();
    }

    public static AddLayer(pLayer: cc.Node) {
        if (GameCore._core == null) return;
        GameCore._core.node.addChild(pLayer);
    }

    public static AddSceneChild(pLayer: cc.Node) {
        if (GameCore._core == null) return;
        GameCore._core._sceneLayer.addChild(pLayer);
    }

    public static ClearSceneNode() {
        if (GameCore._core == null) return;
        GameCore._core._sceneLayer.removeAllChildren(true);
    }
}
