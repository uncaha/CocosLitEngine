export default abstract  class BaseScene implements IDispose {
    protected _sceneUrl: string;
    public get SceeneUrl() {
        return this._sceneUrl;
    }

    protected _completeHandle : Laya.Handler;
    constructor(url: string) {
        this._sceneUrl = url;
    }

    protected _loading: boolean = false;
    protected _destroyed: boolean = false;

    protected _loadCount: number = 0;
    protected _maxLoadCount: number = 0;

    public Load(fun: Laya.Handler) {
        this._loading = true;
        this._completeHandle = fun;
    }

    public OnComplete(sc, args: any[]) {
        this._loadCount += 1;
        if (this._loadCount == this._maxLoadCount)  {
            this._loading = false;
            if (this._completeHandle != null)
                this._completeHandle.run();
        }
    }

    protected GetHandle(key:string) : Laya.Handler
    {
       return Laya.Handler.create(this, this.OnComplete, [key]);
    }

    public Destroy()  {
        if (this._loading)  {
            console.error(this._sceneUrl + " 加载中.此时释放可能会造成内存泄漏.");
        }
        this._destroyed = true;
    }
}