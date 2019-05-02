export default class EventManager {
    private static _instance: EventManager = null;
    public static get Instance() {
        if (EventManager._instance == null)
            EventManager._instance = new EventManager();
        return EventManager._instance;
    }

    private constructor() {

    }

    private eventHandles: EventGroup[] = [];

    public static RegEvent(eventKey: string, callBack: ((target: any, args: any[]) => void)) {
        if (EventManager.Instance.eventHandles[eventKey] == null)
            EventManager.Instance.eventHandles[eventKey] = new EventGroup(eventKey);
        EventManager.Instance.eventHandles[eventKey].Add(callBack);
    }

    public static UnRegEvent(eventKey: string, callBack: ((target: any, args: any[]) => void)) {
        if (EventManager.Instance.eventHandles[eventKey] == null) return;
        EventManager.Instance.eventHandles[eventKey].Remove(callBack);
    }

    public static DispatchEvent(eventKey: string, args: any[]) {
        if (EventManager.Instance.eventHandles[eventKey] == null) return;
        EventManager.Instance.eventHandles[eventKey].DispatchEvent(args);
    }
}

export class EventGroup {
    public readonly EventKey: string;
    private _calls: Function[] = [];
    constructor(key: string) {
        this.EventKey = key;
    }

    public Add(callBack: ((args: any[]) => void)) {
        let tindex = this._calls.indexOf(callBack);
        if (tindex !== -1) return;
        this._calls.push(callBack);
    }

    public Remove(callBack: ((target: any, args: any[]) => void)) {
        let tindex = this._calls.indexOf(callBack);
        if (tindex !== -1)
            this._calls.splice(tindex, 1);
    }

    public DispatchEvent(args: any[]) {
        for (let i = 0; i < this._calls.length; i++) {
            let element = this._calls[i];
            element(args);
        }
    }
}