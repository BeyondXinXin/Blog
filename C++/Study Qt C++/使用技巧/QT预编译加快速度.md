# QT预编译加快速度

临时有需求写些小的任务，比如文件流操作，图片加水印等完成快速部署，或者比较大的项目，编译速度过慢，这时就需要设置预编译。建完新工程实现快速部署和编译。

qt使用预编译只需要在.pro或者任意一个.pri里添加两行就可以了
```javascript
CONFIG          += precompile_header
PRECOMPILED_HEADER=$$PWD/stable.h
```
我分享下我常用的pro模板和预编译文件，便于快速部署

```javascript
QT       += core gui  network sql serialport widgets
#qt引用模块 核心功能、界面、网络、串口
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

#过程文件存放位置
MOC_DIR         = temp/moc  #指定moc命令将含Q_OBJECT的头文件转换成标准.h文件的存放目录
RCC_DIR         = temp/rcc  #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
UI_DIR          = temp/ui   #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
OBJECTS_DIR     = temp/obj  #指定目标文件(obj)的存放目录

#指定生成的应用程序放置的目录
DESTDIR         = bin
#指定生成的应用程序名和图标
TARGET = YX_case
RC_ICONS= myico.ico
#工程中包含的资源文件
DEFINES += QT_DEPRECATED_WARNINGS #定义编译选项，在.h文件中就可以使用：#ifdefine xx_xx_xxx

#指定编译器选项和项目配置
CONFIG          += warn_on   #告诉qmake要把编译器设置为输出警告信息的。
CONFIG          += precompile_header    #可以在项目中使用预编译头文件的支持。
#预编译
PRECOMPILED_HEADER=$$PWD/stable.h
```

```javascript
//stable.h
#if defined __cplusplus
#include <iostream>
#include <vector>
#include <QApplication>
#include <QtCore>
#include <QtGui>
#include <QTimer>
#include <QtNetwork>
#include <QTextCodec>
#include <QThread>
#include <windows.h>
#include <QtSql>
#if (QT_VERSION > QT_VERSION_CHECK(5,0,0))
#include <QtWidgets>
#endif

#define  BOOL_VERIFY(emStatus_bool,switch_bool) \
if (emStatus_bool == true){return true;}\
else{return false;}
#define  NULL_VERIFY(emStatus_null,switch_null) \
if (emStatus_null != NULL){return true;}\
else{return false;}
#define AppPath         qApp->applicationDirPath()
#define TIMEMS          qPrintable(QTime::currentTime().toString("HH:mm:ss zzz"))
#define TIME            qPrintable(QTime::currentTime().toString("HHmmss"))
#define QDATE           qPrintable(QDate::currentDate().toString("yyyy-MM-dd"))
#define QTIME           qPrintable(QTime::currentTime().toString("HH-mm-ss-zzz"))
#define DATETIME        qPrintable(QDateTime::currentDateTime().toString("yyyy-MM-dd HH:mm:ss"))
#define STRDATETIME     qPrintable(QDateTime::currentDateTime().toString("yyyy-MM-dd-HH-mm-ss"))
#define STRDATETIMEMS   qPrintable(QDateTime::currentDateTime().toString("yyyy-MM-dd-HH-mm-ss-zzz"))
#pragma execution_character_set("utf-8")
#endif
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190805110455762.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)