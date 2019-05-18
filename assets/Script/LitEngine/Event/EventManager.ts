export module LEvent{
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
    
        public RegEvent(eventKey: string, callBack: ((target: any, args: any[]) => void)) {
            let e = this;
            if (e.eventHandles[eventKey] == null){
                e.eventHandles[eventKey] = new EventGroup(eventKey);
            } 
            e.eventHandles[eventKey].Add(callBack);
        }
    
        public UnRegEvent(eventKey: string, callBack: ((target: any, args: any[]) => void)) {
            let e = this;
            if (e.eventHandles[eventKey] == null) return;
            e.eventHandles[eventKey].Remove(callBack);
        }
    
        public DispatchEvent(eventKey: string, args: any[]) {
            let e = this;
            if (e.eventHandles[eventKey] == null) return;
            e.eventHandles[eventKey].DispatchEvent(args);
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
}
