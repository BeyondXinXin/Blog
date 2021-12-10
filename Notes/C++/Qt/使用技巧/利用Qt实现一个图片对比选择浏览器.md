# 利用Qt实现一个图片对比选择浏览器

&emsp;&emsp;**需求：根据右侧模板，在左侧选择比较接近的图片。**
&emsp;&emsp;利用QPropertyAnimation、QParallelAnimationGroup实现图片切换效果。场景用QGraphicsView搭建。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200821172154888.gif#pic_center)



![在这里插入图片描述](https://img-blog.csdnimg.cn/20200821172155928.gif#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200821172155640.gif#pic_center)


&emsp;&emsp; 
&emsp;&emsp; 
&emsp;&emsp; 
&emsp;&emsp; **代码**
&emsp;&emsp; 
&emsp;&emsp; cp   [雨田哥](https://blog.csdn.net/ly305750665) &emsp;&emsp;[Qt炫酷图片预览(非QML)](https://blog.csdn.net/ly305750665/article/details/83344786?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522159800137919726869062782%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=159800137919726869062782&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v1~rank_blog_v1-8-83344786.pc_v1_rank_blog_v1&utm_term=%E5%9B%BE%E7%89%87&spm=1018.2118.3001.4187)

```cpp
#ifndef ASPECTSSELECTWIDGET_H
#define ASPECTSSELECTWIDGET_H

#include <QWidget>
#include <QtWidgets/QWidget>
#include <QLabel>
#include <QPushButton>
#include <QPointer>
#include <QtCore/QVariant>

#include "view/imagesceneview.h"

namespace Ui {
    class AspectsSelectWidget;
}

class QTimer;
class QPropertyAnimation;
class GraphicsPixmap;
class QGraphicsScene;
class QParallelAnimationGroup;
class ScriptDcmsSort;

class AspectsSelect : public QWidget {
    Q_OBJECT
  public:
    AspectsSelect(QWidget *parent = nullptr);
    ~AspectsSelect()override;

  public Q_SLOTS:
    void Slot_TemplateSelectChange(const qint32 &num);
  protected:
    virtual void resizeEvent(QResizeEvent *event) override;
    virtual void wheelEvent(QWheelEvent *event) override;
  private:
    void Initial();
    void Play();
    void NextPlay();
    void LastPlay();
    void UpdatePicture();
    void OpenDicomFile();
    void LoadPngs();
    void ConfirmTemplate();
  Q_SIGNALS:
    void Signal_ConfirmNumberOfLayers(const QStringList &mark);
  private Q_SLOTS:
    void Slot_BtnClicket();
    void SlotRunFinished();
  private:
    QGraphicsScene *m_scene_;
    QList<QMap<QString, QString>> m_imgmap_info_lst_;
    QList<GraphicsPixmap *> m_items_;
    QParallelAnimationGroup *m_group_;
    QMap<GraphicsPixmap *, QPropertyAnimation *> m_animation_map_;
    QMap<GraphicsPixmap *, QPropertyAnimation *> m_animations_map_;
    //
    bool is_animation_;
    qint32 current_center_num_;
    QList<qint32> select_idlst_;
    QList<QPixmap> image_lists_;
    QStringList iamge_location_lists_;
    //
    QLabel *lab_select_num_;
    QPushButton *btn_confirm_;
    QPushButton *btn_load_;
    QPointer<ScriptDcmsSort> script_dcm_sort_;

    QUICK_INITIAL_VAR(template_select_num_, qint32)

};




class AspectsSelectWidget : public QWidget {
    Q_OBJECT
  public:
    explicit AspectsSelectWidget(QWidget *parent = nullptr);
    ~AspectsSelectWidget();
  private:
    void Initial();
  private:
    Ui::AspectsSelectWidget *ui;
    QPointer<AspectsSelect> select_view_;
    QPointer<ImageSceneView> template_view_;

};

#endif // ASPECTSSELECTWIDGET_H
```

```cpp
#include "aspectsselectwidget.h"
#include "ui_aspectsselectwidget.h"


#include <QParallelAnimationGroup>
#include <QPropertyAnimation>
#include <QDebug>
#include <QTimer>
#include <QFileDialog>
#include <QVBoxLayout>
#include <QGraphicsView>
#include <ArteryflowUtils>
#include "script/scriptdcmssort.h"

//---------------------------------------------------------------------

AspectsSelect::AspectsSelect(QWidget *parent)
    : QWidget(parent),
      is_animation_(false),
      current_center_num_(0),
      select_idlst_({-1, -1, -1, -1, -1, -1}) {
    this->Initial();
}

AspectsSelect::~AspectsSelect() {
}

//---------------------------------------------------------------------
void AspectsSelect::Slot_TemplateSelectChange(const qint32 &num) {
    this->Set_template_select_num_(num);
}

//---------------------------------------------------------------------

void AspectsSelect::resizeEvent(QResizeEvent *event) {
    this->lab_select_num_->move(40, 760);
    this->btn_confirm_->move(650, 40);
    this->btn_load_->move(550, 40);
    QWidget::resizeEvent(event);
}

void AspectsSelect::wheelEvent(QWheelEvent *event) {
    if(image_lists_.count() < 10) {
        return;
    }
    if(!is_animation_) {
        if (event->delta() > 0) {
            this->LastPlay();
        } else {
            this->NextPlay();
        }
    }
}

//---------------------------------------------------------------------

void AspectsSelect::Initial() {
    //场景
    m_scene_ = new QGraphicsScene(QRect(0, 0, 800, 800), this);
    //图片信息
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "1"   },
        { "width", "90" },
        { "height", "90" },
        { "top", "25"  },
        { "left", "15" },
        { "opacity", "0.5" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "100" },
        { "height", "100" },
        { "top", "20"  },
        { "left", "10" },
        { "opacity", "0.6" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "3"   },
        { "width", "110" },
        { "height", "110" },
        { "top", "15" },
        { "left", "90" },
        { "opacity", "0.7" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "4"   },
        { "width", "120" },
        { "height", "120" },
        { "top", "10" },
        { "left", "170" },
        { "opacity", "0.8" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "5"   },
        { "width", "512" },
        { "height", "512" },
        { "top", "144" },
        { "left", "144" },
        { "opacity", "1" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "4"   },
        { "width", "120" },
        { "height", "120" },
        { "top", "670" },
        { "left", "510" },
        { "opacity", "0.8" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "3"   },
        { "width", "110" },
        { "height", "110" },
        { "top", "675" },
        { "left", "600" },
        { "opacity", "0.7" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "100" },
        { "height", "100" },
        { "top", "680" },
        { "left", "690" },
        { "opacity", "0.6" }
    };
    m_imgmap_info_lst_ << QMap<QString, QString> {
        { "zIndex", "1"   },
        { "width", "90" },
        { "height", "90" },
        { "top", "685" },
        { "left", "695" },
        { "opacity", "0.5" }
    };
    //场景中添加图片元素
    qint32 index = 0;
    for(qint32 i = current_center_num_ - 4; i <= current_center_num_ + 4; i++) {
        auto imageInfoMap = m_imgmap_info_lst_[index];
        index++;
        GraphicsPixmap *item = new GraphicsPixmap();
        item->setPixmap(QPixmap(""));
        item->setPixmapSize(
            QSize(imageInfoMap["width"].toInt(), imageInfoMap["height"].toInt()));
        item->setItemOffset(QPointF(
                                imageInfoMap["left"].toInt(), imageInfoMap["top"].toInt() ));
        item->setZValue(imageInfoMap["zIndex"].toInt());
        item->setOpacity(imageInfoMap["opacity"].toDouble());
        m_items_ << item;
        m_scene_->addItem(item);
    }
    //left button
    GraphicsPixmap *leftBtn = new GraphicsPixmap();
    leftBtn->setObjectName("last");
    leftBtn->setCursor(QCursor(Qt::PointingHandCursor));
    leftBtn->setPixmap(QPixmap(":/Stroke/Registration/template_next.png"));
    leftBtn->setItemOffset(QPointF(12,  400));
    leftBtn->setZValue(5);
    m_scene_->addItem(leftBtn);
    connect(leftBtn, &GraphicsPixmap::Signale_Clicked,
            this, &AspectsSelect::Slot_BtnClicket);
    //right button
    GraphicsPixmap *rightBtn = new GraphicsPixmap();
    rightBtn->setObjectName("next");
    rightBtn->setCursor(QCursor(Qt::PointingHandCursor));
    rightBtn->setPixmap(QPixmap(":/Stroke/Registration/template_last.png"));
    rightBtn->setItemOffset(QPointF(764,  400));
    rightBtn->setZValue(5);
    m_scene_->addItem(rightBtn);
    connect(rightBtn, &GraphicsPixmap::Signale_Clicked,
            this, &AspectsSelect::Slot_BtnClicket);
    //视图
    GraphicsView *view = new GraphicsView(m_scene_);
    view->setFrameShape(QFrame::NoFrame);
    view->setParent(this);
    view->setViewportUpdateMode(QGraphicsView::BoundingRectViewportUpdate);
    view->setBackgroundBrush(QColor(46, 46, 46));
    view->setCacheMode(QGraphicsView::CacheBackground);
    view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    //动画: 大小，位置
    m_group_ = new QParallelAnimationGroup;
    for (int i = 0; i < m_items_.count(); ++i) {
        QPropertyAnimation *anim = new QPropertyAnimation(m_items_[i], "itemoffset");
        QPropertyAnimation *anims = new QPropertyAnimation(m_items_[i], "itemsize");
        m_animation_map_.insert(m_items_[i], anim);
        m_animations_map_.insert(m_items_[i], anims);
        anim->setDuration(1000);
        anims->setDuration(1000);
        anim->setEasingCurve(QEasingCurve::OutQuad);
        anims->setEasingCurve(QEasingCurve::OutQuad);
        m_group_->addAnimation(anim);
        m_group_->addAnimation(anims);
    }
    connect(m_group_, &QParallelAnimationGroup::finished, [this]() {
        for (int index = 0; index < m_imgmap_info_lst_.size(); index++) {
            auto item = m_items_[index];
            item->Set_show_mark_(true);
        }
        is_animation_ = false;
    });
    this->lab_select_num_ = new QLabel(this);
    this->lab_select_num_->setFixedSize(60, 14);
    this->lab_select_num_->setText(
        QString("%1/%2").arg(current_center_num_).arg(0));
    this->btn_confirm_ = new QPushButton(this);
    this->btn_confirm_->setText("选择本层");
    this->btn_confirm_->setFixedSize(90, 22);
    connect(this->btn_confirm_, &QPushButton::clicked,
            this, &AspectsSelect::Slot_BtnClicket);
    this->btn_load_ = new QPushButton(this);
    this->btn_load_->setText("选择dcm文件");
    this->btn_load_->setFixedSize(90, 22);
    connect(this->btn_load_, &QPushButton::clicked,
            this, &AspectsSelect::Slot_BtnClicket);
    //
    script_dcm_sort_ = new ScriptDcmsSort();
    connect(script_dcm_sort_, &ScriptDcmsSort::finished,
            this, &AspectsSelect::SlotRunFinished);
    //
    QVBoxLayout *layout = new QVBoxLayout(this);
    layout->addWidget(view);
    this->template_select_num_ = 0;
}

//---------------------------------------------------------------------

void AspectsSelect::Slot_BtnClicket() {
    if(image_lists_.count() < 10) {
        if(QObject::sender() ==  this->btn_load_) {
            this->OpenDicomFile();
        }
    } else {
        if(QObject::sender() ==  this->btn_confirm_) {
            this->ConfirmTemplate();
        } else if(QObject::sender()->objectName() == "next") {
            this->NextPlay();
        } else if(QObject::sender()->objectName() == "last") {
            this->LastPlay();
        }
    }
}

//---------------------------------------------------------------------

void AspectsSelect::SlotRunFinished() {
    if(QObject::sender() == script_dcm_sort_) {
        // 拷贝完成
        if (!script_dcm_sort_->Get_result_()) {
            return;
        }
        script_dcm_sort_->Reinitialize();
        this->LoadPngs();
    }
}

//---------------------------------------------------------------------

void AspectsSelect::Play() {
    // 动画
    for (int index = 0; index < m_imgmap_info_lst_.size(); index++) {
        auto item = m_items_[index];
        item->Set_show_mark_(false);
        QPropertyAnimation *anim = m_animation_map_.value(item);
        QPropertyAnimation *anims = m_animations_map_.value(item);
        auto imageInfoMap = m_imgmap_info_lst_[index];
        item->setZValue(imageInfoMap["zIndex"].toInt());
        item->setOpacity(imageInfoMap["opacity"].toDouble());
        QPointF pointf(imageInfoMap["left"].toInt(), imageInfoMap["top"].toInt() );
        anim->setStartValue(item->itemoffset());
        anims->setStartValue(item->pixsize());
        anim->setEndValue(pointf);
        anims->setEndValue(
            QSize(
                imageInfoMap["width"].toInt(), imageInfoMap["height"].toInt()));
    }
    is_animation_ = true;
}

//---------------------------------------------------------------------

void AspectsSelect::NextPlay() {
    m_group_->stop();
    if(image_lists_.count() - 1 == current_center_num_) {
        current_center_num_ = 0;
    } else {
        current_center_num_++;
    }
    auto firstItem = m_items_.takeAt(0);
    m_items_ << firstItem;
    Play();
    this->UpdatePicture();
    m_group_->start();
}

//---------------------------------------------------------------------

void AspectsSelect::LastPlay() {
    m_group_->stop();
    if(0 == current_center_num_) {
        current_center_num_ = image_lists_.count() - 1;
    } else {
        current_center_num_--;
    }
    auto lastItem = m_items_.takeAt(m_items_.size() - 1);
    m_items_.prepend(lastItem);
    Play();
    this->UpdatePicture();
    m_group_->start();
}

//---------------------------------------------------------------------
/**
 * @brief AspectsSelect::UpdatePicture
 * 更新图片显示
 */
void AspectsSelect::UpdatePicture() {
    // 更新图片
    qint32 index = 0;
    for(qint32 i = current_center_num_ - 4; i <= current_center_num_ + 4; i++) {
        qint32 tmp_id = i;
        if(tmp_id < 0) {
            tmp_id = image_lists_.size() + i ;
        } else if(tmp_id >= image_lists_.size()) {
            tmp_id = i - image_lists_.size();
        }
        auto item = m_items_[index];
        auto imageInfoMap = m_imgmap_info_lst_[index];
        item->setPixmap(image_lists_.at(tmp_id));
        QString mark = "高度：" + iamge_location_lists_.at(tmp_id) + "mm";
        item->Set_mark_left_top_(mark);
        item->setPixmapSize(
            QSize(imageInfoMap["width"].toInt(), imageInfoMap["height"].toInt()));
        if(select_idlst_.contains(tmp_id)) {
            item->SetLeftDownMark(select_idlst_.indexOf(tmp_id));
        } else {
            item->SetLeftDownMark(-1);
        }
        index++;
    }
    lab_select_num_->setText(QString("%1/%2").arg(current_center_num_)
                             .arg(image_lists_.size() - 1));
}

//---------------------------------------------------------------------
/**
 * @brief AspectsSelect::OpenDicomFile
 * 打开文件
 */
void AspectsSelect::OpenDicomFile() {
    // 选择文件
    QString filename = FileUtil::GetFileName("*");
    // 拷贝文件到本地
    script_dcm_sort_->
    Set_session_file_("./session/" +
                      GlobalVar::current_sessing_.GetSessionFileName());
    script_dcm_sort_->Set_input_path_(filename);
    script_dcm_sort_->Set_m_mode_(ScriptDcmsSort::AspectsFile);
    script_dcm_sort_->start();
}

//---------------------------------------------------------------------
/**
 * @brief AspectsSelect::LoadPngs
 * 读取本地保存图片
 */
void AspectsSelect::LoadPngs() {
    image_lists_.clear();
    iamge_location_lists_.clear();
    QString  path
        = "./session/" +
          GlobalVar::current_sessing_.GetSessionFileName() + "/DicomData/";
    QDir dir(path);
    dir.setNameFilters(QStringList() << "*.png");
    for(quint32 i = 0; i < dir.count(); i++) {
        qint32 num = static_cast<qint32>(i);
        image_lists_ << QPixmap(path + dir[num]);
        iamge_location_lists_ << dir[num].remove(".png");
    }
    this->current_center_num_ = 0;
    this->UpdatePicture();
}

//---------------------------------------------------------------------
/**
 * @brief AspectsSelect::ConfirmTemplate
 * 确认层槽函数
 */
void AspectsSelect::ConfirmTemplate() {
    // 如果当前层如果之前设置过其他模板，则清空。
    for(qint32 i = 0; i < select_idlst_.count(); ++i) {
        if(select_idlst_.at(i) == this->current_center_num_) {
            select_idlst_[i] = -1;
        }
    }
    select_idlst_[this->template_select_num_]
        = this->current_center_num_;
    this->UpdatePicture();
    QStringList template_mark;
    for(qint32 i = 0; i < select_idlst_.count(); ++i) {
        if(-1 == select_idlst_.at(i)) {
            template_mark << "";
        } else {
            QString mark = "" + iamge_location_lists_.at(select_idlst_.at(i)) ;
            template_mark << mark;
        }
    }
    emit Signal_ConfirmNumberOfLayers(template_mark);
}


//---------------------------------------------------------------------







//---------------------------------------------------------------------

AspectsSelectWidget::AspectsSelectWidget(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::AspectsSelectWidget) {
    ui->setupUi(this);
    this->Initial();
}

//---------------------------------------------------------------------

AspectsSelectWidget::~AspectsSelectWidget() {
    delete ui;
}

//---------------------------------------------------------------------

void AspectsSelectWidget::Initial() {
    select_view_ = new AspectsSelect();
    template_view_ = new ImageSceneView();
    QStringList template_file_lists;
    template_file_lists << ":/Stroke/Registration/template1.png";
    template_file_lists << ":/Stroke/Registration/template2.png";
    template_file_lists << ":/Stroke/Registration/template3.png";
    template_file_lists << ":/Stroke/Registration/template4.png";
    template_file_lists << ":/Stroke/Registration/template5.png";
    template_file_lists << ":/Stroke/Registration/template6.png";
    template_file_lists << ":/Stroke/Registration/template_next.png";
    template_file_lists << ":/Stroke/Registration/template_last.png";
    template_view_->Set_file_paths_(template_file_lists);
    template_view_->InitSceneWidget();
    ui->layout_select->addWidget(select_view_);
    ui->layout_view->addWidget(template_view_);
    connect(template_view_, &ImageSceneView::Signal_TemplateSelectChange,
            select_view_, &AspectsSelect::Slot_TemplateSelectChange);
    connect(select_view_, &AspectsSelect::Signal_ConfirmNumberOfLayers,
            template_view_, &ImageSceneView::Slot_ConfirmNumberOfLayers);
}





```cpp
#ifndef IMAGESCENEVIEW_H
#define IMAGESCENEVIEW_H

#include <QtWidgets/QWidget>
#include <QGraphicsObject>
#include <QPixmap>
#include <QGraphicsView>
#include <QuickEvent>

class QTimer;
class QPropertyAnimation;
class GraphicsPixmap;
class QGraphicsScene;
class QParallelAnimationGroup;

class GraphicsView : public QGraphicsView {
    Q_OBJECT
  public:
    GraphicsView(QGraphicsScene *scene);
    ~GraphicsView() override;
  protected:
    void resizeEvent(QResizeEvent *event) Q_DECL_OVERRIDE;
};

class ImageSceneView : public QWidget {
    Q_OBJECT
  public:
    ImageSceneView(QWidget *parent = nullptr);
    ~ImageSceneView() override;
    void InitSceneWidget();
  public Q_SLOTS:
    void Slot_ConfirmNumberOfLayers(const QStringList &mark);
  private:
    void Play();
  private Q_SLOTS:
    void Slot_LeftBtnClicked();
    void Slot_RightBtnClicked();
  Q_SIGNALS:
    void Signal_TemplateSelectChange(const qint32 &num);

  private:
    QGraphicsScene *m_scene_;
    QList<QMap<QString, QString>> img_map_infolst_;
    QList<GraphicsPixmap *> m_items_;
    QUICK_INITIAL_VAR(file_paths_, QStringList)
    QUICK_INITIAL_VAR(select_num_, qint32)
};

class GraphicsPixmap : public QGraphicsObject {
    Q_OBJECT
    Q_PROPERTY(QPointF itemoffset READ itemoffset WRITE setItemOffset)
    Q_PROPERTY(QSize itemsize READ pixsize WRITE setPixmapSize)
  public:
    GraphicsPixmap();
  public:
    QRectF boundingRect() const Q_DECL_OVERRIDE;
    void setItemOffset(QPointF ponit);
    QPointF itemoffset();
    QSize pixsize();
    void setPixmap(const QPixmap &pixmap);
    void setPixmapSize(QSize size);
    void SetLeftDownMark(const qint32 &id);

  Q_SIGNALS:
    void Signale_Clicked();
    void Signale_DoubleClicked();
  private:
    void mousePressEvent(QGraphicsSceneMouseEvent *event) Q_DECL_OVERRIDE;
    void mouseDoubleClickEvent(QGraphicsSceneMouseEvent *event) Q_DECL_OVERRIDE;
    void paint(QPainter *, const QStyleOptionGraphicsItem *, QWidget *) Q_DECL_OVERRIDE;
  private:
    QUICK_INITIAL_VAR(mark_center_, QString)
    QUICK_INITIAL_VAR(show_mark_, bool)
    QUICK_INITIAL_VAR(mark_left_top_, QString)
    QPixmap pix;
    QPointF offset;
    QSize pixSize;
    QString mark_left_down_;
};

#endif // IMAGESCENEVIEW_H

```



```cpp
#include "imagesceneview.h"

#include <QParallelAnimationGroup>
#include <QPropertyAnimation>
#include <QDebug>
#include <QTimer>
#include <QGraphicsSceneMouseEvent>
#include <QPainter>
#include <QCursor>
#include <QVBoxLayout>



const qint32 size_width = 800;
const qint32 size_height = 800;

const qint32 btn_x = 21;
const qint32 interval_x = 12;

const qint32 template_num = 6;

//---------------------------------------------------------------------

ImageSceneView::ImageSceneView(QWidget *parent)
    : QWidget(parent),
      select_num_(0) {
    //图片信息
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "20" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "149" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "278" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "407" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "536" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "2"   },
        { "width", "115" },
        { "height", "115" },
        { "top", "671" },
        { "left", "665" },
        { "opacity", "0.5" }
    };
    img_map_infolst_ << QMap<QString, QString> {
        { "zIndex", "4"   },
        { "width", "512" },
        { "height", "512" },
        { "top", "90" },
        { "left", "144" },
        { "opacity", "1" }
    };
}

