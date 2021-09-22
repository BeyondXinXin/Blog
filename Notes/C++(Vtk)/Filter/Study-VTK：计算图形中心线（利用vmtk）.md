# Study-VTK：计算图形中心线（利用vmtk）

![在这里插入图片描述](https://img-blog.csdnimg.cn/202001041633405.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200104163403135.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

原理  [http://lantiga.github.com/media/AntigaPhDThesis.pdf](http://lantiga.github.com/media/AntigaPhDThesis.pdf)
把模型封闭，选取输入输出点，依次求内切球，圆心为中心线。

```cpp
    /*!
     * \brief 计算中心线
     */
vtkSmartPointer<vtkPolyData> MatUtil::ComputingCenterLines(
    vtkSmartPointer<vtkPolyData> surface) {
    // 表面整理
    vtkNew<vtkCleanPolyData> surface_cleaner;
    surface_cleaner->SetInputData(surface);
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
    vtkNew<vtkIdList> inlet_seed_ids, outlet_seed_ids;
    inlet_seed_ids->InsertNextId(0);
    outlet_seed_ids->InsertNextId(1);
    // 计算中心线
    vtkNew<vtkvmtkPolyDataCenterlines> centerline_filter;
    centerline_filter->SetInputData(centerline_input_surface);
    centerline_filter->SetCapCenterIds(cap_center_ids);
    centerline_filter->SetSourceSeedIds(inlet_seed_ids);
    centerline_filter->SetTargetSeedIds(outlet_seed_ids);
    centerline_filter->SetRadiusArrayName("MaximumInscribedSphereRadius");
//    centerline_filter->SetCostFunction("1/R");
    centerline_filter->SetFlipNormals(0);
    centerline_filter->SetAppendEndPointsToCenterlines(1);
    centerline_filter->SetSimplifyVoronoi(0);
    centerline_filter->SetCenterlineResampling(0);
    centerline_filter->SetResamplingStepLength(1);
    centerline_filter->Update();
    return centerline_filter->GetOutput();
}
```
上边这段程序只适用于管状模型（两个口，分别为入口和出口，不存在交叉），如果模型有多个出入口则需要更改
**vtkNew< vtkIdList > inlet_seed_ids, outlet_seed_ids;**，自行设计选择器，确定输入输出端口。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200104163802880.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

**vtkvmtkPolyDataCenterlines**需要把模型打散，根据入口挨个寻找内切球，效率比较低。20M左右的管状模型提取中心线大概50s左右。为了提高效率可以先对模型进行压缩，用压缩后模型找中心线，再跟压缩前模型融合浏览。

```cpp
 vtkNew<vtkDecimatePro> decimation;
 decimation->SetInputConnection(extract_surface->GetOutputPort());
 decimation->SetTargetReduction(0.9);//
 decimation->Update();
```

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)