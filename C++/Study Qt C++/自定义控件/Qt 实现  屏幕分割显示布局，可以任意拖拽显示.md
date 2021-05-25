# Qt 实现  屏幕分割显示布局，可以任意拖拽显示


@[TOC](利用  Qt 实现  屏幕分割显示布局)

# 1 效果
- 左侧是一个单列的图片预览列表，右侧是一个**N*M**的widgets视图。
- 通过底部视图分割按钮可以，调整右侧**N*M**的值。
- 右侧双击放大/缩小某一个widget
- 右侧单机，选中当前Widget，边框变成红色
- 左侧单机绿色边框表示当前选中
- 左侧双击把当前左侧选中系列在右侧当前选中系列显示
- 可以从左侧直接按住鼠标左键拖拽到右侧某一个widget
- 左侧键盘操作  **Key_Right** **Key_Left** **Key_Home** **Key_End** **Key_Return**
&emsp;&emsp; 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919130023834.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

&emsp;&emsp; 
&emsp;&emsp; 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919130101575.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

&emsp;&emsp; 
&emsp;&emsp; 
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919130419574.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

&emsp;&emsp; 
&emsp;&emsp; 

&emsp;&emsp; **MP4**压缩成**gif**就变得怪怪的，先不研究了。

&emsp;&emsp; 
&emsp;&emsp; 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919125932226.gif#pic_center)

&emsp;&emsp; 
&emsp;&emsp; 


