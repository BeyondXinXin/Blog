# 利用Qt实现一个多图选择目标点的demo

# 说明
- **需求**
16张图片上放置目标点，仅放置第一个点时所有图曾相同位置增加目标点。每个图片上目标点可以任意调整

- **操作**
按下alt+鼠标左键放置目标点。

<font color=red size=3>**注：多图浏览器copy自  飞扬青云   [https://gitee.com/feiyangqingyun/QWidgetDemo](https://gitee.com/feiyangqingyun/QWidgetDemo)**</font>

<font color=red size=3>**注：就是个demo，临时测试实现功能。美化、性能、程序格式、容错什么的都没考虑，仅仅是实现。有一样需求的可以参考下**</font>


![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607134230689.gif)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607134245615.gif)

# 代码

```cpp
#ifndef CUSTOM_ITEM_H
#define CUSTOM_ITEM_H

#include "stable.h"

// 自定义 item
class MyCustomIQGraphicsEllipseItem : public QGraphicsEllipseItem {
  public:
    explicit MyCustomIQGraphicsEllipseItem(QGraphicsItem *parent = nullptr);
    void SetThisTitle(QPointF);
    QPointF GetThisPosition() {
        return this_pointf_;
    }
  protected:
    qint32 type() const;
    void mousePressEvent(QGraphicsSceneMouseEvent *event);
  private:
    void Initial();
  private:
    QPointF this_pointf_;
};

// 自定义 item
class MyCustomIQGraphicsPixmapItem : public QGraphicsPixmapItem {
  public:
    explicit MyCustomIQGraphicsPixmapItem(QGraphicsItem *parent = nullptr);
    ~MyCustomIQGraphicsPixmapItem();
    void SetPointF(QList<double> xList, QList<double> yList);
    bool thisclecked;
  protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event);
};

// 自定义 Scene
class MyCustomQGraphicsScene : public QGraphicsScene {
    Q_OBJECT
  public:
    explicit MyCustomQGraphicsScene(QGraphicsScene *parent = nullptr);
    QPointF GetThisPosition();
    void SetThisPosition(const QPointF &pos);
  protected:
    void mousePressEvent(QGraphicsSceneMouseEvent *event);
    void mouseMoveEvent(QGraphicsSceneMouseEvent *event);
  private:
    void Initial();
  private:
    MyCustomIQGraphicsEllipseItem *begin_;
    qint32 pointnums;
};

// 自定义 view
class MyCustomQGraphicsView : public QGraphicsView {
    Q_OBJECT
  public:
    explicit MyCustomQGraphicsView(QWidget *parent = nullptr);
    void OpenSelectPoint(const QImage &background, const qint32 &id);
    QList<QPointF>  GetThisPositions();
  Q_SIGNALS:
    void SignalDoubleClick();
  protected:
    void wheelEvent(QWheelEvent *event);
    void mouseMoveEvent(QMouseEvent *event);
    void mouseDoubleClickEvent(QMouseEvent *event);
  private:
    void BatchWritePoints(const QPointF &pos);
  private:
    MyCustomQGraphicsScene *setup_scene_;
    MyCustomIQGraphicsPixmapItem *scene_background_;
    QImage img_background_;
    QList<QPointF> point_list_;
    qint32 current_id_;
};

#endif // CUSTOM_ITEM_H

```

