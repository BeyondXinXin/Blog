@[TOC](Qt、Halcon联合开发)
最近比较空闲，记录下自己原来学习过的东西。
本人菜鸟一个，机械出身半路转学qt，所有东西都是自己在网上学习，不保证此博客正确性，仅仅是我个人理解。

Halcon是一款优秀的商业版图像处理软件，Qt在可视化和界面开发方面拥有很强大的功能和便捷性。两者结合可以做很多事情。关于背景、介绍等等百度有一大把，我就不再复制，直接介绍我自己的理解和应用。

我个人把qt和halcon相结合分成三类，展示如下。
1.没有交互过程，halcon处理qt显示
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804115507609.gif)
2.halcon独自完成交互过程
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804120628896.gif)

3.qt完成交互过程
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804115600627.gif)
https://github.com/chinayaoxin/halcon_qt.git
## 1. qt安装
官网下载直接安装就可以，我直接用的vs2015座编译和调试器

## 2. halcon安装
官网下载直接安装就可以，每个月更新下license

## 3. qt配置halcon环境
qt和halcon环境都搭建好后，我们联合开发。
为了便于以后利用，我们把halcon配置单独写进api里。
首先一路默认新建一个qt widgets application 程序
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802152721410.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019080215281123.png)
建好后，选中.pro文件，右键在资源管理器打开，可以看到生成文件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802152827818.png)
在这个文件夹下我们新建文件夹Qt_HALCON文件夹，方便以后移植。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802153109564.png)
在Qt_HALCON文件夹里新建两个.txt文件，我们手写pri文件和头文件。（个人认为pri是qmake为了便于整理代码用的，和直接放入pro一模一样）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802153615235.png)
重命名为 qt_halcon.pri 和 QT_Halcon

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802153648436.png)
用记事本打开这两个文件分别写入

```javascript
// qt_halcon.pri
INCLUDEPATH += 'C:/Program Files/MVTec/HALCON-18.05-Progress/include'
INCLUDEPATH += 'C:/Program Files/MVTec/HALCON-18.05-Progress/include/halconcpp'
DEPENDPATH += 'C:/Program Files/MVTec/HALCON-18.05-Progress/lib/x64-win64'
LIBS += -L'C:/Program Files/MVTec/HALCON-18.05-Progress/lib/x64-win64/' -lhalcon\
 -lhalconc\
 -lhalconcpp\
 -lhalconcppxl\
 -lhalconcxl\
 -lhalconxl\
 -lhdevenginecpp\
 -lhdevenginecppxl\
 -llibiomp5md\
```
```javascript
// QT_Halcon
#ifndef QT_HALCON_MODULE_H
#define QT_HALCON_MODULE_H
#  include "HalconCpp.h"
#  include "HDevThread.h"
using namespace HalconCpp;
#endif
```
qt_halcon.pri就是引用halcon的头文件和lib文件，halcon在c++下不分debug和relese
**具体路径要根据自己安装来定**
QT_Halcon就是为了方便我们其他文件调用halcon的头文件


建立好模板后我们需要调用，打开我们的pro文件，文件最后添加
```javascript
// untitleda.pro文件添加
INCLUDEPATH     += $$PWD/Qt_HALCON
include         ($$PWD/Qt_HALCON/qt_halcon.pri)
#过程文件存放位置
MOC_DIR         = temp/moc  #指定moc命令将含Q_OBJECT的头文件转换成标准.h文件的存放目录
RCC_DIR         = temp/rcc  #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
UI_DIR          = temp/ui   #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
OBJECTS_DIR     = temp/obj  #指定目标文件(obj)的存放目录
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802154808458.png)
添加后，选中.pro文件，右键qmake，可以看到添加完成。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802154909964.png)
此时，这个程序的halcon环境就配置完成，这个Qt_HALCON文件夹就可以作为我们的模板，以后需要用到halcon，直接把这个文件夹复制进去就好。






## 4. qt下使用halcon

### 4.1. 方式一   完全脱离
完全脱离，不需要过多的界面交互，qt仅作为图片显示。
此方式没有任何Qt和Halon的交互，和使用opencv一样，qt负责前端显示，halcon负责图像处理。
这里涉及到QImage与HImage 相互转换，或者共用内存。我直接给出如何转换，要知道原理的话自己百度，我就不复制了。

***为了测试我们这里定义一个简单的需求，qt打开彩色图片，halcon将其旋转180°***
***为了模拟大家正常使用情况，halcon程序我们由halcon自带的ide编写，让后导出c++代码，由qt引用***


在之前建立的工程里我们在mainwindow类下添加
*程序转自https://blog.csdn.net/liyuanbhu/article/details/91356988*

```javascript
//mainwindow.h添加
#include <QT_Halcon>

------------------------------------

bool HImage2QImage(HalconCpp::HImage &from, QImage &to);
bool QImage2HImage(QImage &from, HalconCpp::HImage &to);
```
```javascript
//mainwindow.cpp添加
bool MainWindow::HImage2QImage(HalconCpp::HImage &from, QImage &to)
{
    Hlong width;
    Hlong height;
    from.GetImageSize(&width, &height);

    HTuple channels = from.CountChannels();
    HTuple type = from.GetImageType();

    if( strcmp(type[0].S(), "byte" )) // 如果不是 byte 类型，则失败
    {
        return false;
    }

    QImage::Format format;
    switch(channels[0].I())
    {
    case 1:
        format = QImage::Format_Grayscale8;
        break;
    case 3:
        format = QImage::Format_RGB32;
        break;
    default:
        return false;
    }

    if(to.width() != width || to.height() != height || to.format() != format)
    {
        to = QImage(static_cast<int>(width),
                    static_cast<int>(height),
                    format);
    }
    HString Type;
    if(channels[0].I() == 1)
    {
        unsigned char * pSrc = reinterpret_cast<unsigned char *>( from.GetImagePointer1(&Type, &width, &height) );
        memcpy( to.bits(), pSrc, static_cast<size_t>(width) * static_cast<size_t>(height) );
        return true;
    }
    else if(channels[0].I() == 3)
    {
        uchar *R, *G, *B;
        from.GetImagePointer3(reinterpret_cast<void **>(&R),
                              reinterpret_cast<void **>(&G),
                              reinterpret_cast<void **>(&B), &Type, &width, &height);

        for(int row = 0; row < height; row ++)
        {
            QRgb* line = reinterpret_cast<QRgb*>(to.scanLine(row));
            for(int col = 0; col < width; col ++)
            {
                line[col] = qRgb(*R++, *G++, *B++);
            }
        }
        return true;
    }

    return false;
}


bool MainWindow::QImage2HImage(QImage &from, HalconCpp::HImage &to)
{
    if(from.isNull()) return false;

    int width = from.width(), height = from.height();
    QImage::Format format = from.format();

    if(format == QImage::Format_RGB32 ||
        format == QImage::Format_ARGB32 ||
        format == QImage::Format_ARGB32_Premultiplied)
    {
        to.GenImageInterleaved(from.bits(), "rgbx", width, height, 0,  "byte", width, height, 0, 0, 8, 0);
        return true;
    }
    else if(format == QImage::Format_RGB888)
    {
        to.GenImageInterleaved(from.bits(), "rgb", width, height, 0,  "byte", width, height, 0, 0, 8, 0);
        return true;
    }
    else if(format == QImage::Format_Grayscale8 || format == QImage::Format_Indexed8)
    {
        to.GenImage1("byte", width, height, from.bits());
        return true;
    }
    return false;
}

```
这两个函数就是QImage 和HalconCpp的互转。
接下来打开mainwindow.ui，拖两个btn一个label
两个btn直接右键新建click槽函数
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802162204278.png)
接下来打开halcon软件，我们写一个简单的彩色转灰度程序。

```javascript
read_image (Image, 'E:/test.jpg')
rotate_image (Image, ImageRotate, 180, 'constant')
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802172201948.png)
接下来选择顶部依次点击 文件——导出，设置如下，位置桌面就可以。![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802161022295.png)
会提示无效程序，忽略就可以，因为在halcon里我们就没有写一个完整的程序，后面章节会有完整程序的导出。其实这一步很多余，一般直接写c++程序就可以，不需要用halcon导出。halcon帮助写的很完善，halcon和c++代码也可以直接在右上方选择。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802161412315.png)
导出后，我们再桌面打开这个文件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802161443610.png)
自己仔细阅读下，这个很好理解。其实就是定义一个action()函数，函数里实现我们的彩色转灰度。main里就是try catch调用这个action函数。我们直接把这两个函数复制过来用就可以了。

```javascript
//mainwindow.h添加
#include <QDebug>
------------------------------------
public:
	QImage  tmp_qimage;
	HImage  tmp_himage;
private slots:
    void on_pushButton_clicked();    
    void on_pushButton_2_clicked();
    void action();
```
```javascript
void MainWindow::on_pushButton_clicked()
{
    tmp_qimage=QImage("E:\\test.jpg");
    ui->label->setPixmap(QPixmap::fromImage(tmp_qimage));
}
void MainWindow::on_pushButton_2_clicked()
{
    if(!QImage2HImage(tmp_qimage,tmp_himage))
        return;
    if(!HImage2QImage(tmp_himage,tmp_qimage))
        return;
    if(!QImage2HImage(tmp_qimage,tmp_himage))
        return;

    try{
        action();}
    catch (HException &exception){
        qDebug()<<(const char *)exception.ErrorMessage();}

    if(!HImage2QImage(tmp_himage,tmp_qimage))
        return;

    ui->label->setPixmap(QPixmap::fromImage(tmp_qimage));
}

void MainWindow::action()
{
    RotateImage(tmp_himage, &tmp_himage, 180, "constant");
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804102255701.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804102302970.png)





### 4.2. 方式二   HWindowd独自完成交互
使用HWindow绑定label句柄，所有界面操作直接由halcon自身完成。
这里就是调用 HTuple  hv_WindowID[6];//窗口句柄，绑定qlabel的 Hlong MainWndID;//当前窗口句柄。让后每次label的大小变换重新出刷新halcon窗口适应label大小。
***为了测试我们这里定义一个简单的需求，qt重写halcon模板匹配助手***
***为了模拟大家正常使用情况，halcon程序我们由halcon自带的ide编写，让后导出c++代码，由qt引用***
***图片浏览器和halcon相关所有代码给出，这个测试软件还包含些其他东西，我随后分开后在完整贴出***

```javascript
//第一次绑定label句柄
 MainWndID = (Hlong)myscrollarea->label->winId();
    OpenWindow(0, 0, myscrollarea->label->width() ,
               myscrollarea->label->height(),
               MainWndID,"","",&hv_WindowID[0]);
    HDevWindowStack::Push(hv_WindowID[0]);
    DispObj(ho_Image, HDevWindowStack::GetActive());
```
label大小改变后需要重绘，此时更新halcon窗口。我这里的
ho_Image_show  显示图片
ModelRegion_show  显示交互生成的region（halcon）
ho_TransContours_show  显示结果region（halcon）
```javascript
//重绘函数，更新界面图片
void frmMain::paintEvent(QPaintEvent *event)
{    
    if (HDevWindowStack::IsOpen())
    {
        if(!myscrollarea->mMoveStart)
        {
            if(ho_Image_show)
            {
                HDevWindowStack::Pop();
                OpenWindow(0, 0, myscrollarea->label->width() ,
                           myscrollarea->label->height(),
                           MainWndID,"","",&hv_WindowID[0]);
                HDevWindowStack::Push(hv_WindowID[0]);
                DispObj(ho_Image, HDevWindowStack::GetActive());
            }
            if(ModelRegion_show)
            {
                SetColor(HDevWindowStack::GetActive(),"green");
                SetDraw(HDevWindowStack::GetActive(),"margin");
                DispObj(ModelRegion, HDevWindowStack::GetActive());
            }
            if(ho_TransContours_show)
            {
                SetColor(HDevWindowStack::GetActive(),"red");
                DispObj(ho_TransContours, HDevWindowStack::GetActive());
            }
        }
    }

}
```



这里需要一定的qt和halcon基础，首先用qt构建一个可以拖拽和缩放的图片浏览器。
（图片用label显示，我这里提供一种浏览器显示方法，自定义myScrollArea类继承QScrollArea，类里setWidget一个QLabel用来显示图片）
这个图片浏览器类有很多方式可以实现，用自己的也可以，只要图片显示是用label就可以了，最好把是否可以移动和缩放做成接口放到外部。
本人是半路自学，代码习惯不太好，有强迫症的自行修改。右键我留了个菜单，不需要的自行删除。
```javascript
//myscrollarea.h添加
#ifndef MYSCROLLAREA_H
#define MYSCROLLAREA_H
#include <stable.h>
//图片显示类  public变量canMove决定是否可以拖拽
//          public函数set_image决定显示图片

class myScrollArea : public QScrollArea
{
    Q_OBJECT

public:
    explicit myScrollArea(QWidget *parent = nullptr);
    ~myScrollArea();
    QLabel *    label;
    bool canMenu;//是否弹出菜单
    bool canMove;//是否可以移动
    void set_image(QString filename);
    QImage get_image();
    bool mMoveStart;//是否移动开始
    int min_label_width;
    int min_label_heigh;
    int big_label_size;
    int small_label_size;
    bool mContinuousMove;

private slots:
     void initFrm();

protected:

