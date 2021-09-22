# qt  ubuntu ftp上传 所有文件夹和子文件


之前写过两篇创建静态网站的文章，我实际使用发现很麻烦，每次我都需要从本地上传我改好的网页，于是我想用ftp每次直接上传我需要的所有文件。
需要两步
先遍历目标文件夹下所有文件和子文件
链接ftp，并上传所有文件
为了好看，文件上传做了进度条，每传完一个调到下一个文件

平时主要参考这两位博客，有需求直接搜索，只要他们写过，问题一定很好解决（
https://blog.csdn.net/feiyangqingyun
刘大神
https://me.csdn.net/u011012932
一去二三里
）写完了也贴出来方便他人使用
本来准备编译qt4的那个qtftp模块，奈何我在ubuntu   5.13下死活搞不好，干脆直接用官方建议的QNetworkAccessManager
这玩意有个不好就是文件操作不好，而且中文好像有问题，反正我是用的全英文目录
我使用时候直接用一去二三里（https://me.csdn.net/u011012932）封装过一下的





如何使用ftp 以及windos下如何使用可以看我原来的
https://blog.csdn.net/a15005784320/article/details/98870991
https://blog.csdn.net/a15005784320/article/details/98611713
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830151408440.gif)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830152024805.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830152036284.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



```javascript
#ifndef FORMCONNECT_H
#define FORMCONNECT_H

#include <QWidget>
#include <QUrl>
#include <QFile>
#include <QNetworkReply>
#include <QNetworkAccessManager>


namespace Ui {
class FormConnect;
}


class FtpManager : public QObject {
    Q_OBJECT

  public:
    explicit FtpManager(QObject *parent = nullptr);
    // 设置地址和端口
    void setHostPort(const QString &host, int port = 21);
    // 设置登录 FTP 服务器的用户名和密码
    void setUserInfo(const QString &userName, const QString &password);
    // 上传文件
    void put(const QString &fileName, const QString &path);
    // 下载文件
    void get(const QString &path, const QString &fileName);
  signals:
    void error(QNetworkReply::NetworkError);
    // 上传进度
    void uploadProgress(qint64 bytesSent, qint64 bytesTotal);
    // 下载进度
    void downloadProgress(qint64 bytesReceived, qint64 bytesTotal);


  private slots:
    // 下载过程中写文件
    void finished();

  private:
    QUrl m_pUrl_;
    QFile m_file_;
    QNetworkAccessManager m_manager_;
};


class FormConnect : public QWidget {
    Q_OBJECT

  public:
    explicit FormConnect(QWidget *parent = nullptr);
    ~FormConnect();
  public slots:
    void upload();
    void UpLoadFile(const int tmp);
    void uploadProgress(qint64 bytesSent, qint64 bytesTotal);
    void error(QNetworkReply::NetworkError error);

  signals:
    void SignalOneFileOkOut(const int tmp);
  private:
    bool FindFile(const QString &path);
    Ui::FormConnect *ui;
    FtpManager m_ftp;
    int nFiles;
    int nFile;
    QStringList blog_file_names_;
    QStringList blog_file_paths_;
};

#endif // FORMCONNECT_H

```

