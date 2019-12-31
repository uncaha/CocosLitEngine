
const { ccclass, property,inspector } = cc._decorator;
export module NodeSpace {
    export enum NodeState
    {
        none = 0,
        normal,
        playing,
        pause,
    }
    @ccclass("NodeEventGroup")
    export class NodeEventGroup
    {
        @property()
        key:string = "";
        @property({ type: [cc.Component.EventHandler] })
        handlers: cc.Component.EventHandler[] = [];
        public Call()
        {
            let p = this;
            p.handlers.forEach(e => {
                e.emit([e.customEventData]);
            });
        }
    }

    @ccclass
    @inspector("packages://leveltool/nodebase.js")
    export abstract class NodeBase extends cc.Component {
        @property(NodeEventGroup)
        onStart : NodeEventGroup = new NodeEventGroup();

        @property(NodeEventGroup)
        onPause : NodeEventGroup = new NodeEventGroup();

        @property(NodeEventGroup)
        onComplete : NodeEventGroup = new NodeEventGroup();

        @property(NodeEventGroup)
        onResume : NodeEventGroup = new NodeEventGroup();

        @property()
        autoPlay: boolean = false;

        @property()
        defaultAnimation: string = "";

        childNode: NodeBase[] = [];

        aniData: cc.Animation;
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

            p.aniData = p.node.getComponent(cc.Animation);
        }

        public InitNode() {
            if (this.isInited) return;
            this.isInited = true;
            this.Init();
        }

        public Play() {
            let p = this;
            p.state = NodeState.playing;
            if (p.aniData) {
                if (p.defaultAnimation.length > 0) {
                    p.aniData.play(p.defaultAnimation);
                } else {
                    p.aniData.play();
                }
            }

            p.OnStart();
        }
        public Pause()
        {
            let p = this;
            p.state = NodeState.pause;
            p.OnPause();
        }
        public Resume() {
            let p = this;
            p.state = NodeState.normal;
            p.OnResume();
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
        OnComplete() {
            let p = this;
            if (p.onComplete)
                p.onComplete.Call();
        }
        OnStart() {
            let p = this;
            if (p.onStart)
                p.onStart.Call();
        }
        OnPause() {
            let p = this;
            if (p.onPause)
                p.onPause.Call();
        }
        OnResume() {
            let p = this;
            if (p.onResume)
                p.onResume.Call();
        }
    }
    
    export class NodeEvent {
        protected _time: number;
        protected _events: NodeEventGroup;
        protected _called: boolean;
        protected _customDatas: string[];

        public get Time() {
            return this._time;
        }
        public get Event() {
            return this._events;
        }
        public get Called() {
            return this._called;
        }

        constructor(pHandle: NodeEventGroup, pAniData: { frame: number, func: string, params: string[] }) {
            let p = this;
            p._events = pHandle;
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
            p._events.Call();
        }
    }

}

