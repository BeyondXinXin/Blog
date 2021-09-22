# VTK：利用qt实现体绘制剪裁

做体绘制渲染一定少不了交互剪裁的功能。一般又两种方式：

1. 搞一个包围盒，移动包围盒实现体渲染的剪裁
2. 像小蚂蚁一样可以在屏幕画任意多边形实现剪裁

结果跟狗啃的一样主要是因为数据尺寸比较小（像素40* 40 * 40），直接抹黑像素肯定很烂
![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.6dqddpqyys8.gif)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.5v96fp8ld880.gif)






## 1 项目地址

在官方案例基础上改的

* 包围盒案例 [https://kitware.github.io/vtk-examples/site/Cxx/Widgets/BoxWidget2/](https://kitware.github.io/vtk-examples/site/Cxx/Widgets/BoxWidget2/)
* 体渲染案例 [https://kitware.github.io/vtk-examples/site/Cxx/VolumeRendering/RayCastIsosurface/](https://kitware.github.io/vtk-examples/site/Cxx/VolumeRendering/RayCastIsosurface/)


* 修改后工程 ~~[https://github.com/BeyondXinXin/study_vtk](https://github.com/BeyondXinXin/study_vtk)~~


## 2 包围盒

这个功能**vtk**直接自带，**vtkBoxWidget2**可以实现包围盒交互，**vtkVolume_XXX_Mapper**可以直接输入**planes**实现剪裁。


```cpp
/**
 * @brief The CBvtkBoxWidget3DCallback class
 * vtkBoxWidget2D 的观察者，响应 InteractionEvent 事件，设置当前的Planes到vtkVolume的Planes。
 */
class CBvtkBoxWidget3DCallback final : public vtkCommand {
  public:
    static CBvtkBoxWidget3DCallback *New();
    vtkTypeMacro(CBvtkBoxWidget3DCallback, vtkCommand);
    CBvtkBoxWidget3DCallback() : transform_(
            vtkSmartPointer<vtkTransform>::New()) {}
    ~CBvtkBoxWidget3DCallback() = default;
    vtkVolume *GetVolume() const;
    void SetVolume(vtkVolume *t_volume);
    void Execute(
        vtkObject *caller, unsigned long eventId, void *callData) override;
  private:
    vtkVolume *volume_ = {};
    vtkNew<vtkPlanes> planes_ {};
    vtkSmartPointer<vtkTransform> transform_ {};
};

void CBvtkBoxWidget3DCallback::Execute(
    vtkObject *caller, unsigned long, void *) {
    auto *const boxWidget =
        vtkBoxWidget2::SafeDownCast(caller);
    auto *const  boxRepresentation =
        vtkBoxRepresentation::SafeDownCast(boxWidget->GetRepresentation());
    boxRepresentation->SetInsideOut(1);
    boxRepresentation->GetPlanes(planes_);
    volume_->GetMapper()->SetClippingPlanes(planes_);
}


class CBvtkBoxWidget3D : public vtkBoxWidget2 {
  public:
    static CBvtkBoxWidget3D *New();
    vtkTypeMacro(CBvtkBoxWidget3D, vtkBoxWidget2);
    CBvtkBoxWidget3D();
    ~CBvtkBoxWidget3D();
};

CBvtkBoxWidget3D::CBvtkBoxWidget3D() {
    CreateDefaultRepresentation();
    GetRepresentation()->SetPlaceFactor(1);
}

```


## 3 任意多边形

这个基本都是抄的小蚂蚁的交互，屏幕用手术刀画一个任意多边形让后选择剪裁内部还是外部。实现分解：

1. 关闭vtk默认交互
2. 增加屏幕画多边形的交互
3. 切割模型（抹黑图片）
4. 更新数据，开启vtk交互

记得要自己重新实现模型透明度调节（能设置的下限要高于抹黑值），否则抹黑的地方调节透明度时候就露出来了。

#### 3.1 关闭vtk默认交互

使用自定义的**Interactor**，支持关闭交互

```cpp
void InteractorStyle::OnMouseMove()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnMouseMove();
    }
}

void InteractorStyle::OnLeftButtonDown()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnLeftButtonDown();
    }
}

void InteractorStyle::OnLeftButtonUp()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnLeftButtonUp();
    }
}

void InteractorStyle::OnMiddleButtonDown()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnMiddleButtonDown();
    }
}

void InteractorStyle::OnMiddleButtonUp()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnMiddleButtonUp();
    }
}

void InteractorStyle::OnRightButtonDown()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnRightButtonDown();
    }
}

void InteractorStyle::OnRightButtonUp()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnRightButtonUp();
    }
}

void InteractorStyle::OnMouseWheelForward()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnMouseWheelForward();
    }
}

void InteractorStyle::OnMouseWheelBackward()
{
    if (interactive_) {
        vtkInteractorStyleTrackballCamera::OnMouseWheelBackward();
    }
}
```

#### 3.2 增加屏幕画多边形的交互

直接用Qt的自绘控件即可

> 注意：强烈建议请使用**paintGL**而不是**paintEvent**！！！
> 窗口不能渲染vtk的二维场景。

```cpp
void RenderWidget::paintGL()
{
    QVTKOpenGLNativeWidget::paintGL();
    if (state_ == DrawCutLine && !cutting_points_.isEmpty()) {
        QPainter painter(this);
        drawArea(cutting_points_, painter);
    }
}

void RenderWidget::mousePressEvent(QMouseEvent *event)
{
    if (event->button() == Qt::LeftButton && state_ == DrawCutLine) {
        leftbtn_drag_ = true;
        cutting_points_.clear();
    }
    QVTKOpenGLNativeWidget::mousePressEvent(event);
}

void RenderWidget::mouseReleaseEvent(QMouseEvent *event)
{
    if (event->button() == Qt::LeftButton && state_ == DrawCutLine) {
        leftbtn_drag_ = false;
    }
    QVTKOpenGLNativeWidget::mouseReleaseEvent(event);
}

void RenderWidget::drawArea(QList<QPointF> &pf, QPainter &painter)
{
    if (pf.length() < 1) {
        return;
    }

    QPainterPath path(pf[0]);
    for (int i = 1; i < pf.size(); ++i) {
        path.lineTo(pf[i]);
    }

    QPen pen;
    pen.setColor(Qt::green);
    painter.setPen(pen);
    painter.setBrush(QBrush(Qt::green, Qt::Dense4Pattern));
    painter.drawPath(path);
    painter.drawLine(pf[0], pf.last());
}
```

#### 3.3 切割模型

很多办法都可以，最简单的就是直接遍历图片，利用**vtkCoordinate**投影到屏幕直接判断是否在**QPolygonF**里即可


```cpp
void CutingImagedata(vtkSmartPointer<vtkImageData> image_data,
                     vtkSmartPointer<vtkVolume> volume,
                     vtkSmartPointer<vtkRenderer> renderer,
                     const QPolygonF &polygon, const int &type)
{
    int img_dims[3];
    double img_spacing[3];
    double img_origian[3];
    image_data->GetDimensions(img_dims);
    image_data->GetSpacing(img_spacing);
    image_data->GetOrigin(img_origian);
    vtkNew<vtkCoordinate> corrdinate;
    corrdinate->SetCoordinateSystemToWorld();
    // 不用vtkImageIterator，迭代器没办法获得空间位置
    // 只是个demo，直接认为vtkImageData 数据是 unsigned char 保存的。如果是其他记得要改。
    // 只是个demo，直接认为bround是从0，0，0开始的，实际工程记得校验。
    for (int k = 0; k < img_dims[2]; ++k) {
        for (int i = 0; i < img_dims[0]; ++i) {
            for (int j = 0; j < img_dims[1]; ++j) {
                if (i < 100 && j < 100) {
                    double word_pos[3];
                    word_pos[0] = i * img_spacing[0] + img_origian[0];
                    word_pos[1] = j * img_spacing[1] + img_origian[1];
                    word_pos[2] = k * img_spacing[2] + img_origian[2];
                    corrdinate->SetValue(word_pos);
                    double *display_pos = corrdinate->GetComputedDoubleDisplayValue(renderer);
                    QPointF q_display_pos(display_pos[0], display_pos[1]);
                    if (type == RenderWidget::CutLineInside
                        && polygon.containsPoint(q_display_pos, Qt::OddEvenFill)) {
                        auto pPixel = static_cast<unsigned char *>(image_data->GetScalarPointer(i, j, k));
                        *pPixel = 0;
                    } else if (type == RenderWidget::CutLineOutside
                               && !polygon.containsPoint(q_display_pos.toPoint(), Qt::OddEvenFill)) {
                        auto pPixel = static_cast<unsigned char *>(image_data->GetScalarPointer(i, j, k));
                        *pPixel = 0;
                    }
                }
            }
        }
    }
    volume->Update();
    renderer->RemoveVolume(volume);
    renderer->AddVolume(volume);
}
```

#### 3.4 更新数据，开启vtk交互

修改图像数据需要更新下**vtkVolume**和**renderWindow**。如果要撤回和复位功能，则需要多存几个**vtkImageData**替换输入。
实际项目使用，一般是每次切割的文件保存到本地“.vti”，方便复位和后续步骤计算。

```cpp
volume->Update();
renderWindow()->Render();
```




#### 3.5 直接从官方案例拿的窗口渲染

```cpp

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    // vtk 搭建一个体渲染的Renderer
    vtkNew<vtkMetaImageReader> reader;
    const static QString path = "./etc/HeadMRVolume.mhd";
    reader->SetFileName(path.toLocal8Bit().data());
    reader->Update();

    auto image_data = vtkSmartPointer<vtkImageData>::New();
    image_data = reader->GetOutput();

    auto mapper = vtkSmartPointer<vtkOpenGLGPUVolumeRayCastMapper>::New();
    mapper->SetInputData(image_data);
    mapper->AutoAdjustSampleDistancesOff();
    mapper->SetSampleDistance(0.5);
    mapper->SetBlendModeToIsoSurface();
    mapper->SetCropping(1);
    mapper->SetCroppingRegionPlanes(50, 150, 50, 200, 50, 150);
    mapper->SetCroppingRegionFlags(VTK_CROP_SUBVOLUME);

    vtkNew<vtkColorTransferFunction> color_transfer_fun;
    color_transfer_fun->RemoveAllPoints();
    vtkNew<vtkNamedColors> colors;
    const auto flesh_color = colors->GetColor3d("flesh").GetData();
    const double iso1 = 40.0;
    color_transfer_fun->AddRGBPoint(iso1, flesh_color[0], flesh_color[1], flesh_color[2]);
    vtkNew<vtkPiecewiseFunction> scalarOpacity;
    scalarOpacity->AddPoint(iso1, 0.6);
    vtkNew<vtkVolumeProperty> volume_property;
    volume_property->ShadeOn();
    volume_property->SetInterpolationTypeToLinear();
    volume_property->SetColor(color_transfer_fun);
    volume_property->SetScalarOpacity(scalarOpacity);
    auto volume = vtkSmartPointer<vtkVolume>::New();
    volume->SetMapper(mapper);
    volume->SetProperty(volume_property);
    auto renderer = vtkSmartPointer<vtkRenderer>::New();
    renderer->AddVolume(volume);
    renderer->SetBackground(colors->GetColor3d("cornflower").GetData());
    renderer->ResetCamera();
    volume_property->GetIsoSurfaceValues()->SetValue(0, iso1);
    renderer->ResetCameraClippingRange();

    // 显示 Wiget
    RenderWidget *wid = new RenderWidget();
    wid->setFixedSize(800, 600);
    wid->renderWindow()->AddRenderer(renderer);

    QObject::connect(wid, &RenderWidget::SgnCuttingLine, wid, [wid, renderer, image_data, volume](const int &type) {
        CutingImagedata(image_data, volume, renderer, wid->GetCuttingPolygon(), type);
    });

    // 几个按钮以及逻辑
    GenerateTestButton(wid);

    // 显示
    wid->show();
    return a.exec();
}
```

#### 3.6 简单的按钮逻辑

```cpp
void GenerateTestButton(RenderWidget *wid)
{
    QPushButton *btn_cut = new QPushButton(wid);
    btn_cut->move(20, 20);
    btn_cut->setFixedSize(60, 30);
    btn_cut->setText("cut");

    QPushButton *btn_cancel = new QPushButton(wid);
    btn_cancel->move(20, 20);
    btn_cancel->setFixedSize(60, 30);
    btn_cancel->setText("cancel");

    QPushButton *btn_inside = new QPushButton(wid);
    btn_inside->move(20, 70);
    btn_inside->setFixedSize(60, 30);
    btn_inside->setText("inside");

    QPushButton *btn_outside = new QPushButton(wid);
    btn_outside->move(20, 120);
    btn_outside->setFixedSize(60, 30);
    btn_outside->setText("outside");

    btn_cut->setVisible(true);
    btn_cancel->setVisible(false);
    btn_inside->setVisible(false);
    btn_outside->setVisible(false);

    static auto FunChangeBtnState = [btn_cut, btn_cancel, btn_inside, btn_outside](const bool &show) {
        btn_cut->setVisible(!show);
        btn_cancel->setVisible(show);
        btn_inside->setVisible(show);
        btn_outside->setVisible(show);
    };

    QObject::connect(btn_cut, &QPushButton::clicked, wid, [&, wid] {
        wid->SetStyleState(RenderWidget::DrawCutLine);
        FunChangeBtnState(true);
    });

    QObject::connect(btn_cancel, &QPushButton::clicked, wid, [&, wid] {
        wid->SetStyleState(RenderWidget::Normal);
        FunChangeBtnState(false);
    });

    QObject::connect(btn_inside, &QPushButton::clicked, wid, [&, wid] {
        wid->SetStyleState(RenderWidget::CutLineInside);
        FunChangeBtnState(false);
    });

    QObject::connect(btn_outside, &QPushButton::clicked, wid, [&, wid] {
        wid->SetStyleState(RenderWidget::CutLineOutside);
        FunChangeBtnState(false);
    });
}


void RenderWidget::SetStyleState(const State &state)
{
    switch (state) {
    case DrawCutLine: {
        style_->interactive_ = false;
        state_ = DrawCutLine;
    } break;
    case CutLineInside:
    case CutLineOutside: {
        style_->interactive_ = true;
        state_ = Normal;
        emit SgnCuttingLine(state);
        renderWindow()->Render();
    } break;
    case Normal: {
        style_->interactive_ = true;
        state_ = Normal;

    } break;
    }
    cutting_points_.clear();
}

```






