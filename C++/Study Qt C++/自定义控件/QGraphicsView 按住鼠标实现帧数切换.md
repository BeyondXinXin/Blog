# QGraphicsView 按住鼠标实现帧数切换

# 1 效果
&emsp;&emsp;**QGraphicsView** 框架提显示序列图片，前后帧切换时一般是鼠标滚轮前后滚动，小蚂蚁有一个鼠标移动实现当切换前帧功能，这里仿照实现下。

&emsp;&emsp;Gif前几秒是鼠标滚轮滚动，后边出现光圈是鼠标按下移动。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919162523530.gif#pic_center)


# 2 实现
&emsp;&emsp;自定义**QGraphicsView**，重写**mousePressEvent**、**mouseMoveEvent**、**mouseReleaseEvent**。这个按住拖动Slice操作无论是左键右键还是滚轮都可以。所以用**MouseHandle**封装了下，无论那个按键都可以。


&emsp;&emsp;**mousePressEvent** 和  **mouseMoveEvent** 需要记住上一次鼠标位置
**QPoint prev_mouse_pos_;// 上一个鼠标位置** ；每次**mouseMoveEvent**时，判断前后两个鼠标位置的Y轴变化，决定前后帧移动。

```cpp
/**
 * @brief DicomImageView::mousePressEvent
 * 单机
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

/**
 * @brief DicomImageView::mouseMoveEvent
 * 移动
 * @param event
 */
void DicomImageView::mouseMoveEvent(QMouseEvent *event) {
    if (!m_series_) { // 没有 Series Instance
        QGraphicsView::mouseMoveEvent(event);
        return;
    }
    // 显示 当前位置和灰度
    if (pos_value_item_) {
        PosValueShow(event);
    }
    // 按键判断
    if (event->buttons() & Qt::RightButton) { // 鼠标右键拖动
        MouseMoveHandle(event, mouse_right_state_.state);
    } else if (event->buttons() & Qt::MiddleButton) { // 鼠标中键拖动
        MouseMoveHandle(event, mouse_mid_state_.state);
    } else if (event->buttons() & Qt::LeftButton) { // 鼠标左键拖动
        MouseMoveHandle(event, mouse_left_state_.state);
    } else {
        QGraphicsView::mouseMoveEvent(event);
    }
    prev_mouse_pos_ = event->pos();
}
```


```cpp

/**
 * @brief DicomImageView::MouseMoveHandle
 * @param event
 * @param state
 */
void DicomImageView::MouseMoveHandle(
    QMouseEvent *event, const CurrentState &state) {
    switch (state) {
        case Slicing: {
                setDragMode(QGraphicsView::NoDrag);
                int frames = event->pos().y() - prev_mouse_pos_.y();
                if (frames > 0) {
                    m_series_->NextFrame(m_vtype);
                } else {
                    m_series_->PrevFrame(m_vtype);
                }
                RefreshPixmap();
                UpdateAnnotations();
                break;
            }       
    }
}



```