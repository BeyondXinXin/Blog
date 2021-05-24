# QGraphicsView  QGraphicsScene   增加任意点

这玩意信号传递是
view ---scene---item
一旦把事件重构了了，一定要每个事件处理后
**QGraphicsItem::mouseMoveEvent(event);**

有跟我一样需求的可以看下我的，
增加任意点，点的顺序可以改变
每个点可以拖动和wasd移动
每个任意点的位置实时显示
空格可以把点按顺序直线链接
可以按顺序输出所有点的坐标
鼠标左键拖拽背景
滚轮放大缩小
实时显示鼠标现对于图片位置
写的都是都是借助csdn博客别人的教程（
https://blog.csdn.net/feiyangqingyun  刘大神
https://me.csdn.net/u011012932   一去二三里
），写完了也贴出来方便他人使用

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827112236703.gif)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827112249282.gif)


```javascript
// 自定义 Item
MyCustomIQGraphicsEllipseItem::MyCustomIQGraphicsEllipseItem(QGraphicsItem *parent)
    : QGraphicsEllipseItem(parent) {
    Initial();
}
void MyCustomIQGraphicsEllipseItem::Initial() {
    // 画笔 - 边框色
    QPen p = pen();
    p.setWidth(1);
    p.setColor(QColor(0, 160, 230, 100));
    setPen(p);
    // 画刷 - 背景色
    setBrush(QColor(0, 0, 0, 100));
    // 可选择、可移动
    setFlags(QGraphicsItem::ItemIsSelectable | QGraphicsItem::ItemIsMovable);
    title_item_ = new QGraphicsTextItem(this);
    title_item_->setFont(QFont("ubuntu", 6));
    title_item_->setDefaultTextColor(QColor(10, 10, 10));
}
void MyCustomIQGraphicsEllipseItem::SetThisTitle(QPointF a, QString c) {
    this_pointf_ = a ;
    this_title_name_ = c;
    title_item_->moveBy(this_pointf_.x() - 25, this_pointf_.y() + 10);
    title_item_->setPlainText(QString("%1  x:%2  y:%3")
                              .arg(this_title_name_)
                              .arg(this_pointf_.x())
                              .arg(this_pointf_.y()));

}
void MyCustomIQGraphicsEllipseItem::SetThisPosition() {
    title_item_->setPlainText(QString("%1  x:%2  y:%3")
                              .arg(this_title_name_)
                              .arg(this_pointf_.x() + this->pos().x())
                              .arg(this_pointf_.y() + this->pos().y()));
}
void MyCustomIQGraphicsEllipseItem::SetThisName(QString a) {
    this_title_name_ = a;
    SetThisPosition();
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
void MyCustomIQGraphicsEllipseItem::mouseMoveEvent(
    QGraphicsSceneMouseEvent *event) {
    QPointF point =  event->scenePos();
    title_item_->setPlainText(QString("%1  x:%2  y:%3")
                              .arg(this_title_name_)
                              .arg(point.x())
                              .arg(point.y()));
    QGraphicsItem::mouseMoveEvent(event);
}
void MyCustomIQGraphicsEllipseItem::mouseReleaseEvent(
    QGraphicsSceneMouseEvent *event) {
    QGraphicsItem::mouseReleaseEvent(event);
}
void MyCustomIQGraphicsEllipseItem::paintEvent() {

}
qint32 MyCustomIQGraphicsEllipseItem::type() const {
    return UserType + 1;
}

// 自定义 Item
MyCustomIQGraphicsPixmapItem::MyCustomIQGraphicsPixmapItem(QGraphicsItem *parent)
    : QGraphicsPixmapItem(parent) {
}

void MyCustomIQGraphicsPixmapItem::mouseMoveEvent(
    QGraphicsSceneMouseEvent *event) {
    QGraphicsItem::mouseMoveEvent(event);
}


// 自定义 Scene
MyCustomQGraphicsScene::MyCustomQGraphicsScene(QGraphicsScene *parent):
    QGraphicsScene(parent) {
    Initial();
}
void MyCustomQGraphicsScene::Initial() {
    begin_point_ = new MyCustomIQGraphicsEllipseItem;
    end_point_ = new MyCustomIQGraphicsEllipseItem;
    addItem(begin_point_);
    addItem(end_point_);
    the_path_ = new QGraphicsPathItem;
    QPen p ;
    p.setWidth(2);
    p.setColor(Qt::green);
    the_path_->setPen(p);
    addItem(the_path_);
    point_menu_ = new QMenu();
    point_menu_child_ = new QMenu();
    pointnums_ = 0;
}
void MyCustomQGraphicsScene::mousePressEvent(
    QGraphicsSceneMouseEvent *event) {
    QGraphicsScene::mousePressEvent(event);
    if (!event->isAccepted()) {
        if (event->button() == Qt::LeftButton) {
            if (event->modifiers() == Qt::AltModifier) {
                MyCustomIQGraphicsEllipseItem *item =
                    new MyCustomIQGraphicsEllipseItem();// 在 Scene 上添加一个自定义 item
                QPen p ;
                p.setWidth(1);
                if (pointnums_ == 0) {
                    removeItem(begin_point_);
                    p.setColor(QColor(0, 255, 0, 200));
                    item->setPen(p);
                    QPointF point =  event->scenePos();
                    item->SetThisTitle(point, "出发位置");
                    item->setRect(point.x() - 2, point.y() - 2, 4, 4);
                    begin_point_ = item;
                    addItem(item);
                    pointnums_++;
                } else if (pointnums_ == 1) {
                    removeItem(end_point_);
                    p.setColor(QColor(0, 0, 255, 200));
                    item->setPen(p);
                    QPointF point =  event->scenePos();
                    item->SetThisTitle(point, "结束位置");
                    item->setRect(point.x() - 2, point.y() - 2, 4, 4);
                    end_point_ = item;
                    addItem(item);
                    pointnums_++;
                    emit SignalBtnSeekOut();
                } else {
                    QPointF point =  event->scenePos();
                    item->SetThisTitle(point,
                                       QString::number(list_points_.count() + 1));
                    item->setRect(point.x() - 2, point.y() - 2, 4, 4);
                    addItem(item);
                    list_points_.append(item);
                    pointnums_++;
                    emit SignalBtnSeekOut();
                }
            }
        } else if (event->button() == Qt::RightButton) {
            // 检测光标下是否有 item
            MyCustomIQGraphicsEllipseItem *itemthis = nullptr;
            foreach (QGraphicsItem *item, items(event->scenePos())) {
                if (item->type() == QGraphicsItem::UserType + 1) {
                    itemthis = static_cast<MyCustomIQGraphicsEllipseItem *>(item) ;
                    break;
                }
            }
            if ((itemthis != nullptr) &&
                    (itemthis != begin_point_) &&
                    (itemthis != end_point_)) {
                point_menu_child_->clear();
                point_menu_->clear();
                point_menu_->addAction("删除", [ = ](void) {
                    this->SlotDalteOneItem(*itemthis);
                });
                point_menu_->addAction("取消");
                point_menu_->addSeparator();
                point_menu_child_ = point_menu_->addMenu("移动位置");
                for (int i = 1; i <= list_points_.count(); i++) {
                    point_menu_child_->addAction(QString("移动至%1")
                    .arg(i), [ = ](void) {
                        this->SlotChangeSerialItem(*itemthis, i - 1);
                    });
                }
                point_menu_->exec(QCursor::pos());
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
        emit SignalBtnSeekOut();
    } else {
        emit SIgnalPositionLib(event->scenePos());
    }

    QGraphicsScene::mouseMoveEvent(event);
}
void MyCustomQGraphicsScene::leaveEvent(
    QGraphicsSceneMouseEvent *event) {
    emit SIgnalPositionLib(event->scenePos());
    emit SignalBtnSeekOut();
    QGraphicsScene::mouseMoveEvent(event);
}
void MyCustomQGraphicsScene::keyPressEvent(QKeyEvent *event) {
    if (event->key() == Qt::Key_Space) {
        QPainterPath *painterPath = new QPainterPath;
        painterPath->moveTo(begin_point_->GetThisPosition()
                            + begin_point_->pos());
        MyCustomIQGraphicsEllipseItem *i;
        foreach (i, list_points_) {
            painterPath->lineTo(i->GetThisPosition() + i->pos());
        }
        painterPath->lineTo(end_point_->GetThisPosition()
                            + end_point_->pos());
        the_path_->setPath(*painterPath);
        the_path_->show();
        the_path_->setZValue(100);
    } else {
        QGraphicsScene::keyPressEvent(event);
        if (!selectedItems().isEmpty()) {
            MyCustomIQGraphicsEllipseItem *tmp =
                static_cast<MyCustomIQGraphicsEllipseItem *>(selectedItems().front());
            if (event->key() == Qt::Key_A) {
                tmp->moveBy(-1, 0);
                tmp->SetThisPosition();
            } else if (event->key() == Qt::Key_D) {
                tmp->moveBy(1, 0);
                tmp->SetThisPosition();
            } else if (event->key() == Qt::Key_W) {
                tmp->moveBy(0, -1);
                tmp->SetThisPosition();
            } else if (event->key() == Qt::Key_S) {
                tmp->moveBy(0, 1);
                tmp->SetThisPosition();
            }
        }
    }
    emit SignalBtnSeekOut();
    QGraphicsScene::keyPressEvent(event);
}
void MyCustomQGraphicsScene::keyReleaseEvent(QKeyEvent *event) {
    if (event->key() == Qt::Key_Space) {
        the_path_->hide();
    } else {
        QGraphicsScene::keyReleaseEvent(event);
    }
}
void MyCustomQGraphicsScene::SlotDalteOneItem(
    MyCustomIQGraphicsEllipseItem &tem) {
    list_points_.removeOne(&tem);
    removeItem(&tem);
    MyCustomIQGraphicsEllipseItem *i;
    qint32 tmp_int = 1;
    foreach (i, list_points_) {
        i->SetThisName(QString::number(tmp_int));
        tmp_int++;
        pointnums_--;
    }
    emit SignalBtnSeekOut();
}
void MyCustomQGraphicsScene::SlotDalteAllItem() {
    MyCustomIQGraphicsEllipseItem *i;
    foreach (i, list_points_) {
        list_points_.removeOne(i);
        removeItem(i);
        pointnums_--;
    }
    pointnums_ = 0;
    removeItem(begin_point_);
    removeItem(end_point_);
    emit SignalBtnSeekOut();
}
void MyCustomQGraphicsScene::SlotChangeSerialItem(
    MyCustomIQGraphicsEllipseItem &tem, int a) {
    list_points_.removeOne(&tem);
    list_points_.insert(a, &tem);
    MyCustomIQGraphicsEllipseItem *i;
    qint32 tmp_int = 1;
    foreach (i, list_points_) {
        i->SetThisName(QString::number(tmp_int));
        tmp_int++;
    }
    emit SignalBtnSeekOut();
}
bool MyCustomQGraphicsScene::SLotGetItemSpoint(
    QList<QPointF> &point, const QPointF begin) {
    if (pointnums_ > 1) {
        list_points_.insert(0, begin_point_);
        list_points_.append(end_point_);
        MyCustomIQGraphicsEllipseItem *i;
        foreach (i, list_points_) {
            point << i->GetThisPosition() + i->pos() - begin;
        }
        list_points_.removeOne(begin_point_);
        list_points_.removeOne(end_point_);
        return true;
    }
    return false;
}

// 自定义 View
MyCustomQGraphicsView::MyCustomQGraphicsView(QWidget *parent):
    QGraphicsView(parent) {
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

```
