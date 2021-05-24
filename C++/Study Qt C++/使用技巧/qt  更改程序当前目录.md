# qt  更改程序当前目录

有时候经常需要把程序当前执行目录默认换成其他的
qt如下操作

    #ifdef Q_OS_WIN
        QString home_path = QStandardPaths::writableLocation(
                                QStandardPaths::AppDataLocation);//当前工作目录
        if (!FileUtil::DirMake(QString("%1").arg(home_path))) {
            qCritical() << "目录初始化错误";
        } else {
            QDir::setCurrent(QString("%1").arg(home_path));
        }
    #endif


    #ifdef Q_OS_MAC
        QString home_path = QStandardPaths::writableLocation(
                                QStandardPaths::HomeLocation);  //主目录
        if (!FileUtil::DirMake(QString("%1/test").arg(home_path))) {
            qCritical() << "目录初始化错误";
        } else {
            QDir::setCurrent(QString("%1/test").arg(home_path));
        }
    #endif
    
    #ifdef Q_OS_LINUX
        QString home_path = QStandardPaths::writableLocation(
                                QStandardPaths::HomeLocation); //主目录
        if (!FileUtil::DirMake(QString("%1/test").arg(home_path))) {
            qCritical() << "目录初始化错误";
        } else {
            QDir::setCurrent(QString("%1/test").arg(home_path));
        }
    #endif