//---------------------------------------------------------------------

ImageSceneView::~ImageSceneView() {
}

//---------------------------------------------------------------------

void ImageSceneView::InitSceneWidget() {
    if(template_num + 2 != file_paths_.size()) {
        qDebug() << "图片路径输入错误，输入数量：" << file_paths_.size();
        return;
    }
    //场景
    m_scene_ = new QGraphicsScene(
        QRect(0, 0, size_width, size_height), this);
    // 场景底部添加图片元素
    for (int index = 0; index < template_num; index++) {
        auto imageInfoMap = img_map_infolst_[index];
        QPixmap pixmap = QPixmap(file_paths_.at(index));
        GraphicsPixmap *item = new GraphicsPixmap();
        item->setPixmap(pixmap);
        item->setPixmapSize(QSize(4 + imageInfoMap["width"].toInt(),
                                  4 + imageInfoMap["height"].toInt()));
        item->setItemOffset(QPointF(imageInfoMap["left"].toInt(),
                                    imageInfoMap["top"].toInt()));
        item->setZValue(imageInfoMap["zIndex"].toInt());
        if(select_num_ == index) {
            item->setOpacity(1);
        } else {
            item->setOpacity(imageInfoMap["opacity"].toDouble());
        }
        m_items_ << item;
        m_scene_->addItem(item);
        connect(item, &GraphicsPixmap::Signale_DoubleClicked, this, [ = ] {
            select_num_ = index;
            Play();

        });
    }
    // 场景中间添加元素
    {
        auto map = img_map_infolst_[6];
        QPixmap pixmap = QPixmap(file_paths_.at(select_num_));
        GraphicsPixmap *item = new GraphicsPixmap();
        item->setPixmap(pixmap);
        item->setPixmapSize(QSize(map["width"].toInt(),
                                  map["height"].toInt()));
        item->setItemOffset(QPointF(map["left"].toInt(),
                                    map["top"].toInt()));
        item->setZValue(map["zIndex"].toInt());
        item->setOpacity(map["opacity"].toDouble());
        m_items_ << item;
        m_scene_->addItem(item);
    }
    //left button
    GraphicsPixmap *leftBtn = new GraphicsPixmap();
    leftBtn->setCursor(QCursor(Qt::PointingHandCursor));
    leftBtn->setPixmap(QPixmap(file_paths_.at(template_num)));
    leftBtn->setItemOffset(QPointF(interval_x, size_height / 2));
    leftBtn->setZValue(5);
    m_scene_->addItem(leftBtn);
    connect(leftBtn, SIGNAL(Signale_Clicked()), this, SLOT(Slot_LeftBtnClicked()));
    //right button
    GraphicsPixmap *rightBtn = new GraphicsPixmap();
    rightBtn->setCursor(QCursor(Qt::PointingHandCursor));
    rightBtn->setPixmap(QPixmap(file_paths_.at(template_num + 1)));
    rightBtn->setItemOffset(QPointF(size_width - interval_x - btn_x, size_height / 2));
    rightBtn->setZValue(5);
    m_scene_->addItem(rightBtn);
    connect(rightBtn, SIGNAL(Signale_Clicked()), this, SLOT(Slot_RightBtnClicked()));
    //视图
    GraphicsView *view = new GraphicsView(m_scene_);
    view->setFrameShape(QFrame::NoFrame);
    view->setParent(this);
    view->setViewportUpdateMode(QGraphicsView::BoundingRectViewportUpdate);
    view->setBackgroundBrush(QColor(46, 46, 46));
    view->setCacheMode(QGraphicsView::CacheBackground);
    view->setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
    QVBoxLayout *layout = new QVBoxLayout(this);
    layout->addWidget(view);
}


