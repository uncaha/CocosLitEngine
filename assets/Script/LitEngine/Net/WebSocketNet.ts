
enum SocketNetState {
    Open = 1,
    Close,
    Message,
    Error,
}
export default class WebSocketNet {
    private static _instance : WebSocketNet;

    private _ws : WebSocket = null;
    private _stateDelgate : ((state:number,event:Event)=>void) = null;
    constructor()
    {

    }

    public static get Instance()
    {
        if(WebSocketNet._instance == null)
            WebSocketNet._instance = new WebSocketNet();
        return WebSocketNet._instance;
    }

    public static SetCallBack(callBack:((state:number,event:Event)=>void))
    {
        WebSocketNet.Instance._stateDelgate = callBack;
    }


    public static Connect(url:string)
    {
        if(WebSocketNet.Instance._ws != null && WebSocketNet.Instance._ws.readyState <= 1) return;
        WebSocketNet.Close();
        WebSocketNet.Instance.CreatWs(url);
    }

    public static Send(msg:string)
    {
        WebSocketNet.Instance.WsSend(msg);
    }

    public static Close()
    {
        WebSocketNet.Instance.WsClose();
    }

    private WsSend(msg:string)
    {
        if (this._ws != null) {
            switch (this._ws.readyState) {
                case WebSocket.OPEN:
                    this._ws.send(msg);
                    break;
                case WebSocket.CONNECTING:
                    cc.error("连接中,请稍后发送.readyState = " + this._ws.readyState);
                    break;
                case WebSocket.CLOSED:
                case WebSocket.CLOSING:
                    cc.error("连接状态异常,请重新连接.readyState = " + this._ws.readyState);
                    break;
            }
        }
        else {
            cc.error("必须先进行连接 WebSocketNet.Connect(url)");
        }
    }

    private WsClose()
    {
        if(this._ws.readyState <= 1)
            this._ws.close();
        this.RestWs();
    }

    private RestWs()
    {
        if(this._ws != null)
        {
            this._ws.onopen = null;
            this._ws.onmessage = null;
            this._ws.onerror = null;
            this._ws.onclose = null;
            this._ws = null;
            this._stateDelgate = null;
        }
    }

    private CreatWs(url: string) {
        this._ws = new WebSocket(url);
        this._ws.onopen = this.OnOpen;
        this._ws.onmessage = this.OnMessage;
        this._ws.onerror = this.OnError;
        this._ws.onclose = this.OnClose;
    }

    private OnOpen(event: Event) {
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Open, event);
    }

    private OnMessage(event: Event) {
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Message, event);
    }

    private OnError(event: Event) {
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Error, event);
    }

    private OnClose(event: Event) {
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Close, event);
    }
}