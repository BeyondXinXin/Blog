vtk提取中心线的思路是依次寻找最大内接球，cgal是把模型封闭，让后无线细化成一条线，我测试感觉点会突然离散，不知什么原因

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200119175624415.png#pic_center)

```cpp
vtkSmartPointer<vtkPolyData> RefinementComputingCenterLines(
    const vtkSmartPointer<vtkPolyData> surface) {
    vtkSmartPointer<vtkPolyData> centerline_input_surface;
    // vtk 表面整理
    vtkNew<vtkCleanPolyData> surface_cleaner;
    surface_cleaner->SetInputData(surface);
    surface_cleaner->Update();
    // vtk 三角形相交检查
    vtkNew<vtkTriangleFilter> surface_triangulator;
    surface_triangulator->SetInputConnection(surface_cleaner->GetOutputPort());
    surface_triangulator->PassLinesOff();
    surface_triangulator->PassVertsOff();
    surface_triangulator->Update();
    // vtk 表面封闭
    vtkNew<vtkvmtkCapPolyData> surface_capper;
    surface_capper->SetInputConnection(surface_triangulator->GetOutputPort());
    surface_capper->SetDisplacement(0);
    surface_capper->SetInPlaneDisplacement(0);
    surface_capper->Update();
    surface_cleaner->SetInputData(surface_capper->GetOutput());
    surface_cleaner->Update();
    surface_triangulator->SetInputConnection(surface_cleaner->GetOutputPort());
    surface_triangulator->PassLinesOff();
    surface_triangulator->PassVertsOff();
    surface_triangulator->Update();
    centerline_input_surface = surface_triangulator->GetOutput();
    // 转换为off模型
    STL2OFF("tmp.off", centerline_input_surface);
    // 提取骨骼
    std::ifstream input("tmp.off");
    Polyhedron tmesh;
    input >> tmesh;
    if (!CGAL::is_triangle_mesh(tmesh)) {
        std::cout << "Input geometry is not triangulated." << std::endl;
        return centerline_input_surface;
    }
    Skeleton skeleton;
    CGAL::extract_mean_curvature_flow_skeleton(tmesh, skeleton);
    vtkNew<vtkPoints> points_tmp;
    vtkNew<vtkCellArray> vertices_tmp;
    for (quint32 i = 0; i < boost::num_edges(skeleton); ++i) {
        points_tmp->InsertNextPoint(skeleton[i].point[0],
                                    skeleton[i].point[1],
                                    skeleton[i].point[2]);
        vertices_tmp->InsertNextCell(1);
        vertices_tmp->InsertCellPoint(i);
    }
    vtkNew<vtkPolyData> centerline_output_surface;
    centerline_output_surface->SetPoints(points_tmp);
    centerline_output_surface->SetVerts(vertices_tmp);
    return centerline_output_surface;
}
```

```cpp
void STL2OFF(const QString off_filename,
                      vtkSmartPointer<vtkPolyData> surface_) {
    if (surface_ == nullptr) {
        return;
    }
    if (off_filename.isEmpty()) {
        return;
    }
    double x[3];
    QFile file(off_filename);
    file.open(QIODevice::WriteOnly);
    file.close();
    if (file.open(QIODevice::ReadWrite | QIODevice::Text)) {
        QTextStream stream(&file);
        stream.seek(file.size());
        stream << "OFF" << "\n";
        stream << surface_->GetNumberOfPoints() << " "
               << surface_->GetNumberOfCells() << " 0\n";
        for (qint32 ww = 0; ww < surface_->GetNumberOfPoints() ; ww++) {
            surface_->GetPoint(ww, x);
            stream << x[0] << " " << x[1] << " " << x[2] << "\n";
        }
        for (qint32 ww = 0; ww < surface_->GetNumberOfCells() ; ww++) {
            stream << surface_->GetCell(ww)->GetNumberOfPoints() << " ";
            for (qint32 i = 0; i <
                    surface_->GetCell(ww)->GetNumberOfPoints(); i++) {
                stream << surface_->GetCell(ww)->GetPointId(i) << " ";
            }
            stream << "\n";
        }
        file.close();
    }
}

bool OFF2STL(
    const QString off_filename, vtkSmartPointer<vtkPolyData> surface_) {
    std::string inputFilename = off_filename.toLocal8Bit().data();
    std::ifstream fin(inputFilename.c_str());
    vtkSmartPointer<vtkPolyData> surface = CustomReader(fin);
    vtkSmartPointer<vtkTriangleFilter> triangleFilter =
        vtkSmartPointer<vtkTriangleFilter>::New();
    triangleFilter->SetInputData(surface);
    vtkSmartPointer<vtkPolyDataNormals> normals =
        vtkSmartPointer<vtkPolyDataNormals>::New();
    normals->SetInputConnection(triangleFilter->GetOutputPort());
    normals->ConsistencyOn();
    normals->SplittingOff();
    vtkSmartPointer<vtkMassProperties> massProperties =
        vtkSmartPointer<vtkMassProperties>::New();
    massProperties->SetInputConnection(normals->GetOutputPort());
    massProperties->Update();
    if (massProperties->GetSurfaceArea() > 0.01) {
        surface_ = surface;
        fin.close();
        if (surface_ == nullptr) {
            return false;
        }
        return true;
    }
    return false;
}

vtkSmartPointer<vtkPolyData> CustomReader(istream &infile) {
    char buf[1000];
    infile.getline(buf, 1000);
    if (strcmp(buf, "off") == 0 || strcmp(buf, "OFF") == 0) {
        vtkIdType number_of_points, number_of_triangles, number_of_lines;
        infile >> number_of_points >> number_of_triangles >> number_of_lines;
        vtkSmartPointer<vtkPoints> points
            = vtkSmartPointer<vtkPoints>::New();
        points->SetNumberOfPoints(number_of_points);
        for (vtkIdType i = 0; i < number_of_points; i++) {
            double x, y, z;
            infile >> x >> y >> z;
            points->SetPoint(i, x, y, z);
        }
        vtkSmartPointer<vtkCellArray> polys
            = vtkSmartPointer<vtkCellArray>::New();
        qint32 n;
        vtkIdType type;
        for (vtkIdType i = 0; i < number_of_triangles; i++) {
            infile >> n;
            polys->InsertNextCell(n);
            for (; n > 0; n--) {
                infile >> type;
                polys->InsertCellPoint(type);
            }
        }
        vtkPolyData *polydata = vtkPolyData::New();
        polydata->SetPoints(points);
        polydata->SetPolys(polys);
        return polydata;
    }
    vtkPolyData *polydata = vtkPolyData::New();
    return polydata;
}
```
