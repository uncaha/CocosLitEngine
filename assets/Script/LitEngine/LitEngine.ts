import AssetLoader from "./AssetLoader";
import AudioManager from "./AudioManager";
import EventManager from "./EventManager";
import PlayerData from "./Data/PlayerData";
import HttpNet from "./Net/HttpNet";
import WebSocketNet from "./Net/WebSocketNet";

export default class LitEngine{
    public static AssetLoader = AssetLoader;
    public static AudioManager = AudioManager;
    public static EventManager = EventManager;
    public static PlayerData = PlayerData;
    public static HttpNet = HttpNet;
    public static WebSocketNet = WebSocketNet;
}