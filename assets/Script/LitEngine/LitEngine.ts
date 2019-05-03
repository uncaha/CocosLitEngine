import AssetLoader from "./AssetLoad/AssetLoader";
import AudioManager from "./Audio/AudioManager";
import EventManager from "./Event/EventManager";
import PlayerData from "./Data/PlayerData";
import HttpNet from "./Net/HttpNet";
import WebSocketNet from "./Net/WebSocketNet";
import UpdateManager from "./Update/UpdateManager";

export default class LitEngine{
    public static AssetLoader = AssetLoader;
    public static AudioManager = AudioManager;
    public static EventManager = EventManager;
    public static PlayerData = PlayerData;
    public static HttpNet = HttpNet;
    public static WebSocketNet = WebSocketNet;
    public static UpdateManager = UpdateManager;

    private constructor()
    {
        
    }
}