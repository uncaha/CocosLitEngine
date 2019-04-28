
enum SocketNetState {
    Open = 1,
    Close,
    Error,
}
export default class WebSocketNet {
    private static _instance : WebSocketNet;

    private _ws : WebSocket = null;
    private _stateDelgate : ((state:number,event:Event)=>void) = null;
    private state:SocketNetState = SocketNetState.Close;
    constructor()
    {

    }

    public static get Instance()
    {
        if(WebSocketNet._instance == null)
            WebSocketNet._instance = new WebSocketNet();
        return WebSocketNet._instance;
    }

    public static Connect(url:string,callBack:((state:number,event:Event)=>void) = null)
    {
        if(WebSocketNet.Instance._ws != null && WebSocketNet.Instance._ws.readyState <= 1) return;
        WebSocketNet.Close();
        WebSocketNet.Instance._stateDelgate = callBack;
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
        this.state = SocketNetState.Close;
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
        this.state = SocketNetState.Open;
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Open, event);
    }

    private OnMessage(event: Event) {

    }

    private OnError(event: Event) {
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Error, event);
    }

    private OnClose(event: Event) {
        this.state = SocketNetState.Close;
        if (this._stateDelgate != null)
            this._stateDelgate(SocketNetState.Close, event);
    }
}