interface IDispose{
    Destroy();
}

interface IUpdate{
    Update(dt:number);
    UpdateData();
}

interface IRuning{
    Init(onComplete:Laya.Handler);
    Run();
    Pause();
    Resume();
}