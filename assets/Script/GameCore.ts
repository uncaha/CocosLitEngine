import UIManager from "./UI/UIManager";
import BaseManager from "./Core/BaseManager";

import LitEngine from "./LitEngine/LitEngine";

//import AssetManager from "./LitEngine/AssetManager";

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

    @property({type:cc.RawAsset})
    mainfiest:cc.RawAsset = null; 
    @property({type:cc.AudioClip})
    audio:cc.AudioClip = null; 

    private static _core :GameCore = null;
    private _managers : BaseManager[] = [];

    private eventCall:any;
    onLoad() {
        if(GameCore._core) return;
        cc.game.addPersistRootNode(this.node);
        GameCore._core = this;
        this.Init();
    }

    async Init() {
        this._managers["UIManager"] = new UIManager();

        for (let key in this._managers) {
            if (this._managers.hasOwnProperty(key)) {
                let element = this._managers[key];
                await element.Init();
            }
        }
        await GameCore.GetMng("UIManager").ShowUI("HelloWorld");

        var tar = this;
        this.eventCall = function(args:any[])
        {
            cc.log(tar,args[0]);
        }
        LitEngine.EventManager.RegEvent("GameCoreEvent",this.eventCall);
        //LitEngine.EventManager.UnRegEvent("GameCoreEvent",this.eventCall); 


        LitEngine.AudioManager.playMusic(this.audio);

        // console.log(jsb.fileUtils.getSearchPaths());
        // console.log(jsb.fileUtils.getWritablePath());
        if (cc.sys.isNative) {
            LitEngine.UpdateManager.SetManifest(this.mainfiest);
           
            LitEngine.UpdateManager.isNeedUpdate(function(arr){
                switch (arr.state) {
                    case LitEngine.UpdateManager.UpdateStateType.newVersion:
                        LitEngine.UpdateManager.StartUpdate(function(arr){
                            switch(arr.code)
                            {
                                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                                console.log("ddd--"+arr.updateObj.byteProgress);
                                break;
                                case jsb.EventAssetsManager.UPDATE_FINISHED:
                                    cc.audioEngine.stopAll();
                                    cc.game.restart();
                                break;
                                default:
                                console.log(arr.state +"|" + arr.code + "|"+arr.msg);
                                break;
                            }
                            
                        });
                        break;
                    case LitEngine.UpdateManager.UpdateStateType.already:
                        break;
                    case LitEngine.UpdateManager.UpdateStateType.checkFailed:
                        break;
                }
                console.log(arr.state + "|"+arr.msg);
            });
        }
       // cc.log(jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST);
       // var searchPaths = jsb.fileUtils.getSearchPaths();
        //cc.log(searchPaths);
        // var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "blackjack-remote-asset";
        // cc.log("Storage path for remote asset : " + storagePath);
        // var _am = new jsb.AssetsManager("", storagePath);
        
    }

    update(dt) {
        for (let key in this._managers) {
            if (this._managers.hasOwnProperty(key)) {
                let element = this._managers[key];
                element.UpdateManager(dt);
            }
        }
    }

    public static GetMng(keyname:string)
    {
        return GameCore._core._managers[keyname];
    }
}
