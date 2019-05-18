
import AudioManager from "./Audio/AudioManager";

import PlayerData from "./Data/PlayerData";
import HttpNet from "./Net/HttpNet";
import WebSocketNet from "./Net/WebSocketNet";
import { Pool } from "./Pool/NodePool";
import { Log } from "./Tool/Dlog";
import { LUpdate } from "./Update/UpdateManager";
import { LAsset } from "./AssetLoad/AssetLoader";
import { LEvent } from "./Event/EventManager";

export default class LE{
    public static AssetLoader = LAsset.AssetLoader.instance;
    public static AudioManager = AudioManager.instance;
    public static EventManager = LEvent.EventManager.Instance;
    public static PlayerData = PlayerData;
    public static HttpNet = HttpNet;
    public static WebSocketNet = WebSocketNet;
    public static UpdateManager = LUpdate.UpdateManager;
    public static NodePool = Pool.NodePool.instance;
    public static DLog = Log.DLog;
    private constructor()
    {
        
    }
}