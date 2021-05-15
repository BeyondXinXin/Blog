# vtk实现一个简易的RubberBand 并求矩形内部hu平均值和最值



想实现一个两点的矩形框，并求内部hu平均值。之前是用vtk自带的RubberBand来实现，交互关闭，清空显示等跟其他交互不太好集成统一管理。
趁着周末直接尝试下自定义一个Widget。效果：


![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/1.6igqsk3tw2w0.gif)



反正就两个点，干脆直接用`vtkDistanceWidget`来实现吧。自己实现一个交互，需要写三个相关类
* RubberBandWidget：直接用的`DistanceWidget`，主要是初始化、清空复位用。
* RubberBandWidgetCallback：只绑定了个`EndInteractionEvent`，交互结束后求平均值和极值
* RubberBandRepresentation2D：用四个`vtkAxisActor2D`实现矩形

```cpp
class CBTagging2DWidget {
  public:
    virtual bool OffTagging() = 0;
    virtual bool ClearTagging() = 0;
};
```

```cpp
class CBvtkRubberBandWidget : public vtkDistanceWidget, public CBTagging2DWidget {
  public:
    static CBvtkRubberBandWidget *New();
    vtkTypeMacro(CBvtkRubberBandWidget, vtkDistanceWidget);
    CBvtkRubberBandWidget();
    ~CBvtkRubberBandWidget();
    vtkSmartPointer<vtkImageResliceToColors> m_reslicer {};
    vtkSmartPointer<vtkImageData> m_vtiData {};
    QPointer<CBvtkMPRWidget> m_parentWid {};
    virtual bool OffTagging() override;
    virtual bool ClearTagging() override;
};


vtkStandardNewMacro(CBvtkRubberBandWidget);
CBvtkRubberBandWidget::CBvtkRubberBandWidget() {
    auto rep = CBvtkRubberBandRepresentation2D::New();
    SetRepresentation(rep);
}
CBvtkRubberBandWidget::~CBvtkRubberBandWidget() {
}
bool CBvtkRubberBandWidget::OffTagging() {
    if(vtkDistanceWidget::Manipulate != GetWidgetState()) {
        this->ClearTagging();
        return true;
    }
    return false;
}

bool CBvtkRubberBandWidget::ClearTagging() {
    SetInteractor(0);
    EnabledOff();
    Delete();
    return true;
}
```



```cpp
class CBvtkRubberBandWidgetCallback : public vtkCommand {
  public:
    static CBvtkRubberBandWidgetCallback *New();
    vtkTypeMacro(CBvtkRubberBandWidgetCallback, vtkCommand);
    CBvtkRubberBandWidgetCallback() = default;
    ~CBvtkRubberBandWidgetCallback() = default;
    void Execute(vtkObject *caller, unsigned long, void *) override;
    vtkRenderer *m_renderer;
};

vtkStandardNewMacro(CBvtkRubberBandWidgetCallback);
void CBvtkRubberBandWidgetCallback::Execute(
    vtkObject *t_obj, unsigned long eid, void *) {
    if (eid != vtkCommand::EndInteractionEvent) {
        return;
    }
    auto *const widget = dynamic_cast<CBvtkRubberBandWidget *>(t_obj);
    widget->GetInteractor()->GetPicker()->Pick(
        widget->GetInteractor()->GetEventPosition()[0],
        widget->GetInteractor()->GetEventPosition()[1], 0,  m_renderer);
    double picked[3];
    widget->GetInteractor()->GetPicker()->GetPickPosition(picked);
    auto rep = static_cast<CBvtkRubberBandRepresentation2D *>(widget->GetRepresentation());
    double pos1[3], pos2[3];
    rep->GetPoint1WorldPosition(pos1);
    rep->GetPoint2WorldPosition(pos2);
    double min_value = 9999;
    double max_value = -9999;
    double average_value = 0;
    int num_x = abs(pos2[0] - pos1[0]);
    int num_y = abs(pos2[1] - pos1[1]);
    double division_x = (pos2[0] - pos1[0]) / num_x;
    double division_y = (pos2[1] - pos1[1]) / num_y;
    double pos[3];
    pos[2] = pos1[2];
    vtkMatrix4x4 *sourceMatrix =
        widget->m_reslicer->GetResliceAxes();
    double origin[3];
    double spaceing[3];
    double bounds[6];
    widget->m_vtiData->GetOrigin(origin);
    widget->m_vtiData->GetSpacing(spaceing);
    widget->m_vtiData->GetBounds(bounds);
    for (int i = 0; i < num_x; i++) {
        pos[0] = pos1[0] + i * division_x;
        for (int j = 0; j < num_y; j++) {
            pos[1] = pos1[1] + j * division_y;
            vtkNew<vtkTransform> transform;
            transform->SetMatrix(sourceMatrix);
            transform->Translate(pos[0], pos[1], 0);
            double pos_3d[3] = {
                transform->GetMatrix()->GetElement(0, 3),
                transform->GetMatrix()->GetElement(1, 3),
                transform->GetMatrix()->GetElement(2, 3)
            };
            double point[3] {0, 0, 0};
            for(int k = 0; k < 3; k++) {
                point[k] = pos_3d[k] - origin[k];
                point[k] /= spaceing[k];
                if(point[k] < bounds[k * 2 + 0] / spaceing[k] ||
                        point[k] > bounds[k * 2 + 1] / spaceing[k]) {
                    return;
                }
            }
            int pixel = *(int *) (widget->m_vtiData->GetScalarPointer(point[0], point[1], point[2]));
            average_value += pixel;
            if(min_value >= pixel) {
                min_value = pixel;
            }
            if(max_value <= pixel) {
                max_value = pixel;
            }
        }
    }
    average_value /= num_x * num_y;
    rep->SetRubberBandTitle(average_value, max_value, min_value);
}
```



