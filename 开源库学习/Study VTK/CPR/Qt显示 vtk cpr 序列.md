# Qt显示 vtk cpr 序列



周末终于不忙了，正好实现一个cpr的常用功能，截面图序列浏览。



![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/1.5rf17p9kj0o0.gif)



下边六个截面只是单纯的显示图片，想了想直接用qlabel吧，正好之前没做过可以学习下。记录下用到的东西

## vtkImage 转 QImage

图片类型转换
```cpp
vtkNew<vtkImageCast>cast;
cast->SetInputConnection(mpr_maker_->GetImageReslice(3)->GetOutputPort());
cast->SetOutputScalarTypeToUnsignedChar();
cast->Update();
```


```cpp
QImage vtkImageDataToQImage(vtkSmartPointer<vtkImageData> imageData) {
    if (!imageData) {
        return QImage();
    }
    int width = imageData->GetDimensions()[0];
    int height = imageData->GetDimensions()[1];
    QImage image(width, height, QImage::Format_RGB32);
    QRgb *rgbPtr = reinterpret_cast<QRgb *>(image.bits()) + width * (height - 1);
    unsigned char *colorsPtr =
        reinterpret_cast<unsigned char *>(imageData->GetScalarPointer());
    for (int row = 0; row < height; row++) {
        for (int col = 0; col < width; col++) {
            *(rgbPtr++) = QColor(colorsPtr[0], colorsPtr[1], colorsPtr[2]).rgb();
            colorsPtr += imageData->GetNumberOfScalarComponents();
        }
        rgbPtr -= width * 2;
    }
    return image;
}
```

## 多条可拖动直线

需要自己实现一个Actor，
m_windowSize：窗口大小
m_windowOrigin：窗口原点
m_centerPointDisplayPosition：窗口中心点
m_cameraDistance：缩放倍率

```cpp
class CBvtkResliceActor final : public vtkObject {
  public:
    static CBvtkResliceActor *New();
    vtkTypeMacro(CBvtkResliceActor, vtkObject);
    CBvtkResliceActor() {
        createActor();
    }
    ~CBvtkResliceActor() = default;
    vtkActor *getActor() const {
        return m_actor;
    }
    vtkMTimeType getLineTime() const {
        return m_cursorLines[0]->GetMTime();
    }
    void setCameraDistance(const double t_distance) {
        m_cameraDistance = t_distance;
    }
    void setDisplaySize(const double *t_size);
    void setDisplayOriginPoint(const double *t_point);
    void setCenterPosition(const double *t_center);
    void createActor();
    void update();
    void reset() const;
    void createColors(double *t_color1, double *t_color2);
    void setCPRLines();
    bool cpr_lines_ = false;
  private:
    vtkSmartPointer<vtkAppendPolyData> m_appender = {};
    vtkSmartPointer<vtkActor> m_actor = {};
    vtkSmartPointer<vtkTransformFilter> m_filter = {};
    vtkSmartPointer<vtkLineSource> m_cursorLines[11] = {};
    vtkSmartPointer<vtkUnsignedCharArray> m_colors[3] = {};
    vtkSmartPointer<vtkPolyDataMapper> m_mapper = {};
    double m_windowSize[3] = {};
    double m_windowOrigin[3] = {};
    double m_centerPointDisplayPosition[3] = {};
    double m_cameraDistance = 0;
    int m_start = 0;
};
```

```cpp
void CBvtkResliceActor::update() {
    if (m_start == 0) {
        if(cpr_lines_) {
            for (auto i = -3; i < 4; ++i) {
                if(0 == i) {
                    continue;
                }
                m_cursorLines[7 + i]->SetPoint1(
                    m_centerPointDisplayPosition[0] + i * 1.6,
                    m_centerPointDisplayPosition[1] - 5, 0.01);
                m_cursorLines[7 + i]->SetPoint2(
                    m_centerPointDisplayPosition[0] + i * 1.6,
                    m_centerPointDisplayPosition[1] + 5, 0.01);
                m_cursorLines[7 + i]->Update();
                m_cursorLines[7 + i]->GetOutput()->GetPointData()->AddArray(m_colors[0]);
            }
        } else {
            // 中间连起来
            m_cursorLines[0]->SetPoint1(m_windowOrigin[0], m_centerPointDisplayPosition[1], 0.01);
            m_cursorLines[0]->SetPoint2(m_windowSize[0], m_centerPointDisplayPosition[1], 0.01);
            m_cursorLines[0]->Update();
            m_cursorLines[0]->GetOutput()->GetPointData()->AddArray(m_colors[1]);
            m_cursorLines[2]->SetPoint1(m_centerPointDisplayPosition[0], m_windowOrigin[1], 0.01);
            m_cursorLines[2]->SetPoint2(m_centerPointDisplayPosition[0], m_windowSize[1], 0.01);
            m_cursorLines[2]->Update();
            m_cursorLines[2]->GetOutput()->GetPointData()->AddArray(m_colors[0]);
            // 中间空一个centerHide距离
            if(false) {
                m_cursorLines[0]->SetPoint1(m_windowOrigin[0], m_centerPointDisplayPosition[1], 0.01);
                m_cursorLines[0]->SetPoint2(m_centerPointDisplayPosition[0] - centerHide, m_centerPointDisplayPosition[1], 0.01);
                m_cursorLines[0]->Update();
                m_cursorLines[0]->GetOutput()->GetPointData()->AddArray(m_colors[1]);
                m_cursorLines[1]->SetPoint1(m_centerPointDisplayPosition[0] + centerHide, m_centerPointDisplayPosition[1], 0.01);
                m_cursorLines[1]->SetPoint2(m_windowSize[0], m_centerPointDisplayPosition[1], 0.01);
                m_cursorLines[1]->Update();
                m_cursorLines[1]->GetOutput()->GetPointData()->AddArray(m_colors[1]);
                m_cursorLines[2]->SetPoint1(m_centerPointDisplayPosition[0], m_windowOrigin[1], 0.01);
                m_cursorLines[2]->SetPoint2(m_centerPointDisplayPosition[0], m_centerPointDisplayPosition[1] - centerHide, 0.01);
                m_cursorLines[2]->Update();
                m_cursorLines[2]->GetOutput()->GetPointData()->AddArray(m_colors[0]);
                m_cursorLines[3]->SetPoint1(m_centerPointDisplayPosition[0], m_centerPointDisplayPosition[1] + centerHide, 0.01);
                m_cursorLines[3]->SetPoint2(m_centerPointDisplayPosition[0], m_windowSize[1], 0.01);
                m_cursorLines[3]->Update();
                m_cursorLines[3]->GetOutput()->GetPointData()->AddArray(m_colors[0]);
            }
        }
        m_actor->SetScale(5);
        m_start = 1;
    } else {
        m_actor->SetPosition(
            m_centerPointDisplayPosition[0],
            m_centerPointDisplayPosition[1],
            0.01);
    }
}
```


