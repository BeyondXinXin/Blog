# Study-VTK：一个简单的qt+vtk 图片浏览器框架（可拓展性极强）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200524160818736.gif)
&emsp;&emsp;Qt下使用vtk显示图片，主要是相机的设置和缩放比例尺。增加了很多实用的接口。
```cpp
 qDebug();
    if (this->vmtk_renderer_ == nullptr) {
        qWarning() << "renderer is null";
        return false;
    }
    if (this->actor_ == nullptr) {
        this->actor_ = vtkSmartPointer<vtkImageActor>::New();
    }
    this->actor_->SetInputData(this->image_);
    this->vmtk_renderer_->GetRenderer()->AddActor(this->actor_);
    if (this->scale_actor_ == nullptr) {
        this->scale_actor_ = vtkSmartPointer<vtkLegendScaleActor>::New();
    }
    this->scale_actor_->SetLabelMode(1);
    this->scale_actor_->TopAxisVisibilityOff();
    this->scale_actor_->LeftAxisVisibilityOn();
    this->scale_actor_->BottomAxisVisibilityOff();
    this->scale_actor_->RightAxisVisibilityOff();
    this->scale_actor_->LegendVisibilityOff();
    this->scale_actor_->SetLeftBorderOffset(90);
    this->scale_actor_->SetBottomBorderOffset(35);
    this->scale_actor_->SetTopBorderOffset(35);
    this->scale_actor_->GetLeftAxis()->SetNumberOfLabels(5);
    this->scale_actor_->GetLeftAxis()->SetAdjustLabels(true);
    this->scale_actor_->GetLeftAxis()->SetFontFactor(1);
    this->vmtk_renderer_->GetRenderer()->AddActor(this->scale_actor_);
    double origin[3];
    double spacing[3];
    int extent[6];
    this->image_->GetOrigin(origin);
    this->image_->GetSpacing(spacing);
    this->image_->GetExtent(extent);
    vtkSmartPointer<vtkCamera> camera =
        this->vmtk_renderer_->GetRenderer()->GetActiveCamera();
    camera->ParallelProjectionOn();
    double xc = origin[0] + 0.5 * (extent[0] + extent[1]) * spacing[0];
    double yc = origin[1] + 0.5 * (extent[2] + extent[3]) * spacing[1];
    double xd = (extent[1] - extent[0] + 1) * spacing[0];
    double yd = (extent[3] - extent[2] + 1) * spacing[1];
    double d = camera->GetDistance();
    Q_UNUSED(xd)
    camera->SetFocalPoint(xc, yc, 0.0);
    camera->SetPosition(xc, yc, d);
    camera->SetParallelScale(0.5 * (yd - 1));
    this->vmtk_renderer_->Render();
```


&emsp;
&emsp;
&emsp;
&emsp;


---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)

本案例代码：
[https://gitee.com/yaoxin001/WorkDemo](https://gitee.com/yaoxin001/WorkDemo)

个人博客首页
[http://118.25.63.144/](http://118.25.63.144/)