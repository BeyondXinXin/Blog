&emsp;&emsp;最近总感觉，日常开发时候，使用c++/opencv处理图片调试时候比较麻烦。跟Halcon或者matlab完全没法比，想实时调试效果太麻烦了。虽然windos下vs有个ImageWatch插件，勉强还能接受，但是ubuntu下，或者不用vs，就跟砍一只手一样。
&emsp;&emsp;QOpencvWidget是我平时用来测试opencv效果的窗口，便于快速测试自己想法。

```cpp
#ifndef QOPENCVWIDGET_H
#define QOPENCVWIDGET_H

/**
 * qt opencv widget
 * 试过各种图片浏览方式,感觉还是用现成的GraphicsView好一些
 * QOpencvPixmapItem、QOpencvScene、QOpencvView 便于快速实现自己交互
 */

// 01 Frame includes
#include "stable.h"

class QOpencvPixmapItem;
class QOpencvScene;
class QOpencvView;


class QOpencvWidget : public QWidget {
    Q_OBJECT
  public:
    explicit QOpencvWidget(QWidget *parent = nullptr);
    ~QOpencvWidget();
    void SetSurface(const QImage value);
    QImage GetSurface();
  private:
    void Initial();
  private:
    QGridLayout *gridLayout;
    QOpencvView *graphicsView;
    QOpencvPixmapItem  *opencv_pixmap_;
    QOpencvScene *opencv_scene_;
    QImage img_;
};


class QOpencvPixmapItem : public QGraphicsPixmapItem {
  public:
    explicit QOpencvPixmapItem(QGraphicsPixmapItem *parent = nullptr);
    ~QOpencvPixmapItem();
};

class QOpencvScene : public QGraphicsScene {
    Q_OBJECT
  public:
    explicit QOpencvScene(QGraphicsScene *parent = nullptr);
    ~QOpencvScene();
};

class QOpencvView : public QGraphicsView {
  public:
    explicit QOpencvView(QWidget *parent = nullptr);
    ~QOpencvView();
  protected:
    void wheelEvent(QWheelEvent *event);
};
#endif // QOPENCVWIDGET_H
```


```cpp
// 01 Frame includes
#include "qopencvwidget.h"

QOpencvWidget::QOpencvWidget(QWidget *parent) :
    QWidget(parent) {
    this->Initial();
}

QOpencvWidget::~QOpencvWidget() {

}

void QOpencvWidget::SetSurface(const QImage value) {
    int tmp_height = img_.height() - value.height() ;
    int tmp_width = img_.width() - value.width();
    img_ = value;
    if (tmp_height > 0 || tmp_width > 0) {
        opencv_pixmap_->setOffset(tmp_width / 2, tmp_height / 2);
    } else if (tmp_height < 0 || tmp_width < 0) {
        opencv_pixmap_->setOffset(0, 0);
    }
    opencv_pixmap_->setPixmap(QPixmap::fromImage(img_));
}

QImage QOpencvWidget::GetSurface() {
    return img_;
}

void QOpencvWidget::Initial() {
    this->setObjectName(QStringLiteral("QOpencvWidget"));
    gridLayout = new QGridLayout(this);
    gridLayout->setContentsMargins(0, 0, 0, 0);
    graphicsView = new QOpencvView(this);
    gridLayout->addWidget(graphicsView);
    opencv_scene_ = new QOpencvScene;
    opencv_pixmap_ = new QOpencvPixmapItem;
    graphicsView->setScene(opencv_scene_);
    opencv_scene_->addItem(opencv_pixmap_);
    graphicsView->setDragMode(QGraphicsView::ScrollHandDrag);
    graphicsView->show();
}

QOpencvPixmapItem::QOpencvPixmapItem(QGraphicsPixmapItem *parent):
    QGraphicsPixmapItem(parent) {
}

QOpencvPixmapItem::~QOpencvPixmapItem() {

}
QOpencvScene::QOpencvScene(QGraphicsScene *parent):
    QGraphicsScene(parent) {
}

QOpencvScene::~QOpencvScene() {
}

QOpencvView::QOpencvView(QWidget *parent):
    QGraphicsView(parent) {
}

QOpencvView::~QOpencvView() {
}

void QOpencvView::wheelEvent(QWheelEvent *event) {
    if (event->delta() > 0) {
        this->scale(1.1, 1.1);
    } else {
        this->scale(0.9, 0.9);
    }
}

```

&emsp;&emsp;使用方法如下，ImageBrowserManager::SlotImgProcess 改为自己的测试程序

