import UIManager from "./UI/UIManager";
import BaseManager from "./Core/BaseManager";
import AssetManager from "./LitEngine/AssetManager";
import LitHttpRequest from "./LitEngine/LitHttpRequest";
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

    private static _core: GameCore;
    private _managers: BaseManager[] = []

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        GameCore._core = this;
        this.Init();
    }

    async Init() {
        this._managers["UIManager"] = new UIManager();

        for (const key in this._managers) {
            if (this._managers.hasOwnProperty(key)) {
                var element = this._managers[key];
                await element.Init();
            }
        }
        await this._managers["UIManager"].ShowUI("HelloWorld");

        LitHttpRequest.Send("www.baidu.com",function(erro,response){
            cc.log(response)
        });
    }

    update(dt) {
        for (const key in this._managers) {
            if (this._managers.hasOwnProperty(key)) {
                var element = this._managers[key];
                element.UpdateManager(dt);
            }
        }
    }
}
