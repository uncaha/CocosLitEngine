export default class AssetObject{
    private _assetKey:string;
    private _assetUsedCount:number = 0;
    constructor(assetKey:string){
        this._assetKey = assetKey;
    }

    public get assetKey()
    {
        return this._assetKey;
    }

    public get assetUsedCount()
    {
        return this._assetUsedCount;
    }

    public retain()
    {
        this._assetUsedCount += 1;
    }

    public Release()
    {
        this._assetUsedCount -= 1;
    }
}