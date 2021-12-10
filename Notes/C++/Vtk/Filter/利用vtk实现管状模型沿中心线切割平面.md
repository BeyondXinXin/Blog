# 利用vtk实现管状模型沿中心线切割平面


&emsp;&emsp;需求就是一个管状的模型（两个开口），实现提取其中心线并沿着中心线切线方向切割模型提取平面（中心线每个点负法线方向是新平面y轴，中心线每个点切向量是新平面z轴）。用**vtkvmtkPolyDataCenterlines**实现中心线提取，用**vtkFrenetSerretFrame**实现中心校切向量和负法向量计算，用**vtkCutter**实现平面裁切。





### 1. 原始模型

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020112418361714.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
### 2. 封闭并压缩模型（压缩为了快速提取中心线）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201124183629269.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
### 3. 模型中心线
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201124183642736.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

### 4. 根据中心线法向量开始裁切
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201124183651953.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
### 5. 所有裁切后平面点画在一起
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201124183748281.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
### 6. 抽取其中一层比较，红色是从模型上裁切出来的。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201124184212328.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
### 7 实现代码

```cpp
void ModelCutting();

int main(int, char *[]) {
    ModelCutting();
    return 0;
}


//----------------------------------------------------------
/**
 * @brief GetDotDistance 求两点距离
 * @param p
 * @param x
 * @return
 */
double GetDotDistance(const double p[3], const double x[3]) {
    return   sqrt((p[0] - x[0]) * (p[0] - x[0]) +
                  (p[1] - x[1]) * (p[1] - x[1]) +
                  (p[2] - x[2]) * (p[2] - x[2]));
}

//----------------------------------------------------------
/**
 * @brief AffineTransformation 空间坐标系变换
 * @param coordinate_x
 * @param coordinate_y
 * @param coordinate_z
 * @param center
 * @param point
 * @param outpoint
 */
void AffineTransformation(
    const QList<double> coordinate_x,
    const QList<double> coordinate_y,
    const QList<double> coordinate_z,
    const QList<double> center,
    const QList<double> point,
    QList<double> &outpoint) {
    outpoint << (point.at(0) - center.at(0)) * coordinate_x.at(0)
             + (point.at(1) - center.at(1)) * coordinate_x.at(1)
             + (point.at(2) - center.at(2)) * coordinate_x.at(2) ;
    outpoint << (point.at(0) - center.at(0)) * coordinate_y.at(0)
             + (point.at(1) - center.at(1)) * coordinate_y.at(1)
             + (point.at(2) - center.at(2)) * coordinate_y.at(2);
    outpoint << (point.at(0) - center.at(0)) * coordinate_z.at(0)
             + (point.at(1) - center.at(1)) * coordinate_z.at(1)
             + (point.at(2) - center.at(2)) * coordinate_z.at(2);
}

//----------------------------------------------------------
/**
 * @brief GetVerticalVector 已知x、z求y轴向量
 * @param coordinate_z z轴向量
 * @param coordinate_x x轴向量
 * @param coordinate_y y轴向量
 */
void GetVerticalVector(const QList<double> coordinate_z,
                       const QList<double> coordinate_x,
                       QList<double> &coordinate_y) {
    coordinate_y[0] = coordinate_x[1] * coordinate_z[2] - coordinate_x[2] * coordinate_z[1];
    coordinate_y[1] = coordinate_x[2] * coordinate_z[0] - coordinate_x[0] * coordinate_z[2];
    coordinate_y[2] = coordinate_x[0] * coordinate_z[1] - coordinate_x[1] * coordinate_z[0];
}

//----------------------------------------------------------
/**
 * @brief GetTwoPointUnitVector 获取两点组成的单位向量
 * @param point_1
 * @param point_2
 * @param unit_vctor
 */
void GetTwoPointUnitVector(const QList<double> &point_1,
                           const QList<double> &point_2,
                           QList<double> &unit_vctor) {
    QList<double> vctor;
    vctor << point_2.at(0) - point_1.at(0)
          << point_2.at(1) - point_1.at(1)
          << point_2.at(2) - point_1.at(2);
    double distance = vctor.at(0) * vctor.at(0) +
                      vctor.at(1) * vctor.at(1) +
                      vctor.at(2) * vctor.at(2);
    distance = sqrt(distance);
    unit_vctor.clear();
    unit_vctor << vctor.at(0) / distance;
    unit_vctor << vctor.at(1) / distance;
    unit_vctor << vctor.at(2) / distance;
}

//----------------------------------------------------------
/**
 * @brief ScatterGeneratePng
 * 散点图转png
 * @param point
 * @param spacing
 * @param size
 */
void ScatterGeneratePng(const QList<QList<double>> &point,
                        const char *out_name,
                        const char *in_name,
                        const double spacing = 0.4296875,
                        const qint32 zoom = 10) {
    cv::Mat src = cv::imread(in_name);
    // flip(src, src, -1); //rotate 180
    qint32 sisze = src.rows * zoom;
    double new_spacing = spacing / zoom;
    double center = (sisze * new_spacing) / 2.0;
    cv::resize(src, src, cv::Size(sisze, sisze));
    foreach (auto var, point) {
        qint32 x = sisze - static_cast<qint32>(
                       (center + var.at(0)) / new_spacing );
        qint32 y = static_cast<qint32>(
                       (center - var.at(1)) / new_spacing );
        src.at<cv::Vec3b>(y, x)[2] = 255;
    }
    cv::imwrite(out_name, src);
}

//----------------------------------------------------------
/**
 * @brief ComputingCenterLines
 * 提取中心线
 * @param surface
 * @return
 */
vtkSmartPointer<vtkPolyData> ComputingCenterLines(
    vtkSmartPointer<vtkPolyData> surface) {
    qDebug() << "ComputingCenterLines begin";
    // 模型压缩
    vtkNew<vtkDecimatePro> decimation1;
    decimation1->SetInputData(surface);
    decimation1->SetTargetReduction(0.95);
    decimation1->Update();
    // 表面整理
    vtkNew<vtkCleanPolyData> surface_cleaner;
    surface_cleaner->SetInputData(decimation1->GetOutput());
    surface_cleaner->Update();
    // 三角形相交检查
    vtkNew<vtkTriangleFilter> surface_triangulator;
    surface_triangulator->SetInputConnection(surface_cleaner->GetOutputPort());
    surface_triangulator->PassLinesOff();
    surface_triangulator->PassVertsOff();
    surface_triangulator->Update();
    vtkSmartPointer<vtkPolyData> centerline_input_surface =
        surface_triangulator->GetOutput();
    vtkSmartPointer<vtkIdList> cap_center_ids = nullptr;
    vtkSmartPointer<vtkvmtkCapPolyData> surface_capper;
    // 表面封闭
    surface_capper = vtkSmartPointer<vtkvmtkCapPolyData>::New();
    surface_capper->SetInputConnection(surface_triangulator->GetOutputPort());
    surface_capper->SetDisplacement(0);
    surface_capper->SetInPlaneDisplacement(0);
    surface_capper->Update();
    centerline_input_surface = surface_capper->GetOutput();
    cap_center_ids = surface_capper->GetCapCenterIds();
    VtkUtil::ShowVtkDebugPolydata(centerline_input_surface,
                                  "Closed model  " +
                                  QString::number(cap_center_ids->GetNumberOfIds()) +
                                  "  holes");
    // 计算中心线
    vtkNew<vtkIdList> inlet_seed_ids, outlet_seed_ids;
    inlet_seed_ids->InsertNextId(0);
    outlet_seed_ids->InsertNextId(1);
    vtkNew<vtkvmtkPolyDataCenterlines> centerline_filter;
    centerline_filter->SetInputData(centerline_input_surface);
    centerline_filter->SetCapCenterIds(cap_center_ids);
    centerline_filter->SetSourceSeedIds(inlet_seed_ids);
    centerline_filter->SetTargetSeedIds(outlet_seed_ids);
    centerline_filter->SetRadiusArrayName("MaximumInscribedSphereRadius");
    centerline_filter->SetCostFunction("1/R");
    centerline_filter->SetFlipNormals(0);
    centerline_filter->SetAppendEndPointsToCenterlines(0);// 从端点开始
    centerline_filter->SetSimplifyVoronoi(0);
    centerline_filter->SetCenterlineResampling(0);
    centerline_filter->SetResamplingStepLength(1.0);
    centerline_filter->Update();
    qDebug() << "ComputingCenterLines end";
    return centerline_filter->GetOutput();
}

//----------------------------------------------------------
/**
 * @brief SplinePoints 平滑点
 * @param adjust_list
 * @param spline_list
 * @param resolution
 * @return
 */
bool SplinePoints(const QList<QList<double>> &adjust_list,
                  QList<QList<double>> &spline_list, qint32 resolution) {
    vtkNew<vtkPoints> points;
    for (qint32 i = 0; i < adjust_list.size(); ++i) {
        points->InsertPoint(static_cast<vtkIdType>(i),
                            adjust_list[i][0], adjust_list[i][1], adjust_list[i][2]);
    }
    vtkNew<vtkCellArray> lines;
    lines->InsertNextCell(adjust_list.size());
    vtkNew<vtkPolyData> poly_data;
    for (qint32 i = 0; i < adjust_list.size(); ++i) {
        lines->InsertCellPoint(static_cast<vtkIdType>(i));
    }
    poly_data->SetPoints(points);
    poly_data->SetLines(lines);
    vtkNew<vtkCardinalSpline> spline;
    spline->SetLeftConstraint(2);
    spline->SetLeftValue(0.0);
    spline->SetRightConstraint(2);
    spline->SetRightValue(0.0);
    vtkNew<vtkSplineFilter> filter;
    filter->SetInputData(poly_data);
    filter->SetNumberOfSubdivisions(resolution - 1);
    filter->SetSpline(spline);
    filter->Update();
    double temp_point[3];
    for (qint32 i = 0; i < filter->GetOutput()->GetNumberOfPoints(); ++i) {
        filter->GetOutput()->GetPoint(i, temp_point);
        spline_list.append({temp_point[0], temp_point[1], temp_point[2]});
    }
    return true;
}

//----------------------------------------------------------
/**
 * @brief ModelCutting
 * 模型切割
 */
void ModelCutting() {
    QList<QList<double>> ivus_edge_points_;
    qint32 guide_number = 155;
    // 读取模型
    vtkSmartPointer<vtkPolyData> surface;
    VtkUtil::ReadSTL(surface, "/home/arteryflow/图片/DicomData/ProCTR/mesh.stl");
    VtkUtil::ShowVtkDebugPolydata(surface);
    // 提取中心线
    vtkSmartPointer<vtkPolyData> center_line =
        vtkSmartPointer<vtkPolyData>::New();
    center_line = ComputingCenterLines(surface);
    VtkUtil::ShowVtkDebugPolydata(center_line);
    vtkSmartPointer<vtkPoints> points_center = vtkSmartPointer<vtkPoints>::New();
    for(qint32 id = 0; id < center_line->GetNumberOfPoints(); id++) {
        points_center->InsertNextPoint(
            center_line->GetPoint(center_line->GetNumberOfPoints() - 1 - id)[0],
            center_line->GetPoint(center_line->GetNumberOfPoints() - 1 - id)[1],
            center_line->GetPoint(center_line->GetNumberOfPoints() - 1 - id)[2]);
    }
    vtkNew<vtkParametricSpline> spline_center;
    spline_center->SetPoints(points_center);
    vtkNew<vtkParametricFunctionSource> functionSource_center ;
    functionSource_center->SetParametricFunction(spline_center);
    functionSource_center->SetUResolution(guide_number - 1);
    functionSource_center->SetVResolution(guide_number - 1);
    functionSource_center->SetWResolution(guide_number - 1);
    functionSource_center->Update();
    center_line = functionSource_center->GetOutput();
    VtkUtil::ShowVtkDebugPolydata(center_line,
                                  surface,
                                  "check");
    //
    vtkNew<vtkFrenetSerretFrame> frame;
    frame->SetInputData(center_line);
    frame->ConsistentNormalsOn();
    frame->Update();
    // 副法向量 x轴方向
    frame->GetOutput()->GetPointData()->SetActiveVectors("FSBinormals");
    vtkSmartPointer<vtkDataArray> guide_auxiliary =
        frame->GetOutput()->GetPointData()->GetVectors();
    // 导丝切向量 z轴方向
    frame->GetOutput()->GetPointData()->SetActiveVectors("FSTangents");
    vtkSmartPointer<vtkDataArray> guide_tange_vector =
        frame->GetOutput()->GetPointData()->GetVectors();
    //创建切割平面
    vtkNew<vtkPlane> plane;
    vtkNew<vtkCutter> cutter;
    for(qint32 i = 0; i < guide_number ; ++i) {
        double tmpdouble[3];
        // 中心点
        center_line->GetPoint(i, tmpdouble);
        QList<double> center = {tmpdouble[0], tmpdouble[1], tmpdouble[2]};
        // 新坐标z轴 单位向量
        guide_tange_vector->GetTuple(i, tmpdouble);
        QList<double> coordinate_z = {tmpdouble[0], tmpdouble[1], tmpdouble[2]};
        // 新坐标x轴 单位向量
        guide_auxiliary->GetTuple(i, tmpdouble);
        QList<double> coordinate_x = {tmpdouble[0], tmpdouble[1], tmpdouble[2]};
        // 新坐标y轴 单位向量
        QList<double> coordinate_y = {0, 0, 0};
        GetVerticalVector(coordinate_z, coordinate_x, coordinate_y);
        //
        double p[3];
        center_line->GetPoint(i, p);
        frame->GetOutput()->GetPointData()->SetActiveVectors("FSTangents");
        vtkDataArray *ptNormals2 = frame->GetOutput()->GetPointData()->GetVectors();
        double value[3];
        ptNormals2->GetTuple(i, value);
        plane->SetOrigin(p[0], p[1], p[2]); //设置切割平面起点
        plane->SetNormal(value[0], value[1], value[2]); //设置切割方向为X方向
        cutter->SetCutFunction(plane);//设置切割平面
        cutter->SetInputData(surface);//设置模型
        cutter->GenerateCutScalarsOn();
        cutter->Update();
        vtkSmartPointer<vtkPolyData> ResultPoly =  cutter->GetOutput();
        qint64 n = ResultPoly->GetNumberOfPoints();
        QList<QList<double>> in_points;
        for(qint32 j = 0; j < n; j++) {
            double x[3];
            ResultPoly->GetPoint(j, x); //获取顶点坐标
            if(GetDotDistance(p, x) < 5) {
                QList<double> src_point = {x[0], x[1], x[2]};
                QList<double> out_points;
                AffineTransformation(
                    coordinate_x, coordinate_y, coordinate_z, center, src_point, out_points);
                in_points << out_points;
            }
        }
        SplinePoints(in_points, in_points, 200);
        ScatterGeneratePng(in_points
                           , QString("/home/arteryflow/桌面/tmp/%1.png")
                           .arg(guide_number - i).toLocal8Bit().data()
                           , QString("/home/arteryflow/图片/DicomData/ProCTR//save-mutiVOI(21x21)/%1.bmp")
                           .arg(guide_number - i).toLocal8Bit().data()
                          );
        ivus_edge_points_ << in_points;
    }
    vtkNew<vtkPoints> points;
    vtkNew<vtkCellArray> vertices;
    for (qint32 i = 0; i < ivus_edge_points_.size(); ++i) {
        points->InsertNextPoint(ivus_edge_points_[i][0],
                                ivus_edge_points_[i][1],
                                ivus_edge_points_[i][2]);
        vertices->InsertNextCell(1);
        vertices->InsertCellPoint(i);
    }
    vtkNew<vtkPolyData> poly_data_tmp;
    poly_data_tmp->SetPoints(points);
    poly_data_tmp->SetVerts(vertices);
    VtkUtil::ShowVtkDebugPolydata( poly_data_tmp, "check");
}

```
