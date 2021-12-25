# 【VTK】可拖动的坐标轴MovableAxesWidget


一直想从头写一个`vtkWidget`来了解vtk。这两天晚上比较空，正好自己选一个交互实现下。

vtk官网有一个可以拖动轴的例子[MovableAxes](https://kitware.github.io/vtk-examples/site/Cxx/Visualization/MovableAxes/)。可惜`AxesActor`继承自`Prop3D`而非`Widget`无法交互，并且例子只能绕相机方向旋转平移无法绕指定轴。就把这个例子改成`vtkWidget`好了。

自己实现效果

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/vtk/widget/%E3%80%90vtk%E3%80%91%E5%8F%AF%E6%8B%96%E5%8A%A8%E7%9A%84%E5%9D%90%E6%A0%87%E8%BD%B4movableaxeswidget.md/432592122211263.gif)

官网案例

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/vtk/widget/%E3%80%90vtk%E3%80%91%E5%8F%AF%E6%8B%96%E5%8A%A8%E7%9A%84%E5%9D%90%E6%A0%87%E8%BD%B4movableaxeswidget.md/304214714217556.gif =400x)

仿照RoboDK交互方式，很多三维软件都是这种交互。印象中原来在贴吧看到过vtk实现这种交互，也许vtk有现成的，我这次找的时候没找到。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/vtk/widget/%E3%80%90vtk%E3%80%91%E5%8F%AF%E6%8B%96%E5%8A%A8%E7%9A%84%E5%9D%90%E6%A0%87%E8%BD%B4movableaxeswidget.md/488025914237722.gif =400x)






---

记录下实现`vtkWidget`和`vtkWidgetRep`遇到的问题。


## 1 素材

轴用`ConeSource`+`LineSource`，平面用`PlaneSource`，旋转自己实现一个`Source`（读stl），文字用`VectorText`。每个轴、平面、文字公用一个，原点单独设置。

## 2 Widget常用接口实现

需要在`Rep`中根据自己定义，实现这几个函数，以便vtk渲染时统一处理不同的`Widget`。

```cpp
    double *GetBounds() VTK_SIZEHINT(6) override;
    void GetActors(vtkPropCollection *pc) override;
    void ReleaseGraphicsResources(vtkWindow *) override;
    int RenderOpaqueGeometry(vtkViewport *) override;
    int RenderTranslucentPolygonalGeometry(vtkViewport *) override;
```

## 3 不同组件的选择

通过实现`void RegisterPickers() override;`让vtk判断捕捉那些`actor`。

```cpp
    // 捕捉
    this->picker_ = vtkCellPicker::New();
    this->picker_->SetTolerance(0.004); // 选择范围，window对角线百分比
    for (int i = 0; i < 3; i++) {
        this->picker_->AddPickList(this->axis_actors_[i]);
        this->picker_->AddPickList(this->plane_actors_[i]);
        this->picker_->AddPickList(this->rotate_actors_[i]);
    }
    this->picker_->PickFromListOn();

void MovableAxesRepresentation::SetLockPicker(vtkTypeBool lock)
{
    if (lock == this->lock_camera_) {
        return;
    }
    if (lock) {
        for (int i = 0; i < 3; i++) {
            this->picker_->DeletePickList(this->axis_actors_[i]);
            this->picker_->DeletePickList(this->plane_actors_[i]);
            this->picker_->DeletePickList(this->rotate_actors_[i]);
        }
    } else {
        for (int i = 0; i < 3; i++) {
            this->picker_->AddPickList(this->axis_actors_[i]);
            this->picker_->AddPickList(this->plane_actors_[i]);
            this->picker_->AddPickList(this->rotate_actors_[i]);
        }
    }
    this->lock_camera_ = lock;
    this->Modified();
}

void MovableAxesRepresentation::RegisterPickers()
{
    vtkPickingManager *pm = this->GetPickingManager();
    if (!pm) {
        return;
    }
    pm->AddPicker(this->picker_, this);
}
```

