import UIManager from "./UI/UIManager";
import BaseManager from "./Core/BaseManager";
import AssetManager from "./LitEngine/AssetManager";
import LitHttpRequest from "./LitEngine/Net/HttpNet";
import WebSocketNet, { SocketNetState } from "./LitEngine/Net/WebSocketNet";
import HttpNet from "./LitEngine/Net/HttpNet";
import EventManager from "./LitEngine/EventManager";
import PlayerData from "./LitEngine/Data/PlayerData";
import PlayerInfo from "./Player/PlayerInfo";
import AudioManager from "./LitEngine/AudioManager";
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
        EventManager.RegEvent("GameCoreEvent",this.eventCall);
        //EventManager.UnRegEvent("GameCoreEvent",this.eventCall); 

        AudioManager.playMusic(this.audio);
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
