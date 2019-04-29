import PlayerBase from "./PlayerBase";
export default class PlayerInfo extends PlayerBase{
    private static _instance: PlayerInfo = null;
    public static get Instance() {
        if (PlayerInfo._instance == null)
            PlayerInfo._instance = new PlayerInfo();
        return PlayerInfo._instance;
    }

    constructor()
    {
        super();
        this._key = "PlayerInfo";
        this._data = {
            playerName : "",
            gold : 0,
        };
        this.Load();
    }   
}