import LE from "./LE";

export module Pool {
    export class NodePool {
        constructor() {
    
        }
        private _groupList: NodeGroup[] = [];
        public async Get(pKey: string) {
            if (pKey == null || pKey.length == 0) return;
            let tgp = this._groupList[pKey];
            let ret;
            if (tgp != null) {
                ret = tgp.Get();
            }

            if (ret == null) {
                let res = await LE.AssetLoader.LoadAssetAsync(pKey);
                let tnode: cc.Node = cc.instantiate(res);
                tnode.name = pKey;
                ret = tnode;
            }
            return ret;
        }

        public Push(pKey: string, pNode)  {
            let n = this;
            let tgp;
            if (n._groupList[pKey] == null)
                n._groupList[pKey] = new NodeGroup(pKey);
            tgp = n._groupList[pKey];

            tgp.Push(pNode);
        }

        public Clear()  {
            let tlist = this._groupList;
            for (const key in tlist) {
                if (tlist.hasOwnProperty(key)) {
                    let e = tlist[key];
                    e.Clear();
                }
            }
            this._groupList = [];
        }
    }

    export class NodeGroup {
        public readonly Key: string;
        private _queue: any[] = [];
        constructor(pKey: string) {
            this.Key = pKey;
        }

        public Get(): any  {
            let n = this;
            if (n._queue == null || n._queue.length == 0) return null;
            return n._queue.pop();
        }

        public Push(pNode)  {
            let n = this;
            if (n._queue == null)
                n._queue = [];

            if(n._queue.indexOf(pNode) == -1)
                n._queue.push(pNode);
        }

        public Clear()  {
            let tlist = this._queue;
            for (let i = 0; i < tlist.length; i++) {
                let e = tlist[i];
                tlist[i] = null;
                let tname = e.name;
                e.destroy();
                LE.AssetLoader.ReleaseAsset(tname);
            }
            tlist = null;
        }
    }
}