//---------------------------------------------------------------------

void ImageSceneView::Slot_ConfirmNumberOfLayers(
    const QStringList &mark) {
    // 场景底部标签修改
    for (int index = 0; index < template_num; index++) {
        auto item = m_items_[index];
        item->Set_mark_center_(mark.at(index));
        item->update();
    }
}


//---------------------------------------------------------------------

void ImageSceneView::Slot_LeftBtnClicked() {
    //上一张
    if(0 == select_num_) {
        select_num_ = 5;
    } else {
        select_num_--;
    }
    Play();
}

//---------------------------------------------------------------------

void ImageSceneView::Slot_RightBtnClicked() {
    //下一张
    if(template_num - 1 == select_num_) {
        select_num_ = 0;
    } else {
        select_num_++;
    }
    Play();
}

//---------------------------------------------------------------------

void ImageSceneView::Play() {
    // 场景底部元素修改
    for (int index = 0; index < template_num; index++) {
        auto item = m_items_[index];
        if(select_num_ == index) {
            item->setOpacity(1);
        } else {
            item->setOpacity(0.5);
        }
    }
    // 场景中间元素修改
    m_items_[6]->setPixmap(file_paths_.at(select_num_));
    //
    emit Signal_TemplateSelectChange(select_num_);
}

//---------------------------------------------------------------------