```javascript
#include "formconnect.h"
#include "ui_formconnect.h"
#include <QFile>
#include <QFileInfo>
#include <app.h>
#include <QChar>


FormConnect::FormConnect(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::FormConnect) {
    ui->setupUi(this);
    // 接信号槽
    connect(ui->pUploadButton, SIGNAL(clicked(bool)), this, SLOT(upload()));
    connect(&m_ftp, SIGNAL(error(QNetworkReply::NetworkError)),
            this, SLOT(error(QNetworkReply::NetworkError)));
    connect(&m_ftp, SIGNAL(uploadProgress(qint64, qint64)),
            this, SLOT(uploadProgress(qint64, qint64)));
    connect(this, &FormConnect::SignalOneFileOkOut,
            this, &FormConnect::UpLoadFile);
    // 设置 FTP 相关信息
    m_ftp.setHostPort("118.25.63.144", 21);
    m_ftp.setUserInfo("yaoxin", "*****");
    //*****的是我的密码，欢迎访问我的私人网站http://118.25.63.144/blog-Navigation.html，虽然啥也没有
}

FormConnect::~FormConnect() {
    delete ui;
}



// 上传文件
void FormConnect::upload() {
    ui->pUploadButton->setEnabled(0);
    nFiles = 0;
    nFile = 0;
    blog_file_paths_.clear();
    blog_file_names_.clear();
    FindFile("/home/yx/视频/cloud.arteryflow/Seafile/博客共享/WWW");
    UpLoadFile(nFile);
    ui->label_2->setText(QString("0/%1").arg(nFiles));
    /* 下载文件
    //void FormConnect::download() {
    //    m_ftp.get("blog-image/", "/home/yx/音乐/blog文件/blog-image");
    //    connect(&m_ftp, SIGNAL(error(QNetworkReply::NetworkError)),
    //            this, SLOT(error(QNetworkReply::NetworkError)));
    //    connect(&m_ftp, SIGNAL(downloadProgress(qint64, qint64)),
    //            this, SLOT(downloadProgress(qint64, qint64)));

    //    qDebug() << blog_file_paths_ ;
    //    qDebug() << nFiles ;
    //}
    // 更新下载进度
    //void FormConnect::downloadProgress(qint64 bytesReceived, qint64 bytesTotal) {
    //   ui->m_pDownloadBar->setMaximum(static_cast<qint32>(bytesReceived));
    //   ui->m_pDownloadBar->setValue(static_cast<qint32>(bytesTotal));
    //}
    // void download();
    //void downloadProgress(qint64 bytesReceived, qint64 bytesTotal);*/
}

void FormConnect::UpLoadFile(const int tmp) {
    if (tmp >= nFiles) {
        ui->pUploadButton->setEnabled(1);
        QUIHelper::showMessageBoxInfo("上传完成");
        ui->label_2->setText("0/0");
        ui->m_pUploadBar->setValue(0);
        return;
    }
    QString local_files = blog_file_paths_.at(tmp) + "/" + blog_file_names_.at(tmp);
    QString remote_files =
        QString(blog_file_paths_.at(tmp))
        .remove("/home/yx/视频/cloud.arteryflow/Seafile/博客共享/WWW") + "/" +
        blog_file_names_.at(tmp);
    qDebug() << local_files << "is OK";
    qDebug() << remote_files << "is OK";
    m_ftp.put(local_files, remote_files);
    ui->label_2->setText(QString("%2/%1").arg(nFiles).arg(tmp));
}



// 更新上传进度
void FormConnect::uploadProgress(qint64 bytesSent, qint64 bytesTotal) {
    ui->m_pUploadBar->setMaximum(static_cast<qint32>(bytesSent));
    ui->m_pUploadBar->setValue(static_cast<qint32>(bytesTotal));

    if (bytesSent == bytesTotal) {
        nFile++;
        emit SignalOneFileOkOut(nFile);
    }

}



// 错误处理
void FormConnect::error(QNetworkReply::NetworkError error) {
    switch (error) {
    case QNetworkReply::HostNotFoundError :
        qDebug() << QString::fromLocal8Bit("主机没有找到");
        break;
    // 其他错误处理
    default:
        break;
    }
}

bool FormConnect::FindFile(const QString &path) {

    QDir dir(path);
    if (!dir.exists()) {
        return false;
    }
    dir.setFilter(QDir::Dirs | QDir::Files);
    dir.setSorting(QDir::DirsFirst);
    QFileInfoList list = dir.entryInfoList();
    int i = 0;
    do {

        QFileInfo fileInfo = list.at(i);
        if (fileInfo.fileName() == "." | fileInfo.fileName() == "..") {
            i++;
            continue;
        }
        bool bisDir = fileInfo.isDir();
        if (bisDir) {
            FindFile(fileInfo.filePath());
        } else {
            blog_file_paths_ << fileInfo.path();
            blog_file_names_ << fileInfo.fileName();
            qDebug() << QString(" %2  %3  ")
                     .arg(fileInfo.path())
                     .arg(fileInfo.fileName());
            nFiles++;
        }
        i++;
    } while (i < list.size());
    return true;
}
FtpManager::FtpManager(QObject *parent)
    : QObject(parent) {
    // 设置协议
    m_pUrl_.setScheme("ftp");
}

// 设置地址和端口
void FtpManager::setHostPort(const QString &host, int port) {
    m_pUrl_.setHost(host);
    m_pUrl_.setPort(port);
}

// 设置登录 FTP 服务器的用户名和密码
void FtpManager::setUserInfo(const QString &userName, const QString &password) {
    m_pUrl_.setUserName(userName);
    m_pUrl_.setPassword(password);
}

// 上传文件
void FtpManager::put(const QString &fileName, const QString &path) {
    QFile file(fileName);
    file.open(QIODevice::ReadOnly);
    QByteArray data = file.readAll();

    m_pUrl_.setPath(path);
    QNetworkReply *pReply = m_manager_.put(QNetworkRequest(m_pUrl_), data);



    connect(pReply, SIGNAL(uploadProgress(qint64, qint64)),
            this, SIGNAL(uploadProgress(qint64, qint64)));
    connect(pReply, SIGNAL(error(QNetworkReply::NetworkError)),
            this, SIGNAL(error(QNetworkReply::NetworkError)));
}

// 下载文件
void FtpManager::get(const QString &path, const QString &fileName) {
    QFileInfo info;
    info.setFile(fileName);

    m_file_.setFileName(fileName);
    m_file_.open(QIODevice::WriteOnly | QIODevice::Append);
    m_pUrl_.setPath(path);

    QNetworkReply *pReply = m_manager_.get(QNetworkRequest(m_pUrl_));

    connect(pReply, SIGNAL(finished()), this, SLOT(finished()));
    connect(pReply, SIGNAL(downloadProgress(qint64, qint64)),
            this, SIGNAL(downloadProgress(qint64, qint64)));
    connect(pReply, SIGNAL(error(QNetworkReply::NetworkError)),
            this, SIGNAL(error(QNetworkReply::NetworkError)));
}

// 下载过程中写文件
void FtpManager::finished() {
    QNetworkReply *pReply = qobject_cast<QNetworkReply *>(sender());
    switch (pReply->error()) {
    case QNetworkReply::NoError : {
        m_file_.write(pReply->readAll());
        m_file_.flush();
    }
    break;
    default:
        break;
    }

    m_file_.close();
    pReply->deleteLater();
}


```