## 绑定鼠标滚轮和拖动事件的槽函数

```cpp

enum vtkCustomEvents : unsigned long {
    changeScrollValue = vtkCommand::UserEvent + 1,
    defaultCursor = changeScrollValue + 1,
    cursorMove = defaultCursor + 1,
    cursorFinishMovement = cursorMove + 1,
    cursorRotate = cursorFinishMovement + 1,
    imageChanged = cursorRotate + 1,
    qualityLow = imageChanged + 1,
    qualityHigh = qualityLow + 1,
};

for (auto i = 0; i < 3; ++i) {
    if (!m_cursor[i]) {
        m_cursor[i] = vtkSmartPointer<CBvtkReslicePlaneCursorWidget>::New();
        m_cursor[i]->cpr_type_ = cpr_type_;
        m_cbk[i] = vtkSmartPointer<CBvtkResliceCallback>::New();
        m_cbk[i]->setHandleNumber(i);
        m_cbk[i]->setWidget(this);
        m_cbk[i]->planeWidget_[0] = this->m_planeWidget[0];
        m_cbk[i]->planeWidget_[1] = this->m_planeWidget[1];
        m_cbk[i]->planeWidget_[2] = this->m_planeWidget[2];
        m_cursor[i]->setWidget(this);
        m_cursor[i]->AddObserver(cursorRotate, m_cbk[i]);
        m_cursor[i]->AddObserver(cursorMove, m_cbk[i]);
        m_cursor[i]->AddObserver(qualityLow, m_cbk[i]);
        m_cursor[i]->AddObserver(qualityHigh, m_cbk[i]);
        m_cursor[i]->AddObserver(vtkCommand::LeftButtonReleaseEvent, m_cbk[i]);
        m_cursor[i]->AddObserver(cursorFinishMovement, m_cbk[i]);
        m_cursor[i]->AddObserver(imageChanged, m_cbk[i]);
        m_windows[i]->GetInteractor()->GetInteractorStyle()->AddObserver(imageChanged, m_cbk[i]);
    }
}

if(reslice_widget_->cpr_type_) {
    for(int i = 0; i < 3; i++) {
        connection_->Connect(
            reslice_widget_->GetReslicePlaneCursorWidget()[i],
            cursorMove, this,
            SLOT(SlotUpdataCPR(vtkObject *, unsigned long, void *, void *)));
        connection_->Connect(
            reslice_widget_->GetReslicePlaneCursorWidget()[i],
            imageChanged, this,
            SLOT(SlotUpdataCPR(vtkObject *, unsigned long, void *, void *)));
    }
}
```

## 生成多张切片

要保证几个窗口的床位窗宽一致，我是选择四组`vtkImageResliceToColors` + `vtkImageReslice`，几个窗口公用一个`vtkScalarsToColors`来实现。
三组用来切割实现cpr切割，另外一组用来切割下面几张用QLabel显示的图片。每次切割平移8个毫米。
用`QList<QImage>`把几张需要显示的图片传出去。


```cpp
QList<QImage> list;
vtkNew<vtkMatrix4x4>reslice_axes;
for(int i = -24; i < 25; i = i + 8) {
    if(0 == i) {
        continue;
    }
    reslice_axes->DeepCopy(reslice_widget_->GetImageReslicers()[0]->GetResliceAxes());
    reslice_axes->SetElement(0, 3, reslice_axes->GetElement(0, 3) + i);
    reslice_axes->SetElement(1, 3, cpr_center_[1]);
    reslice_axes->SetElement(2, 3, cpr_center_[2]);
    mpr_maker_->GetImageReslice(3)->SetResliceAxes(reslice_axes);
    vtkNew<vtkImageCast>cast;
    cast->SetInputConnection(mpr_maker_->GetImageReslice(3)->GetOutputPort());
    cast->SetOutputScalarTypeToUnsignedChar();
    cast->Update();
    list <<  vtkImageDataToQImage(cast->GetOutput()).mirrored(false, true);
}
emit SgnUpdataCPR(list);
```