    bool eventFilter(QObject *obj, QEvent *evt);
    QPoint mMousePoint;
    QMenu *myScrollAreaMenu;
    QImage *myScrollArea_img;//内部图片

};

#endif // MYSCROLLAREA_H
```

```javascript
//myscrollarea.cpp
#include "myscrollarea.h"


myScrollArea::myScrollArea(QWidget *parent) :
    QScrollArea(parent)
    ,canMenu(true)
    ,canMove(true)
    ,mMoveStart(false)
    ,min_label_width(100)
    ,min_label_heigh(100)
    ,big_label_size(100)
    ,small_label_size(100)
    ,mContinuousMove(false)
    ,mMousePoint(QPoint(0,0))
{
    this->initFrm();
}

myScrollArea::~myScrollArea()
{    
    if(label)
    {
        delete label;
    }
}

void myScrollArea::set_image(QString filename)
{
    myScrollArea_img = new QImage(filename);
    label->setPixmap(QPixmap::fromImage(*myScrollArea_img));
    return;
}

QImage myScrollArea::get_image()
{
    return *myScrollArea_img;
}

void myScrollArea::initFrm()
{
    label = new QLabel();
    label->setFixedSize(500,500);
    label->setText("请选择图像");
    this->setWidget(label);
    this->setMaximumHeight(768);
    this->setMaximumWidth(1024);
    installEventFilter(this);



    myScrollAreaMenu = new QMenu(this);
    //myScrollAreaMenu->addAction("菜单01", this, SLOT(snapshot_video_one()));
    myScrollAreaMenu->addAction("菜单01");
    myScrollAreaMenu->addAction("菜单02");
    myScrollAreaMenu->addSeparator();

    QMenu *menu4 = myScrollAreaMenu->addMenu("菜单03");
    menu4->addAction("菜单03-子菜单01");
    menu4->addAction("菜单03-子菜单02");
    menu4->addAction("菜单03-子菜单03");
    menu4->addAction("菜单03-子菜单04");
}




//事件过滤器
bool myScrollArea::eventFilter(QObject *obj, QEvent *evt)
{
    //鼠标右键菜单
    if(canMenu)
    {
        if (evt->type() == QEvent::MouseButtonPress) {
            if (qApp->mouseButtons() == Qt::RightButton) {
                myScrollAreaMenu->exec(QCursor::pos());
            }
        }
    }


    if(canMove)
    {
        //鼠标拖动移动
        if(evt->type() == QEvent::MouseMove)
        {
            QMouseEvent *me = (QMouseEvent*) evt;
            if(me->buttons() & Qt::LeftButton)
            {
                if(!mMoveStart)
                {
                    mMoveStart = true;
                    mContinuousMove = false;
                    mMousePoint = me->globalPos();
                }
                else
                {
                    QScrollBar *scrollBarx = horizontalScrollBar();
                    QScrollBar *scrollBary = verticalScrollBar();
                    QPoint p = me->globalPos();
                    int offsetx = p.x() - mMousePoint.x();
                    int offsety = p.y() - mMousePoint.y();
                    if(!mContinuousMove && (offsetx > -10 && offsetx < 10) && (offsety > -10 && offsety < 10))
                        return false;
                    mContinuousMove = true;
                    scrollBarx->setValue(scrollBarx->value() - offsetx);
                    scrollBary->setValue(scrollBary->value() - offsety);
                    mMousePoint = p;
                    setCursor(Qt::SizeAllCursor);
                }
                return true;
            }
        }
        else if(evt->type() == QEvent::MouseButtonRelease)
        {
            mMoveStart = false;
            setCursor(Qt::ArrowCursor);
        }


        //滚轮放大缩小
        if(evt->type() == QEvent::Wheel){
            QWheelEvent *wheelEvent = static_cast<QWheelEvent *>(evt);
            QScrollBar *scrollBarx = horizontalScrollBar();
            QScrollBar *scrollBary = verticalScrollBar();
            if(wheelEvent->delta() > 100)
            {
                scrollBarx->setValue(scrollBarx->value()+big_label_size/2);
                scrollBary->setValue(scrollBary->value()+big_label_size/2);
                label->setFixedSize(label->width()+big_label_size,label->height()+big_label_size);

                return true;
            }
            else if(wheelEvent->delta() <-100)
            {
                if(label->width()<min_label_width)
                    return true;
                if(label->height()<min_label_heigh)
                    return true;
                scrollBarx->setValue(scrollBarx->value()-small_label_size/2);
                scrollBary->setValue(scrollBary->value()-small_label_size/2);
                label->setFixedSize(label->width()-small_label_size,label->height()-small_label_size);


                return true;
            }
            else{ return true;}
        }
    }

    return QObject::eventFilter(obj,evt);

}

