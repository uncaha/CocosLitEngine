
import { Pool } from "../LitEngine/NodePool";
import BaseManager from "../Core/BaseManager";
import GameCore from "../GameCore";
import LE from "../LitEngine/LE";

export default class EffectManager extends BaseManager {

    public static Creat(): EffectManager {
        return new EffectManager("EffectManager");
    }

    public async Init() {
        this.effectPool = new Pool.NodePool();
        this.effectNode = new cc.Node("effectNode");
        GameCore.AddLayer(this.effectNode);
    }

    private effectPool: Pool.NodePool;
    private lifeList: cc.ParticleSystem[] = [];
    private effectNode:cc.Node;

    public Clear()  {
        let n = this;
        n.effectPool.Clear();

        let tlist = n.lifeList;
        for (let i = 0; i < tlist.length; i++) {
            const e = tlist[i];
            let tname = e.name;
            e.node.destroy();
            LE.AssetLoader.ReleaseAsset(tname);
        }
        n.lifeList = [];
    }

    public async Play(url: string, pTargetNode:cc.Node)  {
        if (this.effectNode == null) return;
        if(url.length == 0) return;
        let n = this;
        let tnode = await n.effectPool.Get(url);
        if (tnode == null) return;
        n.effectNode.addChild(tnode);
        tnode.position = pTargetNode.position;
        let tpt = tnode.getComponent(cc.ParticleSystem);
        tpt.resetSystem();
        n.lifeList.push(tpt);
    }

    public Update(dt: number)  {
        let n = this;
        let tlist = n.lifeList;
        for (let i = tlist.length - 1; i >= 0; i--) {
            const e = tlist[i];
            if(e.stopped){
                tlist.splice(i,1);
                e.node.removeFromParent();
                n.effectPool.Push(e.name,e.node);
            }
           
        }
    }
}