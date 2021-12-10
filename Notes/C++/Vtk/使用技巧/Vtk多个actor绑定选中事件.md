
# Vtk多个actor绑定选中事件


1 交互只有： 放大、移动、沿着z轴旋转
2 增加选中回调
3 增加部分模型隐藏

## 效果

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.91qghbo1huk.gif)

## 项目地址

在官方案例基础上改的

* 案例 [https://kitware.github.io/vtk-examples/site/Cxx/Picking/HighlightPickedActor/](https://kitware.github.io/vtk-examples/site/Cxx/Picking/HighlightPickedActor/)
* 修改后工程 ~~[https://github.com/BeyondXinXin/study_vtk](https://github.com/BeyondXinXin/study_vtk)~~


## 原文

[Vtk多个actor绑定选中事件](https://github.com/BeyondXinXin/Blog/blob/master/%E5%BC%80%E6%BA%90%E5%BA%93%E5%AD%A6%E4%B9%A0/Study%20VTK/%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7/Vtk%E5%A4%9A%E4%B8%AAactor%E7%BB%91%E5%AE%9A%E9%80%89%E4%B8%AD%E4%BA%8B%E4%BB%B6.md)


## 实现

**TrackballCamera** 记录下所有的actor，每次鼠标单机后调用**vtkPropPicker**判断是否选中某一个模型。




```cpp

class MouseInteractorHighLightActor : public vtkInteractorStyleTrackballCamera
{
public:
    vtkTypeMacro(MouseInteractorHighLightActor, vtkInteractorStyleTrackballCamera);
    static MouseInteractorHighLightActor *New();
    MouseInteractorHighLightActor();
    ~MouseInteractorHighLightActor() override;
    void OnLeftButtonDown() override;
    void OnMouseMove() override;
    void Rotate() override;
    QList<vtkActor *> actors_;

private:
    vtkActor *LastPickedActor;
    vtkProperty *LastPickedProperty;
};


void MouseInteractorHighLightActor::OnLeftButtonDown()
{
    vtkNew<vtkNamedColors> colors;
    int *clickPos = GetInteractor()->GetEventPosition();
    vtkNew<vtkPropPicker> picker;
    picker->Pick(clickPos[0], clickPos[1], 0, GetDefaultRenderer());
    if (LastPickedActor) {
        LastPickedActor->GetProperty()->DeepCopy(LastPickedProperty);
    }
    LastPickedActor = picker->GetActor();
    if (LastPickedActor) {
        LastPickedProperty->DeepCopy(LastPickedActor->GetProperty());
        LastPickedActor->GetProperty()->SetColor(colors->GetColor3d("Red").GetData());
        LastPickedActor->GetProperty()->SetOpacity(1.0);
    }
    int i = 0;
    bool select = false;
    foreach (auto actor, actors_) {
        if (actor == LastPickedActor) {
            select = true;
            InvokeEvent(vtkCommand::UserEvent + 1, &i);
        }
        i++;
    }
    if (!select) {
        i = -1;
        InvokeEvent(vtkCommand::UserEvent + 1, &i);
    }

    vtkInteractorStyleTrackballCamera::OnLeftButtonDown();
}


foreach (auto var, filename) {
    vtkNew<vtkSTLReader> reader;
    reader->SetFileName(var.toLocal8Bit().data());
    vtkNew<vtkSphereSource> source;
    vtkNew<vtkPolyDataMapper> mapper;
    mapper->SetInputConnection(reader->GetOutputPort());
    vtkNew<vtkActor> actor;
    actor->SetMapper(mapper);
    actor->GetProperty()->SetSpecularColor(colors->GetColor3d("White").GetData());
    actor->GetProperty()->SetSpecularPower(30.0);
    renderer->AddActor(actor);
    style->actors_ << actor;
}

```



> 注意：**vtkPropPicker** 和 选中后发出 **InvokeEvent** 都是耗时操作，如果外边处理事情很多可能造成**widget**闪烁。实际使用的时候我是在**vtkPropPicker**后**Render**一下。

```cpp
void MouseInteractorHighLightActor::OnLeftButtonDown()
{
    int *clickPos = GetInteractor()->GetEventPosition();
    picker_->Pick(clickPos[0], clickPos[1], 0, GetDefaultRenderer());
    GetDefaultRenderer()->Render();
    if (last_picked_actor_) {
        last_picked_actor_->GetProperty()->DeepCopy(last_picked_property_);
    }
    last_picked_actor_ = picker_->GetActor();
    if (last_picked_actor_) {
        last_picked_property_->DeepCopy(last_picked_actor_->GetProperty());
        last_picked_actor_->GetProperty()->SetColor(colors_->GetColor3d("Red").GetData());
    }
    int i = 0;
    bool select = false;
    foreach (auto actor, actors_) {
        if (actor == last_picked_actor_) {
            select = true;
            InvokeEvent(vtkCommand::UserEvent + 1, &i);
        }
        i++;
    }
    if (!select) {
        i = -1;
        InvokeEvent(vtkCommand::UserEvent + 1, &i);
    }
    vtkInteractorStyleTrackballCamera::OnLeftButtonDown();
}
```


