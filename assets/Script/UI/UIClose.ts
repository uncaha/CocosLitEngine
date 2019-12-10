import UIBase from "./UIBase";
import LE from "../LitEngine/LE";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIClose extends UIBase {
    @property({ type: cc.Component.EventHandler})
    tss:cc.Component.EventHandler; 
    
    ani :cc.Animation;
    mvideo :cc.VideoPlayer;
    onLoad () {
        //this.mvideo = this.node.getComponent(cc.VideoPlayer);
      //  this.mvideo.node.on('ready-to-play', this.testCall22, this);

        var videoPlayerEventHandler = new cc.Component.EventHandler();
        videoPlayerEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        videoPlayerEventHandler.component = "UIClose"
        videoPlayerEventHandler.handler = "test1";
        videoPlayerEventHandler.customEventData = "123";

        this.mvideo = this.node.getComponent(cc.VideoPlayer);
        this.mvideo.videoPlayerEvent.push(videoPlayerEventHandler);

        this.ani = this.node.getComponent(cc.Animation);

        this.tss.emit([this.tss.customEventData]);
    }

    start () {

    }

    timer :number = 0;;
    isStart : boolean = false;
    update(dt){
        let p = this;
        if(!p.isStart) return;
    }  

    public BtnCall(event:any,key:string)
    {
        
        switch (key)
        {
            case "1":
            break;
        }

    }

    public test1(event,type,pdata)
    {
        let tvideo : cc.VideoPlayer = event;
        switch (type) {
            case cc.VideoPlayer.EventType.CLICKED:
               // tvideo.play();
                this.isStart = true;
                break;
            case cc.VideoPlayer.EventType.PLAYING:
                
                break;
        
            default:
                break;
        }
    }

    public TestEvent(event,pkey:string)
    {
        cc.log(pkey);
    }

    public testCall22(event)
    {
        let tv = event;
        tv.play();
        
    }

    // update (dt) {}
}
