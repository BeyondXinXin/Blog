# qt 生成日志 日志浏览  demo

一个简单的日志生成&&浏览案例
比较简单,有需要的可以看一下
完整代码在最后 [gitee](https://gitee.com/yaoxin001/ReadLog)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200117110053925.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
### 给进程添加名称

```cpp
 QThread::currentThread()->setObjectName("Main Thread");
```
### QTextEdit  显示日志
```cpp
void LogView::ShowLog(const QString &file_path) {
    qDebug();
    ui->log_textedit->clear();
    QFile file(file_path);
    if (file.open(QFile::ReadOnly)) {
        QDataStream stream(&file);
        QString text;
        while (!stream.atEnd()) {
            stream >> text;
            ui->log_textedit->append(text);
        }
        file.close();
        this->show();
    }
}
```
### 生成文件夹    获取全局路径
```cpp
QString GetFullPath(const QString &path) {
    if (QDir::isAbsolutePath(path)) {
        return path;
    } else {
        return QDir::currentPath() + "/" + path;
    }
}

bool DirMake(const QString &path) {
    QString full_path = GetFullPath(path);
    QDir dir(full_path);
    if (dir.exists()) {
        return true;
    } else {
        return dir.mkpath(full_path);
    }
}
```
### 设置系统路径

```cpp
void ReadLOgWidget::InitialSystemPath() {
#ifdef Q_OS_WIN
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::AppDataLocation);
    QDir dir(home_path);
    dir.cdUp();
    home_path = dir.absolutePath();
    log_path_ = QString("%1/ReadLog").arg(home_path);
#endif
#ifdef Q_OS_LINUX
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::HomeLocation);
    log_path_ = QString("%1/.ReadLog").arg(home_path);
#endif
#ifdef Q_OS_MAC
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::HomeLocation);
    log_path_ = QString("%1/.ReadLog").arg(home_path);
#endif
    DirMake(log_path_);
    QDir::setCurrent(log_path_);
}
```
### 生成日志

```cpp
void ReadLOgWidget::InitialLogMessage() {
    DirMake("./log");
    if (log_file_.open(QIODevice::WriteOnly | QIODevice::Append)) {
        qInstallMessageHandler(LogMessageOutput);
    } else {
        qWarning() << "logfile open error!";
    }
}
```

```cpp
void ReadLOgWidget::LogMessageOutput(
    QtMsgType type, const QMessageLogContext &context, const QString &msg) {
    static QReadWriteLock lock;
    QWriteLocker locker(&lock);
    static QTextStream cout(stdout, QIODevice::WriteOnly);
    QString msg_type;
    switch (type) {
        case QtDebugMsg: {
                msg_type = QString("DEBUG:");
                break;
            }
        case QtInfoMsg: {
                msg_type = QString("INFO:");
                break;
            }
        case QtWarningMsg: {
                msg_type = QString("WARNING:");
                break;
            }
        case QtCriticalMsg: {
                msg_type = QString("CRITICAL:");
                break;
            }
        case QtFatalMsg: {
                msg_type = QString("FATAL:");
                break;
            }
    }
    QString currentDateTime = QDateTime::currentDateTime()
                              .toString("yyyy-MM-dd hh:mm:ss:zzz");
    QString currentThreadName = QThread::currentThread()->objectName();
    QString message = QString("%1 [%2] %3 - %4 %5")
                      .arg(currentDateTime)
                      .arg(currentThreadName)
                      .arg(msg_type)
                      .arg(QString(context.function).remove(QRegExp("\\((.*)\\)")))
                      .arg(msg);
    log_text_stream_ << message;
    cout << message << endl;
    cout.flush();
}
```
### 找日志并排序
```cpp
void ReadLOgWidget::UpdateLogInfo() {
    qDebug();
    ui->log_tree->clear();
    QDir dir("./log");
    QStringList filters;
    filters << "log*";
    dir.setNameFilters(filters);
    dir.setSorting(QDir::Time);
    QFileInfoList file_list = dir.entryInfoList(QDir::Files | QDir::NoSymLinks |
                              QDir::NoDotAndDotDot);
    foreach (const QFileInfo &file_info, file_list) {
        QTreeWidgetItem *item = new QTreeWidgetItem();
        item->setText(0, file_info.fileName());
        ui->log_tree->addTopLevelItem(item);
    }
}
```


---
# 完整代码
main.cpp
logview.h 
readlogwidget.h
logview.cpp
readlogwidget.cpp

```cpp
QT       += core gui
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets
TARGET = ReadLog
TEMPLATE = app
DEFINES += QT_DEPRECATED_WARNINGS  QT_MESSAGELOGCONTEXT
CONFIG += c++11
SOURCES += \
        main.cpp \
        readlogwidget.cpp \
    logview.cpp

HEADERS += \
        readlogwidget.h \
    logview.h

FORMS += \
        readlogwidget.ui \
    logview.ui

qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

```

```cpp
#include "readlogwidget.h"
#include <QApplication>
#include <QThread>

int main(int argc, char *argv[]) {
    QThread::currentThread()->setObjectName("Main Thread");
    QApplication a(argc, argv);
    ReadLOgWidget w;
    w.show();
    return a.exec();
}
```

```cpp
#ifndef LOGVIEW_H
#define LOGVIEW_H

#include <QWidget>

namespace Ui {
    class LogView;
}

class LogView : public QWidget {
    Q_OBJECT

  public:
    explicit LogView(QWidget *parent = nullptr);
    virtual ~LogView() override;
    void ShowLog(const QString &file_path);
  private:
    Ui::LogView *ui;
};

#endif // LOGVIEW_H
```

```cpp
#include "logview.h"
#include "ui_logview.h"
#include <QFile>
#include <QDebug>

LogView::LogView(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::LogView) {
    ui->setupUi(this);
}

LogView::~LogView() {
    delete ui;
}

void LogView::ShowLog(const QString &file_path) {
    qDebug();
    ui->log_textedit->clear();
    QFile file(file_path);
    if (file.open(QFile::ReadOnly)) {
        QDataStream stream(&file);
        QString text;
        while (!stream.atEnd()) {
            stream >> text;
            ui->log_textedit->append(text);
        }
        file.close();
        this->show();
    }
}

```

```cpp
#ifndef READLOGWIDGET_H
#define READLOGWIDGET_H

#include <QFile>
#include <QMainWindow>
#include <QPointer>
#include "logview.h"

namespace Ui {
    class ReadLOgWidget;
}

class ReadLOgWidget : public QMainWindow {
    Q_OBJECT

  public:
    explicit ReadLOgWidget(QWidget *parent = nullptr);
    virtual ~ReadLOgWidget() override;
  private:
    void Initial();
    void InitialSystemPath();
    void InitialLogMessage();
    void UpdateLogInfo();
    static void LogMessageOutput(QtMsgType type,
                                 const QMessageLogContext &context,
                                 const QString &msg);
  private slots:
    void SlotLogButtonClicked();
  private:
    Ui::ReadLOgWidget *ui;
    QPointer<LogView> log_view_;
    QString log_path_;
  private:
    const static QString log_file_name_;
    static QFile log_file_;
    static QDataStream log_text_stream_;

};

#endif // READLOGWIDGET_H

```

```cpp
#include "readlogwidget.h"
#include "readlogwidget.h"
#include "ui_readlogwidget.h"
#include <QDir>
#include <QThread>
#include <QtDebug>
#include <QDateTime>
#include <QReadWriteLock>
#include <QStandardPaths>


QString GetFullPath(const QString &path) {
    if (QDir::isAbsolutePath(path)) {
        return path;
    } else {
        return QDir::currentPath() + "/" + path;
    }
}

bool DirMake(const QString &path) {
    QString full_path = GetFullPath(path);
    QDir dir(full_path);
    if (dir.exists()) {
        return true;
    } else {
        return dir.mkpath(full_path);
    }
}


const QString ReadLOgWidget::log_file_name_ = QString("%1%2")
        .arg("./log/")
        .arg(QDateTime::currentDateTime().
             toString("log_yyyy_MM_dd_hh_mm_ss"));
QFile ReadLOgWidget::log_file_(log_file_name_);
QDataStream ReadLOgWidget::log_text_stream_(&log_file_);


ReadLOgWidget::ReadLOgWidget(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::ReadLOgWidget) {
    ui->setupUi(this);
    this->Initial();
    this->InitialSystemPath();
    this->InitialLogMessage();
    this->UpdateLogInfo();
}

ReadLOgWidget::~ReadLOgWidget() {
    qDebug();
    log_view_->deleteLater();
    qInstallMessageHandler(nullptr);
    log_file_.close();
    delete ui;
}

void ReadLOgWidget::Initial() {
    log_view_ = new LogView();
    connect(ui->log_open, &QPushButton::clicked,
            this, &ReadLOgWidget::SlotLogButtonClicked);
    connect(ui->log_delete, &QPushButton::clicked,
            this, &ReadLOgWidget::SlotLogButtonClicked);

}

void ReadLOgWidget::InitialSystemPath() {
#ifdef Q_OS_WIN
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::AppDataLocation);
    QDir dir(home_path);
    dir.cdUp();
    home_path = dir.absolutePath();
    log_path_ = QString("%1/ReadLog").arg(home_path);
#endif
#ifdef Q_OS_LINUX
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::HomeLocation);
    log_path_ = QString("%1/.ReadLog").arg(home_path);
#endif
#ifdef Q_OS_MAC
    QString home_path = QStandardPaths::writableLocation(
                            QStandardPaths::HomeLocation);
    log_path_ = QString("%1/.ReadLog").arg(home_path);
#endif
    DirMake(log_path_);
    QDir::setCurrent(log_path_);
}

void ReadLOgWidget::InitialLogMessage() {
    DirMake("./log");
    if (log_file_.open(QIODevice::WriteOnly | QIODevice::Append)) {
        qInstallMessageHandler(LogMessageOutput);
    } else {
        qWarning() << "logfile open error!";
    }
}



void ReadLOgWidget::UpdateLogInfo() {
    qDebug();
    ui->log_tree->clear();
    QDir dir("./log");
    QStringList filters;
    filters << "log*";
    dir.setNameFilters(filters);
    dir.setSorting(QDir::Time);
    QFileInfoList file_list = dir.entryInfoList(QDir::Files | QDir::NoSymLinks |
                              QDir::NoDotAndDotDot);
    foreach (const QFileInfo &file_info, file_list) {
        QTreeWidgetItem *item = new QTreeWidgetItem();
        item->setText(0, file_info.fileName());
        ui->log_tree->addTopLevelItem(item);
    }
}

void ReadLOgWidget::LogMessageOutput(
    QtMsgType type, const QMessageLogContext &context, const QString &msg) {
    static QReadWriteLock lock;
    QWriteLocker locker(&lock);
    static QTextStream cout(stdout, QIODevice::WriteOnly);
    QString msg_type;
    switch (type) {
        case QtDebugMsg: {
                msg_type = QString("DEBUG:");
                break;
            }
        case QtInfoMsg: {
                msg_type = QString("INFO:");
                break;
            }
        case QtWarningMsg: {
                msg_type = QString("WARNING:");
                break;
            }
        case QtCriticalMsg: {
                msg_type = QString("CRITICAL:");
                break;
            }
        case QtFatalMsg: {
                msg_type = QString("FATAL:");
                break;
            }
    }
    QString currentDateTime = QDateTime::currentDateTime()
                              .toString("yyyy-MM-dd hh:mm:ss:zzz");
    QString currentThreadName = QThread::currentThread()->objectName();
    QString message = QString("%1 [%2] %3 - %4 %5")
                      .arg(currentDateTime)
                      .arg(currentThreadName)
                      .arg(msg_type)
                      .arg(QString(context.function).remove(QRegExp("\\((.*)\\)")))
                      .arg(msg);
    log_text_stream_ << message;
    cout << message << endl;
    cout.flush();
}

void ReadLOgWidget::SlotLogButtonClicked() {
    qDebug();
    QTreeWidgetItem *item = ui->log_tree->currentItem();
    if (item == nullptr) {
        return ;
    }
    if (QObject::sender() == ui->log_open) {
        QString file_name = item->text(0);
        log_view_->ShowLog(QString("./log/%1").arg(file_name));
    } else if (QObject::sender() == ui->log_delete) {
        QString file_name = item->text(0);
        QFile::remove(QString("./log/%1").arg(file_name));
        this->UpdateLogInfo();
    }
}

```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200117111025969.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200117111050659.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)