## 4 Widget在屏幕上尺寸始终固定

`vtkWidgetRepresentation`提供了`HandleSize`和`SizeHandlesInPixels`用来确保`Handle`占固定像素，可以直接借助这个接口实现所有尺寸固定。

```cpp
    this->HandleSize = 5.0;

void MovableAxesRepresentation::SizeHandles()
{
    double radius = this->vtkWidgetRepresentation::SizeHandlesInPixels(2, this->origian_sphere_->GetCenter());
    for (int i = 0; i < 3; i++) {
        this->axis_cones_[i]->SetHeight(3 * radius);
        this->axis_cones_[i]->SetRadius(radius);
        this->rotate_sources_[i]->SetRadius(radius);
        this->label_actors_[i]->SetScale(radius * 3, radius * 3, radius * 3);
    }
    this->origian_sphere_->SetRadius(radius);

    axis_offset_ = radius * 5 * default_axis_offset_;
    plane_offset_ = radius * 5 * default_plane_offset_;
    plane_wide_ = radius * 5 * default_plane_wide_;
    rotate_offset_ = radius * 5 * default_rotate_offset_;
}
```

## 5 降低无效刷新

`Rep`下不调用`this->Modified();`不重新计算`actor、source`

```cpp
void MovableAxesRepresentation::BuildRepresentation()
{
    // 刷新Rep
    if (!this->Renderer || !this->Renderer->GetRenderWindow()) {
        return;
    }

    vtkInformation *info = this->GetPropertyKeys();
    for (int i = 0; i < 3; i++) {
        this->axis_actors_[i]->SetPropertyKeys(info);
        this->plane_actors_[i]->SetPropertyKeys(info);
        this->rotate_actors_[i]->SetPropertyKeys(info);
    }
    this->origian_actor_->SetPropertyKeys(info);

    // actor、source重新计算
    if (this->GetMTime() > this->BuildTime
        || this->Renderer->GetRenderWindow()->GetMTime() > this->BuildTime) {
        ...
     }

    // 重建和renderwindow更改时调整控制柄的大小
    if (this->GetMTime() > this->BuildTime
        || this->Renderer->GetRenderWindow()->GetMTime() > this->BuildTime) {
        this->SizeHandles();
        this->BuildTime.Modified();
    }
}
```

## 6 鼠标移入高亮，按下切换光标

`Widget`订阅事件、修改鼠标样式

```cpp
    this->CallbackMapper->SetCallbackMethod(vtkCommand::LeftButtonPressEvent, vtkWidgetEvent::Select,
                                            this, MovableAxesWidget::SelectAction);

    this->CallbackMapper->SetCallbackMethod(vtkCommand::LeftButtonReleaseEvent,
                                            vtkWidgetEvent::EndSelect, this, MovableAxesWidget::EndSelectAction);

    this->CallbackMapper->SetCallbackMethod(vtkCommand::MouseMoveEvent,
                                            vtkWidgetEvent::Move, this, MovableAxesWidget::MoveAction);

int MovableAxesWidget::UpdateCursorShape(int state)
{
    // 更新光标
    if (this->ManagesCursor) {
        switch (state) {
        case MovableAxesRepresentation::MoveAxisX:
        case MovableAxesRepresentation::MoveAxisY:
        case MovableAxesRepresentation::MoveAxisZ:
        case MovableAxesRepresentation::MovePlanX:
        case MovableAxesRepresentation::MovePlanY:
        case MovableAxesRepresentation::MovePlanZ:
        case MovableAxesRepresentation::RotateAxisX:
        case MovableAxesRepresentation::RotateAxisY:
        case MovableAxesRepresentation::RotateAxisZ: {
            return this->RequestCursorShape(VTK_CURSOR_SIZEALL);
        }
        default:
            return this->RequestCursorShape(VTK_CURSOR_DEFAULT);
        }
    }

    return 0;
}
```

