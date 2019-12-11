import { NodeSpace } from "./NodeBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VideoNode extends NodeSpace.NodeBase {

     vPlayer: cc.VideoPlayer;
     vPlayerStartTIme : number;
     aniData: cc.Animation;
     eventList: NodeSpace.NodeEvent[] = [];

     videoReady : boolean = false;
     waitToPlay : boolean = false;

     protected Init(){
          super.Init();
          let p = this;
          p.vPlayer = p.node.getComponent(cc.VideoPlayer);
          p.vPlayerStartTIme = p.vPlayer.currentTime;
          p.aniData = p.node.getComponent(cc.Animation);
          let tcount = p.aniData.defaultClip.events.length;
          let tdatalist = p.aniData.defaultClip.events;
          let thandles = p.events;
          for (let i = 0; i < tcount; i++) {
               if (i >= thandles.length) continue;
               const e = tdatalist[i];
               p.eventList.push(new NodeSpace.NodeEvent(thandles[i], e));
          }

          var videoPlayerEventHandler = new cc.Component.EventHandler();
          videoPlayerEventHandler.target = p.node;
          videoPlayerEventHandler.component = "VideoNode"
          videoPlayerEventHandler.handler = "OnVideoEvent";
          p.vPlayer.videoPlayerEvent.push(videoPlayerEventHandler);
          
     }

     public Play() {
          let p = this;
          if (p.videoReady) {
               p.vPlayer.play();
               super.Play();
               p.waitToPlay = false;
          } else {
               p.waitToPlay = true;
          }

     }
     public Stop() {
          let p = this;
          p.vPlayer.pause();
          super.Stop();
     }
     public Resume() {
          let p = this;
          let tlist = p.eventList;
          for (let i = 0; i < tlist.length; i++) {
               const e = tlist[i];
               e.Rest();
          }
          p.vPlayer.currentTime = p.vPlayerStartTIme;
          p.vPlayer.stop();
          
          super.Resume();
     }

     OnVideoEvent(event,type,pdata)
     {
          let p = this;
          let tvideo: cc.VideoPlayer = event;
          switch (type) {
               case cc.VideoPlayer.EventType.CLICKED:
                    if(p.videoReady && !p.IsPlaying)
                    {
                         p.Play();
                    }else if(p.IsPlaying)
                    {
                         p.Stop();
                    }
                    break;
               case cc.VideoPlayer.EventType.PLAYING:
                    break;
               case cc.VideoPlayer.EventType.PAUSED:
                    break;
               case cc.VideoPlayer.EventType.STOPPED:
                    break;
               case cc.VideoPlayer.EventType.COMPLETED:
                    p.OnComplete();
                    break;
               case cc.VideoPlayer.EventType.READY_TO_PLAY:
                    p.videoReady = true;
                    if(p.waitToPlay && tvideo.mute)
                    {
                         p.Play();
                    }
                    break;

               default:
                    break;
          }
     }

     public UpdateLogic(dt) {

     }

     OnPlaying(dt) {
          let p = this;
          let teventList = p.eventList;
          for (let i = 0; i < teventList.length; i++) {
               const e = teventList[i];
               if(e.Called) continue;
               if(p.vPlayer.currentTime >= e.Time)
               {
                    e.Call();
               }
          }
     }

     OnComplete() {
          this.Stop();
          cc.log("Video complete");
     }
     OnStart() {

     }

     EventCall(pEvent,pData,pD2)
     {
          cc.log(pData);
     }

}