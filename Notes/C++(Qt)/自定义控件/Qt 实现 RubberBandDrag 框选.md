# Qt 实现 RubberBandDrag 框选


# 1 效果
&emsp;&emsp;**QGraphicsView** 框架提供一个默认交互 **RubberBandDrag** 。可以用了实现 **QGraphicsView**里的局部调整（放大、图像处理）、局部选中效果。

- 局部调整（根据选中范围内HU值设定整体床位窗宽）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919160636539.gif#pic_center)


- 局部选中

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200919160914619.gif#pic_center)

# 2 实现
&emsp;&emsp;自定义**QGraphicsView**，重写**mousePressEvent**、**mouseMoveEvent**、**mouseReleaseEvent**。这个框选操作无论是左键右键还是滚轮都可以。所以**MouseHandle**无论那个按键都可以。


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

/**
 * @brief DicomImageView::mouseReleaseEvent
 * 松开
 * @param event
 */
void DicomImageView::mouseReleaseEvent(QMouseEvent *event) {
    if (!m_series_) { // 没有 Series Instance
        QGraphicsView::mouseReleaseEvent(event);
        return;
    }
    // 按键判断
    if (event->button() == Qt::RightButton) { // 鼠标右键
        MouseReleaseHandle(event, mouse_right_state_.state);
    } else if (event->button() == Qt::MiddleButton) { // 鼠标中键
        MouseReleaseHandle(event, mouse_mid_state_.state);
    } else if (event->button() == Qt::LeftButton) { // 鼠标左键
        MouseReleaseHandle(event, mouse_left_state_.state);
    }
    QGraphicsView::mouseReleaseEvent(event);
}
```


```cpp
/**
 * @brief DicomImageView::MousePressHandle
 * @param event
 * @param state
 * @param type
 */
void DicomImageView::MousePressHandle(
    QMouseEvent *event,
    const CurrentState &state,
    const DicomImageView::DrawingType &type) {
    switch (state) {
        case ROIWindow:
            setDragMode(QGraphicsView::RubberBandDrag);
            break;
        default:
            break;
    }
}

/**
 * @brief DicomImageView::MouseMoveHandle
 * @param event
 * @param state
 */
void DicomImageView::MouseMoveHandle(
    QMouseEvent *event, const CurrentState &state) {
    QPointF sp = mapToScene(event->pos());// 鼠标坐标(映射到场景)
    QPointF ip = pixmap_item_->mapFromScene(sp);// 图片坐标
    switch (state) {        
        case ROIWindow: {
                QGraphicsView::mouseMoveEvent(event);
                break;
            }       
    }
}

/**
 * @brief DicomImageView::MouseReleaseHandle
 * @param state
 */
void DicomImageView::MouseReleaseHandle(QMouseEvent *, const CurrentState &state) {
    switch (state) {       
        case ROIWindow: {
                if (m_scene_->selectedItems().size() == 0) {
                    if (rubberBandRect().isValid()) {
                    	// 局部调整
                        m_series_->SetRoiWindow(
                            pixmap_item_->mapFromScene(
                                mapToScene(rubberBandRect())).boundingRect());
                        RefreshPixmap();
                    }
                    // 局部选中
                    foreach (AbstractPathItem *it, item_list_) {
                        if (!it->pixInfoUpdated()) {
                            it->recalPixInfo(
                                m_series_->GetCurrImageInstance(m_vtype)->GetDcmImage());
                            m_scene_->update();
                        }
                    }
                }
                break;
            }      
    }
}
```




