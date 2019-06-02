export module LEvent{
    export class EventObject{
        public type:number;
        public data:any;
    }
    export class EventManager {
        private static _instance: EventManager = null;
        public static get Instance() {
            if (EventManager._instance == null)
                EventManager._instance = new EventManager();
            return EventManager._instance;
        }
    
        private constructor() {
    
        }
    
        private eventHandles: EventGroup[] = [];
        public static RegEvent(eventKey: string, callBack: ((arg:EventObject) => void)) {
            let e = EventManager.Instance;
            if (e.eventHandles[eventKey] == null){
                e.eventHandles[eventKey] = new EventGroup(eventKey);
            } 
            e.eventHandles[eventKey].Add(callBack);
            return callBack;
        }
    
        public static UnRegEvent(eventKey: string, callBack: ((arg:EventObject) => void)) {
            let e = EventManager.Instance;
            if (e.eventHandles[eventKey] == null) return;
            e.eventHandles[eventKey].Remove(callBack);
        }
    
        public static DispatchEvent(eventKey: string, arg:EventObject) {
            let e = EventManager.Instance;
            if (e.eventHandles[eventKey] == null) return;
            e.eventHandles[eventKey].DispatchEvent(arg);
        }
    }
    
    export class EventGroup {
        public readonly EventKey: string;
        private _calls: Function[] = [];
        constructor(key: string) {
            this.EventKey = key;
        }
    
        public Add(callBack:((arg:EventObject) => void)) {
            let tindex = this._calls.indexOf(callBack);
            if (tindex !== -1) return;
            this._calls.push(callBack);
        }
    
        public Remove(callBack:((arg:EventObject) => void)) {
            let tindex = this._calls.indexOf(callBack);
            if (tindex !== -1)
                this._calls.splice(tindex, 1);
        }
    
        public DispatchEvent(arg:EventObject) {
            for (let i = 0; i < this._calls.length; i++) {
                let element = this._calls[i];
                element(arg);
            }
        }
    }
}
