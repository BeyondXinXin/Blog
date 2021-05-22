# Study-VTK：提取连通域

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190911185254340.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190911185342874.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


[主要参考:vtk帮助文档](https://lorensen.github.io/VTKExamples/site/Cxx/#surface-reconstruction)
[案例源码](https://lorensen.github.io/VTKExamples/site/Cxx/VisualizationAlgorithms/PineRootConnectivity/)

需要提取stl模型的最大连通域,之前也没接触过,搜了下vtk有现成的连通域处理类 vtkPolyDataConnectivityFilter
具体用法
https://vtk.org/doc/nightly/html/classvtkPolyDataConnectivityFilter.html

vtkpolydataconnectivityfilter是一个筛选器，它提取共享公共点和/或满足标量阈值条件的单元格。
（这样的单元格组称为连通域。）
此筛选器专门用于多边形数据。这意味着它运行得更快，更容易构建处理多边形数据的可视化网络。
可以通过启用布尔ivar scalarconnectivity来修改vtkpolydataconnectivityfilter的行为。如果此标志处于启用状态，则修改连接算法，以便仅当1）单元格是几何连接的（共享一个点）和2）单元格的点的标量值落在指定的标量范围内时，才认为单元格是连接的。如果启用scalarconnectivity和fullscalarconnectivity，则单元格的所有点都必须位于为该单元格指定的标量范围内，才能符合连接条件。如果fullscalarconnectivity处于禁用状态，则单元格的任何一个点都可能位于用户指定的标量范围内，以便单元格符合连接条件。
scalarconnectivity的这种用法对于选择单元格以供以后处理特别有用。

常用函数
1）提取数据集中的最大（最多点）连接区域：SetExtractionModeToLargestRegion();
2）提取指定区域号：SetExtractionModeToSpecifiedRegions();
3）提取共享指定点ids的所有区域：SetExtractionModeToPointSeededRegions();
4）提取共享指定单元ID的所有区域：SetExtractionModeToCellSeededRegions();
5）提取最靠近指定点的区域：SetExtractionModeToClosestPointRegion();
6）提取所有区域（用于着色区域）：SetExtractionModeToAllRegions()

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019091119061951.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

我这里需要提取最大连通域 ,代码如下
```javascript
  vtkSmartPointer<vtkPolyDataConnectivityFilter> connect =
            vtkSmartPointer<vtkPolyDataConnectivityFilter>::New();
        connect->SetInputConnection(surface_reader_->GetOutputPort()->GetOutputPort());
        connect->SetExtractionModeToLargestRegion();
        connect->AddSeed(100);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019091118584943.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)