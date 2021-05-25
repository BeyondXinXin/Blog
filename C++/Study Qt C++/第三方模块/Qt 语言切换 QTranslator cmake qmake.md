# Qt 语言切换 QTranslator cmake qmake
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426190205600.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020042619021611.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426190223450.png#pic_center)

&emsp;&emsp;如果觉得下边这个工程有用的话，下载：[http://118.25.63.144/temporary/TranslatorTest.zip](http://118.25.63.144/temporary/TranslatorTest.zip)


&emsp;&emsp;使用qt实现动态语言切换很方便。只需要利用**Qt5LinguistTools**生成一个.ts文件（多个语言需要多个.ts文件），让后使用**QtLinguist**软件打开.ts文件，填充翻译，发布为.qm文件。让后动态读取.qm就可以了。**cmake/qmake**下如如何配置**Qt5LinguistTools**可以看下边两个简单的案例。
&emsp;&emsp;需要翻译的文本应该用 tr把文本包含起来。

```cpp
QString QObject::tr(const char *sourceText, const char *disambiguation = Q_OBJECT, int n = Q_OBJECT)
```
&emsp;&emsp;需要翻译的界面应该在属性下设置为可以翻译
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426191247805.png#pic_center)
&emsp;&emsp;更新和发布翻译
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426191358650.png#pic_center)
&emsp;&emsp;设置翻译文本，选择**Qt5LinguistTools**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426191433480.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200426191643141.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)





- qmake

```cpp

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = untitled
TEMPLATE = app


DEFINES += QT_DEPRECATED_WARNINGS

CONFIG += c++11

SOURCES += \
        main.cpp

RESOURCES += \
    resource.qrc

TRANSLATIONS += en.ts

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target
```

```cpp
#include <QDebug>
#include <QTranslator>
#include <QApplication>

int main(int argc, char *argv[]) {
    QApplication a(argc, argv);
    QTranslator translator;
    translator.load(":/new/prefix1/en.qm");
    qApp->installTranslator(&translator);
    qDebug() << QObject::tr("hell word");
    qApp->removeTranslator(&translator);
    qDebug() << QObject::tr("hell word");
    qApp->installTranslator(&translator);
    qDebug() << QObject::tr("hell word");
    return 0;
}


```


- camke

```cpp
cmake_minimum_required(VERSION 3.1)

project(untitled)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 14)
option(BUILD_SHARED_LIBS "" OFF)

find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Xml Network Concurrent)
find_package(Qt5LinguistTools)

set(Resource
    resource.qrc)

set(translate
    resource.qrc)

qt5_create_translation(Translate
    main.cpp
    dialog.ui
    en.ts)

add_executable(${PROJECT_NAME}
    ${Translate}
    ${Resource}
    dialog.cpp
    dialog.h
    dialog.ui
    main.cpp)

target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent)

```

```cpp
#include <QTranslator>
#include <QApplication>
#include <QDebug>
#include "dialog.h"

int main(int argc, char *argv[]) {
    QApplication a(argc, argv);
    QTranslator translator;
    translator.load(":/en.qm");
    qApp->installTranslator(&translator);
    qDebug() << QObject::tr("hell word");
    qApp->removeTranslator(&translator);
    qDebug() << QObject::tr("hell word");
    Dialog w;
    w.exec();
    return 0;
}

```

```cpp
#ifndef DIALOG_H
#define DIALOG_H

#include <QDialog>


namespace Ui {
    class Dialog;
}

class QTranslator;

class Dialog : public QDialog {
    Q_OBJECT

  public:
    explicit Dialog(QWidget *parent = nullptr);
    ~Dialog();
  protected:
//    void changeEvent(QEvent *);
  private slots:
    void on_pushButton_clicked();

  private:
    Ui::Dialog *ui;
    QTranslator *translator_;
};

#endif // DIALOG_H

```

```cpp
#include "dialog.h"
#include "ui_dialog.h"
#include <QTranslator>
#include <QDebug>
#include <QLibraryInfo>

Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog) {
    ui->setupUi(this);
    translator_ = new QTranslator();
}

Dialog::~Dialog() {
    delete ui;
}

void Dialog::on_pushButton_clicked() {
    static bool is_en = 0;
    if(!is_en) {
        qApp->removeTranslator(translator_);
        translator_ = new QTranslator();
        translator_->load(":/en.qm");
        qApp->installTranslator(translator_);
        ui->retranslateUi(this);
    } else {
        qApp->removeTranslator(translator_);
        ui->retranslateUi(this);
    }
    is_en = !is_en;
}

```
