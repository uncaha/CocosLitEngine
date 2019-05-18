export default abstract  class BaseManager implements IUpdate{
    public static Creat():BaseManager {
        return null;
    }
    protected _node:cc.Node;
    public readonly managerName:string;
    protected constructor(nameStr:string){
        this.managerName = nameStr;
    }

    public abstract async Init();
    

    public Update(dt:number)
    {

    }

    public UpdateData()
    {

    }
}