```cpp
#ifndef IMAGEBROWSERMANAGER_H
#define IMAGEBROWSERMANAGER_H
// 01 Frame includes
#include "stable.h"

// 03 OPENCV includes
#include "qopencvprocessing.h"
#include "qopencvwidget.h"

class ImageBrowserManager: public QObject {
    Q_OBJECT
  public:
    explicit ImageBrowserManager(QOpencvWidget &widget,
                                 QObject *parent = nullptr);
    virtual ~ImageBrowserManager() override;
    void OpenStlFile(const QString &file_path = "");
  public Q_SLOTS:
    void SlotImgProcess(const int &operation, const QString &text);
  Q_SIGNALS:
    void SignalPromptInformationOut(const QString &text);
  private:
    void Initial();
    void UnDo();
    void ReDo();
    void UpDataImage(const QImage);
  private:
    QOpencvWidget &widget_;
    QVector<QImage> img_vector_;	            // 存储图像的Vector容器
    QVector<QImage>::iterator imt_iter_;		// Vector迭代器
};
#endif // IMAGEBROWSERMANAGER_H
```

```cpp
// 01 Frame includes
#include "imagebrowsermanager.h"
#include "quihelper.h"

// 06 Test includes
#include "readivus.h"
#include "mainwindow.h"
#include "formedgeadjustment.h"

ImageBrowserManager::ImageBrowserManager(QOpencvWidget &widget,
        QObject *parent) :
    QObject(parent), widget_(widget) {
    this->Initial();
}

ImageBrowserManager::~ImageBrowserManager() {

}

void ImageBrowserManager::Initial() {

}

void ImageBrowserManager::UnDo() {// 撤销
    if (imt_iter_ != img_vector_.begin()) {// 前面还有对象
        imt_iter_--;
        this->widget_.SetSurface(*imt_iter_);
        if (imt_iter_ == img_vector_.begin()) {// 自减为初始图像
            if (imt_iter_ != (img_vector_.end() - 1)) {
                img_vector_.erase(++imt_iter_, img_vector_.end());
            }
        }
    }
}

void ImageBrowserManager::ReDo() {// 重做
    if (imt_iter_ != img_vector_.end() && imt_iter_ != img_vector_.end() - 1) {
        // 后面还有对象
        imt_iter_++;
        this->widget_.SetSurface(*imt_iter_);
        if (imt_iter_ == (img_vector_.end())) {// 自加后是否为最后一个
        }
    }
}

void ImageBrowserManager::UpDataImage(const QImage tmp) {
    img_vector_.append(tmp);
    imt_iter_ = img_vector_.end() - 1;
    this->widget_.SetSurface(*imt_iter_);
}

void ImageBrowserManager::OpenStlFile(const QString &file_path) {
    QString tmp = file_path;
    QImage *img = new QImage();

    if (tmp.isEmpty()) {
        tmp = QUIHelper::GetFileName(
                  "*.bmp *.jpg *.pbm *.pgm *.png *.ppm *.xbm *.xpm ");
    }
    if (!(img->load(tmp))) {
        QUIHelper::ShowMessageBoxError("打开图像失败！", 3, true);
        delete img;
        return;
    }
    this->widget_.SetSurface(*img);
    img_vector_.clear();
    img_vector_.append(*img);
    imt_iter_ = img_vector_.end() - 1;
    this->widget_.SetSurface(*imt_iter_);
}

void ImageBrowserManager::SlotImgProcess(const int &operation, const QString &text) {
    if (this->img_vector_.size() == 0) {
        emit SignalPromptInformationOut(("Image 数据错误"));
        return;
    }
    QString tmp_information = text;
    QStringList imformation = tmp_information.split("|");
    switch (operation) {
        case 1: {// 载入
                OpenStlFile();
                break;
            }
        case 2: {// 保存
                QImage img = QOpencvProcessing::Instance()->splitColor(
                                 widget_.GetSurface(),
                                 imformation.at(0).toLocal8Bit().data(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                break;
            }
        case 3: {// 撤销
                UnDo();
                break;
            }
        case 4: {// 重做
                ReDo();
                break;
            }
        case 101: {// 图像自适应大小
                emit SignalPromptInformationOut(("图像自适应大小"));
                break;
            }
        case 102: {// 改变大小
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Resize(
                    img, imformation.at(0).toInt(), imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("改变大小"));
                break;
            }
        case 103: {// 确认缩放
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Enlarge_Reduce(
                    img, imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认缩放"));
                break;
            }
        case 104: {// 确认旋转
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Rotate(img, imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认旋转"));
                break;
            }
        case 105: {// 确认线性变换
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Lean(
                    img, imformation.at(0).toInt(), imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认线性变换"));
                break;
            }
        case 106: {// 水平镜像
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Flip(img, 1);
                UpDataImage(img);
                emit SignalPromptInformationOut(("水平镜像"));
                break;
            }
        case 107: {// 垂直镜像
                QImage img = widget_.GetSurface();
                QOpencvProcessing::Instance()->Flip(img, 0);
                UpDataImage(img);
                emit SignalPromptInformationOut(("垂直镜像"));
                break;
            }
        case 201: {// 二值图像
                QImage img = QOpencvProcessing::Instance()->Bin(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("二值图像"));
                break;
            }
        case 202: {// 灰度图像
                QImage img = QOpencvProcessing::Instance()->Graylevel(
                                 widget_.GetSurface());
                UpDataImage(img);
                emit SignalPromptInformationOut(("灰度图像"));
                break;
            }
        case 203: {// 图像反转
                QImage img = QOpencvProcessing::Instance()->Reverse(
                                 widget_.GetSurface());
                UpDataImage(img);
                emit SignalPromptInformationOut(("图像反转"));
                break;
            }
        case 204: {// 确认线性变换
                QImage img = QOpencvProcessing::Instance()->Linear(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认线性变换"));
                break;
            }
        case 205: {// 确认对数变换
                QImage img = QOpencvProcessing::Instance()->Log(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认对数变换"));
                break;
            }
        case 206: {// 确认伽马变换
                QImage img = QOpencvProcessing::Instance()->Gamma(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("确认伽马变换"));
                break;
            }
        case 207: {// 直方图均衡化
                QImage img = QOpencvProcessing::Instance()->Histeq(
                                 widget_.GetSurface());
                UpDataImage(img);
                emit SignalPromptInformationOut(("直方图均衡化"));
                break;
            }
        case 301: {// 简单滤波
                QImage img = QOpencvProcessing::Instance()->Normalized(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("简单滤波"));
                break;
            }
        case 302: {// 高斯滤波
                QImage img = QOpencvProcessing::Instance()->Gaussian(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("高斯滤波"));
                break;
            }
        case 303: {// 中值滤波
                QImage img = QOpencvProcessing::Instance()->Median(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("中值滤波"));
                break;
            }
        case 304: {// sobel边缘检测
                QImage img = QOpencvProcessing::Instance()->Sobel(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("sobel边缘检测"));
                break;
            }
        case 305: {// laplacian边缘检测
                QImage img = QOpencvProcessing::Instance()->Laplacian(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("laplacian边缘检测"));
                break;
            }
        case 306: {// canny边缘检测
                QImage img = QOpencvProcessing::Instance()->Canny(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("canny边缘检测"));
                break;
            }
        case 307: {// line检测
                QImage img = QOpencvProcessing::Instance()->HoughLine(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt(),
                                 imformation.at(2).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut("line检测");
                break;
            }
        case 308: {// circle检测
                QImage img = QOpencvProcessing::Instance()->HoughCircle(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("circle检测"));
                break;
            }
        case 401: {// 腐蚀
                QImage img = QOpencvProcessing::Instance()->Erode(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt(),
                                 imformation.at(2).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("腐蚀"));
                break;
            }
        case 402: {// 膨胀
                QImage img = QOpencvProcessing::Instance()->Dilate(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt(),
                                 imformation.at(2).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("膨胀"));
                break;
            }
        case 403: {// 开运算
                QImage img = QOpencvProcessing::Instance()->Open(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt(),
                                 imformation.at(2).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("开运算"));
                break;
            }
        case 404: {// 闭运算
                QImage img = QOpencvProcessing::Instance()->Close(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt(),
                                 imformation.at(2).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("闭运算"));
                break;
            }
        case 405: {// 形态学梯度
                QImage img = QOpencvProcessing::Instance()->Grad(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("形态学梯度"));
                break;
            }
        case 406: {// 顶帽操作
                QImage img = QOpencvProcessing::Instance()->Tophat(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("顶帽操作"));
                break;
            }
        case 407: {// 黑帽操作
                QImage img = QOpencvProcessing::Instance()->Blackhat(
                                 widget_.GetSurface(),
                                 imformation.at(0).toInt(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("黑帽操作"));
                break;
            }

        case 501: {// 颜色模型
                QImage img = QOpencvProcessing::Instance()->splitColor(
                                 widget_.GetSurface(),
                                 imformation.at(0).toLocal8Bit().data(),
                                 imformation.at(1).toInt());
                UpDataImage(img);
                emit SignalPromptInformationOut(("颜色模型"));
                break;
            }
        case 601: {// 最短路径提取测试
                MainWindow *tmp = new MainWindow;
                tmp->OpenMinPathWidgetIn(widget_.GetSurface());
                break;
            }
        case 602: {// 边缘调整控件测试
                FormEdgeAdjustment *tmp = new FormEdgeAdjustment();
                tmp->showMaximized();
                break;
            }
        case 603: {// IVUS浏览控件
                ReadIVUS *tmp = new ReadIVUS();
                tmp->show();
                break;
            }
        default: {
                break;
            }
    }
}


```
