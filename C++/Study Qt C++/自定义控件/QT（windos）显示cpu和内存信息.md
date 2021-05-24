# QT（windos）显示cpu和内存信息

我们程序常常需要显示cup占用和内存占，这里提供一种windos下cpu、内存占用抓取的方式
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190806111559932.gif)
这个类是读取系统信息
```javascript
//系统展示
class ISysWin
{
public:
    ISysWin(void);
    virtual ~ISysWin(void);
    bool GetSysCpu(int& nCpuRate);
    bool GetSysMemory(int& nMemTotal,int& nMemUsed);
protected:
    //时间转换
    __int64 Filetime2Int64(const FILETIME* ftime);
    //两个时间相减运算
    __int64 CompareFileTime(FILETIME preTime,FILETIME nowTime);
};
```

```javascript
/*-----------------------------------系统展示cpu和内存-----------------------------------*/
ISysWin::ISysWin(void)
{
}
ISysWin::~ISysWin(void)
{
}
__int64 ISysWin::Filetime2Int64(const FILETIME* ftime)
{
    LARGE_INTEGER li;
    li.LowPart = ftime->dwLowDateTime;
    li.HighPart = ftime->dwHighDateTime;
    return li.QuadPart;
}

__int64 ISysWin::CompareFileTime(FILETIME preTime,FILETIME nowTime)
{
    return this->Filetime2Int64(&nowTime) - this->Filetime2Int64(&preTime);
}

//将单字节char*转化为宽字节wchar_t*
wchar_t* AnsiToUnicode( const char* szStr )
{
    int nLen = MultiByteToWideChar( CP_ACP, MB_PRECOMPOSED, szStr, -1, NULL, 0 );
    if (nLen == 0)
    {
        return NULL;
    }
    wchar_t* pResult = new wchar_t[nLen];
    MultiByteToWideChar( CP_ACP, MB_PRECOMPOSED, szStr, -1, pResult, nLen );
    return pResult;
}

//将宽字节wchar_t*转化为单字节char*
inline char* UnicodeToAnsi( const wchar_t* szStr )
{
    int nLen = WideCharToMultiByte( CP_ACP, 0, szStr, -1, NULL, 0, NULL, NULL );
    if (nLen == 0)
    {
        return NULL;
    }
    char* pResult = new char[nLen];
    WideCharToMultiByte( CP_ACP, 0, szStr, -1, pResult, nLen, NULL, NULL );
    return pResult;
}

bool ISysWin::GetSysCpu(int& nCpuRate)
{
    HANDLE hEvent;
    bool res;
    static FILETIME preIdleTime;
    static FILETIME preKernelTime;
    static FILETIME preUserTime;

    FILETIME idleTime;
    FILETIME kernelTime;
    FILETIME userTime;

    res = GetSystemTimes(&idleTime,&kernelTime,&userTime);

    preIdleTime = idleTime;
    preKernelTime = kernelTime;
    preUserTime = userTime;

    hEvent = CreateEvent(NULL,FALSE,FALSE,NULL);//初始值为nonsignaled

    WaitForSingleObject(hEvent,500);//等待500毫秒

    res = GetSystemTimes(&idleTime,&kernelTime,&userTime);

    int idle = CompareFileTime(preIdleTime,idleTime);
    int kernel = CompareFileTime(preKernelTime,kernelTime);
    int user = CompareFileTime(preUserTime,userTime);

    nCpuRate =(int)ceil( 100.0*( kernel + user - idle ) / ( kernel + user ) );

    return res;
}

bool ISysWin::GetSysMemory(int& nMemTotal,int& nMemUsed)
{
    MEMORYSTATUSEX memsStat;
    memsStat.dwLength = sizeof(memsStat);
    if(!GlobalMemoryStatusEx(&memsStat))//如果获取系统内存信息不成功，就直接返回
    {
        nMemTotal = -1;
        nMemUsed  = -1;
        return false;
    }
    int nMemFree = memsStat.ullAvailPhys/( 1024.0*1024.0 );
    nMemTotal = memsStat.ullTotalPhys/( 1024.0*1024.0 );
    nMemUsed= nMemTotal- nMemFree;
    return true;
}
```

主界面右下角显示cpu信息，放到其他位置一样的
```javascript
private:
    QLabel *T_StatusBa_lab1 ;//cpu显示
    QThread workerThread;//cpu显示
------------------------------------------------------------------------------------------------
class Worker_SysCpu : public QObject
{
    Q_OBJECT
    ISysWin* pISys;

public:
    Worker_SysCpu()  {pISys= new ISysWin();CPU_SYS_end=true;}
    ~Worker_SysCpu() {delete pISys;}
    bool CPU_SYS_end;
public slots:

    void doWork()
    {
        while (1)
        {
            QString result;
            if(!CPU_SYS_end)
                return;
            //qDebug()<<CPU_SYS_end;
            int nCpuRate = -1;
            int nMemTotal = -1;
            int nMemUsed = -1;
            QMap<int,QString> pidMap;
            pISys->GetSysCpu(nCpuRate);
            pISys->GetSysMemory(nMemTotal,nMemUsed);

            //qDebug()<<"id："<<QThread::currentThreadId();

            double a=(double)nMemUsed/(double)nMemTotal*100;

            if(nCpuRate>0)
            {
                result="cpu 占用率"+ QString::number(nCpuRate) + "%"  + "内存 占用率:" + QString::number(a,'f',0) +"%";

                emit resultReady(result);
            }
            QThread::sleep(1);
        }
    }
signals:
    void resultReady(const QString &result);
};
------------------------------------------------------------------------------------------------
	T_StatusBa=new  QStatusBar;
	T_StatusBa_lab1 = new QLabel;
	T_StatusBa_lab1->setMinimumSize(100, 20); // 设置标签最小大小
	T_StatusBa_lab1->setFrameShape(QFrame::WinPanel); // 设置标签形状
	T_StatusBa_lab1->setFrameShadow(QFrame::Sunken); // 设置标签阴影
	
	
	Worker_SysCpu *worker;
	worker= new Worker_SysCpu;
	worker->moveToThread(&workerThread);
	
	connect(&workerThread, &QThread::finished, worker, &QObject::deleteLater);
	connect(&workerThread, &QThread::started, worker, &Worker_SysCpu::doWork);
	connect(&workerThread, &QThread::finished, &workerThread, &QObject::deleteLater);
	connect(worker, SIGNAL(resultReady(QString)), this, SLOT( Updata_StatusBa_cpu(QString)));
	workerThread.start();
	T_StatusBa->addPermanentWidget(T_StatusBa_lab1);
```
