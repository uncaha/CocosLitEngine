
import AudioManager from "./AudioManager";

import PlayerData from "./PlayerData";
import HttpNet from "./HttpNet";
import WebSocketNet from "./WebSocketNet";
import { Pool } from "./NodePool";
import { Log } from "./DLog";
import { LUpdate } from "./UpdateManager";
import { Asset } from "./AssetLoader";
import { Event } from "./EventManager";

export default class LE{
    public static AssetLoader = new Asset.AssetLoader();
    public static AudioManager = AudioManager;
    public static EventManager = Event.EventManager;
    public static PlayerData = PlayerData;
    public static HttpNet = HttpNet;
    public static WebSocketNet = WebSocketNet;
    public static UpdateManager = LUpdate.UpdateManager;
    public static NodePool = Pool.NodePool;
    public static DLog = Log.DLog;
    private constructor()
    {
        
    }
}