```cpp
class CBvtkRubberBandRepresentation2D : public vtkDistanceRepresentation {
  public:
    static CBvtkRubberBandRepresentation2D *New();
    vtkTypeMacro(CBvtkRubberBandRepresentation2D, vtkDistanceRepresentation);
    void PrintSelf(ostream &os, vtkIndent indent) override;
    double GetDistance() override {
        return this->Distance;
    }
    double *GetPoint1WorldPosition() override;
    double *GetPoint2WorldPosition() override;
    void GetPoint1WorldPosition(double pos[3]) override;
    void GetPoint2WorldPosition(double pos[3]) override;
    void SetPoint1WorldPosition(double pos[3]) override;
    void SetPoint2WorldPosition(double pos[3]) override;
    void SetPoint1DisplayPosition(double pos[3]) override;
    void SetPoint2DisplayPosition(double pos[3]) override;
    void GetPoint1DisplayPosition(double pos[3]) override;
    void GetPoint2DisplayPosition(double pos[3]) override;
    void BuildRepresentation() override;
    void ReleaseGraphicsResources(vtkWindow *w) override;
    int RenderOverlay(vtkViewport *viewport) override;
    int RenderOpaqueGeometry(vtkViewport *viewport) override;
    vtkSmartPointer<vtkImageResliceToColors> m_reslicer {};
    vtkSmartPointer<vtkImageData> m_vtiData {};
    void SetRubberBandTitle(const double &, const double &, const double &);

  protected:
    CBvtkRubberBandRepresentation2D();
    ~CBvtkRubberBandRepresentation2D() override;
    vtkAxisActor2D *AxisActors[4];

    vtkProperty2D *AxisProperty;
    double Distance;
  private:
    CBvtkRubberBandRepresentation2D(const CBvtkRubberBandRepresentation2D &) = delete;
    void operator=(const CBvtkRubberBandRepresentation2D &) = delete;
};


vtkStandardNewMacro(CBvtkRubberBandRepresentation2D);
CBvtkRubberBandRepresentation2D::CBvtkRubberBandRepresentation2D() {
    this->HandleRepresentation = vtkPointHandleRepresentation2D::New();
    this->AxisProperty = vtkProperty2D::New();
    this->AxisProperty->SetColor(0, 1, 0);
    //
    for (int i = 0; i < 4; i++) {
        AxisActors[i] = vtkAxisActor2D::New();
        AxisActors[i]->GetPoint1Coordinate()->SetCoordinateSystemToWorld();
        AxisActors[i]->GetPoint2Coordinate()->SetCoordinateSystemToWorld();
        AxisActors[i]->SetNumberOfLabels(5);
        AxisActors[i]->LabelVisibilityOff();
        AxisActors[i]->AdjustLabelsOff();
        AxisActors[i]->SetProperty(this->AxisProperty);
        AxisActors[i]->SetTitle(" ");
        AxisActors[i]->GetTitleTextProperty()->SetBold(1);
        AxisActors[i]->GetTitleTextProperty()->SetItalic(1);
        AxisActors[i]->GetTitleTextProperty()->SetShadow(1);
        AxisActors[i]->GetTitleTextProperty()->SetFontFamilyToArial();
    }
    this->Distance = 0.0;
}

CBvtkRubberBandRepresentation2D::~CBvtkRubberBandRepresentation2D() {
    this->AxisProperty->Delete();
    this->AxisActors[0]->Delete();
    this->AxisActors[1]->Delete();
    this->AxisActors[2]->Delete();
    this->AxisActors[3]->Delete();
}

void CBvtkRubberBandRepresentation2D::GetPoint1WorldPosition(double pos[3]) {
    this->Point1Representation->GetWorldPosition(pos);
}

void CBvtkRubberBandRepresentation2D::GetPoint2WorldPosition(double pos[3]) {
    this->Point2Representation->GetWorldPosition(pos);
}

double *CBvtkRubberBandRepresentation2D::GetPoint1WorldPosition() {
    if (!this->Point1Representation) {
        static double temp[3] = { 0, 0, 0 };
        return temp;
    }
    return this->Point1Representation->GetWorldPosition();
}

double *CBvtkRubberBandRepresentation2D::GetPoint2WorldPosition() {
    if (!this->Point2Representation) {
        static double temp[3] = { 0, 0, 0 };
        return temp;
    }
    return this->Point2Representation->GetWorldPosition();
}

void CBvtkRubberBandRepresentation2D::SetPoint1DisplayPosition(double x[3]) {
    this->Point1Representation->SetDisplayPosition(x);
    double p[3];
    this->Point1Representation->GetWorldPosition(p);
    this->Point1Representation->SetWorldPosition(p);
    this->BuildRepresentation();
}

void CBvtkRubberBandRepresentation2D::SetPoint2DisplayPosition(double x[3]) {
    this->Point2Representation->SetDisplayPosition(x);
    double p[3];
    this->Point2Representation->GetWorldPosition(p);
    this->Point2Representation->SetWorldPosition(p);
    this->BuildRepresentation();
}

void CBvtkRubberBandRepresentation2D::SetPoint1WorldPosition(double x[3]) {
    if (this->Point1Representation) {
        this->Point1Representation->SetWorldPosition(x);
        this->BuildRepresentation();
    }
}

void CBvtkRubberBandRepresentation2D::SetPoint2WorldPosition(double x[3]) {
    if (this->Point2Representation) {
        this->Point2Representation->SetWorldPosition(x);
        this->BuildRepresentation();
    }
}

void CBvtkRubberBandRepresentation2D::GetPoint1DisplayPosition(double pos[3]) {
    this->Point1Representation->GetDisplayPosition(pos);
    pos[2] = 0.0;
}

void CBvtkRubberBandRepresentation2D::GetPoint2DisplayPosition(double pos[3]) {
    this->Point2Representation->GetDisplayPosition(pos);
    pos[2] = 0.0;
}

void CBvtkRubberBandRepresentation2D::BuildRepresentation() {
    if (this->GetMTime() > this->BuildTime ||
            this->AxisActors[0]->GetMTime() > this->BuildTime ||
            this->AxisActors[1]->GetMTime() > this->BuildTime ||
            this->AxisActors[2]->GetMTime() > this->BuildTime ||
            this->AxisActors[3]->GetMTime() > this->BuildTime ||
            this->AxisActors[0]->GetTitleTextProperty()->GetMTime() > this->BuildTime ||
            this->AxisActors[1]->GetTitleTextProperty()->GetMTime() > this->BuildTime ||
            this->AxisActors[2]->GetTitleTextProperty()->GetMTime() > this->BuildTime ||
            this->AxisActors[3]->GetTitleTextProperty()->GetMTime() > this->BuildTime ||
            this->Point1Representation->GetMTime() > this->BuildTime ||
            this->Point2Representation->GetMTime() > this->BuildTime ||
            (this->Renderer && this->Renderer->GetVTKWindow() &&
             this->Renderer->GetVTKWindow()->GetMTime() > this->BuildTime)) {
        this->Superclass::BuildRepresentation();
        double p1[3], p2[3];
        this->Point1Representation->GetWorldPosition(p1);
        this->Point2Representation->GetWorldPosition(p2);
        this->Distance = sqrt(vtkMath::Distance2BetweenPoints(p1, p2));
        //
        this->AxisActors[0]->GetPoint1Coordinate()->SetValue(p1[0], p1[1], p1[2]);
        this->AxisActors[0]->GetPoint2Coordinate()->SetValue(p2[0], p1[1], p2[2]);
        this->AxisActors[1]->GetPoint1Coordinate()->SetValue(p2[0], p1[1], p2[2]);
        this->AxisActors[1]->GetPoint2Coordinate()->SetValue(p2[0], p2[1], p2[2]);
        this->AxisActors[2]->GetPoint1Coordinate()->SetValue(p1[0], p1[1], p2[2]);
        this->AxisActors[2]->GetPoint2Coordinate()->SetValue(p1[0], p2[1], p2[2]);
        this->AxisActors[3]->GetPoint1Coordinate()->SetValue(p1[0], p2[1], p2[2]);
        this->AxisActors[3]->GetPoint2Coordinate()->SetValue(p2[0], p2[1], p2[2]);
        //
        for (int i = 0; i < 4; i++) {
            AxisActors[i]->SetRulerMode(this->RulerMode);
            if (this->Scale != 0.0) {
                AxisActors[i]->SetRulerDistance(this->RulerDistance / this->Scale);
            }
            AxisActors[i]->SetNumberOfLabels(this->NumberOfRulerTicks);
        }
        this->BuildTime.Modified();
    }
}

void CBvtkRubberBandRepresentation2D::ReleaseGraphicsResources(vtkWindow *w) {
    this->AxisActors[0]->ReleaseGraphicsResources(w);
    this->AxisActors[1]->ReleaseGraphicsResources(w);
    this->AxisActors[2]->ReleaseGraphicsResources(w);
    this->AxisActors[3]->ReleaseGraphicsResources(w);
}

int CBvtkRubberBandRepresentation2D::RenderOverlay(vtkViewport *v) {
    this->BuildRepresentation();
    if (this->AxisActors[0]->GetVisibility()) {
        this->AxisActors[1]->RenderOverlay(v);
        this->AxisActors[2]->RenderOverlay(v);
        this->AxisActors[3]->RenderOverlay(v);
        return this->AxisActors[0]->RenderOverlay(v);
    } else {
        return 0;
    }
}

int CBvtkRubberBandRepresentation2D::RenderOpaqueGeometry(vtkViewport *v) {
    this->BuildRepresentation();
    if (this->AxisActors[0]->GetVisibility()) {
        this->AxisActors[1]->RenderOpaqueGeometry(v);
        this->AxisActors[2]->RenderOpaqueGeometry(v);
        this->AxisActors[3]->RenderOpaqueGeometry(v);
        return this->AxisActors[0]->RenderOpaqueGeometry(v);
    } else {
        return 0;
    }
}

void CBvtkRubberBandRepresentation2D::SetRubberBandTitle(
    const double &average, const double &max, const double &min) {
    QString str;
    str += QString::number(average, 'f', 0);
    str += "( ";
    str += QString::number(min);
    str += "~";
    str += QString::number(max);
    str += " )";
    this->AxisActors[3]->GetTitleTextProperty()->SetFontSize(1);
    this->AxisActors[3]->SetTitle(str.toLocal8Bit().data());
}

void CBvtkRubberBandRepresentation2D::PrintSelf(ostream &os, vtkIndent indent) {
    this->Superclass::PrintSelf(os, indent);
}


```



