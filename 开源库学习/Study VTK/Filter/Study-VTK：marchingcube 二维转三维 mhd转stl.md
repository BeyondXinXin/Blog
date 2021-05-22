# Study-VTK：marchingcube 二维转三维 mhd转stl

marchingcube是一个比较经典而古老的算法，也是面绘制中应用比较多的算法，Marchingcube发展到今天也遇到了几何拓扑、一致性的问题仍待改善。在三维规则数据场中构造等值面是计算机视觉也是VTK当中的一个重要的问题，Marching Cubes方法就是解决这个问题的一个成熟的被广泛使用的方法，简称MC方法。VTK当中的vtkMarchingCubes就是对这个方法的代码实现。

vtk 封装好了 vtkMarchingCubes用于二维转为三维
void SetValue (int i, double value) 设置第i个等值面的值为value
void SetNumberOfContours (int number) 设置等值面的个数

[主要参考:vtk帮助文档](https://lorensen.github.io/VTKExamples/site/Cxx/#image-format)
[案例源码](https://github.com/lorensen/VTKWikiExamplesTarballs)
[相关博客 wp_veil](https://blog.csdn.net/wp_veil/article/details/7047537)
vtkmarchingcubes是一个过滤器，它接收一个卷（例如，三维结构化点集）作为输入，并在输出一个或多个等值面时生成。必须指定一个或多个等高线值才能生成等高线。或者，可以指定最小/最大scalarrange和等高线数，以生成一系列等距等高线值。
具体使用案例MedicalDemo1  MedicalDemo2  MedicalDemo3  MedicalDemo4就是官方相关案例

这是我用mhd转stl的过程
其中
vtk_mhd_name_in  是mhd名字
vtk_stl_name_out   是stl名字
```javascript
//vtk 读取mhd转化stl
    vtkSmartPointer<vtkMarchingCubes> vtk_extractor =vtkSmartPointer<vtkMarchingCubes>::New();
    vtkSmartPointer<vtkSTLWriter> vtk_writer_stl =vtkSmartPointer<vtkSTLWriter>::New();
    vtkSmartPointer<vtkMetaImageReader> vtk_reader_mhd =vtkSmartPointer<vtkMetaImageReader>::New();
    vtk_reader_mhd->SetFileName(this_struct.vtk_mhd_name_in.toLocal8Bit().data());
    emit SignalPNG2STLInformationOut("写入stl....");
    emit SignalPNG2STLPercentageCurrentOut(75, 100);
    vtk_extractor->SetInputConnection(vtk_reader_mhd->GetOutputPort());
    vtk_extractor->SetValue(this_struct.vtk_SetValue_begin,this_struct.vtk_SetValue_value);
    vtk_writer_stl->SetFileName( this_struct.vtk_stl_name_out.toLocal8Bit().data());
    vtk_writer_stl->SetInputConnection(vtk_extractor->GetOutputPort());
    vtk_writer_stl->Write();
    emit SignalPNG2STLPercentageCurrentOut(100, 100);
    emit SignalPNG2STLInformationOut("完成....");
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