GraphicsView::GraphicsView(QGraphicsScene *scene)
    : QGraphicsView(scene) {
}
//---------------------------------------------------------------------

GraphicsView::~GraphicsView() {
}
//---------------------------------------------------------------------

void GraphicsView::resizeEvent(QResizeEvent *event) {
    QGraphicsView::resizeEvent(event);
    fitInView(sceneRect(), Qt::KeepAspectRatio);
}

//---------------------------------------------------------------------

GraphicsPixmap::GraphicsPixmap() : QGraphicsObject() {
    this->mark_left_down_ = "";
    this->mark_left_top_ = "";
    this->show_mark_ = true;
    setCacheMode(DeviceCoordinateCache);
}

//---------------------------------------------------------------------

void GraphicsPixmap::mousePressEvent(QGraphicsSceneMouseEvent *event) {
    if (event->button() == Qt::LeftButton) {
        emit Signale_Clicked();
    }
    QGraphicsObject::mousePressEvent(event);
}

void GraphicsPixmap::mouseDoubleClickEvent(QGraphicsSceneMouseEvent *event) {
    if (event->button() == Qt::LeftButton) {
        emit Signale_Clicked();
        emit Signale_DoubleClicked();
    }
}

//---------------------------------------------------------------------

void GraphicsPixmap::setItemOffset(QPointF ponit) {
    prepareGeometryChange();
    offset = ponit;
    this->update();
}

