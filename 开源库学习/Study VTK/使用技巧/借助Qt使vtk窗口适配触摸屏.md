# 借助Qt使vtk窗口适配触摸屏心得


最近工作安排是适配vtk的触摸屏操作，看了一些源码，这里分享下自己目前使用的办法。  

<mark>本文就是自己的思路，仅供参考，可能完全错误。！！！  </mark> 如果有其他优雅的办法请指正。


---

感谢这位大佬的分享 [https://github.com/tsutenn/TsutennQVTKWidget](https://github.com/tsutenn/TsutennQVTKWidget)，理解了他的思路后重写了一下。

一个支持多指触控操作vtp的简单Demo（单指旋转、双指缩放、三指平移）：
~~[https://github.com/BeyondXinXin/study_vtk](https://github.com/BeyondXinXin/study_vtk)~~(仓库特别乱，整理好在开源)


根据自己测试和集成的过程，大概分了5块：

1. qvtk接收触摸事件
2. 自定义Rep的交互修改
3. vtkAbstractWidget及其子类交互修改
4. 图片、模型 "多点触控"交互支持（单指旋转、双指缩放、三指平移等）
5. 图片、模型 "按钮+单指" 交互支持（旋转、平移、缩放、窗宽窗位、透明度、复位等）





---

##  qvtk的触摸支持

Vtk源码里的**QVTKInteractorAdapter**其实已经增加了触摸屏操作判断，但是并未增加相应的**vtkCommand**。MT(多指触控)操作直接改为：  
Qt::TouchPointReleased  ==>  vtkCommand::LeftButtonReleaseEvent  
Qt::TouchPointPressed  ==>  vtkCommand::LeftButtonPressEvent  
Qt::TouchPointMoved  ==>  vtkCommand::MouseMoveEvent  
无语，官方要是直接增加触摸对应的**vtkCommand**和相机操作可以省很多事。  
  
为了适配触摸操作，我想的办法：  
实现一个**TouchInteractor**用来替代**QVTKInteractorAdapter**。用Qt的信号槽绑定Qt事件和**TouchInteractor**，解析后用vtk的observe分发给其他Rep和相机操作。  
为了实现异步，**TouchInteractor**需要维护Qt事件列队，利用**vtkWindowInteractor**的**RepeatingTimer**批量从列队中分发事件。  

步骤：

1. 开启 qvtkxxxwidget 的触摸屏支持（Qt::WA_AcceptTouchEvents、Qt::WA_WState_AcceptedTouchBeginEvent、Qt::WA_TouchPadAcceptSingleTouchEvents）
2. 拦截 qvtkxxxwidget 的事件过滤器，交给自定义的**Interactor**用来操作相机和操作Rep
3. 自定义的rep和自带的rep全部重写：增加picker范围（手指不好选中），绑定多指操作到原来的键盘、中键、滚轮等操作



用Qt的信号槽绑定Qt事件和**TouchInteractor**
```cpp
struct TsutennTask
{

    TsutennTask(int t, QList<QPointF> l)
    {
        this->type_ = t;
        this->points_ = l;
    }

    int type_ = -1;
    QList<QPointF> points_;
};

class SlotHelper : public QObject
{
    Q_OBJECT

private:
    QQueue<TsutennTask *> tasks;

public:
    SlotHelper(TouchRenderWidget *parent = Q_NULLPTR);
    ~SlotHelper() override;
    bool HasTask();
    TsutennTask *GetTask();

public slots:
    void TouchBeginEventProcessor(QList<QPointF> points);
    void TouchUpdateEventProcessor(QList<QPointF> points);
    void ToucEndEventProcessor();
    void MouseBeginEventProcessor(QPointF points);
    void MouseEndEventProcessor(QPointF startpos, QPointF endpos);
    void MouseDoubleClickEventProcessor(QPointF clickpos);
    void MouseMoveEventProcessor(QPointF movepos);
};


SlotHelper::SlotHelper(TouchRenderWidget *parent)
{
    void (TouchRenderWidget::*sgn1)(QList<QPointF>) = &TouchRenderWidget::SgnTouchBegin;
    void (TouchRenderWidget::*sgn2)(QList<QPointF>) = &TouchRenderWidget::SgnTouchUpdata;
    void (TouchRenderWidget::*sgn3)(void) = &TouchRenderWidget::SgnTouchEdn;
    void (TouchRenderWidget::*sgn4)(QPointF) = &TouchRenderWidget::SgnMouseBegin;
    void (TouchRenderWidget::*sgn5)(QPointF, QPointF) = &TouchRenderWidget::SgnMouseEnd;
    void (TouchRenderWidget::*sgn6)(QPointF) = &TouchRenderWidget::SgnMouseDoubleClick;
    void (TouchRenderWidget::*sgn7)(QPointF) = &TouchRenderWidget::SgnMouseMove;

    void (SlotHelper::*slot1)(QList<QPointF>) = &SlotHelper::TouchBeginEventProcessor;
    void (SlotHelper::*slot2)(QList<QPointF>) = &SlotHelper::TouchUpdateEventProcessor;
    void (SlotHelper::*slot3)(void) = &SlotHelper::ToucEndEventProcessor;
    void (SlotHelper::*slot4)(QPointF) = &SlotHelper::MouseBeginEventProcessor;
    void (SlotHelper::*slot5)(QPointF, QPointF) = &SlotHelper::MouseEndEventProcessor;
    void (SlotHelper::*slot6)(QPointF) = &SlotHelper::MouseDoubleClickEventProcessor;
    void (SlotHelper::*slot7)(QPointF) = &SlotHelper::MouseMoveEventProcessor;

    QObject::connect(parent, sgn1, this, slot1);
    QObject::connect(parent, sgn2, this, slot2);
    QObject::connect(parent, sgn3, this, slot3);
    QObject::connect(parent, sgn4, this, slot4);
    QObject::connect(parent, sgn5, this, slot5);
    QObject::connect(parent, sgn6, this, slot6);
    QObject::connect(parent, sgn7, this, slot7);
}

SlotHelper::~SlotHelper()
{
    QObject::disconnect(this);
}

bool :SlotHelper::HasTask()
{
    return !this->tasks.isEmpty();
}

TsutennTask *SlotHelper::GetTask()
{
    return this->tasks.dequeue();
}
```


重新分发的**TouchInteractor**

```cpp
class TouchRenderCallback : public vtkCommand
{
public:
    enum State
    {
        kNone,
        kRotate,
        kDolly,
        kPan,
        KTransparency,
        kWindowLevel,
    };

public:
    static TouchRenderCallback *New(TouchRenderWidget *parent = Q_NULLPTR);
    vtkTypeMacro(TouchRenderCallback, vtkCommand);
    void SetParent(RenderFrame *parent);
    void Execute(vtkObject *caller, unsigned long vtkNotUsed(eventId), void *vtkNotUsed(callData)) override;

    void SetState(const State &state);

    vtkSmartPointer<vtkRenderer> render_;
    vtkSmartPointer<vtkRenderWindow> ren_win_;

    void SetVolume(const std::shared_ptr<VolumeRepresentation> &vol_repr);

private:
    virtual void TouchBeginExecute(QList<QPointF>);
    virtual void TouchUpdateExecute(QList<QPointF>);
    virtual void TouchEndExecute(QList<QPointF>);
    virtual void MouseBeginExecute(QList<QPointF>);
    virtual void MouseEndExecute(QList<QPointF>);
    virtual void MouseDoubleClickExecute(QList<QPointF>);
    virtual void MouseMoveExecute(QList<QPointF>);

private:
    void CamRotate(int delta[], const double &rotation_angle = 0.2);
    void CamSecurityDolly(int delta[], double factor = 10);
    void CamPan(const QPoint &pos1, const QPoint &pos2);

    void ShiftWindow(int delta[]);

private:
    std::shared_ptr<VolumeRepresentation> vol_repr_;
    SlotHelper *callback_slot_;
    RenderFrame *parent_;

    State state_ { kNone };
    QList<QPointF> last_mouse_;
    QList<QPointF> last_touch_;

    qreal zoom_para_;
};

void TouchRenderCallback::Execute(
  vtkObject *vtkNotUsed(caller), unsigned long vtkNotUsed(eventId), void *vtkNotUsed(callData))
{
    while (this->callback_slot_->HasTask()) {
        TsutennTask *task = this->callback_slot_->GetTask();
        switch (task->type_) {
        case 0:
            qDebug() << "Touch begin";
            TouchBeginExecute(task->points_);
            break;
        case 1:
            TouchUpdateExecute(task->points_);
            break;
        case 2:
            qDebug() << "Touch End";
            TouchEndExecute(task->points_);
            break;
        case 3:
            qDebug() << "Mouse press";
            MouseBeginExecute(task->points_);
            break;
        case 4:
            qDebug() << "Mouse release";
            MouseEndExecute(task->points_);
            break;
        case 5:
            qDebug() << "Mouse double click";
            MouseDoubleClickExecute(task->points_);
            break;
        case 6:
            MouseMoveExecute(task->points_);
            break;
        }
    }
    ren_win_->Render();
}

```

拦截的 qvtkxxxwidget

```cpp

bool TouchRenderWidget::eventFilter(QObject *object, QEvent *event)
{
    if (!use_touch_callback_) {
        if (event->type() == QEvent::Wheel) {
            return true;
        }
        return RenderWidget::eventFilter(object, event);
    }

    if (event->type() == QEvent::TouchBegin) {
        return TouchBeginEventProcess(event);
    } else if (event->type() == QEvent::TouchUpdate) {
        return TouchUpdateEventProcess(event);
    } else if (event->type() == QEvent::TouchEnd) {
        return TouchEndEventProcess(event);
    } else if (event->type() == QEvent::MouseButtonPress) {
        return MousePressEventProcess(event);
    } else if (event->type() == QEvent::MouseButtonRelease) {
        return MouseReleaseEventProcess(event);
    } else if (event->type() == QEvent::MouseButtonDblClick) {
        return MouseDoubleClickEventProcess(event);
    } else if (event->type() == QEvent::MouseMove) {
        return MouseMoveEventProcess(event);
    } else if (event->type() == QEvent::Wheel) {
        return true;
    }

    return RenderWidget::eventFilter(object, event);
}

bool TouchRenderWidget::TouchBeginEventProcess(QEvent *event)
{
    QTouchEvent *touchEvent = static_cast<QTouchEvent *>(event);
    touch_points_ = touchEvent->touchPoints();
    QList<QPointF> points;
    for (int i = 0; i < touch_points_.count(); i++) {
        points.append(touch_points_.at(i).pos());
    }
    emit SgnTouchBegin(points);
    return true;
}

bool TouchRenderWidget::TouchUpdateEventProcess(QEvent *event)
{
    QTouchEvent *touchEvent = static_cast<QTouchEvent *>(event);
    touch_points_ = touchEvent->touchPoints();
    QList<QPointF> points;
    for (int i = 0; i < touch_points_.count(); i++) {
        points.append(touch_points_.at(i).pos());
    }
    emit SgnTouchUpdata(points);
    return true;
}

bool TouchRenderWidget::TouchEndEventProcess(QEvent *)
{
    touch_points_.clear();
    SgnTouchEdn();
    return true;
}

bool TouchRenderWidget::MousePressEventProcess(QEvent *event)
{

    QMouseEvent *mouse_event = static_cast<QMouseEvent *>(event);
    if (mouse_event->buttons().testFlag(Qt::MidButton)
        || mouse_event->buttons().testFlag(Qt::RightButton)) {
        return true;
    }

    if (touch_points_.isEmpty()) {
        QMouseEvent *mouse_event = static_cast<QMouseEvent *>(event);
        start_pos_ = mouse_event->pos();

        emit SgnMouseBegin(start_pos_);
        process_mouse_event_ = true;
    }
    return true;
}

bool TouchRenderWidget::MouseReleaseEventProcess(QEvent *event)
{
    if (process_mouse_event_) {
        process_mouse_event_ = false;
        QMouseEvent *mouse_event = static_cast<QMouseEvent *>(event);
        end_pos_ = mouse_event->pos();
        emit SgnMouseEnd(start_pos_, end_pos_);
    }
    return true;
}
bool rtx::TouchRenderWidget::MouseDoubleClickEventProcess(QEvent *event)
{
    QMouseEvent *mouse_event = static_cast<QMouseEvent *>(event);
    QPointF Pos = mouse_event->pos();
    emit SgnMouseDoubleClick(Pos);
    return true;
}

bool rtx::TouchRenderWidget::MouseMoveEventProcess(QEvent *event)
{
    if (process_mouse_event_) {
        QMouseEvent *mouse_event = static_cast<QMouseEvent *>(event);
        QPointF pos = mouse_event->pos();
        emit SgnMouseMove(pos);
    }
    return true;
}


```



##  自定义Rep的交互修改
##  vtkAbstractWidget及其子类交互修改

无论是自定义**Rep**还是**vtkAbstractWidget**，基本上所有用到的vtk类全部需要重写。  
目前只改了一部分，前路慢慢。举个例子：  

**vtkPropPicker** 需要逐步扩大选择范围，直到找到目标Prop。还要增加**vtkPropCollection**的维护。


```cpp
class ForkePropPicker : public vtkPropPicker
{
public:
    static ForkePropPicker *New();
    vtkTypeMacro(ForkePropPicker, vtkAbstractPropPicker);
    int Pick(double selectionX, double selectionY, double selectionZ,
             vtkRenderer *renderer) override;

    int PickProp(double selectionX, double selectionY, vtkRenderer *renderer,
                 vtkPropCollection *pickfrom);
};
```

```cpp
vtkStandardNewMacro(ForkePropPicker);
int ForkePropPicker::Pick(double selectionX, double selectionY, double, vtkRenderer *renderer)
{
    this->Initialize();
    double offset = 5.0;
    int number_enlarge = 50;

    while (!this->Path && number_enlarge > 1) {
        //  初始化拣选流程
        offset += 1.0;
        number_enlarge--;
        this->Initialize();
        this->Renderer = renderer;
        this->SelectionPoint[0] = selectionX;
        this->SelectionPoint[1] = selectionY;
        this->SelectionPoint[2] = 0;

        // 如果已定义，则调用开始拾取方法
        this->InvokeEvent(vtkCommand::StartPickEvent, nullptr);

        // 让渲染器执行硬件拾取
        this->SetPath(renderer->PickPropFrom(selectionX - offset, selectionY - offset,
                                             selectionX + offset, selectionY + offset, this->PickFromProps));

        // 如果存在拾取，则查找拾取的世界x、y、z，并调用其拾取方法。
        if (this->Path) {
            this->WorldPointPicker->Pick(selectionX, selectionY, 0, renderer);
            this->WorldPointPicker->GetPickPosition(this->PickPosition);
            this->Path->GetLastNode()->GetViewProp()->Pick();
            this->InvokeEvent(vtkCommand::PickEvent, nullptr);
        }
        this->InvokeEvent(vtkCommand::EndPickEvent, nullptr);
    }
    // 对拾取的道具调用Pick，并返回1表示成功
    if (this->Path) {
        return 1;
    } else {
        return 0;
    }
}

int ForkePropPicker::PickProp(double selectionX, double selectionY, vtkRenderer *renderer, vtkPropCollection *pickfrom)
{
    this->PickFromProps = pickfrom;
    int ret = this->Pick(selectionX, selectionY, 0, renderer);
    this->PickFromProps = nullptr;
    return ret;
}

```





##  图片、模型 "多点触控"交互支持（单指旋转、双指缩放、三指平移等）

这个就是修改相机操作，目前判断方法比较简单。双指上下、左右滑动等操作可以在这里增加判断


```cpp

void TouchRenderCallback::TouchUpdateExecute(QList<QPointF> points)
{

    if (kNone == state_) {
        return;
    }

    if (points.size() == 1 || last_touch_.size() != points.size()) {
        auto tmp = (points.at(0) - last_touch_.at(0)).toPoint();
        int delta[2] = { tmp.x(), -tmp.y() };

        if (kRotate == state_) {
            CamRotate(delta);
        } else if (kDolly == state_) {
            CamSecurityDolly(delta);
        } else if (kPan == state_) {
            CamPan(last_touch_.at(0).toPoint(), points.at(0).toPoint());
        } else if (KTransparency == state_) {
            ShiftWindow(delta);
        } else if (kWindowLevel == state_) {
            int deltax_, deltay_;
            deltax_ = delta[0];
            deltay_ = delta[1];
            parent_->SgnWindowLevelChange(deltax_, deltay_);
        }
    } else if (points.size() == 2) {
        auto tmp = (points.at(0) - last_touch_.at(0)).toPoint();
        int delta[2] = { tmp.x(), -tmp.y() };
        CamSecurityDolly(delta);
    } else if (points.size() == 3) {
        CamPan(last_touch_.at(0).toPoint(), points.at(0).toPoint());
    } else if (points.size() == 4) {
        auto tmp = (points.at(0) - last_touch_.at(0)).toPoint();
        int delta[2] = { tmp.x(), -tmp.y() };
        ShiftWindow(delta);
    }

    last_touch_ = points;
}
```

关于重写相机操作直接看一下vtk自带交互的实现，照着改一下。比如缩放：

```cpp
void TouchRenderCallback::CamSecurityDolly(int delta[], double factor)
{
    int dy = delta[1];
    double *center = this->render_->GetCenter();
    double dyf = factor * dy / center[1];
    dyf = pow(1.1, dyf);

    vtkCamera *camera = this->render_->GetActiveCamera();
    if (camera->GetParallelProjection()) {
        auto par = camera->GetParallelScale();
        if (par + 1e-6 < 10.0 && dyf + 1e-6 > 1.0) {
            return;
        } else if (par - 1e-6 > 200.010 && dyf + 1e-6 < 1.0) {
            return;
        }
        camera->SetParallelScale(camera->GetParallelScale() / dyf);
    } else {
        auto dis = camera->GetDistance();
        if (dis + 1e-6 < 100.0 && dyf + 1e-6 > 1.0) {
            return;
        } else if (dis - 1e-6 > 3000.010 && dyf + 1e-6 < 1.0) {
            return;
        }
        camera->Zoom(dyf);
    }
    if (this->render_->GetLightFollowCamera()) {
        this->render_->UpdateLightsGeometryToFollowCamera();
    }
    render_->Render();
}
```



##  图片、模型 "按钮+单指" 交互支持（旋转、平移、缩放、窗宽窗位、透明度、复位等）

搞几个互斥按钮，单指实现不同的调整

```cpp

void RenderFrame::AddTouchButton(FrameState frame_state)
{
    auto FunGenBtn = [&](const QString &str, const QString &objstr, const State &state, const bool &checkable = false) {
        QPushButton *btn = new QPushButton(widget_);
        btn->setFixedSize(100, 100);
        btn->setText(str);
        btn->setObjectName(objstr);
        btn->setProperty("CustomStyle", "4view");
        btn->setProperty("attribute", state);
        btn->setCheckable(checkable);
        connect(btn, &QPushButton::clicked, this, [=]() {
            BtnClicked(State(QObject::sender()->property("attribute").toInt()));
        });
        return btn;
    };

    if (frame_state == Frame_3d) {
        btn_group_->addButton(FunGenBtn(u8"旋转", u8"route", I_Rotate, true), 0);
        btn_group_->addButton(FunGenBtn(u8"缩放", u8"dolly", I_Dolly, true), 1);
        btn_group_->addButton(FunGenBtn(u8"平移", u8"Pan", I_Pan, true), 2);
        btn_group_->addButton(FunGenBtn(u8"透明", u8"Transparency", I_Transparency, true), 3);

        btn_group_->addButton(FunGenBtn(u8"相机复位", u8"Transparency", I_CamReset), 4);
        btn_group_->addButton(FunGenBtn(u8"切换颜色", u8"ChangeVrClor", W_ChangeVrClor), 5);
        btn_group_->addButton(FunGenBtn(u8"渲染模式", u8"ChangeVrModel", W_ChangeVrModel), 6);
        btn_group_->addButton(FunGenBtn(u8"透明复位", u8"TranReset", W_TranReset), 7);

        widget_->SetUsrTouchCallback(true);
    } else if (frame_state == Frame_2d) {
        btn_group_->addButton(FunGenBtn(u8"位置", u8"Pos", I_Pos, true), 0);
        btn_group_->addButton(FunGenBtn(u8"序列", u8"Order", I_Order, true), 1);
        btn_group_->addButton(FunGenBtn(u8"缩放", u8"dolly", I_Dolly, true), 2);
        btn_group_->addButton(FunGenBtn(u8"平移", u8"Pan", I_Pan, true), 3);
        btn_group_->addButton(FunGenBtn(u8"窗宽位", u8"WindowLevel", I_WindowLevel, true), 4);

        btn_group_->addButton(FunGenBtn(u8"相机复位", u8"Transparency", I_CamReset), 5);
        btn_group_->addButton(FunGenBtn(u8"窗宽位复位", u8"WLReset", W_WLReset), 6);

        widget_->SetUsrTouchCallback(false);
    }
    btn_group_->button(0)->click();
}

void RenderFrame::BtnClicked(State state)
{
    switch (state) {
    case I_None: {
        iren_refresh_->SetState(TouchRenderCallback::kNone);
        widget_->SetUsrTouchCallback(true);
    } break;
    case I_Rotate: {
        iren_refresh_->SetState(TouchRenderCallback::kRotate);
        widget_->SetUsrTouchCallback(true);
    } break;
    case I_Dolly: {
        iren_refresh_->SetState(TouchRenderCallback::kDolly);
        widget_->SetUsrTouchCallback(true);
    } break;
    case I_Pan: {
        iren_refresh_->SetState(TouchRenderCallback::kPan);
        widget_->SetUsrTouchCallback(true);
    } break;
    case I_Transparency: {
        iren_refresh_->SetState(TouchRenderCallback::KTransparency);
        widget_->SetUsrTouchCallback(true);
    } break;
    case I_WindowLevel: {
        iren_refresh_->SetState(TouchRenderCallback::kWindowLevel);
        widget_->SetUsrTouchCallback(true);
    } break;

    case I_Pos: {
        widget_->SetUsrTouchCallback(false);
        emit SgnFrameStateChange(state);
    } break;
    case I_Order: {
        widget_->SetUsrTouchCallback(false);
        emit SgnFrameStateChange(state);
    } break;

    case I_CamReset:
    case W_WLReset:
    case W_TranReset:
    case W_ChangeVrClor:
    case W_ChangeVrModel: {
        emit SgnFrameStateChange(state);
    } break;
    }
}

void Interactor3DAction::Move(InteractEvent *e, bool self)
{
    interce_event_ = e;
    int tem_delta[2] = { (e->Position() - e->LastPosition())[0], (e->Position() - e->LastPosition())[1] };
    switch (this->state_) {
    case kRotate:
        CamRotate(tem_delta);
        if (self) {
            Invoke<Rotate>();
        }
        break;
    case kSpin:
        track_ball_->Spin(e->Position(), e->LastPosition());
        if (self) {
            Invoke<Spin>();
        }
        break;
    case kDolly:
        track_ball_->SecurityDolly(e->Position() - e->LastPosition(), motion_factor_);
        if (self) {
            Invoke<Dolly>();
        }
        break;

    case KWheelForward:
        track_ball_->SecurityDolly(pow(1.1, motion_factor_ * 0.2));
        if (self) {
            Invoke<WheelForward>();
        }
        break;
    case KWheelBackward:
        track_ball_->SecurityDolly(pow(1.1, -motion_factor_ * 0.2));
        if (self) {
            Invoke<WheelBackward>();
        }
        break;
    case kPan:
        track_ball_->Pan(e->Position(), e->LastPosition());
        if (self) {
            Invoke<Pan>();
        }
        break;
    case kWindowLevel:
        ShiftWindow(e->Renderer(), e->Position() - e->LastPosition(), motion_factor_);
        if (self) {
            Invoke<WindowLevel>();
        }
        break;
    default:
        return;
    }
    e->RequestRender();
}

```



