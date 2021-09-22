# 升级vtk9 ：vtkPointHandleRepresentation3D  引发的bug


&emsp;&emsp; 之前用VTK8实现了一些自己写的交互，最近升级到VTK9，发现有些不能使用了。

### 原来的功能

&emsp;&emsp;屏幕中放置一个手柄，设置其尺寸为0（或者隐藏）。当鼠标移入这个隐藏的手柄时候会改变形状，选中拖动后会触发别的事情实时改变。



### 升级9后遇到的问题

&emsp;&emsp;隐藏的手柄无移入效果和无法被拖动。


### 分析问题

&emsp;&emsp;定位：VTK9里 `vtkPointHandleRepresentation3D` 这个类，如果设置 隐藏/尺寸为0 后。他的`vtkPointHandleRepresentation3D：：ComputeInteractionState` 永远返回`vtkHandleRepresentation::Outside`。对比了下VTK8和VTK9的源码，发现新版本 `vtkPointHandleRepresentation3D`做了一个改动：无论什么情况，首先确保光标位于显示空间中表示的边界球体内。这个MR是为了修复一个视角相关的BUG。

相关MR [https://gitlab.kitware.com/vtk/vtk/-/commit/1dca39384ab4940798471ec1da0a3877df9ff726](https://gitlab.kitware.com/vtk/vtk/-/commit/1dca39384ab4940798471ec1da0a3877df9ff726)

### 解决办法

&emsp;&emsp;原来的代码

```cpp
CBvtkResliceWidgetRepresentation::CBvtkResliceWidgetRepresentation() {
    m_centerMovementPointRepresentation =
        vtkSmartPointer<vtkPointHandleRepresentation3D>::New();
    m_centerMovementPointRepresentation->SetSmoothMotion(1);
    m_centerMovementPointRepresentation->SetHandleSize(0);
    m_centerMovementPointRepresentation->SetTolerance(15);
    m_centerMovementPointRepresentation->AllOff();
    m_centerMovementPointRepresentation->TranslationModeOn();
    m_cursorActor = vtkSmartPointer<CBvtkResliceActor>::New();
    m_cursorVisibility = true;
}

int CBvtkResliceWidgetRepresentation::ComputeInteractionState(
    const int X, const int Y, int ) {
    if (m_centerMovementPointRepresentation->ComputeInteractionState(X, Y)
            != vtkHandleRepresentation::Outside) {
        return handleCursor;
    };
    vtkNew<vtkCellPicker> picker;
    picker->SetTolerance(0.01);
    picker->InitializePickList();
    picker->PickFromListOn();
    picker->AddPickList(m_cursorActor->getActor());
    if (picker->Pick(X, Y, 0, Renderer)) {
        return mprCursor;
    }
    return outside;
}

void CBvtkResliceWidgetRepresentation::BuildRepresentation() {
    if (GetMTime() > BuildTime ||
            m_centerMovementPointRepresentation->GetMTime() > BuildTime ||
            (Renderer &&
             Renderer->GetVTKWindow() &&
             Renderer->GetVTKWindow()->GetMTime() > BuildTime)
       ) {
        double centerPos[3];
        m_centerMovementPointRepresentation->GetWorldPosition(centerPos);
        Renderer->GetVTKWindow()->GetSize();
        m_cursorActor->setCameraDistance(
            Renderer->GetActiveCamera()->GetDistance());
        vtkNew<vtkCoordinate> coord;
        coord->SetCoordinateSystemToDisplay();
        coord->SetValue(
            Renderer->GetVTKWindow()->GetSize()[0],
            Renderer->GetVTKWindow()->GetSize()[1], 0);
        double *size = coord->GetComputedWorldValue(Renderer);
        m_cursorActor->setCenterPosition(centerPos);
        m_cursorActor->setDisplaySize(size);
        coord->SetValue(0, 0);
        double *origin = coord->GetComputedWorldValue(Renderer);
        m_cursorActor->setDisplayOriginPoint(origin);
        m_cursorActor->update();
        BuildTime.Modified();
    }
}

```



&emsp;&emsp;我目前先用了个比较蠢的办法：直接给他还原回去吧。


```cpp
class CBvtkPointHandleRepresentation3D : public vtkPointHandleRepresentation3D {
  public:
    static CBvtkPointHandleRepresentation3D *New();
    vtkTypeMacro(CBvtkPointHandleRepresentation3D, vtkPointHandleRepresentation3D);
    CBvtkPointHandleRepresentation3D() = default;
    ~CBvtkPointHandleRepresentation3D() = default;
    int ComputeInteractionState(int X, int Y, int modify) override;
};

int CBvtkPointHandleRepresentation3D::ComputeInteractionState(int X, int Y, int ) {
    this->VisibilityOn();
    vtkAssemblyPath *path = this->GetAssemblyPath(X, Y, 0., this->CursorPicker);
    double focus[3];
    this->Cursor3D->GetFocalPoint(focus);
    double d[3];
    this->GetDisplayPosition(d);
    if ( path != nullptr ) {
        this->InteractionState = vtkHandleRepresentation::Nearby;
    } else {
        this->InteractionState = vtkHandleRepresentation::Outside;
        if ( this->ActiveRepresentation ) {
            this->VisibilityOff();
        }
    }
    return this->InteractionState;
}

```