//---------------------------------------------------------------------

QPointF GraphicsPixmap::itemoffset() {
    return offset;
}

//---------------------------------------------------------------------

void GraphicsPixmap::setPixmap(const QPixmap &pixmap) {
    pixSize = pixmap.size();
    pix = pixmap;
    this->update();
}

//---------------------------------------------------------------------

void GraphicsPixmap::setPixmapSize(QSize size) {
    pixSize = size;
}

//---------------------------------------------------------------------
void GraphicsPixmap::SetLeftDownMark(const qint32 &id) {
    switch (id) {
        case -1:
            mark_left_down_ = "";
            break;
        case 0:
            mark_left_down_ = "模板一";
            break;
        case 1:
            mark_left_down_ = "模板二";
            break;
        case 2:
            mark_left_down_ = "模板三";
            break;
        case 3:
            mark_left_down_ = "模板四";
            break;
        case 4:
            mark_left_down_ = "模板五";
            break;
        case 5:
            mark_left_down_ = "模板六";
            break;
        default:
            break;
    }
    this->update();
}

//---------------------------------------------------------------------

QSize GraphicsPixmap::pixsize() {
    return pixSize;
}

//---------------------------------------------------------------------

QRectF GraphicsPixmap::boundingRect() const {
    return QRectF(offset, pix.size() / pix.devicePixelRatio());
}

