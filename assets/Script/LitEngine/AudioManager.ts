
const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    private static _instance: AudioManager = null;
    public static get instance() {
        if (AudioManager._instance == null) {
            var tnode = new cc.Node("AudioManager");
            cc.game.addPersistRootNode(tnode);
            AudioManager._instance = tnode.addComponent("AudioManager");
        }
        return AudioManager._instance;
    }

    private _mixerSources: cc.AudioSource[] = [];
    private _audioSources: cc.AudioSource[] = [];
    private _backMusic: cc.AudioSource = null;
    private _audioIndex: number = 0;
    private _maxAudioSource: number = 5;
    private _volume: number = 1;
    private _mixerAudioIndex: number = 0;
    private _onMixerVolume: number = 0.3;
    private _curVolume = 1;
    private _isMixerSoundPlaying = false;
    private constructor() {
        super();
    }

    onLoad() {
        this.InitAudioSource();
    }

    private InitAudioSource() {
        let tmaxCount = this._maxAudioSource;
        let tnode = this.node;
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

        let mixeraudios = this._mixerSources;
        for (let i = 0; i < tmaxCount; i++) {
            let vsce = tnode.addComponent(cc.AudioSource);
            vsce.loop = false;
            vsce.playOnLoad = false;
            vsce.volume = tvolume;
            vsce.stop();
            mixeraudios.push(vsce);
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

    public get mixerAudioIndex() {
        return this._mixerAudioIndex;
    }

    public set mixerAudioIndex(value) {
        let a = this;
        if (value >= a._maxAudioSource)
            a._mixerAudioIndex = 0;
        else
            a._mixerAudioIndex = value;
    }

    public get volume() {
        return this._volume;
    }

    public set volume(value) {
        let a = this;
        a._volume = value > 1 ? 1 : value;
        a._backMusic.volume = a._volume * a._curVolume;
        a.setNormalVolume(a._audioSources, a._volume * a._curVolume);
        a.setNormalVolume(a._mixerSources, a._volume);
    }

    public get onMixerVolume() {
        return this._onMixerVolume;
    }

    public set onMixerVolume(value) {
        this._onMixerVolume = value > 1 ? 1 : value;
    }

    private setNormalVolume(sources, avolume) {
        for (let aus of sources) {
            aus.volume = avolume;
        }
    }

    private playSoundByArrays(sources, index, clip) {
        sources[index].stop();
        sources[index].clip = clip;
        sources[index].play();
        index++;
        return index;
    }

    public static playMixerSound(clip: cc.AudioClip) {
        let a = AudioManager.instance;
        a.mixerAudioIndex = a.playSoundByArrays(a._mixerSources, a.mixerAudioIndex, clip);
        a._isMixerSoundPlaying = true;
    }

    public static playSound(clip: cc.AudioClip) {
        let a = AudioManager.instance;
        a.audioIndex = a.playSoundByArrays(a._audioSources, a.audioIndex, clip);
    }

    public static playMusic(clip: cc.AudioClip) {
        var a = AudioManager.instance;
        a._backMusic.stop();
        a._backMusic.clip = clip;
        a._backMusic.play();
    }

    update(dt) {
        var a = this;
        let tisplayin = false;
        if (a._isMixerSoundPlaying) {
            let tmaxCount = a._maxAudioSource;
            let tmixeraudios = a._mixerSources;

            for (let i = 0; i < tmaxCount; i++) {
                let vsce = tmixeraudios[i];
                tisplayin = vsce.isPlaying;
                if (tisplayin)
                    break;
            }
        }

        let tcurvolume = a._curVolume;
        let tmixmolume = a._onMixerVolume;
        if (tisplayin) {
            if (tcurvolume > tmixmolume) {
                tcurvolume -= dt;
                a._curVolume = tcurvolume < tmixmolume ? tmixmolume : tcurvolume;
                let tvol = a._volume * tcurvolume;
                a.setNormalVolume(a._audioSources, tvol);
                a._backMusic.volume = tvol;
            }

        }
        else {
            if (tcurvolume < 1) {
                tcurvolume += dt;
                a._curVolume = tcurvolume > 1 ? 1 : tcurvolume;
                let tvol = a._volume * tcurvolume;
                a.setNormalVolume(a._audioSources, tvol);
                a._backMusic.volume = tvol;

                if (a._curVolume == 1) {
                    a._isMixerSoundPlaying = false;
                }
            }

        }
    }
}