`Rep`实现交互、actor样式切换

```cpp
    int ComputeInteractionState(int X, int Y, int modify = 0) override;
    void StartWidgetInteraction(double eventPos[2]) override;
    void WidgetInteraction(double newEventPos[2]) override;
    void EndWidgetInteraction(double newEventPos[2]) override;

void MovableAxesRepresentation::HighlightNormal(const int &state)
{
    // 根据交互状态，修改属性
    for (int i = 0; i < 3; i++) {
        this->axis_actors_[i]->SetProperty(this->property_[i]);
        this->plane_actors_[i]->SetProperty(this->property_[i]);
        this->rotate_actors_[i]->SetProperty(this->property_[i]);
    }
    switch (state) {
    case MoveAxisX:
        this->axis_actors_[0]->SetProperty(this->selected_property_[0]);
        break;
    case MoveAxisY:
        this->axis_actors_[1]->SetProperty(this->selected_property_[1]);
        break;
    case MoveAxisZ:
        this->axis_actors_[2]->SetProperty(this->selected_property_[2]);
        break;
    case MovePlanX:
        this->plane_actors_[0]->SetProperty(this->selected_property_[0]);
        break;
    case MovePlanY:
        this->plane_actors_[1]->SetProperty(this->selected_property_[1]);
        break;
    case MovePlanZ:
        this->plane_actors_[2]->SetProperty(this->selected_property_[2]);
        break;
    case RotateAxisX:
        this->rotate_actors_[0]->SetProperty(this->selected_property_[0]);
        break;
    case RotateAxisY:
        this->rotate_actors_[1]->SetProperty(this->selected_property_[1]);
        break;
    case RotateAxisZ:
        this->rotate_actors_[2]->SetProperty(this->selected_property_[2]);
        break;
    default:
        break;
    }
}
```

## 7 交互相关坐标计算


1. 沿着轴平移

获取鼠标运动矢量，跟坐标轴点乘结果就是要平移距离

```cpp
void MovableAxesRepresentation::MoveAxis(const int &state, double *p1, double *p2)
{

    vtkNew<vtkTransform> posture_transform_;
    posture_transform_->SetMatrix(posture_);

    double v[3] { p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2] };
    double normal[3];

    switch (state) {
    case MoveAxisX: {
        normal[0] = posture_->GetElement(0, 0);
        normal[1] = posture_->GetElement(1, 0);
        normal[2] = posture_->GetElement(2, 0);
        auto distance = vtkMath::Dot(v, normal);
        posture_transform_->Translate(distance, 0, 0);
    } break;
    case MoveAxisY: {
        normal[0] = posture_->GetElement(0, 1);
        normal[1] = posture_->GetElement(1, 1);
        normal[2] = posture_->GetElement(2, 1);
        auto distance = vtkMath::Dot(v, normal);
        posture_transform_->Translate(0, distance, 0);
    } break;
    case MoveAxisZ: {
        normal[0] = posture_->GetElement(0, 2);
        normal[1] = posture_->GetElement(1, 2);
        normal[2] = posture_->GetElement(2, 2);
        auto distance = vtkMath::Dot(v, normal);
        posture_transform_->Translate(0, 0, distance);
    } break;
    default:
        return;
    }

    posture_transform_->Update();
    posture_transform_->GetMatrix(posture_);

    this->Modified();
    this->BuildRepresentation();
}
```

2. 在平面平移

获取鼠标运动矢量，求其在平面投影