//---------------------------------------------------------------------

void GraphicsPixmap::paint(QPainter *painter,
                           const QStyleOptionGraphicsItem *,
                           QWidget *) {
    painter->setRenderHint(QPainter::SmoothPixmapTransform, true);
    painter->drawPixmap(offset,
                        pix.scaled(pixSize, Qt::KeepAspectRatio,
                                   Qt::SmoothTransformation));
    if(show_mark_) {
        QFont font;
        font.setPointSize(pixSize.width() / 15 > 5 ? pixSize.width() / 15 : 5);
        painter->setFont(font);
        painter->setPen(QColor(255, 143, 36));
        painter->drawText(offset + QPoint(pixSize.width() / 10,
                                          pixSize.width() * 9 / 10), mark_left_down_);
        font.setPointSize(pixSize.width() / 20 > 5 ? pixSize.width() / 20 : 5);
        painter->setFont(font);
        painter->setPen(QColor(168, 143, 110));
        painter->drawText(offset + QPoint(pixSize.width() / 10,
                                          pixSize.width() / 10), mark_left_top_);
        font.setPointSize(20);
        painter->setFont(font);
        painter->setPen(QColor(255, 143, 36));
        painter->drawText(offset + QPoint(pixSize.width() / 10,
                                          pixSize.width() * 4 / 10), mark_center_);
    }
}

```














