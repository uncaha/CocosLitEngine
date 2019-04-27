
export default class PlayerData
{
    private constructor()
    {
        
    }

    public static SetItem(key:string,userData:any)
    {
        cc.sys.localStorage.setItem(key, JSON.stringify(userData));
    }

    public static GetItem(key:string)
    {
        return JSON.parse(cc.sys.localStorage.getItem(key));
    }

    public static RemoveItem(key:string)
    {
        cc.sys.localStorage.removeItem(key);
    }
}