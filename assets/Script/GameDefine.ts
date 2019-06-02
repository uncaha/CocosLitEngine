export module GameDefine{
    export class EventKey
    {
        static readonly none = "none";
        static readonly moduleCall = "InGameModule";
    }

    export enum ModuleEvent
    {
        none = 0,
        Run,
        Pause,
        Resume,
    }
}