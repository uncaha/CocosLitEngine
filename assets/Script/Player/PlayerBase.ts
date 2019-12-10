import PlayerData from "../LitEngine/PlayerData";

export default class PlayerBase{
    protected _key:string;
    protected _data:any;
    public get data(){
        return this._data;
    }
    public Save()
    {
        PlayerData.SetItem(this._key,this._data);
    }

    public Load()
    {
        var tdata = PlayerData.GetItem(this._key);
        if(tdata != null)
            this._data = tdata;
    }
}
    