export default class AudioManager {
    private static _instance: AudioManager = null;
    public static get instance() {
        if (AudioManager._instance == null)
            AudioManager._instance = new AudioManager();
        return AudioManager._instance;
    }

    private _audioSources: cc.AudioSource[] = [];
    private _backMusic: cc.AudioSource = null;
    private _node: cc.Node;
    private _audioIndex: number = 0;
    private _maxAudioSource: number = 5;
    private _volume: number = 1;
    private constructor() {
        this._node = new cc.Node("AudioManager");
        cc.game.addPersistRootNode(this._node);
        this.InitAudioSource();
    }

    private InitAudioSource() {
        let tmaxCount = this._maxAudioSource;
        let tnode = this._node;
        let audios = this._audioSources;
        let tvolume = this._volume;
        for (let i = 0; i < tmaxCount; i++) {
            let vsce = tnode.addComponent(cc.AudioSource);
            vsce.loop = false;
            vsce.playOnLoad = false;
            vsce.volume = tvolume;
            vsce.stop();
            audios.push(vsce);
        }

        this._backMusic = tnode.addComponent(cc.AudioSource);
        this._backMusic.loop = true;
        this._backMusic.stop();

    }

    public get audioIndex() {
        return this._audioIndex;
    }

    public set audioIndex(value) {
        if (value >= this._maxAudioSource)
            this._audioIndex = 0;
        else
            this._audioIndex = value;
    }

    public get volume() {
        return this._volume;
    }

    public set volume(value) {
        this._volume = value > 1 ? 1 : value;
        let audios = this._audioSources;
        let tvolume = this._volume;

        for (let aus of audios) {
            aus.volume = tvolume;
        }
    }

    public static playSound(clip: cc.AudioClip) {
        let audioSources = AudioManager.instance._audioSources;
        let tindex = AudioManager.instance.audioIndex;
        audioSources[tindex].clip = clip;
        audioSources[tindex].play();
        AudioManager.instance.audioIndex++;
    }

    public static playMusic(clip: cc.AudioClip)
    {
        AudioManager.instance._backMusic.clip = clip;
        AudioManager.instance._backMusic.play();
    }
}