&emsp;&emsp;做**kissDicomViewer**需要影像自动播放。记录下每天学习内容

项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  


---

# 利用QTimer实现 Dicom 播放功能

## 1. 效果
![
](https://img-blog.csdnimg.cn/20210123220734132.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210123220845419.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

&emsp;&emsp;支持自动循环播放、快进、快退、播放速度调整、到第一针/最后一针。
  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210123220612861.gif)




&emsp;&emsp;界面小于一定宽度，自动暂停并隐藏播放栏。
  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210123220619714.gif)




## 2. 实现

&emsp;&emsp;双向绑定  进度条值得变化 <==> `DICOM` 显示帧变化  。 利用`QTimer`的定时发送信号功能，调整进度条值以实现播放效果。
```cpp
void VideoControlView::SlotSpeedTimeOut() {
    if (QObject::sender() == play_speed_) {
        ui->progress_slider->setValue(time_ + 1);
        if(time_ >= total_time_ - 1) {
            ui->progress_slider->setValue(0);
        }
    } else if (QObject::sender() == next_speed_) {
        ui->progress_slider->setValue(time_ + 1);
        if(time_ >= total_time_ - 1) {
            this->StopMovie();
        }
    } else if (QObject::sender() == prev_speed_) {
        ui->progress_slider->setValue(time_ - 1);
        if(time_ <= 0) {
            this->StopMovie();
        }
    }
}

void VideoControlView::SlotValueChangedIn(int value) {
    play_speed_->setInterval(1000 / value);
    next_speed_->setInterval(400 / value);
    prev_speed_->setInterval(400 / value);
}

void VideoControlView::SlotPlusMinusButtonClicked() {
    if (QObject::sender() == ui->plus_button) {
        ui->frame_box->setValue(ui->frame_box->value() + 1);
    } else if (QObject::sender() == ui->minus_button) {
        ui->frame_box->setValue(ui->frame_box->value() - 1);
    }
}
```
&ensp;&ensp;修改父窗口的`resizeEvent`实现位置移动和隐藏
```cpp
//-------------------------------------------------------
/**
 * @brief DicomImageView::resizeEvent
 * 界面重新调整大小
 * @param event
 */
void DicomImageView::resizeEvent(QResizeEvent *event) {
    QGraphicsView::resizeEvent(event);
    if (!manual_zoom_) {
        this->SetOperation(FillViewport);
    }
    ResizePixmapItem();
    RepositionAuxItems();
    UpdataShowAnnotations(); // 注释
    UpdataShowMeasurements(); // 标注
    // 视频播放
    QSize size = this->size();
    if(video_controlview_->width() < size.width()) {
        video_controlview_->move(size.width() / 2 - video_controlview_->width() / 2,
                                 size.height() - video_controlview_->height() - 5);
    } else {
        video_controlview_->move(0, size.height() + 20);
        video_controlview_->StopMovie();
    }
}

```


&ensp;&ensp;播放/暂停按钮切换的显示利用`Qt`的动态属性实现。

```css
QPushButton[pause='true']{
    background:transparent;
    border:none;
    border-image:url(:/png/video/play01.png);
}
QPushButton::hover[pause='true']{
    border-image:url(:/png/video/play02.png);
}
QPushButton[pause='false']{
    background:transparent;
    border:none;
    border-image:url(:/png/video/pause01.png);
}
QPushButton::hover[pause='false']{
    border-image:url(:/png/video/pause01.png);
}
```

```cpp
void VideoControlView::SlotControlButtonClicked() {
    if (total_time_ <= 0) {
        return;
    }
    bool polish = false;
    if (QObject::sender() == ui->next_button) {
        ui->progress_slider->setValue(total_time_);
    } else if (QObject::sender() == ui->next_fast_button) {
        ui->play_button->setProperty("pause", "false");
        polish = true;
        this->SetTimerStop();
        next_speed_->start();
    } else if (QObject::sender() == ui->prev_button) {
        ui->progress_slider->setValue(0);
    } else if (QObject::sender() == ui->prev_fast_button) {
        ui->play_button->setProperty("pause", "false");
        polish = true;
        this->SetTimerStop();
        prev_speed_->start();
    } else if (QObject::sender() == ui->play_button) {
        if (play_speed_->isActive() ||
                next_speed_->isActive() ||
                prev_speed_->isActive()) {
            ui->play_button->setProperty("pause", "true");
            polish = true;
            this->SetTimerStop();
        } else {
            if (time_ <= 0 || time_ >= total_time_) {
                ui->progress_slider->setValue(0);
            }
            ui->play_button->setProperty("pause", "false");
            polish = true;
            play_speed_->start();
        }
    }
    if(polish) {
        ui->play_button->style()->unpolish(ui->play_button);
        ui->play_button->style()->polish(ui->play_button);
        ui->play_button->update();
    }
}
```