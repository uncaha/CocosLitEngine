import UIManager from "./UI/UIManager";
import BaseManager from "./Core/BaseManager";

import LE from "./LitEngine/LE";
import ConfigManager from "./Managers/ConfigManager";
import StateManager from "./Managers/StateManager";
import MainState from "./State/MainState";
import EffectManager from "./Managers/EffectManager";


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
    private managers: BaseManager[] = [];
    private updateList: BaseManager[] = [];
    //#region mgrs
    public static get mgrUI(): UIManager {
        return GameCore._core.managers["UIManager"];
    }

    public static get mgrConfig(): ConfigManager {
        return GameCore._core.managers["ConfigManager"];
    }

    public static get mgrState(): StateManager {
        return GameCore._core.managers["StateManager"];
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
        g.AddMgr(ConfigManager.Creat(),false);
        g.AddMgr(UIManager.Creat());
        g.AddMgr(StateManager.Creat());
        g.AddMgr(EffectManager.Creat());
        for (const key in g.managers) {
            if (g.managers.hasOwnProperty(key)) {
                const e = g.managers[key];
                e.Init();
            }
        }

        await GameCore.mgrState.GotoState(new MainState());

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

    private AddMgr(pMgr:BaseManager,pUpdate:boolean = true)
    {
        let g = this;
        g.managers[pMgr.managerName] = pMgr;
        if(pUpdate){
            g.updateList.push(pMgr);
        }
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

        for (let i = 0; i < g.updateList.length; i++) {
            const e = g.updateList[i];
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
