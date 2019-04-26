export default class AssetObject{
    public assetKey:string;
    public assetUsedCount:number = 0;
    constructor(assetKey:string){
        this.assetKey = assetKey;
    }

    public retain()
    {
        this.assetUsedCount += 1;
    }

    public Release()
    {
        this.assetUsedCount -= 1;
    }
}