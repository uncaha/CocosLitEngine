import AudioManager from "../LitEngine/Audio/AudioManager";

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
export default class UIBase extends cc.Component {
    @property({type:[cc.AudioClip]})
    audios:cc.AudioClip[] = []; 
    
    onLoad () {

    }

    start () {

    }

    public BtnCall(event:any,key:string)
    {

    }

    public play(event:any,index:number)
    {
        if(index >= this.audios.length) return;
        AudioManager.playMixerSound(this.audios[index]);
    }

    // update (dt) {}
}
