# VTK绘制螺钉螺纹线

需要在ct三视图上画出来螺钉的每个截面。螺钉的长度和直径都不确定，需要动态调整。
本来计划用一个画好的螺钉缩放，任意拖拽时候变形严重。干脆直接画吧。



## 效果


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.4m3ftpxoj3w0.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.sbifylbqfww.png)





## 项目地址

用现成的**vtkSphereSource**改的

* 案例 [vtkSphereSource](https://vtk.org/doc/nightly/html/classvtkSphereSource.html)
* 修改后工程 ~~[https://github.com/BeyondXinXin/study_vtk](https://github.com/BeyondXinXin/study_vtk)~~


## 原文

[VTK绘制螺钉螺纹线](https://github.com/BeyondXinXin/Blog/blob/master/%E5%BC%80%E6%BA%90%E5%BA%93%E5%AD%A6%E4%B9%A0/Study%20VTK/Widget/VTK%E7%BB%98%E5%88%B6%E8%9E%BA%E9%92%89%E8%9E%BA%E7%BA%B9%E7%BA%BF.md)


## 实现

设定一些参数，计算螺纹线。

```cpp
class VtkPedicleScrewSource : public vtkPolyDataAlgorithm
{
public:
    static VtkPedicleScrewSource * New();
    vtkTypeMacro(VtkPedicleScrewSource, vtkPolyDataAlgorithm);
    void PrintSelf(ostream & os, vtkIndent indent) override;

    vtkSetMacro(Subdivision, int);
    vtkGetMacro(Subdivision, int);
    vtkSetMacro(TopR, double);
    vtkGetMacro(TopR, double);
    vtkSetMacro(Length, double);
    vtkGetMacro(Length, double);
    vtkSetMacro(V, double);
    vtkGetMacro(V, double);
    vtkSetMacro(D, double);
    vtkGetMacro(D, double);
    vtkSetMacro(BottonmR, double);
    vtkGetMacro(BottonmR, double);
    vtkSetMacro(Chamfering, double);
    vtkGetMacro(Chamfering, double);
    vtkSetMacro(Ascending, double);
    vtkGetMacro(Ascending, double);
    vtkSetMacro(GuideHeight, double);
    vtkGetMacro(GuideHeight, double);
    vtkSetMacro(PedicleRotateX, double);
    vtkGetMacro(PedicleRotateX, double);
    vtkSetMacro(PedicleTranslateX, double);
    vtkGetMacro(PedicleTranslateX, double);
    vtkSetMacro(PedicleTranslateY, double);
    vtkGetMacro(PedicleTranslateY, double);
    vtkSetMacro(PedicleTranslateZ, double);
    vtkGetMacro(PedicleTranslateZ, double);
    vtkSetStringMacro(PedicleFileName);
    vtkGetStringMacro(PedicleFileName);

protected:
    VtkPedicleScrewSource(int res = 6);
    ~VtkPedicleScrewSource() override;
    int RequestData(vtkInformation *, vtkInformationVector **, vtkInformationVector *) override;

protected: // 遵循vtk命名
    int OutputPointsPrecision;
    int Subdivision = 40; // 每一圈螺纹细分数量
    double TopR = 3.0; // 圆台顶部半径
    double Length = 55.0; // 总长度
    double V = 0.06; // 螺旋线前进速度
    double D = 0.5; // 螺纹宽度
    double BottonmR = 1.0; // 圆台底部半径
    double Chamfering = 0.3; // 螺纹倒角
    double Ascending = 0.3; // 螺栓倒角
    double GuideHeight = 150; // 引导线高度

    // 模型坐标系乱选的，让他们最后重新提供吧
    double PedicleRotateX = 180;
    double PedicleTranslateX = -5;
    double PedicleTranslateY = 7;
    double PedicleTranslateZ = 18;
    char * PedicleFileName; // 椎弓根名称

private:
    VtkPedicleScrewSource(const VtkPedicleScrewSource &) = delete;
    void operator=(const VtkPedicleScrewSource &) = delete;
};



int VtkPedicleScrewSource::RequestData(
  vtkInformation * vtkNotUsed(request),
  vtkInformationVector ** vtkNotUsed(inputVector),
  vtkInformationVector * outputVector)
{
    vtkInformation * outInfo = outputVector->GetInformationObject(0);
    vtkPolyData * output = vtkPolyData::SafeDownCast(outInfo->Get(vtkDataObject::DATA_OBJECT()));
    //
    std::vector<int> triangle_cell {
        0, 2, 6, 0, 4, 6, 1, 3, 7, 1, 5, 7,
        0, 1, 5, 0, 4, 5, 2, 3, 7, 2, 6, 7,
        0, 1, 3, 0, 2, 3, 0, 1, 5, 0, 4, 5,
        0, 2, 6, 0, 4, 6, 2, 3, 7, 2, 6, 7,
        1, 5, 0, 3, 7, 0
    };

    // 螺钉---螺纹
    vtkNew<vtkPolyData> screw_1;
    vtkNew<vtkPoints> points_1;
    vtkNew<vtkCellArray> cells_1;
    vtkNew<vtkTriangle> trianle;
    double Omega = M_PI * 2.0 / Subdivision; // 角速度
    double H = (Length - 16) * TopR / (TopR - BottonmR); // 圆锥高度
    vtkIdType number = static_cast<vtkIdType>(H * (TopR - BottonmR) / (V * TopR)); // 螺旋线点总数
    int begin_t = static_cast<int>(H * BottonmR / (V * TopR)); // 螺旋线起始时间（圆台底部）
    // 螺钉---螺纹---四条螺旋线 points
    for (int i = 0; i < number; i++) {
        int T = begin_t + i;
        double x = TopR * V * T / H * cos(Omega * T);
        double y = TopR * V * T / H * sin(Omega * T);
        double z = V * T + Ascending;
        points_1->InsertNextPoint(x, y, z);
        z -= D + Ascending * 2;
        points_1->InsertNextPoint(x, y, z);
        if (i < Subdivision * 2) {
            x += TopR * cos(Omega * T) * (1 - V * T / H) * (i + 1) / (Subdivision * 2);
            y += TopR * sin(Omega * T) * (1 - V * T / H) * (i + 1) / (Subdivision * 2);
        } else {
            x = TopR * cos(Omega * T);
            y = TopR * sin(Omega * T);
        }
        z = V * T;
        points_1->InsertNextPoint(x, y, z);
        z -= D;
        points_1->InsertNextPoint(x, y, z);
    }
    // 螺钉---螺纹---螺纹 cells
    for (int i = 0; i < number * 4 - 4; i = i + 4) {
        for (unsigned long long j = 0; j < 8; j++) {
            trianle->GetPointIds()->SetId(0, i + triangle_cell.at(j * 3 + 0));
            trianle->GetPointIds()->SetId(1, i + triangle_cell.at(j * 3 + 1));
            trianle->GetPointIds()->SetId(2, i + triangle_cell.at(j * 3 + 2));
            cells_1->InsertNextCell(trianle);
        }
    }
    screw_1->SetPoints(points_1);
    screw_1->SetPolys(cells_1);
    // 螺钉---圆台
    vtkNew<vtkPolyData> screw_2;
    vtkNew<vtkPoints> points_2;
    vtkNew<vtkCellArray> cells_2;
    for (int i = 0; i < Subdivision; i++) {
        double x = BottonmR * cos(Omega * i);
        double y = BottonmR * sin(Omega * i);
        double z = V * begin_t - Ascending - D;
        points_2->InsertNextPoint(x, y, z);
        x = (BottonmR - Chamfering) * cos(Omega * i);
        y = (BottonmR - Chamfering) * sin(Omega * i);
        z -= Chamfering;
        points_2->InsertNextPoint(x, y, z);
        x = TopR * cos(Omega * i);
        y = TopR * sin(Omega * i);
        z = V * (static_cast<double>(begin_t + number)) + Ascending;
        points_2->InsertNextPoint(x, y, z);
        x = (TopR - Chamfering) * cos(Omega * i);
        y = (TopR - Chamfering) * sin(Omega * i);
        z += Chamfering;
        points_2->InsertNextPoint(x, y, z);
    }
    double x = BottonmR * cos(Omega * 0);
    double y = BottonmR * sin(Omega * 0);
    double z = V * begin_t - Ascending - D;
    points_2->InsertNextPoint(x, y, z);
    x = (BottonmR - Chamfering) * cos(Omega * 0);
    y = (BottonmR - Chamfering) * sin(Omega * 0);
    z -= Chamfering;
    points_2->InsertNextPoint(x, y, z);
    x = TopR * cos(Omega * 0);
    y = TopR * sin(Omega * 0);
    z = V * (static_cast<double>(begin_t + number)) + Ascending;
    points_2->InsertNextPoint(x, y, z);
    x = (TopR - Chamfering) * cos(Omega * 0);
    y = (TopR - Chamfering) * sin(Omega * 0);
    z += Chamfering;
    points_2->InsertNextPoint(x, y, z);
    points_2->InsertNextPoint(0, 0, V * begin_t - Ascending - Chamfering - D);
    points_2->InsertNextPoint(0, 0, V * (static_cast<double>(begin_t + number)) + Ascending + Chamfering);
    for (unsigned long long j = 8; j < 10; j++) {
        trianle->GetPointIds()->SetId(0, triangle_cell.at(j * 3 + 0));
        trianle->GetPointIds()->SetId(1, triangle_cell.at(j * 3 + 1));
        trianle->GetPointIds()->SetId(2, triangle_cell.at(j * 3 + 2));
        cells_2->InsertNextCell(trianle);
    }
    for (int i = 0; i < Subdivision; i++) {
        vtkIdType offset = i * 4;
        for (unsigned long long j = 10; j < 16; j++) {
            trianle->GetPointIds()->SetId(0, offset + triangle_cell.at(j * 3 + 0));
            trianle->GetPointIds()->SetId(1, offset + triangle_cell.at(j * 3 + 1));
            trianle->GetPointIds()->SetId(2, offset + triangle_cell.at(j * 3 + 2));
            cells_2->InsertNextCell(trianle);
        }
        trianle->GetPointIds()->SetId(0, offset + triangle_cell.at(16 * 3 + 0));
        trianle->GetPointIds()->SetId(1, offset + triangle_cell.at(16 * 3 + 1));
        trianle->GetPointIds()->SetId(2, (Subdivision + 1) * 4);
        cells_2->InsertNextCell(trianle);
        trianle->GetPointIds()->SetId(0, offset + triangle_cell.at(17 * 3 + 0));
        trianle->GetPointIds()->SetId(1, offset + triangle_cell.at(17 * 3 + 1));
        trianle->GetPointIds()->SetId(2, (Subdivision + 1) * 4 + 1);
        cells_2->InsertNextCell(trianle);
    }
    screw_2->SetPoints(points_2);
    screw_2->SetPolys(cells_2);
    // 螺钉
    vtkNew<vtkAppendPolyData> screw_append;
    screw_append->AddInputData(screw_2);
    screw_append->AddInputData(screw_1);
    vtkNew<vtkTransform> screw_translation;
    screw_translation->Translate(0, 0, -1 * (V * (static_cast<double>(begin_t + number)) + Ascending + Chamfering));
    vtkNew<vtkTransformPolyDataFilter> screw_transform;
    screw_transform->SetInputConnection(screw_append->GetOutputPort());
    screw_transform->SetTransform(screw_translation);
    // 椎弓根
    vtkNew<vtkPolyData> pedicle;
    vtkNew<vtkSTLReader> pedicle_reader;
    pedicle_reader->SetFileName(PedicleFileName);
    vtkNew<vtkTransform> pedicle_translation;
    pedicle_translation->Translate(PedicleTranslateX, PedicleTranslateY, PedicleTranslateZ);
    pedicle_translation->RotateX(PedicleRotateX);
    vtkNew<vtkTransformPolyDataFilter> pedicle_transform;
    pedicle_transform->SetInputConnection(pedicle_reader->GetOutputPort());
    pedicle_transform->SetTransform(pedicle_translation);
    // 引导线
    vtkNew<vtkCylinderSource> guide_line;
    guide_line->SetHeight(GuideHeight);
    guide_line->SetCenter(0, -0.5 * GuideHeight, 0);
    guide_line->SetRadius(0.2);
    vtkNew<vtkTransform> guide_translation;
    guide_translation->RotateX(-90);
    vtkNew<vtkTransformPolyDataFilter> guide_transform;
    guide_transform->SetInputConnection(guide_line->GetOutputPort());
    guide_transform->SetTransform(guide_translation);
    // 组合
    vtkNew<vtkAppendPolyData> out_append;
    out_append->AddInputConnection(screw_transform->GetOutputPort());
    out_append->AddInputConnection(pedicle_transform->GetOutputPort());
    out_append->AddInputConnection(guide_transform->GetOutputPort());
    // 螺栓是按照 xy->z 画的，显示是xz->y
    out_append->Update();
    double center[3];
    out_append->GetOutput()->GetCenter(center);
    vtkNew<vtkTransform> out_translation;
    out_translation->PostMultiply();
    out_translation->Translate(0, 0, center[2]);
    out_translation->RotateX(90);
    out_translation->Translate(0, center[2], 0);
    out_translation->Translate(0, -Length + 16 - 2 * D - Chamfering - Ascending, 0);
    vtkNew<vtkTransformPolyDataFilter> out_transform;
    out_transform->SetInputConnection(out_append->GetOutputPort());
    out_transform->SetTransform(out_translation);
    out_transform->Update();
    output->DeepCopy(out_transform->GetOutput());
    return 1;
}
```


使用

```cpp
int main(int argc, char *argv[])
{
    QApplication::setAttribute(Qt::AA_DontCheckOpenGLContextThreadAffinity);
    QGuiApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
    QGuiApplication::setAttribute(Qt::AA_UseHighDpiPixmaps);
    QApplication a(argc, argv);
    vtkNew<VtkPedicleScrewSource> poly_data;
    { // 选填
        poly_data->SetSubdivision(40); // 每一圈螺纹细分数量
        poly_data->SetTopR(3.0); // 圆台顶部半径
        poly_data->SetLength(56.0); // 圆锥高度（不是圆台高度）
        poly_data->SetV(0.06); // 螺旋线前进速度
        poly_data->SetD(0.5); // 螺纹宽度
        poly_data->SetBottonmR(1.0); // 圆台底部半径
        poly_data->SetChamfering(0.3); // 螺纹倒角
        poly_data->SetAscending(0.3); // 螺栓倒角
        poly_data->SetGuideHeight(150); // 引导线高度
        // 模型坐标系乱选的，让他们最后重新提供吧
        poly_data->SetPedicleRotateX(180);
        poly_data->SetPedicleTranslateX(-5);
        poly_data->SetPedicleTranslateY(7);
        poly_data->SetPedicleTranslateZ(18);
    }
    { // 必填
        poly_data->SetPedicleFileName("./etc/Pedicle_screw.STL"); // 椎弓根文件名称
    }
    std::cout << *poly_data << std::endl;
    poly_data->Update();
    ShowVtkDebugPolydata(poly_data->GetOutput());
    return 0;
}

```