```cpp
void GetPlaneProjection(const double a[3], const double b[3], double c[3])
{
    double squard = vtkMath::Dot(a, a);
    double scale = vtkMath::Dot(b, a) / squard;
    for (int i = 0; i < 3; i++) {
        c[i] = b[i] - a[i] * scale;
    }
}

void MovableAxesRepresentation::MovePlane(const int &state, double *p1, double *p2)
{
    // 鼠标点移动到自身坐标系中
    double pos_t1[4] { p1[0], p1[1], p1[2], 1 };
    double pos_t2[4] { p2[0], p2[1], p2[2], 1 };
    vtkNew<vtkMatrix4x4> posture_inv;
    vtkMatrix4x4::Invert(posture_, posture_inv);
    auto pos_t = posture_inv->MultiplyDoublePoint(pos_t1);
    double v1[3] = { pos_t[0], pos_t[1], pos_t[2] };
    pos_t = posture_inv->MultiplyDoublePoint(pos_t2);
    double v2[3] = { pos_t[0], pos_t[1], pos_t[2] };

    // 计算鼠标移动向量投影在对应平面
    double v[3] { v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2] };
    double normal[3];
    double projection[3];

    switch (state) {
    case MovePlanX: {
        normal[0] = 1;
        normal[1] = 0;
        normal[2] = 0;
    } break;
    case MovePlanY: {
        normal[0] = 0;
        normal[1] = 1;
        normal[2] = 0;
    } break;
    case MovePlanZ: {
        normal[0] = 0;
        normal[1] = 0;
        normal[2] = 1;
    } break;
    default:
        return;
    }

    // 平移
    vtkNew<vtkTransform> posture_transform_;
    posture_transform_->SetMatrix(posture_);
    GetPlaneProjection(normal, v, projection);
    posture_transform_->Translate(projection);
    posture_transform_->Update();
    posture_transform_->GetMatrix(posture_);

    this->Modified();
    this->BuildRepresentation();
}
```


3. 沿着轴旋转


```cpp
void MovableAxesRepresentation::RotateAxis(const int &state, double *p1, double *p2)
{
    // 将鼠标位置移动到自身坐标系下，求两次鼠标位置向量在投影平面的夹角
    vtkNew<vtkTransform> posture_transform;
    posture_transform->SetMatrix(posture_);
    if ((p1[0] - p2[0]) < 1e-4
        && (p1[1] - p2[1]) < 1e-4
        && (p1[2] - p2[2]) < 1e-4) {
        return;
    }

    double pos_t1[4] { p1[0], p1[1], p1[2], 1 };
    double pos_t2[4] { p2[0], p2[1], p2[2], 1 };
    vtkNew<vtkMatrix4x4> posture_inv;
    vtkMatrix4x4::Invert(posture_, posture_inv);
    auto pos_t = posture_inv->MultiplyDoublePoint(pos_t1);
    double v1[3] = { pos_t[0], pos_t[1], pos_t[2] };
    pos_t = posture_inv->MultiplyDoublePoint(pos_t2);
    double v2[3] = { pos_t[0], pos_t[1], pos_t[2] };
    double normal[3];

    switch (state) {
    case RotateAxisX: {
        normal[0] = 1;
        normal[1] = 0;
        normal[2] = 0;
    } break;
    case RotateAxisY: {
        normal[0] = 0;
        normal[1] = 1;
        normal[2] = 0;
    } break;
    case RotateAxisZ: {
        normal[0] = 0;
        normal[1] = 0;
        normal[2] = 1;
    } break;
    default:
        return;
    }

    double projection1[3], projection2[3];
    GetPlaneProjection(normal, v1, projection1);
    GetPlaneProjection(normal, v2, projection2);

    vtkMath::Normalize(projection1);
    vtkMath::Normalize(projection2);
    double axis[3];
    vtkMath::Cross(projection1, projection2, axis);
    double radians = acos(vtkMath::Dot(projection1, projection2));
    double degrees = vtkMath::DegreesFromRadians(radians);

    posture_transform->RotateWXYZ(degrees, axis);

    posture_transform->Update();
    posture_transform->GetMatrix(posture_);

    this->Modified();
    this->BuildRepresentation();
}
```