```
ui界面，自己找了halcon模板匹配助手绘制。我这里把ui_.h的setupUi和retranslateUi贴出来，也可以参考下。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804104100906.png)

```javascript
// retranslateUi
 void retranslateUi(QWidget *frmMain)
    {
        frmMain->setWindowTitle(QApplication::translate("frmMain", "Form", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab), QApplication::translate("frmMain", "\345\244\232\347\225\214\351\235\242\347\274\272\351\231\267\346\230\276\347\244\272\345\212\237\350\203\275\345\261\225\347\244\272", nullptr));
        groupBox->setTitle(QApplication::translate("frmMain", "\345\233\276\345\203\217\346\223\215\344\275\234", nullptr));
        pushButton_3->setText(QApplication::translate("frmMain", "\346\270\205\347\251\272\345\233\276\345\203\217", nullptr));
        pushButton_2->setText(QApplication::translate("frmMain", "\345\212\240\350\275\275\345\233\276\345\203\217", nullptr));
        pushButton_4->setText(QApplication::translate("frmMain", "\344\277\235\345\255\230\345\233\276\345\203\217", nullptr));
        pushButton_5->setText(QApplication::translate("frmMain", "\345\217\246\345\255\230\345\233\276\345\203\217", nullptr));
        groupBox_2->setTitle(QApplication::translate("frmMain", "\346\250\241\346\235\277\346\241\206\351\200\211", nullptr));
        p1->setText(QString());
        p2->setText(QString());
        p3->setText(QString());
        p4->setText(QString());
        p5->setText(QString());
        pushButton_10->setText(QString());
        label->setText(QApplication::translate("frmMain", "ROI\346\225\260\351\207\217\357\274\232 0", nullptr));
        radioButton->setText(QApplication::translate("frmMain", "\345\271\266\351\233\206", nullptr));
        radioButton_2->setText(QApplication::translate("frmMain", "\344\272\244\351\233\206", nullptr));
        radioButton_3->setText(QApplication::translate("frmMain", "\345\267\256\351\233\206", nullptr));
        radioButton_4->setText(QApplication::translate("frmMain", "\345\257\271\347\247\260\345\267\256\351\233\206", nullptr));
        groupBox_3->setTitle(QApplication::translate("frmMain", "\350\275\256\345\273\223\345\217\202\346\225\260", nullptr));
        pushButton_9->setText(QApplication::translate("frmMain", "\346\211\276\345\257\273\350\275\256\345\273\223", nullptr));
        checkBox->setText(QApplication::translate("frmMain", "\345\212\250\346\200\201\346\230\276\347\244\272", nullptr));
        label_2->setText(QApplication::translate("frmMain", "\345\233\276\345\203\217\351\207\221\345\255\227\345\241\224\345\261\202\346\225\260", nullptr));
        label_3->setText(QApplication::translate("frmMain", "\346\250\241\346\235\277\346\227\213\350\275\254\350\265\267\345\247\213\350\247\222\345\272\246", nullptr));
        label_4->setText(QApplication::translate("frmMain", "\346\250\241\346\235\277\346\227\213\350\275\254\350\247\222\345\272\246\350\214\203\345\233\264", nullptr));
        label_5->setText(QApplication::translate("frmMain", "\346\250\241\346\235\277\346\227\213\350\275\254\350\247\222\345\272\246\346\255\245\351\225\277", nullptr));
        lineEdit->setText(QApplication::translate("frmMain", "0", nullptr));
        label_8->setText(QApplication::translate("frmMain", "\345\257\271\346\257\224\345\272\246\344\275\216", nullptr));
        label_9->setText(QApplication::translate("frmMain", "\345\257\271\346\257\224\345\272\246\351\253\230", nullptr));
        label_10->setText(QApplication::translate("frmMain", "\346\234\200\345\260\217\345\257\271\346\257\224\345\272\246", nullptr));
        label_11->setText(QApplication::translate("frmMain", "\346\234\200\345\260\217\347\273\204\344\273\266\351\225\277\345\272\246", nullptr));
        label_12->setText(QApplication::translate("frmMain", "\345\214\271\351\205\215\346\226\271\346\263\225\350\256\276\347\275\256", nullptr));
        comboBox_3->setItemText(0, QApplication::translate("frmMain", "none", nullptr));

        label_7->setText(QApplication::translate("frmMain", "\346\250\241\346\235\277\347\224\237\346\210\220\346\226\271\346\263\225", nullptr));
        comboBox_2->setItemText(0, QApplication::translate("frmMain", "no_pregeneration", nullptr));

        label_6->setText(QApplication::translate("frmMain", "\346\250\241\346\235\277\344\274\230\345\214\226\346\226\271\346\263\225", nullptr));
        comboBox->setItemText(0, QApplication::translate("frmMain", "use_polarity", nullptr));
        comboBox->setItemText(1, QApplication::translate("frmMain", "ignore_global_polarity", nullptr));
        comboBox->setItemText(2, QApplication::translate("frmMain", "ignore_local_polarity", nullptr));
        comboBox->setItemText(3, QApplication::translate("frmMain", "ignore_color_polarity", nullptr));

        tabWidget->setTabText(tabWidget->indexOf(tab_2), QApplication::translate("frmMain", "\350\276\271\347\274\230\346\217\220\345\217\226\345\212\237\350\203\275\345\261\225\347\244\272", nullptr));
        groupBox_4->setTitle(QApplication::translate("frmMain", "\347\255\233\351\200\211\346\235\241\344\273\266", nullptr));
        label_15->setText(QApplication::translate("frmMain", "\347\274\272\351\231\267\345\220\215\347\247\260", nullptr));
        comboBox_4->setItemText(0, QApplication::translate("frmMain", "\345\210\222\344\274\244", nullptr));
        comboBox_4->setItemText(1, QApplication::translate("frmMain", "\347\242\260\344\274\244", nullptr));
        comboBox_4->setItemText(2, QApplication::translate("frmMain", "\345\216\213\344\274\244", nullptr));
        comboBox_4->setItemText(3, QApplication::translate("frmMain", "\346\260\264\346\273\264", nullptr));

        checkBox_2->setText(QApplication::translate("frmMain", "\345\212\250\346\200\201\350\256\241\347\256\227", nullptr));
        label_16->setText(QApplication::translate("frmMain", "\351\235\242\347\247\257", nullptr));
        label_19->setText(QApplication::translate("frmMain", "\351\225\277\345\272\246", nullptr));
        label_23->setText(QApplication::translate("frmMain", "\347\201\260\345\272\246", nullptr));
        label_24->setText(QApplication::translate("frmMain", "\345\257\271\346\257\224", nullptr));
        pushButton_6->setText(QApplication::translate("frmMain", "\345\274\200\345\247\213\347\255\233\351\200\211", nullptr));
        pushButton_7->setText(QApplication::translate("frmMain", "\351\273\230\350\256\244\345\217\202\346\225\260", nullptr));
        pushButton->setText(QApplication::translate("frmMain", "\346\211\213\345\212\250\346\267\273\345\212\240", nullptr));
        pushButton_16->setText(QApplication::translate("frmMain", "\346\270\205\347\251\272\350\241\250\346\240\274", nullptr));
        label_14->setText(QApplication::translate("frmMain", "\347\274\272\351\231\267\345\233\276\347\211\207", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(widget), QApplication::translate("frmMain", "\344\270\273\347\225\214\351\235\242\347\274\272\351\231\267\351\200\211\344\270\255\347\212\266\346\200\201\345\261\225\347\244\272", nullptr));
        tabWidget->setTabText(tabWidget->indexOf(tab_3), QApplication::translate("frmMain", "\346\216\245\347\272\277\347\253\257\345\255\220\347\274\272\351\231\267\346\217\220\345\217\226\345\261\225\347\244\272", nullptr));
    } // retranslateUi
```

```javascript
//setupUi
 void setupUi(QWidget *frmMain)
    {
        if (frmMain->objectName().isEmpty())
            frmMain->setObjectName(QStringLiteral("frmMain"));
        frmMain->resize(877, 676);
        verticalLayout = new QVBoxLayout(frmMain);
        verticalLayout->setSpacing(0);
        verticalLayout->setObjectName(QStringLiteral("verticalLayout"));
        tabWidget = new QTabWidget(frmMain);
        tabWidget->setObjectName(QStringLiteral("tabWidget"));
        tab = new QWidget();
        tab->setObjectName(QStringLiteral("tab"));
        horizontalLayout_3 = new QHBoxLayout(tab);
        horizontalLayout_3->setObjectName(QStringLiteral("horizontalLayout_3"));
        gridWidget = new frmshow(tab);
        gridWidget->setObjectName(QStringLiteral("gridWidget"));
        gridLayout = new QGridLayout(gridWidget);
        gridLayout->setObjectName(QStringLiteral("gridLayout"));

        horizontalLayout_3->addWidget(gridWidget);

        gridWidget_2 = new frmshow(tab);
        gridWidget_2->setObjectName(QStringLiteral("gridWidget_2"));
        gridLayout_2 = new QGridLayout(gridWidget_2);
        gridLayout_2->setObjectName(QStringLiteral("gridLayout_2"));

        horizontalLayout_3->addWidget(gridWidget_2);

        tabWidget->addTab(tab, QString());
        tab_2 = new QWidget();
        tab_2->setObjectName(QStringLiteral("tab_2"));
        horizontalLayout = new QHBoxLayout(tab_2);
        horizontalLayout->setSpacing(5);
        horizontalLayout->setObjectName(QStringLiteral("horizontalLayout"));
        horizontalLayout->setContentsMargins(-1, -1, -1, 9);
        horizontalSpacer_8 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout->addItem(horizontalSpacer_8);

        horizontalLayout_2 = new QHBoxLayout();
        horizontalLayout_2->setObjectName(QStringLiteral("horizontalLayout_2"));

        horizontalLayout->addLayout(horizontalLayout_2);

        verticalLayout_3 = new QVBoxLayout();
        verticalLayout_3->setObjectName(QStringLiteral("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(6, 6, 6, 6);
        groupBox = new QGroupBox(tab_2);
        groupBox->setObjectName(QStringLiteral("groupBox"));
        groupBox->setMaximumSize(QSize(16777215, 16777215));
        gridLayout_3 = new QGridLayout(groupBox);
        gridLayout_3->setObjectName(QStringLiteral("gridLayout_3"));
        pushButton_3 = new QPushButton(groupBox);
        pushButton_3->setObjectName(QStringLiteral("pushButton_3"));

        gridLayout_3->addWidget(pushButton_3, 0, 1, 1, 1);

        pushButton_2 = new QPushButton(groupBox);
        pushButton_2->setObjectName(QStringLiteral("pushButton_2"));

        gridLayout_3->addWidget(pushButton_2, 0, 0, 1, 1);

        pushButton_4 = new QPushButton(groupBox);
        pushButton_4->setObjectName(QStringLiteral("pushButton_4"));

        gridLayout_3->addWidget(pushButton_4, 1, 0, 1, 1);

        pushButton_5 = new QPushButton(groupBox);
        pushButton_5->setObjectName(QStringLiteral("pushButton_5"));

        gridLayout_3->addWidget(pushButton_5, 1, 1, 1, 1);


        verticalLayout_3->addWidget(groupBox);

        groupBox_2 = new QGroupBox(tab_2);
        groupBox_2->setObjectName(QStringLiteral("groupBox_2"));
        verticalLayout_4 = new QVBoxLayout(groupBox_2);
        verticalLayout_4->setObjectName(QStringLiteral("verticalLayout_4"));
        horizontalLayout_5 = new QHBoxLayout();
        horizontalLayout_5->setObjectName(QStringLiteral("horizontalLayout_5"));
        p1 = new QPushButton(groupBox_2);
        p1->setObjectName(QStringLiteral("p1"));
        p1->setMinimumSize(QSize(30, 30));
        p1->setMaximumSize(QSize(30, 30));
        QIcon icon;
        icon.addFile(QStringLiteral(":/image/Circle.png"), QSize(), QIcon::Normal, QIcon::Off);
        p1->setIcon(icon);

        horizontalLayout_5->addWidget(p1);

        p2 = new QPushButton(groupBox_2);
        p2->setObjectName(QStringLiteral("p2"));
        p2->setMinimumSize(QSize(30, 30));
        p2->setMaximumSize(QSize(30, 30));
        QIcon icon1;
        icon1.addFile(QStringLiteral(":/image/Elipse.png"), QSize(), QIcon::Normal, QIcon::Off);
        p2->setIcon(icon1);

        horizontalLayout_5->addWidget(p2);

        p3 = new QPushButton(groupBox_2);
        p3->setObjectName(QStringLiteral("p3"));
        p3->setMinimumSize(QSize(30, 30));
        p3->setMaximumSize(QSize(30, 30));
        QIcon icon2;
        icon2.addFile(QStringLiteral(":/image/Square.png"), QSize(), QIcon::Normal, QIcon::Off);
        p3->setIcon(icon2);

        horizontalLayout_5->addWidget(p3);

        p4 = new QPushButton(groupBox_2);
        p4->setObjectName(QStringLiteral("p4"));
        p4->setMinimumSize(QSize(30, 30));
        p4->setMaximumSize(QSize(30, 30));
        p4->setIcon(icon2);

        horizontalLayout_5->addWidget(p4);

        p5 = new QPushButton(groupBox_2);
        p5->setObjectName(QStringLiteral("p5"));
        p5->setMinimumSize(QSize(30, 30));
        p5->setMaximumSize(QSize(30, 30));
        QIcon icon3;
        icon3.addFile(QStringLiteral(":/image/Painbrush.png"), QSize(), QIcon::Normal, QIcon::Off);
        p5->setIcon(icon3);

        horizontalLayout_5->addWidget(p5);

        pushButton_10 = new QPushButton(groupBox_2);
        pushButton_10->setObjectName(QStringLiteral("pushButton_10"));
        pushButton_10->setMinimumSize(QSize(30, 30));
        pushButton_10->setMaximumSize(QSize(30, 30));
        QIcon icon4;
        icon4.addFile(QStringLiteral(":/image/btn_close.png"), QSize(), QIcon::Normal, QIcon::Off);
        pushButton_10->setIcon(icon4);

        horizontalLayout_5->addWidget(pushButton_10);

        horizontalSpacer = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_5->addItem(horizontalSpacer);

        label = new QLabel(groupBox_2);
        label->setObjectName(QStringLiteral("label"));

        horizontalLayout_5->addWidget(label);


        verticalLayout_4->addLayout(horizontalLayout_5);

        horizontalLayout_4 = new QHBoxLayout();
        horizontalLayout_4->setObjectName(QStringLiteral("horizontalLayout_4"));
        radioButton = new QRadioButton(groupBox_2);
        radioButton->setObjectName(QStringLiteral("radioButton"));
        radioButton->setTabletTracking(false);
        radioButton->setAutoFillBackground(false);
        radioButton->setCheckable(true);
        radioButton->setChecked(true);

        horizontalLayout_4->addWidget(radioButton);

        radioButton_2 = new QRadioButton(groupBox_2);
        radioButton_2->setObjectName(QStringLiteral("radioButton_2"));

        horizontalLayout_4->addWidget(radioButton_2);

        radioButton_3 = new QRadioButton(groupBox_2);
        radioButton_3->setObjectName(QStringLiteral("radioButton_3"));

        horizontalLayout_4->addWidget(radioButton_3);

        radioButton_4 = new QRadioButton(groupBox_2);
        radioButton_4->setObjectName(QStringLiteral("radioButton_4"));

        horizontalLayout_4->addWidget(radioButton_4);

        horizontalSpacer_2 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_4->addItem(horizontalSpacer_2);


        verticalLayout_4->addLayout(horizontalLayout_4);


        verticalLayout_3->addWidget(groupBox_2);

        groupBox_3 = new QGroupBox(tab_2);
        groupBox_3->setObjectName(QStringLiteral("groupBox_3"));
        verticalLayout_2 = new QVBoxLayout(groupBox_3);
        verticalLayout_2->setObjectName(QStringLiteral("verticalLayout_2"));
        horizontalLayout_6 = new QHBoxLayout();
        horizontalLayout_6->setObjectName(QStringLiteral("horizontalLayout_6"));
        pushButton_9 = new QPushButton(groupBox_3);
        pushButton_9->setObjectName(QStringLiteral("pushButton_9"));

        horizontalLayout_6->addWidget(pushButton_9);

        checkBox = new QCheckBox(groupBox_3);
        checkBox->setObjectName(QStringLiteral("checkBox"));
        checkBox->setChecked(true);
        checkBox->setTristate(false);

        horizontalLayout_6->addWidget(checkBox);

        horizontalSpacer_3 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_6->addItem(horizontalSpacer_3);


        verticalLayout_2->addLayout(horizontalLayout_6);

        horizontalLayout_7 = new QHBoxLayout();
        horizontalLayout_7->setObjectName(QStringLiteral("horizontalLayout_7"));
        label_2 = new QLabel(groupBox_3);
        label_2->setObjectName(QStringLiteral("label_2"));
        label_2->setMinimumSize(QSize(100, 0));
        label_2->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_7->addWidget(label_2);

        spinBox = new QSpinBox(groupBox_3);
        spinBox->setObjectName(QStringLiteral("spinBox"));
        spinBox->setMaximum(10);
        spinBox->setValue(5);

        horizontalLayout_7->addWidget(spinBox);

        horizontalSlider = new QSlider(groupBox_3);
        horizontalSlider->setObjectName(QStringLiteral("horizontalSlider"));
        horizontalSlider->setMaximum(10);
        horizontalSlider->setValue(5);
        horizontalSlider->setOrientation(Qt::Horizontal);

        horizontalLayout_7->addWidget(horizontalSlider);


        verticalLayout_2->addLayout(horizontalLayout_7);

        horizontalLayout_8 = new QHBoxLayout();
        horizontalLayout_8->setObjectName(QStringLiteral("horizontalLayout_8"));
        label_3 = new QLabel(groupBox_3);
        label_3->setObjectName(QStringLiteral("label_3"));
        label_3->setMinimumSize(QSize(100, 0));
        label_3->setMaximumSize(QSize(100, 16777215));
        QFont font;
        font.setFamily(QStringLiteral("Agency FB"));
        font.setPointSize(8);
        label_3->setFont(font);

        horizontalLayout_8->addWidget(label_3);

        spinBox_2 = new QSpinBox(groupBox_3);
        spinBox_2->setObjectName(QStringLiteral("spinBox_2"));
        spinBox_2->setMaximum(180);

        horizontalLayout_8->addWidget(spinBox_2);

        horizontalSlider_2 = new QSlider(groupBox_3);
        horizontalSlider_2->setObjectName(QStringLiteral("horizontalSlider_2"));
        horizontalSlider_2->setMaximum(180);
        horizontalSlider_2->setOrientation(Qt::Horizontal);

        horizontalLayout_8->addWidget(horizontalSlider_2);


        verticalLayout_2->addLayout(horizontalLayout_8);

        horizontalLayout_9 = new QHBoxLayout();
        horizontalLayout_9->setObjectName(QStringLiteral("horizontalLayout_9"));
        label_4 = new QLabel(groupBox_3);
        label_4->setObjectName(QStringLiteral("label_4"));
        label_4->setMinimumSize(QSize(100, 0));
        label_4->setMaximumSize(QSize(100, 16777215));
        label_4->setFont(font);

        horizontalLayout_9->addWidget(label_4);

        spinBox_3 = new QSpinBox(groupBox_3);
        spinBox_3->setObjectName(QStringLiteral("spinBox_3"));
        spinBox_3->setMaximum(360);
        spinBox_3->setValue(0);

        horizontalLayout_9->addWidget(spinBox_3);

        horizontalSlider_3 = new QSlider(groupBox_3);
        horizontalSlider_3->setObjectName(QStringLiteral("horizontalSlider_3"));
        horizontalSlider_3->setMaximum(360);
        horizontalSlider_3->setValue(0);
        horizontalSlider_3->setSliderPosition(0);
        horizontalSlider_3->setOrientation(Qt::Horizontal);

        horizontalLayout_9->addWidget(horizontalSlider_3);


        verticalLayout_2->addLayout(horizontalLayout_9);

        horizontalLayout_10 = new QHBoxLayout();
        horizontalLayout_10->setObjectName(QStringLiteral("horizontalLayout_10"));
        label_5 = new QLabel(groupBox_3);
        label_5->setObjectName(QStringLiteral("label_5"));
        label_5->setMinimumSize(QSize(100, 0));
        label_5->setMaximumSize(QSize(100, 16777215));
        label_5->setFont(font);

        horizontalLayout_10->addWidget(label_5);

        lineEdit = new QLineEdit(groupBox_3);
        lineEdit->setObjectName(QStringLiteral("lineEdit"));
        lineEdit->setMinimumSize(QSize(52, 0));
        lineEdit->setMaximumSize(QSize(52, 16777215));

        horizontalLayout_10->addWidget(lineEdit);

        horizontalSpacer_4 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_10->addItem(horizontalSpacer_4);


        verticalLayout_2->addLayout(horizontalLayout_10);

        horizontalLayout_11 = new QHBoxLayout();
        horizontalLayout_11->setObjectName(QStringLiteral("horizontalLayout_11"));
        label_8 = new QLabel(groupBox_3);
        label_8->setObjectName(QStringLiteral("label_8"));
        label_8->setMinimumSize(QSize(100, 0));
        label_8->setMaximumSize(QSize(100, 100));

        horizontalLayout_11->addWidget(label_8);

        spinBox_5 = new QSpinBox(groupBox_3);
        spinBox_5->setObjectName(QStringLiteral("spinBox_5"));
        spinBox_5->setMaximum(255);
        spinBox_5->setValue(36);

        horizontalLayout_11->addWidget(spinBox_5);

        horizontalSlider_4 = new QSlider(groupBox_3);
        horizontalSlider_4->setObjectName(QStringLiteral("horizontalSlider_4"));
        horizontalSlider_4->setMaximum(255);
        horizontalSlider_4->setValue(36);
        horizontalSlider_4->setOrientation(Qt::Horizontal);

        horizontalLayout_11->addWidget(horizontalSlider_4);


        verticalLayout_2->addLayout(horizontalLayout_11);

        horizontalLayout_12 = new QHBoxLayout();
        horizontalLayout_12->setObjectName(QStringLiteral("horizontalLayout_12"));
        label_9 = new QLabel(groupBox_3);
        label_9->setObjectName(QStringLiteral("label_9"));
        label_9->setMinimumSize(QSize(100, 0));
        label_9->setMaximumSize(QSize(1000, 16777215));

        horizontalLayout_12->addWidget(label_9);

        spinBox_6 = new QSpinBox(groupBox_3);
        spinBox_6->setObjectName(QStringLiteral("spinBox_6"));
        spinBox_6->setMaximum(255);
        spinBox_6->setValue(41);

        horizontalLayout_12->addWidget(spinBox_6);

        horizontalSlider_5 = new QSlider(groupBox_3);
        horizontalSlider_5->setObjectName(QStringLiteral("horizontalSlider_5"));
        horizontalSlider_5->setMaximum(255);
        horizontalSlider_5->setValue(41);
        horizontalSlider_5->setOrientation(Qt::Horizontal);

        horizontalLayout_12->addWidget(horizontalSlider_5);


        verticalLayout_2->addLayout(horizontalLayout_12);

        horizontalLayout_13 = new QHBoxLayout();
        horizontalLayout_13->setObjectName(QStringLiteral("horizontalLayout_13"));
        label_10 = new QLabel(groupBox_3);
        label_10->setObjectName(QStringLiteral("label_10"));
        label_10->setMinimumSize(QSize(100, 0));
        label_10->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_13->addWidget(label_10);

        spinBox_7 = new QSpinBox(groupBox_3);
        spinBox_7->setObjectName(QStringLiteral("spinBox_7"));
        spinBox_7->setMaximum(255);
        spinBox_7->setValue(3);

        horizontalLayout_13->addWidget(spinBox_7);

        horizontalSlider_6 = new QSlider(groupBox_3);
        horizontalSlider_6->setObjectName(QStringLiteral("horizontalSlider_6"));
        horizontalSlider_6->setValue(3);
        horizontalSlider_6->setOrientation(Qt::Horizontal);

        horizontalLayout_13->addWidget(horizontalSlider_6);


        verticalLayout_2->addLayout(horizontalLayout_13);

        horizontalLayout_14 = new QHBoxLayout();
        horizontalLayout_14->setObjectName(QStringLiteral("horizontalLayout_14"));
        label_11 = new QLabel(groupBox_3);
        label_11->setObjectName(QStringLiteral("label_11"));
        label_11->setMinimumSize(QSize(100, 0));
        label_11->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_14->addWidget(label_11);

        spinBox_8 = new QSpinBox(groupBox_3);
        spinBox_8->setObjectName(QStringLiteral("spinBox_8"));
        spinBox_8->setMaximum(500);
        spinBox_8->setValue(30);

        horizontalLayout_14->addWidget(spinBox_8);

        horizontalSlider_7 = new QSlider(groupBox_3);
        horizontalSlider_7->setObjectName(QStringLiteral("horizontalSlider_7"));
        horizontalSlider_7->setMaximum(500);
        horizontalSlider_7->setValue(30);
        horizontalSlider_7->setOrientation(Qt::Horizontal);

        horizontalLayout_14->addWidget(horizontalSlider_7);


        verticalLayout_2->addLayout(horizontalLayout_14);

        horizontalLayout_17 = new QHBoxLayout();
        horizontalLayout_17->setObjectName(QStringLiteral("horizontalLayout_17"));
        label_12 = new QLabel(groupBox_3);
        label_12->setObjectName(QStringLiteral("label_12"));
        label_12->setMinimumSize(QSize(100, 0));
        label_12->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_17->addWidget(label_12);

        comboBox_3 = new QComboBox(groupBox_3);
        comboBox_3->addItem(QString());
        comboBox_3->setObjectName(QStringLiteral("comboBox_3"));

        horizontalLayout_17->addWidget(comboBox_3);


        verticalLayout_2->addLayout(horizontalLayout_17);

        horizontalLayout_15 = new QHBoxLayout();
        horizontalLayout_15->setObjectName(QStringLiteral("horizontalLayout_15"));
        label_7 = new QLabel(groupBox_3);
        label_7->setObjectName(QStringLiteral("label_7"));
        label_7->setMinimumSize(QSize(100, 0));
        label_7->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_15->addWidget(label_7);

        comboBox_2 = new QComboBox(groupBox_3);
        comboBox_2->addItem(QString());
        comboBox_2->setObjectName(QStringLiteral("comboBox_2"));

        horizontalLayout_15->addWidget(comboBox_2);


        verticalLayout_2->addLayout(horizontalLayout_15);

        horizontalLayout_16 = new QHBoxLayout();
        horizontalLayout_16->setObjectName(QStringLiteral("horizontalLayout_16"));
        label_6 = new QLabel(groupBox_3);
        label_6->setObjectName(QStringLiteral("label_6"));
        label_6->setMinimumSize(QSize(100, 0));
        label_6->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_16->addWidget(label_6);

        comboBox = new QComboBox(groupBox_3);
        comboBox->addItem(QString());
        comboBox->addItem(QString());
        comboBox->addItem(QString());
        comboBox->addItem(QString());
        comboBox->setObjectName(QStringLiteral("comboBox"));

        horizontalLayout_16->addWidget(comboBox);


        verticalLayout_2->addLayout(horizontalLayout_16);


        verticalLayout_3->addWidget(groupBox_3);

        verticalSpacer = new QSpacerItem(20, 40, QSizePolicy::Minimum, QSizePolicy::Expanding);

        verticalLayout_3->addItem(verticalSpacer);


        horizontalLayout->addLayout(verticalLayout_3);

        horizontalLayout->setStretch(1, 4);
        horizontalLayout->setStretch(2, 1);
        tabWidget->addTab(tab_2, QString());
        widget = new QWidget();
        widget->setObjectName(QStringLiteral("widget"));
        horizontalLayout_18 = new QHBoxLayout(widget);
        horizontalLayout_18->setObjectName(QStringLiteral("horizontalLayout_18"));
        verticalLayout_5 = new QVBoxLayout();
        verticalLayout_5->setObjectName(QStringLiteral("verticalLayout_5"));
        groupBox_4 = new QGroupBox(widget);
        groupBox_4->setObjectName(QStringLiteral("groupBox_4"));
        groupBox_4->setMinimumSize(QSize(0, 0));
        groupBox_4->setMaximumSize(QSize(300, 16777215));
        verticalLayout_6 = new QVBoxLayout(groupBox_4);
        verticalLayout_6->setObjectName(QStringLiteral("verticalLayout_6"));
        horizontalLayout_21 = new QHBoxLayout();
        horizontalLayout_21->setObjectName(QStringLiteral("horizontalLayout_21"));
        label_15 = new QLabel(groupBox_4);
        label_15->setObjectName(QStringLiteral("label_15"));

        horizontalLayout_21->addWidget(label_15);

        comboBox_4 = new QComboBox(groupBox_4);
        comboBox_4->addItem(QString());
        comboBox_4->addItem(QString());
        comboBox_4->addItem(QString());
        comboBox_4->addItem(QString());
        comboBox_4->setObjectName(QStringLiteral("comboBox_4"));

        horizontalLayout_21->addWidget(comboBox_4);

        horizontalSpacer_7 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_21->addItem(horizontalSpacer_7);

        checkBox_2 = new QCheckBox(groupBox_4);
        checkBox_2->setObjectName(QStringLiteral("checkBox_2"));

        horizontalLayout_21->addWidget(checkBox_2);


        verticalLayout_6->addLayout(horizontalLayout_21);

        horizontalLayout_22 = new QHBoxLayout();
        horizontalLayout_22->setObjectName(QStringLiteral("horizontalLayout_22"));
        label_16 = new QLabel(groupBox_4);
        label_16->setObjectName(QStringLiteral("label_16"));
        label_16->setMinimumSize(QSize(0, 0));
        label_16->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_22->addWidget(label_16);

        spinBox_4 = new QSpinBox(groupBox_4);
        spinBox_4->setObjectName(QStringLiteral("spinBox_4"));
        spinBox_4->setMaximum(300);
        spinBox_4->setValue(120);

        horizontalLayout_22->addWidget(spinBox_4);

        horizontalSlider_8 = new QSlider(groupBox_4);
        horizontalSlider_8->setObjectName(QStringLiteral("horizontalSlider_8"));
        horizontalSlider_8->setMaximum(300);
        horizontalSlider_8->setValue(120);
        horizontalSlider_8->setOrientation(Qt::Horizontal);

        horizontalLayout_22->addWidget(horizontalSlider_8);


        verticalLayout_6->addLayout(horizontalLayout_22);

        horizontalLayout_27 = new QHBoxLayout();
        horizontalLayout_27->setObjectName(QStringLiteral("horizontalLayout_27"));
        label_19 = new QLabel(groupBox_4);
        label_19->setObjectName(QStringLiteral("label_19"));
        label_19->setMinimumSize(QSize(0, 0));
        label_19->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_27->addWidget(label_19);

        spinBox_10 = new QSpinBox(groupBox_4);
        spinBox_10->setObjectName(QStringLiteral("spinBox_10"));
        spinBox_10->setMaximum(500);
        spinBox_10->setValue(100);

        horizontalLayout_27->addWidget(spinBox_10);

        horizontalSlider_10 = new QSlider(groupBox_4);
        horizontalSlider_10->setObjectName(QStringLiteral("horizontalSlider_10"));
        horizontalSlider_10->setMaximum(500);
        horizontalSlider_10->setValue(100);
        horizontalSlider_10->setOrientation(Qt::Horizontal);

        horizontalLayout_27->addWidget(horizontalSlider_10);


        verticalLayout_6->addLayout(horizontalLayout_27);

        horizontalLayout_33 = new QHBoxLayout();
        horizontalLayout_33->setObjectName(QStringLiteral("horizontalLayout_33"));
        label_23 = new QLabel(groupBox_4);
        label_23->setObjectName(QStringLiteral("label_23"));
        label_23->setMinimumSize(QSize(0, 0));
        label_23->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_33->addWidget(label_23);

        spinBox_13 = new QSpinBox(groupBox_4);
        spinBox_13->setObjectName(QStringLiteral("spinBox_13"));
        spinBox_13->setMaximum(255);
        spinBox_13->setValue(95);

        horizontalLayout_33->addWidget(spinBox_13);

        horizontalSlider_13 = new QSlider(groupBox_4);
        horizontalSlider_13->setObjectName(QStringLiteral("horizontalSlider_13"));
        horizontalSlider_13->setMaximum(255);
        horizontalSlider_13->setValue(95);
        horizontalSlider_13->setOrientation(Qt::Horizontal);

        horizontalLayout_33->addWidget(horizontalSlider_13);


        verticalLayout_6->addLayout(horizontalLayout_33);

        horizontalLayout_34 = new QHBoxLayout();
        horizontalLayout_34->setObjectName(QStringLiteral("horizontalLayout_34"));
        label_24 = new QLabel(groupBox_4);
        label_24->setObjectName(QStringLiteral("label_24"));
        label_24->setMinimumSize(QSize(0, 0));
        label_24->setMaximumSize(QSize(100, 16777215));

        horizontalLayout_34->addWidget(label_24);

        spinBox_14 = new QSpinBox(groupBox_4);
        spinBox_14->setObjectName(QStringLiteral("spinBox_14"));
        spinBox_14->setMaximum(255);
        spinBox_14->setValue(60);

        horizontalLayout_34->addWidget(spinBox_14);

        horizontalSlider_14 = new QSlider(groupBox_4);
        horizontalSlider_14->setObjectName(QStringLiteral("horizontalSlider_14"));
        horizontalSlider_14->setMaximum(255);
        horizontalSlider_14->setValue(90);
        horizontalSlider_14->setOrientation(Qt::Horizontal);

        horizontalLayout_34->addWidget(horizontalSlider_14);


        verticalLayout_6->addLayout(horizontalLayout_34);

        horizontalLayout_19 = new QHBoxLayout();
        horizontalLayout_19->setObjectName(QStringLiteral("horizontalLayout_19"));
        horizontalSpacer_5 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_19->addItem(horizontalSpacer_5);

        pushButton_6 = new QPushButton(groupBox_4);
        pushButton_6->setObjectName(QStringLiteral("pushButton_6"));

        horizontalLayout_19->addWidget(pushButton_6);

        horizontalSpacer_6 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_19->addItem(horizontalSpacer_6);


        verticalLayout_6->addLayout(horizontalLayout_19);

        horizontalLayout_20 = new QHBoxLayout();
        horizontalLayout_20->setObjectName(QStringLiteral("horizontalLayout_20"));
        horizontalSpacer_14 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_20->addItem(horizontalSpacer_14);

        pushButton_7 = new QPushButton(groupBox_4);
        pushButton_7->setObjectName(QStringLiteral("pushButton_7"));

        horizontalLayout_20->addWidget(pushButton_7);

        pushButton = new QPushButton(groupBox_4);
        pushButton->setObjectName(QStringLiteral("pushButton"));

        horizontalLayout_20->addWidget(pushButton);

        pushButton_16 = new QPushButton(groupBox_4);
        pushButton_16->setObjectName(QStringLiteral("pushButton_16"));

        horizontalLayout_20->addWidget(pushButton_16);

        horizontalSpacer_15 = new QSpacerItem(40, 20, QSizePolicy::Expanding, QSizePolicy::Minimum);

        horizontalLayout_20->addItem(horizontalSpacer_15);


        verticalLayout_6->addLayout(horizontalLayout_20);


        verticalLayout_5->addWidget(groupBox_4);

        label_14 = new QLabel(widget);
        label_14->setObjectName(QStringLiteral("label_14"));
        label_14->setMinimumSize(QSize(0, 0));
        label_14->setMaximumSize(QSize(300, 16777215));

        verticalLayout_5->addWidget(label_14);

        verticalLayout_5->setStretch(0, 1);
        verticalLayout_5->setStretch(1, 1);

        horizontalLayout_18->addLayout(verticalLayout_5);

        horizontalLayout_23 = new QHBoxLayout();
        horizontalLayout_23->setObjectName(QStringLiteral("horizontalLayout_23"));

        horizontalLayout_18->addLayout(horizontalLayout_23);

        mytablewidget = new myTableWidget(widget);
        mytablewidget->setObjectName(QStringLiteral("mytablewidget"));
        mytablewidget->setMinimumSize(QSize(525, 0));
        mytablewidget->setMaximumSize(QSize(525, 16777215));

        horizontalLayout_18->addWidget(mytablewidget);

        horizontalLayout_18->setStretch(0, 1);
        horizontalLayout_18->setStretch(1, 10);
        horizontalLayout_18->setStretch(2, 1);
        tabWidget->addTab(widget, QString());
        tab_3 = new QWidget();
        tab_3->setObjectName(QStringLiteral("tab_3"));
        tabWidget->addTab(tab_3, QString());

        verticalLayout->addWidget(tabWidget);


        retranslateUi(frmMain);

        tabWidget->setCurrentIndex(1);


        QMetaObject::connectSlotsByName(frmMain);
    } // setupUi
----------------------------------
 QVBoxLayout *verticalLayout;
    QTabWidget *tabWidget;
    QWidget *tab;
    QHBoxLayout *horizontalLayout_3;
    frmshow *gridWidget;
    QGridLayout *gridLayout;
    frmshow *gridWidget_2;
    QGridLayout *gridLayout_2;
    QWidget *tab_2;
    QHBoxLayout *horizontalLayout;
    QSpacerItem *horizontalSpacer_8;
    QHBoxLayout *horizontalLayout_2;
    QVBoxLayout *verticalLayout_3;
    QGroupBox *groupBox;
    QGridLayout *gridLayout_3;
    QPushButton *pushButton_3;
    QPushButton *pushButton_2;
    QPushButton *pushButton_4;
    QPushButton *pushButton_5;
    QGroupBox *groupBox_2;
    QVBoxLayout *verticalLayout_4;
    QHBoxLayout *horizontalLayout_5;
    QPushButton *p1;
    QPushButton *p2;
    QPushButton *p3;
    QPushButton *p4;
    QPushButton *p5;
    QPushButton *pushButton_10;
    QSpacerItem *horizontalSpacer;
    QLabel *label;
    QHBoxLayout *horizontalLayout_4;
    QRadioButton *radioButton;
    QRadioButton *radioButton_2;
    QRadioButton *radioButton_3;
    QRadioButton *radioButton_4;
    QSpacerItem *horizontalSpacer_2;
    QGroupBox *groupBox_3;
    QVBoxLayout *verticalLayout_2;
    QHBoxLayout *horizontalLayout_6;
    QPushButton *pushButton_9;
    QCheckBox *checkBox;
    QSpacerItem *horizontalSpacer_3;
    QHBoxLayout *horizontalLayout_7;
    QLabel *label_2;
    QSpinBox *spinBox;
    QSlider *horizontalSlider;
    QHBoxLayout *horizontalLayout_8;
    QLabel *label_3;
    QSpinBox *spinBox_2;
    QSlider *horizontalSlider_2;
    QHBoxLayout *horizontalLayout_9;
    QLabel *label_4;
    QSpinBox *spinBox_3;
    QSlider *horizontalSlider_3;
    QHBoxLayout *horizontalLayout_10;
    QLabel *label_5;
    QLineEdit *lineEdit;
    QSpacerItem *horizontalSpacer_4;
    QHBoxLayout *horizontalLayout_11;
    QLabel *label_8;
    QSpinBox *spinBox_5;
    QSlider *horizontalSlider_4;
    QHBoxLayout *horizontalLayout_12;
    QLabel *label_9;
    QSpinBox *spinBox_6;
    QSlider *horizontalSlider_5;
    QHBoxLayout *horizontalLayout_13;
    QLabel *label_10;
    QSpinBox *spinBox_7;
    QSlider *horizontalSlider_6;
    QHBoxLayout *horizontalLayout_14;
    QLabel *label_11;
    QSpinBox *spinBox_8;
    QSlider *horizontalSlider_7;
    QHBoxLayout *horizontalLayout_17;
    QLabel *label_12;
    QComboBox *comboBox_3;
    QHBoxLayout *horizontalLayout_15;
    QLabel *label_7;
    QComboBox *comboBox_2;
    QHBoxLayout *horizontalLayout_16;
    QLabel *label_6;
    QComboBox *comboBox;
    QSpacerItem *verticalSpacer;
    QWidget *widget;
    QHBoxLayout *horizontalLayout_18;
    QVBoxLayout *verticalLayout_5;
    QGroupBox *groupBox_4;
    QVBoxLayout *verticalLayout_6;
    QHBoxLayout *horizontalLayout_21;
    QLabel *label_15;
    QComboBox *comboBox_4;
    QSpacerItem *horizontalSpacer_7;
    QCheckBox *checkBox_2;
    QHBoxLayout *horizontalLayout_22;
    QLabel *label_16;
    QSpinBox *spinBox_4;
    QSlider *horizontalSlider_8;
    QHBoxLayout *horizontalLayout_27;
    QLabel *label_19;
    QSpinBox *spinBox_10;
    QSlider *horizontalSlider_10;
    QHBoxLayout *horizontalLayout_33;
    QLabel *label_23;
    QSpinBox *spinBox_13;
    QSlider *horizontalSlider_13;
    QHBoxLayout *horizontalLayout_34;
    QLabel *label_24;
    QSpinBox *spinBox_14;
    QSlider *horizontalSlider_14;
    QHBoxLayout *horizontalLayout_19;
    QSpacerItem *horizontalSpacer_5;
    QPushButton *pushButton_6;
    QSpacerItem *horizontalSpacer_6;
    QHBoxLayout *horizontalLayout_20;
    QSpacerItem *horizontalSpacer_14;
    QPushButton *pushButton_7;
    QPushButton *pushButton;
    QPushButton *pushButton_16;
    QSpacerItem *horizontalSpacer_15;
    QLabel *label_14;
    QHBoxLayout *horizontalLayout_23;
    myTableWidget *mytablewidget;
    QWidget *tab_3;

```



halcon部分代码，手动打开模板匹配助手，建立模板，生成代码，导出c++，需要注意的是，设置成为在运行时绘制ROI生成代码，如果选择与助手相同的ROI就没有交互过程，直接用第一种使用方式就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804103720655.png)
HALCON代码导出c++后，和第一部一样自己先简单浏览下，了解逻辑。让后我们截取选用。

```javascript
//halcon里用到的变量
//---------------------界面二边缘提取变量---------------------//
    Hlong MainWndID;//当前窗口句柄
    HTuple  hv_WindowID[6];//窗口句柄
    HObject  ho_Image;//加载图片
    HObject  ModelRegion, ho_TransContours;//选择区域、生成区域
    bool ho_Image_show,ModelRegion_show,ho_TransContours_show;//三张图片是否显示
    int ModelRegionAreaNum;
    HObject  ho_ModelContours, ho_TemplateImage; // 轮廓找寻局部标志变量
    HTuple  hv_ModelID, hv_ModelRegionArea, hv_RefRow;// 轮廓找寻局部控制变量
    HTuple  hv_RefColumn, hv_HomMat2D;// 轮廓找寻局部控制变量

    //---------------------界面三缺陷筛选变量---------------------//
```

```javascript
//halcon里截出来的核心函数
//---------------------打开图片---------------------//
void frmMain::on_pushButton_2_clicked()
{
    MainWndID = (Hlong)myscrollarea->label->winId();
    OpenWindow(0, 0, myscrollarea->label->width() ,
               myscrollarea->label->height(),
               MainWndID,"","",&hv_WindowID[0]);
    HDevWindowStack::Push(hv_WindowID[0]);
    DispObj(ho_Image, HDevWindowStack::GetActive());
    ho_Image_show=true;
}

//重绘函数，更新界面图片
void frmMain::paintEvent(QPaintEvent *event)
{    
    if (HDevWindowStack::IsOpen())
    {
        if(!myscrollarea->mMoveStart)
        {
            if(ho_Image_show)
            {
                HDevWindowStack::Pop();
                OpenWindow(0, 0, myscrollarea->label->width() ,
                           myscrollarea->label->height(),
                           MainWndID,"","",&hv_WindowID[0]);
                HDevWindowStack::Push(hv_WindowID[0]);
                DispObj(ho_Image, HDevWindowStack::GetActive());
            }
            if(ModelRegion_show)
            {
                SetColor(HDevWindowStack::GetActive(),"green");
                SetDraw(HDevWindowStack::GetActive(),"margin");
                DispObj(ModelRegion, HDevWindowStack::GetActive());
            }
            if(ho_TransContours_show)
            {
                SetColor(HDevWindowStack::GetActive(),"red");
                DispObj(ho_TransContours, HDevWindowStack::GetActive());
            }
        }
    }

}

//框选roi 圆/方向椭圆/矩形/方向矩形/钢笔
void frmMain::on_pushButton_ModelRegionArea()
{
    myscrollarea->canMove=false;
    myscrollarea->canMenu=false;
    ho_Image_show=false;

    QPushButton *pub = (QPushButton *)sender();
    QString name = pub->objectName();

    HObject  temp;


    if(name=="p1")
    {
        if(ModelRegionAreaNum==0)
        {
            HTuple Row,Column,Radius;
            DrawCircle(hv_WindowID[0],&Row,&Column,&Radius);
            GenCircle(&ModelRegion,Row,Column,Radius);
        }else{
            HTuple Row,Column,Radius;
            DrawCircle(hv_WindowID[0],&Row,&Column,&Radius);
            GenCircle(&temp,Row,Column,Radius);

            if(ui->radioButton->isChecked())
                Union2(ModelRegion, temp, &ModelRegion);//并集
            if(ui->radioButton_2->isChecked())
                Intersection(ModelRegion, temp, &ModelRegion);//交集
            if(ui->radioButton_3->isChecked())
                Difference(ModelRegion, temp, &ModelRegion);//差集
            if(ui->radioButton_4->isChecked())
                SymmDifference(ModelRegion, temp, &ModelRegion);//对称差
        }
    }
    if(name=="p2")
    {if(ModelRegionAreaNum==0)
        {
            HTuple Row,Column,Phi,Radius1,Radius2;
            DrawEllipse(hv_WindowID[0],&Row,&Column,&Phi,&Radius1,&Radius2);
            GenEllipse(&ModelRegion,Row,Column,Phi,Radius1,Radius2);
        }else{
            HTuple Row,Column,Phi,Radius1,Radius2;
            DrawEllipse(hv_WindowID[0],&Row,&Column,&Phi,&Radius1,&Radius2);
            GenEllipse(&temp,Row,Column,Phi,Radius1,Radius2);

            if(ui->radioButton->isChecked())
                Union2(ModelRegion, temp, &ModelRegion);//并集
            if(ui->radioButton_2->isChecked())
                Intersection(ModelRegion, temp, &ModelRegion);//交集
            if(ui->radioButton_3->isChecked())
                Difference(ModelRegion, temp, &ModelRegion);//差集
            if(ui->radioButton_4->isChecked())
                SymmDifference(ModelRegion, temp, &ModelRegion);//对称差
        }}
    if(name=="p3")
    {
        if(ModelRegionAreaNum==0)
        {
            HTuple Row1,Column1,Row2,Column2;
            DrawRectangle1(hv_WindowID[0],&Row1,&Column1,&Row2,&Column2);
            GenRectangle1(&ModelRegion,Row1, Column1, Row2, Column2);

        }else{
            HTuple Row1,Column1,Row2,Column2;
            DrawRectangle1(hv_WindowID[0],&Row1,&Column1,&Row2,&Column2);
            GenRectangle1(&temp,Row1, Column1, Row2, Column2);
            if(ui->radioButton->isChecked())
                Union2(ModelRegion, temp, &ModelRegion);//并集
            if(ui->radioButton_2->isChecked())
                Intersection(ModelRegion, temp, &ModelRegion);//交集
            if(ui->radioButton_3->isChecked())
                Difference(ModelRegion, temp, &ModelRegion);//差集
            if(ui->radioButton_4->isChecked())
                SymmDifference(ModelRegion, temp, &ModelRegion);//对称差
        }
    }
    if(name=="p4")
    {
        if(ModelRegionAreaNum==0)
        {
            HTuple Row1,Column1,Phi, Length1,Length2;
            DrawRectangle2(hv_WindowID[0],&Row1,&Column1,&Phi,&Length1,&Length2);
            GenRectangle2(&ModelRegion,Row1, Column1, Phi, Length1,Length2);
            DrawRegion(&ModelRegion, hv_WindowID[0]);
        }else{
            HTuple Row1,Column1,Phi, Length1,Length2;
            DrawRectangle2(hv_WindowID[0],&Row1,&Column1,&Phi,&Length1,&Length2);
            GenRectangle2(&temp,Row1, Column1, Phi, Length1,Length2);
            if(ui->radioButton->isChecked())
                Union2(ModelRegion, temp, &ModelRegion);//并集
            if(ui->radioButton_2->isChecked())
                Intersection(ModelRegion, temp, &ModelRegion);//交集
            if(ui->radioButton_3->isChecked())
                Difference(ModelRegion, temp, &ModelRegion);//差集
            if(ui->radioButton_4->isChecked())
                SymmDifference(ModelRegion, temp, &ModelRegion);//对称差
        }
    }
    if(name=="p5")
    {
        if(ModelRegionAreaNum==0)
        {
            DrawRegion(&ModelRegion, hv_WindowID[0]);
        }else{
            DrawRegion(&temp, hv_WindowID[0]);
            if(ui->radioButton->isChecked())
                Union2(ModelRegion, temp, &ModelRegion);//并集
            if(ui->radioButton_2->isChecked())
                Intersection(ModelRegion, temp, &ModelRegion);//交集
            if(ui->radioButton_3->isChecked())
                Difference(ModelRegion, temp, &ModelRegion);//差集
            if(ui->radioButton_4->isChecked())
                SymmDifference(ModelRegion, temp, &ModelRegion);//对称差
        }
    }

    myscrollarea->canMove=true;
    myscrollarea->canMenu=true;
    ModelRegion_show=true;
    ho_Image_show=true;
    ho_TransContours_show=false;
    ModelRegionAreaNum++;
    ui->label->setText( QString("ROI数量： %1").arg(ModelRegionAreaNum) );
}

//边缘提取
void frmMain::on_pushButton_9_clicked()
{
    //裁剪模板
    ReduceDomain(ho_Image, ModelRegion, &ho_TemplateImage);
    try
    {
        //创建形状模型
        CreateShapeModel(ho_TemplateImage,
                         ui->spinBox->value(),//
                         HTuple(0).TupleRad(),
                         HTuple(0).TupleRad(),
                         HTuple(0).TupleRad(),
                         (HTuple("none").Append("no_pregeneration")),
                         "use_polarity",
                         ((HTuple(ui->spinBox_5->value())
                               .Append(ui->spinBox_6->value()))
                              .Append(ui->spinBox_8->value())),
                         ui->spinBox_7->value(),
                         &hv_ModelID);
    }
    catch (HException &exception)
    {
         qDebug()<<(stderr,"  Error #%u in %s: %s\n", exception.ErrorCode(),
                     (const char *)exception.ProcName(),
                     (const char *)exception.ErrorMessage());
    }

    //获取模型轮廓，以便稍后将其转换为图像
    GetShapeModelContours(&ho_ModelContours, hv_ModelID, 1);
    //获取参考位置
    AreaCenter(ModelRegion, &hv_ModelRegionArea, &hv_RefRow, &hv_RefColumn);
    VectorAngleToRigid(0, 0, 0, hv_RefRow, hv_RefColumn, 0, &hv_HomMat2D);
    AffineTransContourXld(ho_ModelContours, &ho_TransContours, hv_HomMat2D);
    ModelRegion_show=true;ho_Image_show=true;ho_TransContours_show=true;

}
```
Connect关联，绑定按钮和画图事件、绑定horizontalSlider和spinBox数值统一
```javascript
void frmMain::initConnect()
{
    connect(ui->p1,SIGNAL(clicked()),this,SLOT(on_pushButton_ModelRegionArea()));
    connect(ui->p2,SIGNAL(clicked()),this,SLOT(on_pushButton_ModelRegionArea()));
    connect(ui->p3,SIGNAL(clicked()),this,SLOT(on_pushButton_ModelRegionArea()));
    connect(ui->p4,SIGNAL(clicked()),this,SLOT(on_pushButton_ModelRegionArea()));
    connect(ui->p5,SIGNAL(clicked()),this,SLOT(on_pushButton_ModelRegionArea()));

    connect(ui->pushButton_9,SIGNAL(clicked()),this,SLOT(on_pushButton_9_clicked()));
    connect(ui->pushButton_10,SIGNAL(clicked()),this,SLOT(on_pushButton_10_clicked()));

    connect(ui->spinBox,SIGNAL(valueChanged(int)),ui->horizontalSlider,SLOT(setValue(int)));
    connect(ui->horizontalSlider,SIGNAL(valueChanged(int)),ui->spinBox,SLOT(setValue(int)));

    connect(ui->spinBox_2,SIGNAL(valueChanged(int)),ui->horizontalSlider_2,SLOT(setValue(int)));
    connect(ui->horizontalSlider_2,SIGNAL(valueChanged(int)),ui->spinBox_2,SLOT(setValue(int)));

    connect(ui->spinBox_3,SIGNAL(valueChanged(int)),ui->horizontalSlider_3,SLOT(setValue(int)));
    connect(ui->horizontalSlider_3,SIGNAL(valueChanged(int)),ui->spinBox_3,SLOT(setValue(int)));

    connect(ui->spinBox_5,SIGNAL(valueChanged(int)),ui->horizontalSlider_4,SLOT(setValue(int)));
    connect(ui->horizontalSlider_4,SIGNAL(valueChanged(int)),ui->spinBox_5,SLOT(setValue(int)));

    connect(ui->spinBox_6,SIGNAL(valueChanged(int)),ui->horizontalSlider_5,SLOT(setValue(int)));
    connect(ui->horizontalSlider_5,SIGNAL(valueChanged(int)),ui->spinBox_6,SLOT(setValue(int)));

    connect(ui->spinBox_7,SIGNAL(valueChanged(int)),ui->horizontalSlider_6,SLOT(setValue(int)));
    connect(ui->horizontalSlider_6,SIGNAL(valueChanged(int)),ui->spinBox_7,SLOT(setValue(int)));

    connect(ui->spinBox_8,SIGNAL(valueChanged(int)),ui->horizontalSlider_7,SLOT(setValue(int)));
    connect(ui->horizontalSlider_7,SIGNAL(valueChanged(int)),ui->spinBox_8,SLOT(setValue(int)));

    connect(ui->spinBox_4,SIGNAL(valueChanged(int)),ui->horizontalSlider_8,SLOT(setValue(int)));
    connect(ui->horizontalSlider_8,SIGNAL(valueChanged(int)),ui->spinBox_4,SLOT(setValue(int)));

    connect(ui->spinBox_10,SIGNAL(valueChanged(int)),ui->horizontalSlider_10,SLOT(setValue(int)));
    connect(ui->horizontalSlider_10,SIGNAL(valueChanged(int)),ui->spinBox_10,SLOT(setValue(int)));

    connect(ui->spinBox_13,SIGNAL(valueChanged(int)),ui->horizontalSlider_13,SLOT(setValue(int)));
    connect(ui->horizontalSlider_13,SIGNAL(valueChanged(int)),ui->spinBox_13,SLOT(setValue(int)));

    connect(ui->spinBox_14,SIGNAL(valueChanged(int)),ui->horizontalSlider_14,SLOT(setValue(int)));
    connect(ui->horizontalSlider_14,SIGNAL(valueChanged(int)),ui->spinBox_14,SLOT(setValue(int)));

}
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804105620219.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804105639115.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804105647657.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190804105706445.png)









### 4.3. 方式三  qt完成交互传输给halcon
官方案例，HWindow绑定qt事件，每次交互操作后FlushBuffer。
这里需要对qt和halcon都有一定的了解，去系统变量里看下HALCONEXAMPLES路径，cpp里边有个Matching的例子,我把它注释下，又添加方式二的需求，展示如何改这个案例。

```javascript
#pragma once

#include <qlabel.h>
#include <qpushbutton.h>


#include <QScopedPointer>
#include "qhalconwindow.h"

class Matching: public QWidget
{
    Q_OBJECT

    //构建、析构、初始化
public:
    Matching(QWidget *parent=0);
    virtual ~Matching(void);
    void InitFg(void);

    //按钮事件
protected slots:
    void Create(void);
    void Start(void);
    void Stop(void);
    void ArbitrarilyDry(void);

    //计时
protected:
    void timerEvent(QTimerEvent*);
    void StartMatching(void);

private:
    // HALCON 变量
    Hlong ImageWidth, ImageHeight;
    HalconCpp::HTuple FGHandle;
    HalconCpp::HImage Image;
    QScopedPointer<HalconCpp::HShapeModel> ShapeModel;
    HalconCpp::HTuple ModelRow, ModelColumn;
    HalconCpp::HTuple Rect1Row, Rect1Col, Rect2Row, Rect2Col;
    HalconCpp::HTuple RectLength1, RectLength2;
    HalconCpp::HObject ShapeModelRegion;
    // GUI 成员
    QLabel *MatchTimeLabel, *MatchScoreLabel, *MeasTimeLabel;
    QLabel *NumLeadsLabel, *MinLeadsDistLabel;
    QPushButton *CreateButton, *StartButton, *StopButton, *ArbitrarilyDryButton;
    QHalconWindow *Disp;

    // Timer
    long Timer;
};

```

```javascript
#pragma once
#include <QWidget>
#include <QPainter>
#include <QScopedPointer>
#  include "HalconCpp.h"


class QHalconWindow: public QWidget
{
    Q_OBJECT

public:
    QHalconWindow(QWidget *parent=0, long Width=0, long Height=0);
    HalconCpp::HWindow* GetHalconBuffer(void) {return halconBuffer.data();}
    void GetPartFloat(double *row1, double *col1, double *row2, double *col2);
    void setCanMove(bool a);
protected:
    void resizeEvent(QResizeEvent*);
    void paintEvent(QPaintEvent *event);
    void mouseMoveEvent(QMouseEvent *event);
    void mousePressEvent(QMouseEvent *event);
    void mouseReleaseEvent(QMouseEvent *event);
    void mouseDoubleClickEvent(QMouseEvent *event);
    void wheelEvent(QWheelEvent *event);
private:
    void SetPartFloat(double row1, double col1, double row2, double col2);
    QScopedPointer<HalconCpp::HWindow> halconBuffer;
    QPoint lastMousePos;
    double lastRow1, lastCol1, lastRow2, lastCol2;
    bool CanMove;
};
```

```javascript
#include "matching.h"
#include <QApplication>
#pragma execution_character_set("utf-8")


int main(int argc, char **argv)
{

  QApplication application(argc,argv);
  Matching w;

  try
  {
    w.resize(QSize(700, 500));
    w.setWindowTitle("匹配和测量演示");
    w.InitFg();
    w.show();
  }
  catch (HalconCpp::HException &exception)
  {
    fprintf(stderr, "Error #%u: %s\n",
            exception.ErrorCode(), (const char*)exception.ErrorMessage());
    exit(-1);
  }

  return application.exec();
}
```

```javascript
CONFIG		+= qt debug
QT              += core gui  widgets


  #includes
  INCLUDEPATH   += "$$(HALCONROOT)/include"
  INCLUDEPATH   += "$$(HALCONROOT)/include/halconcpp"

  #libs
  win32:LIBS    += "$$(HALCONROOT)/lib/$$(HALCONARCH)/halconcpp.lib" \
                   "$$(HALCONROOT)/lib/$$(HALCONARCH)/halcon.lib"


#sources
HEADERS	    += qhalconwindow.h
HEADERS	    += matching.h
SOURCES	    += qhalconwindow.cpp
SOURCES	    += matching.cpp
SOURCES	    += main.cpp

```

```javascript
//此示例应用程序显示使用与形状模型匹配的模式来定位对象。 此外，它还展示了如何使用检测到的对象位置和旋转来构建检查任务的搜索空间。 在该特定示例中，IC上的打印用于找到IC。 从找到的位置和旋转，构造两个测量矩形以测量IC的引线之间的间隔。 由于本例中使用的照明，引线在几个位置和旋转处具有255的饱和灰度值，这扩大了引线的表观宽度，因此似乎减小了引线之间的间距，尽管使用相同的板 在所有图像中。
#include "matching.h"
#include <QGridLayout>
#pragma execution_character_set("utf-8")
// 构造函数：创建GUI
Matching::Matching(QWidget *parent)
    : QWidget(parent), Timer(-1)
{
    // 按钮
    CreateButton = new QPushButton(tr("创建模型"),this);
    connect(CreateButton,SIGNAL(clicked()),SLOT(Create()));

    StartButton  = new QPushButton(tr("开始"),this);
    StartButton->setEnabled(false);
    connect(StartButton,SIGNAL(clicked()),SLOT(Start()));

    StopButton  = new QPushButton(tr("停止"),this);
    StopButton->setEnabled(false);
    connect(StopButton, SIGNAL(clicked()),SLOT(Stop()));

    ArbitrarilyDryButton = new QPushButton(tr("绘画"),this);
    connect(ArbitrarilyDryButton, SIGNAL(clicked()),SLOT(ArbitrarilyDry()));

    // 标签
    QLabel *match_time    = new QLabel(tr("匹配:"),this);
    QLabel *match_time2   = new QLabel(tr("时间:"),this);
    MatchTimeLabel        = new QLabel("        ",this);
    QLabel *match_score   = new QLabel(tr("评分:  "),this);
    MatchScoreLabel       = new QLabel("        ",this);
    QLabel *meas_time     = new QLabel(tr("测量:"),this);
    QLabel *meas_time2    = new QLabel(tr("时间:"),this);
    MeasTimeLabel         = new QLabel("        ",this);
    QLabel *num_leads     = new QLabel(tr("引线数量:  "),this);
    NumLeadsLabel         = new QLabel("        ",this);
    QLabel *min_lead_dist = new QLabel(tr("最小引导距离:  "),this);
    MinLeadsDistLabel     = new QLabel("        ",this);

    // 标签 MVTec
    QLabel *MvtecLabel    = new QLabel(("匹配和测量演示"),this);
    MvtecLabel->setFont(QFont(NULL,10,QFont::Bold ));
    // HALCON小部件的解释
    QLabel *DispHintLabel = new QLabel(
        "变焦：鼠标滚轮; 移动：鼠标左键; 重置：双击", this);



    // 布局
    // Topmost VBoxLayout
    QVBoxLayout *TopBox = new QVBoxLayout(this);

    // MVTec label layout in TopBox
    QHBoxLayout *Mvtec  = new QHBoxLayout;
    Mvtec->addStretch(1);
    Mvtec->addWidget(MvtecLabel);
    Mvtec->addStretch(1);

    // TopVBox in TopBox
    QVBoxLayout *TopVBox = new QVBoxLayout;

    // HBoxDispAndButtons in TopVBox
    QHBoxLayout *HBoxDispAndButtons = new QHBoxLayout;

    // Disp: HALCON window widget in HBoxDispAndButtons
    Disp = new QHalconWindow(this);
    Disp->setMinimumSize(50,50);

    // One layout for HALCON widget and hint label
    QVBoxLayout *DispVBox = new QVBoxLayout;
    DispVBox->addWidget(Disp, 1);
    DispVBox->addSpacing(8);
    DispVBox->addWidget(DispHintLabel);

    // Buttons in HBoxDispAndButtons
    QVBoxLayout *Buttons = new QVBoxLayout;
    Buttons->addWidget(CreateButton);
    Buttons->addSpacing(8);
    Buttons->addWidget(StartButton);
    Buttons->addSpacing(8);
    Buttons->addWidget(StopButton);
    Buttons->addSpacing(8);
    Buttons->addWidget(ArbitrarilyDryButton);
    Buttons->addStretch(1);

    // HBoxDispAndButtons
    HBoxDispAndButtons->addSpacing(15);
    HBoxDispAndButtons->addLayout(DispVBox, 1);
    HBoxDispAndButtons->addSpacing(15);
    HBoxDispAndButtons->addLayout(Buttons);
    HBoxDispAndButtons->addSpacing(15);

    // HBoxLabels in TopVBox
    QHBoxLayout *HBoxLabels = new QHBoxLayout;
    // Labels in HBoxLabels
    QGridLayout *Labels = new QGridLayout();
    Labels->addWidget(match_time,0,0);
    Labels->addWidget(match_time2,0,1);
    Labels->addWidget(MatchTimeLabel,0,2);
    Labels->addWidget(match_score,0,3);
    Labels->addWidget(MatchScoreLabel,0,4);
    Labels->addWidget(meas_time,1,0);
    Labels->addWidget(meas_time2,1,1);
    Labels->addWidget(MeasTimeLabel,1,2);
    Labels->addWidget(num_leads,1,3);
    Labels->addWidget(NumLeadsLabel,1,4);
    Labels->addWidget(min_lead_dist,1,5);
    Labels->addWidget(MinLeadsDistLabel,1,6);

    // End Labels
    HBoxLabels->addSpacing(15);
    HBoxLabels->addLayout(Labels);
    HBoxLabels->addSpacing(130);
    // End HBoxLabels
    TopVBox->addLayout(HBoxDispAndButtons);
    TopVBox->addSpacing(15);
    TopVBox->addLayout(HBoxLabels);
    // End TopVBox
    TopBox->addSpacing(15);
    TopBox->addLayout(TopVBox);
    TopBox->addSpacing(15);
    TopBox->addLayout(Mvtec);
    TopBox->addSpacing(10);
    // End TopBox
}


// 当用户通过单击窗口管理器修饰中的关闭按钮关闭应用程序时，将调用析构函数。
Matching::~Matching(void)
{
    using namespace HalconCpp;

    // 关闭所有已分配的HALCON资源。
    CloseFramegrabber(FGHandle);
    if (Timer != -1)
    {
        killTimer(Timer);
        Timer = -1;
    }
}


// 打开采集卡并抓取初始图像
void Matching::InitFg(void)
{
    using namespace HalconCpp;

    // 打开采集卡并抓取初始图像
    OpenFramegrabber("File",1,1,0,0,0,0,"default",-1,"default",-1,"default",
                     "board/board.seq","default",-1,1,&FGHandle);    
    GrabImage(&Image,FGHandle);    
    Image.GetImageSize(&ImageWidth, &ImageHeight);
    Disp->GetHalconBuffer()->SetPart(0, 0, ImageHeight-1, ImageWidth-1);

    Disp->GetHalconBuffer()->SetLineWidth(3);
    Disp->GetHalconBuffer()->DispObj(Image);
    Disp->GetHalconBuffer()->FlushBuffer();
}




// 创建形状模型
void Matching::Create(void)
{
    using namespace HalconCpp;

    HalconCpp::HTuple Area;
    HalconCpp::HTuple Row1, Column1, Row2, Column2;
    HalconCpp::HTuple RectPhi;

    HalconCpp::HObject Rectangle0, Rectangle1, Rectangle2;
    HImage   ImageReduced, ShapeModelImage;

    // 通过将创建按钮设置为不敏感来防止模型生成两次。
    CreateButton->setEnabled(false);
    CreateButton->repaint();
    setCursor(Qt::WaitCursor);
    // 使用以下四个坐标从矩形生成模型：
    Row1 = 188;
    Column1 = 182;
    Row2 = 298;
    Column2 = 412;

    GenRectangle1(&Rectangle0,Row1,Column1,Row2,Column2);
    AreaCenter(Rectangle0,&Area,&ModelRow,&ModelColumn);

    // 计算测量矩形相对于模型中心的坐标。
    Rect1Row = ModelRow-102;
    Rect1Col = ModelColumn+5;
    Rect2Row = ModelRow+107;
    Rect2Col = ModelColumn+5;
    RectPhi = 0;
    RectLength1 = 170;
    RectLength2 = 5;
    // 生成两个测量矩形以用于可视化目的。
    GenRectangle2(&Rectangle1,Rect1Row,Rect1Col,RectPhi,RectLength1,
                  RectLength2);
    GenRectangle2(&Rectangle2,Rect2Row,Rect2Col,RectPhi,RectLength1,
                  RectLength2);

    GenRectangle1(&Rectangle0,Row1,Column1,Row2,Column2);
    AreaCenter(Rectangle0,&Area,&ModelRow,&ModelColumn);

    ReduceDomain(Image,Rectangle0,&ImageReduced);
    // 创建模型的标志性表示。 该区域将通过模型的测量位置进行变换，以便稍后进行可视化。
    InspectShapeModel(ImageReduced,&ShapeModelImage,&ShapeModelRegion,1,30);
    // 创建模型。
    ShapeModel.reset(new HShapeModel(ImageReduced,4,0,2*PI,PI/180,"none","use_polarity",30,10));

    // 显示模型和测量矩形。
    Disp->GetHalconBuffer()->SetColor("green");
    Disp->GetHalconBuffer()->DispObj(ShapeModelRegion);
    Disp->GetHalconBuffer()->SetColor("blue");
    Disp->GetHalconBuffer()->SetDraw("margin");
    Disp->GetHalconBuffer()->DispObj(Rectangle1);
    Disp->GetHalconBuffer()->DispObj(Rectangle2);
    Disp->GetHalconBuffer()->SetDraw("fill");
    Disp->GetHalconBuffer()->FlushBuffer();
    // 允许用户开始匹配。
    StartButton->setEnabled(true);
    setCursor(Qt::ArrowCursor);
}


// 抓取下一张图片并进行匹配
void Matching::StartMatching(void)
{
    using namespace HalconCpp;
    double   S1, S2;
    HTuple   Rect1RowCheck, Rect1ColCheck, Rect2RowCheck, Rect2ColCheck;
    HTuple   MeasureHandle1, MeasureHandle2, NumLeads;
    HTuple   RowCheck, ColumnCheck, AngleCheck, Score, HomMat2D, MinDistance;
    HTuple   RowEdgeFirst1, ColumnEdgeFirst1, AmplitudeFirst1;
    HTuple   RowEdgeSecond1, ColumnEdgeSecond1, AmplitudeSecond1;
    HTuple   IntraDistance1, InterDistance1;
    HTuple   RowEdgeFirst2, ColumnEdgeFirst2, AmplitudeFirst2;
    HTuple   RowEdgeSecond2, ColumnEdgeSecond2, AmplitudeSecond2;
    HTuple   IntraDistance2, InterDistance2;
    HObject  ShapeModelTrans;
    HObject  Rectangle1, Rectangle2;
    HImage   Image;
    char     buf[MAX_STRING];
    QString  string;

    GrabImage(&Image,FGHandle);
    // 请注意，所有显示操作都是使用缓冲区窗口调用的。此缓冲区窗口将被复制到此函数末尾的可见窗口中。 这导致无闪烁显示结果。
    Disp->GetHalconBuffer()->DispObj(Image);
    // 在当前图像中找到IC。
    S1 = HSystem::CountSeconds();
    ShapeModel->FindShapeModel(Image, 0, 2*PI, 0.7, 1, 0.5, "least_squares", 4,
                               0.7, &RowCheck,&ColumnCheck,&AngleCheck,&Score);
    S2 = HSystem::CountSeconds();
    // 使用实际时间更新匹配时间标签。
    sprintf_s(buf,"%5.2f",(S2-S1)*1000);
    string = buf;
    MatchTimeLabel->setText(string);
    if (Score.Length() == 1)
    {
        // 使用测量的分数更新匹配的分数标签。
        sprintf_s(buf,"%7.5f",(double)Score[0]);
        string = buf;
        MatchScoreLabel->setText(string);
        // 旋转模型以进行可视化。
        VectorAngleToRigid(ModelRow,ModelColumn,0,RowCheck,ColumnCheck,AngleCheck,
                           &HomMat2D);
        AffineTransRegion(ShapeModelRegion,&ShapeModelTrans,HomMat2D,"false");
        Disp->GetHalconBuffer()->SetColor("green");
        Disp->GetHalconBuffer()->DispObj(ShapeModelTrans);
        // 计算测量矩形的参数。
        AffineTransPixel(HomMat2D,Rect1Row,Rect1Col,&Rect1RowCheck,
                         &Rect1ColCheck);
        AffineTransPixel(HomMat2D,Rect2Row,Rect2Col,&Rect2RowCheck,
                         &Rect2ColCheck);
        // 出于可视化目的，将两个矩形生成为区域并显示它们。
        GenRectangle2(&Rectangle1,Rect1RowCheck,Rect1ColCheck,AngleCheck,
                      RectLength1,RectLength2);
        GenRectangle2(&Rectangle2,Rect2RowCheck,Rect2ColCheck,AngleCheck,
                      RectLength1,RectLength2);
        Disp->GetHalconBuffer()->SetColor("blue");
        Disp->GetHalconBuffer()->SetDraw("margin");
        Disp->GetHalconBuffer()->DispObj(Rectangle1);
        Disp->GetHalconBuffer()->DispObj(Rectangle2);
        Disp->GetHalconBuffer()->SetDraw("fill");
        // 做实际测量。
        S1 = HSystem::CountSeconds();
        GenMeasureRectangle2(Rect1RowCheck,Rect1ColCheck,AngleCheck,
                             RectLength1,RectLength2,ImageWidth,ImageHeight,"bilinear",
                             &MeasureHandle1);
        GenMeasureRectangle2(Rect2RowCheck,Rect2ColCheck,AngleCheck,
                             RectLength1,RectLength2,ImageWidth,ImageHeight,"bilinear",
                             &MeasureHandle2);
        MeasurePairs(Image,MeasureHandle1,2,90,"positive","all",
                     &RowEdgeFirst1,&ColumnEdgeFirst1,&AmplitudeFirst1,
                     &RowEdgeSecond1,&ColumnEdgeSecond1,&AmplitudeSecond1,
                     &IntraDistance1,&InterDistance1);
        MeasurePairs(Image,MeasureHandle2,2,90,"positive","all",
                     &RowEdgeFirst2,&ColumnEdgeFirst2,&AmplitudeFirst2,
                     &RowEdgeSecond2,&ColumnEdgeSecond2,&AmplitudeSecond2,
                     &IntraDistance2,&InterDistance2);
        CloseMeasure(MeasureHandle1);
        CloseMeasure(MeasureHandle2);

        S2 = HSystem::CountSeconds();
        // 显示测量结果。
        Disp->GetHalconBuffer()->SetColor("red");
        Disp->GetHalconBuffer()->DispLine(
            RowEdgeFirst1-RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeFirst1-RectLength2*AngleCheck.TupleSin(),
            RowEdgeFirst1+RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeFirst1+RectLength2*AngleCheck.TupleSin());
        Disp->GetHalconBuffer()->DispLine(
            RowEdgeSecond1-RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeSecond1-RectLength2*AngleCheck.TupleSin(),
            RowEdgeSecond1+RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeSecond1+RectLength2*AngleCheck.TupleSin());
        Disp->GetHalconBuffer()->DispLine(
            RowEdgeFirst2-RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeFirst2-RectLength2*AngleCheck.TupleSin(),
            RowEdgeFirst2+RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeFirst2+RectLength2*AngleCheck.TupleSin());
        Disp->GetHalconBuffer()->DispLine(
            RowEdgeSecond2-RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeSecond2-RectLength2*AngleCheck.TupleSin(),
            RowEdgeSecond2+RectLength2*AngleCheck.TupleCos(),
            ColumnEdgeSecond2+RectLength2*AngleCheck.TupleSin());

        Disp->GetHalconBuffer()->SetDraw("fill");
        // 使用实际时间更新测量时间标签。
        sprintf_s(buf,"%5.2f",(S2-S1)*1000);
        string = buf;
        MeasTimeLabel->setText(string);
        // 使用测量的引线数更新引线编号标签。
        NumLeads = IntraDistance1.Length()+IntraDistance2.Length();

        sprintf_s(buf,"%2ld",(long)((Hlong)NumLeads[0]));
        string = buf;

        NumLeadsLabel->setText(string);
        // 使用测量的最小距离更新引导距离标签。
        MinDistance = (InterDistance1.TupleConcat(InterDistance2)).TupleMin();
        sprintf_s(buf,"%6.3f",(double)MinDistance[0]);
        string = buf;
        MinLeadsDistLabel->setText(string);

    }
    Disp->GetHalconBuffer()->FlushBuffer();
}


// 在:: Start（）中启动Timer后，将连续调用此函数
void Matching::timerEvent(QTimerEvent*)
{
    StartMatching();
}


// 开始连续匹配
void Matching::Start(void)
{
    StartButton->setEnabled(false);
    StopButton->setEnabled(true);
    // 启动计时器 - > :: timerEvent（）被连续调用
    Timer = startTimer(20);
}


// 停止连续匹配
void Matching::Stop(void)
{
    StartButton->setEnabled(true);
    StopButton->setEnabled(false);
    // 杀死计时器
    if (Timer != -1)
    {
        killTimer(Timer);
        Timer = -1;
    }
}

#include <qdebug.h>
//roi绘画选取
void Matching::ArbitrarilyDry(void)
{
    using namespace HalconCpp;

    Disp->setCanMove(false);

    HalconCpp::HObject  temp;
    HalconCpp::HTuple  hv_WindowID;//窗口句柄
    Hlong MainWndID;//当前窗口句柄
    Disp->GetHalconBuffer()->DispObj(Image);
    MainWndID = Disp->winId();
    OpenWindow(0,0,Disp->width(),Disp->height(),
               MainWndID,"","",&hv_WindowID);
    HDevWindowStack::Push(hv_WindowID);

    double row1, col1, row2, col2;
    Disp->GetPartFloat(&row1, &col1, &row2, &col2);
    SetPart(hv_WindowID,HalconCpp::HTuple(row1), HalconCpp::HTuple(col1),
            HalconCpp::HTuple(row2), HalconCpp::HTuple(col2));
    DispObj(Image, HDevWindowStack::GetActive());
    SetColor(HDevWindowStack::GetActive(),"red");
    DrawRegion(&temp,hv_WindowID);
    HDevWindowStack::Pop();





    Disp->GetHalconBuffer()->DispObj(Image);
    Disp->GetHalconBuffer()->SetColor("blue");
    Disp->GetHalconBuffer()->SetDraw("margin");
    Disp->GetHalconBuffer()->SetLineWidth(1);
    Disp->GetHalconBuffer()->DispRegion(temp);
    Disp->GetHalconBuffer()->FlushBuffer();


    Disp->setCanMove(true);


}

```

```javascript
#include <QMouseEvent>
#include <QWheelEvent>

#include "qhalconwindow.h"

#include <cmath>

Herror __stdcall ContentUpdateCallback(void *context)
{
    //__stdcall：函数参数由右向左入栈,函数调用结束后由被调用函数清除栈内数据。
    // 如果启用了自动刷新，则此回调将调用flush_buffer（默认）在每次更改图形缓冲区后调用它
    QHalconWindow* hwindow = (QHalconWindow*)context;

    // 在Qt线程中安排重绘
    hwindow->update();

    return H_MSG_OK;
}

QHalconWindow::QHalconWindow(QWidget *parent, long Width, long Height)
    : QWidget(parent), lastMousePos(-1, -1),CanMove(true)
{
    show();
    resize(Width,Height);

    // 初始化HALCON缓冲区窗口
    halconBuffer.reset(new HalconCpp::HWindow(0, 0, 100, 100, 0, "buffer", ""));

    //SetWindowParam允许设置打开窗口的不同参数
    // 打开图形堆栈，因此图像和区域在缩放或调整大小后仍然保持不变
    halconBuffer->SetWindowParam("graphics_stack", "true");
    // 打开明确的冲洗
    halconBuffer->SetWindowParam("flush", "true");
    // 注册更新回调
    halconBuffer->SetContentUpdateCallback((void*)&ContentUpdateCallback, this);
}

// 每当调整QHalconWindow小部件的大小时，调整HALCON窗口的大小
void QHalconWindow::resizeEvent(QResizeEvent* event)
{
    if(!CanMove)
        return;
    Q_UNUSED(event);
    // 将HALCON窗口设置为新大小。
    halconBuffer->SetWindowExtents(0,0,width(),height());
    // 启动重绘缓冲区。
    // (这使用graphics_stack来获取最后的图像和对象)
    halconBuffer->FlushBuffer();
}

void QHalconWindow::paintEvent(QPaintEvent *event)
{
    if(!CanMove)
        return;
    using namespace HalconCpp;
    Q_UNUSED(event);

    HString type;
    Hlong   width, height;
    //获取缓冲区的内容
    HImage image = halconBuffer->DumpWindowImage();
    // 将缓冲区转换为Qt中使用的格式
    HImage imageInterleaved = image.InterleaveChannels("argb", "match", 0);
    // 获取原始图像数据的访问权限
    unsigned char* pointer = (unsigned char*)imageInterleaved.GetImagePointer1(&type, &width, &height);
    // 从数据创建QImage
    QImage qimage(pointer, width/4, height, QImage::Format_RGB32);

    // 将图像绘制到小部件
    QPainter painter(this);
    painter.drawImage(QPoint(0, 0), qimage);

}

void QHalconWindow::mouseMoveEvent(QMouseEvent *event)
{
    if(!CanMove)
        return;
    if ((event->buttons() == Qt::LeftButton) && lastMousePos.x() != -1)
    {
        QPoint delta = lastMousePos - event->globalPos();

        // 缩放增量到图像缩放系数
        double scalex = (lastCol2 - lastCol1 + 1) / (double)width();
        double scaley = (lastRow2 - lastRow1 + 1) / (double)height();
        try
        {
            // 设置新的可见部分
            SetPartFloat(lastRow1 + (delta.y() * scaley),
                         lastCol1 + (delta.x() * scalex),
                         lastRow2 + (delta.y() * scaley),
                         lastCol2 + (delta.x() * scalex));
            // 启动重绘（）
            halconBuffer->FlushBuffer();
        }
        catch (HalconCpp::HOperatorException)
        {
            // 如果零件图像移动到窗口之外，则可能发生这种情况
        }
    }
}

void QHalconWindow::mousePressEvent(QMouseEvent *event)
{
    if(!CanMove)
        return;
    // 保存最后一个鼠标位置和图像部分
    GetPartFloat(&lastRow1, &lastCol1, &lastRow2, &lastCol2);
    lastMousePos = event->globalPos();
}

void QHalconWindow::mouseReleaseEvent(QMouseEvent *event)
{
    if(!CanMove)
        return;
    Q_UNUSED(event);
    // 未设置参考鼠标位置
    lastMousePos = QPoint(-1, -1);
}

void QHalconWindow::mouseDoubleClickEvent(QMouseEvent *event)
{
    if(!CanMove)
        return;
    Q_UNUSED(event);//没有实质性的作用，用来避免编译器警告
    if (event->buttons() == Qt::LeftButton)
    {
        // 重置图像部分
        halconBuffer->SetPart(0, 0, -1, -1);
        halconBuffer->FlushBuffer();
    }
}

void QHalconWindow::wheelEvent(QWheelEvent *event)
{
    if(!CanMove)
        return;


    // event-> delta（）是120的倍数。对于较大的倍数，用户将轮子旋转多个槽口。
    int num_notch = std::abs(event->delta()) / 120;
    double factor = (event->delta() > 0) ? std::sqrt(2.0) : 1.0 / std::sqrt(2.0);
    while (num_notch > 1)
    {
        factor = factor * ((event->delta() > 0) ? std::sqrt(2.0) : 1.0 / std::sqrt(2.0));
        num_notch--;
    }

    // 得到缩放中心
    double centerRow, centerCol;
    halconBuffer->ConvertCoordinatesWindowToImage(event->y(), event->x(), &centerRow, &centerCol);
    // 获取当前图像部分
    double row1, col1, row2, col2;
    GetPartFloat(&row1, &col1, &row2, &col2);
    // 在中心周围
    double left = centerRow - row1;
    double right = row2 - centerRow;
    double top = centerCol - col1;
    double buttom = col2 - centerCol;
    double newRow1 = centerRow - left * factor;
    double newRow2 = centerRow + right * factor;
    double newCol1 = centerCol - top * factor;
    double newCol2 = centerCol + buttom * factor;
    try
    {
        SetPartFloat(newRow1, newCol1, newRow2, newCol2);
        halconBuffer->FlushBuffer();
    }
    catch (HalconCpp::HOperatorException)
    {
        // 如果零件太小或太大，可能会发生这种情况
    }
}





void QHalconWindow::GetPartFloat(double *row1, double *col1, double *row2, double *col2)
{
    // 要从get_part获取浮点值，请使用HTuple参数
    HalconCpp::HTuple trow1, tcol1, trow2, tcol2;
    halconBuffer->GetPart(&trow1, &tcol1, &trow2, &tcol2);
    *row1 = trow1.D();
    *col1 = tcol1.D();
    *row2 = trow2.D();
    *col2 = tcol2.D();
}

void QHalconWindow::setCanMove(bool a)
{
    CanMove=a;
}

void QHalconWindow::SetPartFloat(double row1, double col1, double row2, double col2)
{
    // 将double值转换为HTuple。 否则，使用SetPart的int变体，即使在放大时也能实现平滑移动和缩放
    halconBuffer->SetPart(HalconCpp::HTuple(row1), HalconCpp::HTuple(col1),
                          HalconCpp::HTuple(row2), HalconCpp::HTuple(col2));
}

```
