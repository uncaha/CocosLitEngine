interface IDispose{
    Destroy();
}

interface IInit{
    Init();
}

interface IUpdate{
    Update(dt:number);
    UpdateData();
}

interface IRuning{
    Run();
    Pause();
    Resume();
}

interface IRest{
    Rest();
}

interface ICustomArray<T>{
    [index:number]:T;
}