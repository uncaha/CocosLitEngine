
const { ccclass, property } = cc._decorator;
export module NodeSpace {
    export enum NodeState
    {
        none = 0,
        normal,
        playing,
        stop,
    }

    @ccclass
    export abstract class NodeBase extends cc.Component {

        @property({ type: [cc.Component.EventHandler] })
        events: cc.Component.EventHandler[] = [];

        @property()
        autoPlay: boolean = false;

        childNode: NodeBase[] = [];

        isInited: boolean;
        state : NodeState = NodeState.normal;
        public get State():NodeState
        {
            return this.state;
        }
        public get IsPlaying():boolean
        {
            return this.state == NodeState.playing;
        }
        onLoad() {
            let p = this;
            if (p.autoPlay) {
                p.InitNode();
                p.Play();
            }
        }

        protected Init() {
            this.isInited = true;
            let p = this;
            let tnodes = p.node.children;
            tnodes.forEach(e => {
                let tcomp = e.getComponent(NodeBase);
                tcomp.Init();
                p.childNode.push(tcomp);
            });
        }

        public InitNode() {
            if (this.isInited) return;
            this.isInited = true;
            this.Init();
        }

        public Play() {
            let p = this;
            p.state = NodeState.playing;
            p.OnStart();
        }
        public Stop() {
            let p = this;
            p.state = NodeState.stop;
        }
        public Resume() {
            let p = this;
            p.state = NodeState.normal;
            p.Play();
        }

        update(dt) {
            let p = this;
            if (p.IsPlaying) {
                p.OnPlaying(dt);
            }
            p.UpdateLogic(dt);
        }

        public abstract UpdateLogic(dt);

        abstract OnPlaying(dt);
        abstract OnComplete();
        abstract OnStart();
    }
    
    export class NodeEvent {
        protected _time: number;
        protected _event: cc.Component.EventHandler;
        protected _called: boolean;
        protected _customDatas: string[];

        public get Time() {
            return this._time;
        }
        public get Event() {
            return this._event;
        }
        public get Called() {
            return this._called;
        }

        constructor(pHandle: cc.Component.EventHandler, pAniData: { frame: number, func: string, params: string[] }) {
            let p = this;
            p._event = pHandle;
            p._customDatas = pAniData.params;
            p._called = false;
            p._time = pAniData.frame ;
        }

        public Rest() {
            let p = this;
            p._called = false;
        }

        public Call() {
            let p = this;
            if (p._called) return;
            p._called = true;
            p._event.emit([p._event.customEventData]);
        }
    }

}