```cpp
#include "stable.h"
#include "custom_item.h"
#include <math.h>

// 自定义 Item
MyCustomIQGraphicsEllipseItem::MyCustomIQGraphicsEllipseItem(QGraphicsItem *parent)
    : QGraphicsEllipseItem(parent) {
    Initial();
}
void MyCustomIQGraphicsEllipseItem::Initial() {
    QPen p = pen();
    p.setWidth(1);
    p.setColor(QColor(0, 160, 230, 100));
    setPen(p);
    setBrush(QColor(0, 0, 0, 100));
    setFlags(QGraphicsItem::ItemIsSelectable | QGraphicsItem::ItemIsMovable);
}
void MyCustomIQGraphicsEllipseItem::SetThisTitle(QPointF a) {
    this_pointf_ = a ;
}
void MyCustomIQGraphicsEllipseItem::mousePressEvent(
    QGraphicsSceneMouseEvent *event) {
    if (event->button() == Qt::LeftButton) {
        if (event->modifiers() == Qt::ShiftModifier) {
            setSelected(true);// 选中 item
        } else if (event->modifiers() == Qt::AltModifier) {
        } else {
            QGraphicsItem::mousePressEvent(event);
            event->accept();
        }
    } else if (event->button() == Qt::RightButton) {
        event->ignore();
    }
}


qint32 MyCustomIQGraphicsEllipseItem::type() const {
    return UserType + 1;
}


// 自定义 Item
MyCustomIQGraphicsPixmapItem::MyCustomIQGraphicsPixmapItem(QGraphicsItem *parent)
    : QGraphicsPixmapItem(parent) {
    setZValue(0);
}

MyCustomIQGraphicsPixmapItem::~MyCustomIQGraphicsPixmapItem() {
}

void MyCustomIQGraphicsPixmapItem::mousePressEvent(QGraphicsSceneMouseEvent *event) {
    if (event->button() == Qt::LeftButton) {
        event->ignore();
    }
    if (event->button() == Qt::RightButton) {
        event->ignore();
    }
}

// 自定义 Scene
MyCustomQGraphicsScene::MyCustomQGraphicsScene(QGraphicsScene *parent):
    QGraphicsScene(parent) {
    Initial();
}

QPointF MyCustomQGraphicsScene::GetThisPosition() {
    return begin_->GetThisPosition() + begin_->pos();
}

void MyCustomQGraphicsScene::SetThisPosition(const QPointF &pos) {
    this->begin_->setPos(pos - begin_->GetThisPosition());
}

void MyCustomQGraphicsScene::Initial() {
    pointnums = 0;
    begin_ = new MyCustomIQGraphicsEllipseItem;
}

void MyCustomQGraphicsScene::mousePressEvent(QGraphicsSceneMouseEvent *event) {
    QGraphicsScene::mousePressEvent(event);
    if (event->isAccepted()) {
        return;
    }
    if (event->button() == Qt::LeftButton) {
        if (event->modifiers() == Qt::AltModifier) {
            MyCustomIQGraphicsEllipseItem *item =
                new MyCustomIQGraphicsEllipseItem();// 在 Scene 上添加一个自定义 item
            QPen p ;
            p.setWidth(1);
            if (pointnums == 0) {
                p.setColor(QColor(0, 255, 0, 200));
                item->setPen(p);
                QPointF point =  event->scenePos();
                item->SetThisTitle(point);
                item->setRect(point.x() - 10, point.y() - 10, 20, 20);
                begin_ = item;
                addItem(item);
                pointnums++;
            }
        }
    }
    if (event->button() == Qt::RightButton) {
        // 检测光标下是否有 item
        MyCustomIQGraphicsEllipseItem *itemthis = nullptr;
        foreach (QGraphicsItem *item, items(event->scenePos())) {
            if (item->type() == QGraphicsItem::UserType + 1) {
                itemthis = static_cast<MyCustomIQGraphicsEllipseItem *>(item) ;
                break;
            }
        }
    }
}



void MyCustomQGraphicsScene::mouseMoveEvent(
    QGraphicsSceneMouseEvent *event) {
    // 检测光标下是否有 item
    MyCustomIQGraphicsEllipseItem *itemthis = nullptr;
    foreach (QGraphicsItem *item, items(event->scenePos())) {
        if (item->type() == QGraphicsItem::UserType + 1) {
            itemthis = static_cast<MyCustomIQGraphicsEllipseItem *>(item) ;
            break;
        }
    }
    if (itemthis != nullptr) {
    } else {
    }
    QGraphicsScene::mouseMoveEvent(event);
}


// 自定义 View
MyCustomQGraphicsView::MyCustomQGraphicsView(QWidget *parent):
    QGraphicsView(parent) {
    this->setStyleSheet("background: transparent;border:0px");
    setup_scene_ = new MyCustomQGraphicsScene;
    scene_background_ = new MyCustomIQGraphicsPixmapItem();
    setup_scene_->addItem(scene_background_);
    this->setVisible(0);
    //
    current_id_ = -1;
    QPointF tmp(0, 0);
    for( qint32 a = 0; a < 16; ++a ) {
        point_list_ << tmp;
    }
}

void MyCustomQGraphicsView::OpenSelectPoint(
    const QImage &background, const qint32 &id) {
    this->current_id_ = id;
    img_background_ = background;
    scene_background_->setPixmap(QPixmap::fromImage(img_background_));
    setup_scene_->setSceneRect(0, 0,
                               img_background_.width() * 2,
                               img_background_.height() * 2);
    scene_background_->moveBy(img_background_.width() /
                              2 - scene_background_->pos().x(),
                              img_background_.height() /
                              2 - scene_background_-> pos().y());
    if(point_list_.at(current_id_).x() > 1) {
        setup_scene_->SetThisPosition(point_list_.at(current_id_)
                                      + this->scene_background_->pos());
    }
    this->setScene(setup_scene_);
    this->show();
    this->setDragMode(QGraphicsView::ScrollHandDrag);
    this->setVisible(1);
}

QList<QPointF> MyCustomQGraphicsView::GetThisPositions() {
    return point_list_;
}

void MyCustomQGraphicsView::wheelEvent(QWheelEvent *event) {
    if (event->delta() > 0) {
        this->scale(1.1, 1.1);
    } else {
        this->scale(0.9, 0.9);
    }
}

void MyCustomQGraphicsView::mouseMoveEvent(QMouseEvent *event) {
    QGraphicsView::mouseMoveEvent(event);
}

void MyCustomQGraphicsView::mouseDoubleClickEvent(QMouseEvent *) {
    this->setVisible(0);
    QPointF tmp =
        this->setup_scene_->GetThisPosition() - this->scene_background_->pos();
    BatchWritePoints(tmp);
    emit SignalDoubleClick();
}

void MyCustomQGraphicsView::BatchWritePoints(const QPointF &pos) {
    if(current_id_ != -1) {
        for( qint32 i = 0; i < 16; ++i ) {
            if(point_list_.at(i).x() < 1) {
                point_list_[i] = pos;
            }
        }
        point_list_[current_id_] = pos;
        current_id_ = -1;
    }
}


```

