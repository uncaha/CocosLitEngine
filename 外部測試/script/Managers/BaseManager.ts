export default class BaseManager{
    public static Creat():BaseManager {
        return null;
    }
    protected _node:Laya.Node;
    public readonly managerName:string;
    protected constructor(nd:Laya.Node,nameStr:string){
        this._node = nd;
        this.managerName = nameStr;
    }

    public Update(dt:number)
    {

    }

    public UpdateData()
    {

    }
}