![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919125950127.gif#pic_center)


# 2 实现
&emsp;&emsp; 可以分成三个部分，左侧的预览，右侧的显示，底部的视图分割。
## 2.1 底部视图分割

&emsp;&emsp; 这个选择布局实现可以先创建一个这样的布局。鼠标移入选中的效果只需要改一下**mouseMoveEvent**，点击确认改一下**mousePressEvent**，**Signal_ViewLayout**表示右侧需要更改的尺寸。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919131718333.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

```cpp
void GridPopWidget::mousePressEvent(QMouseEvent *e) {
    QWidget::mousePressEvent(e);
    QPoint p = e->pos();
    int row = 0, col = 0;
    QPoint lim = rect().bottomRight();
    if (p.x() > lim.x() || p.y() > lim.y()) {
        return;
    }
    foreach (QWidget *w, wArr.first()) {
        if (p.x() > w->pos().x()) {
            col++;
        }
    }
    foreach (QList<QWidget *> ws, wArr) {
        if (p.y() > ws.first()->pos().y()) {
            row++;
        }
    }
    emit Signal_ViewLayout(col, row);
    close();
}

void GridPopWidget::mouseMoveEvent(QMouseEvent *e) {
    QWidget::mouseMoveEvent(e);
    QPoint p = e->pos();
    foreach (QList<QWidget *> ws, wArr) {
        foreach (QWidget *w, ws) {
            if (p.x() > w->pos().x() && p.y() > w->pos().y()) {
                w->setStyleSheet(HIGHLIGHT_STYLE);
            } else {
                w->setStyleSheet(NORMAL_STYLE);
            }
        }
    }
}

```

## 2.2 左侧预览视图

&emsp;&emsp; 左侧就是一个简单的**QWidget**，添加一个**QBoxLayout（QBoxLayout::TopToBottom）**，每个预览视图是一个自定义的**QLabel**。修改这个自定义**QLabel**的**mousePressEvent**、**mouseDoubleClickEvent**、**mouseMoveEvent**实现单机、双击、拖拽的功能。拖拽的话借助**QMimeData**。

```cpp
void DicomImageLabel::mousePressEvent(QMouseEvent *e) {
    emit Signal_ImageClicked(this);
    drag_org_ = e->pos();
    QLabel::mousePressEvent(e);
}

void DicomImageLabel::mouseMoveEvent(QMouseEvent *e) {
    if ((e->buttons() & Qt::LeftButton) &&
            ((e->pos() - drag_org_).manhattanLength() > QApplication::startDragDistance())) {
        QDrag *drag = new QDrag(this);
        QMimeData *data = new QMimeData;
        data->setText(QString::number((qulonglong)m_series_));
        drag->setMimeData(data);
        drag->exec(Qt::CopyAction);
    }
    QLabel::mouseMoveEvent(e);
}

void DicomImageLabel::mouseDoubleClickEvent(QMouseEvent *e) {
    emit Signal_ImageDoubleClicked(this);
    QLabel::mouseDoubleClickEvent(e);
}

```

&emsp;&emsp; 边框变色改一下自定义**QLabel**的QPalette::WindowText。

```cpp
void DicomImageLabel::setHighlight(bool yes) {
    QPalette p = palette();
    if (yes) {
        p.setColor(QPalette::WindowText, Qt::green);
    } else {
        p.setColor(QPalette::WindowText, Qt::black);
    }
    setPalette(p);
}

```

## 2.3  右侧多视图显示
&emsp;&emsp;右侧跟左侧一样，一个**QWidget**，添加一个**QGridLayout（QBoxLayout::TopToBottom）**。这次不是自定义**QLabel**，而是自定义一个**QGraphicsView**。一样的重写**mousePressEvent**、**mouseDoubleClickEvent**，支持
单机选中（修改边框）  **Signal_ViewClicked**
双击放大（QGridLayout里所有widget全部 **setVisible(false)** ） **Singal_viewDoubleclicked**

```cpp
//---------------------------------------------------------
/**
 * @brief DicomImageView::mousePressEvent
 * 单击
 * @param event
 */
void DicomImageView::mousePressEvent(QMouseEvent *event) {
    emit Signal_ViewClicked(this);
    if (!m_series_) { // 没有 Series Instance
        QGraphicsView::mousePressEvent(event);
        return;
    }
    // 按键判断
    if (event->button() == Qt::RightButton) { // 鼠标右键
        MousePressHandle(event, mouse_right_state_.state, mouse_right_state_.type);
    } else if (event->button() == Qt::MiddleButton) { // 鼠标中键
        MousePressHandle(event, mouse_mid_state_.state, mouse_mid_state_.type);
    } else if (event->button() == Qt::LeftButton) { // 鼠标左键
        MousePressHandle(event, mouse_left_state_.state, mouse_left_state_.type);
    }
    prev_mouse_pos_ = event->pos();
    QGraphicsView::mousePressEvent(event);
}

//---------------------------------------------------------
/**
 * @brief DicomImageView::mouseDoubleClickEvent
 * 双击
 * @param event
 */
void DicomImageView::mouseDoubleClickEvent(QMouseEvent *event) {
    emit Singal_viewDoubleclicked(this);
    QGraphicsView::mouseDoubleClickEvent(event);
}
```

&emsp;&emsp;支持拖拽需要重写 **dragEnterEvent** 、**dragMoveEvent**、 **dropEvent** 、**dragLeaveEvent**

```cpp
//---------------------------------------------------------
/**
 * @brief DicomImageView::dragEnterEvent
 * 拖拽进入
 * @param e
 */
void DicomImageView::dragEnterEvent(QDragEnterEvent *e) {
    if (e->mimeData()->hasFormat("text/plain")) {
        e->acceptProposedAction();
    }
}

//---------------------------------------------------------
/**
 * @brief DicomImageView::dragMoveEvent
 * 拖拽移动
 * @param e
 */
void DicomImageView::dragMoveEvent(QDragMoveEvent *e) {
    if (e->mimeData()->hasFormat("text/plain")) {
        e->acceptProposedAction();
    }
}

//---------------------------------------------------------
/**
 * @brief DicomImageView::dropEvent
 * 拖拽松开
 * @param e
 */
void DicomImageView::dropEvent(QDropEvent *e) {
    if (e->mimeData()->hasFormat("text/plain")) {
        e->acceptProposedAction();
        SeriesInstance *s = qobject_cast<SeriesInstance *>(
                                (QObject *)(e->mimeData()->text().toULongLong()));
        if (s) {
            SetSeriesInstance(s);
            emit Signal_ViewClicked(this);
        }
        QGraphicsView::dropEvent(e);
    }
}

//---------------------------------------------------------
/**
 * @brief DicomImageView::dragLeaveEvent
 * 离开事件
 * @param e
 */
void DicomImageView::dragLeaveEvent(QDragLeaveEvent *) {
    return;
}
```









&emsp;&emsp;边框变色改一下自定义**QLabel**的QPalette::WindowText。

```cpp
//---------------------------------------------------------
/**
 * @brief DicomImageView::SetBorderHighlight
 * 设置View边框是否高亮
 * @param yes
 */
void DicomImageView::SetBorderHighlight(bool yes) {
    QPalette p = palette();
    if (yes) {
        p.setColor(QPalette::Text, Qt::magenta);
    } else {
        p.setColor(QPalette::Text, Qt::gray);
    }
    setPalette(p);
}
```