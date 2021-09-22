# Study-VTK：三维影像实现任意方向、大小的切割

@[TOC](Study-VTK：实现任意平面的切割)


# 0 背景：
&emsp;&emsp;vtk关于三维影像（图片）的提取有两个类，**vtkExtractVOI**和**vtkImageReslice**。合理运用这两个可以实现任意大小、方向的三维影像切割。
&emsp;&emsp;doxygen文档：[vtkExtractVOI](https://vtk.org/doc/nightly/html/classvtkExtractVOI.html)、[vtkImageReslice](https://vtk.org/doc/nightly/html/classvtkImageReslice.html)

# 1 案例：
&emsp;&emsp;用这两个类实现的demo，先用**vtkImageReslice**过影像中心，和process坐标系切割影像。让后计算四个点到中心距离换算为新影像上对应的坐标，再用**vtkExtractVOI**切割。实现任意方向、大小的模型切割。这种方式一次只能且两个轴，所以再重复一次（第二次x和y正好反向）。计算时候不能忽略间隙，否则新切割出来的会变形。
- process x轴：长轴（鼠标选的前两个点）方向；
- process y轴：original 的Z轴方向；
- process z轴：鼠标选的后两个点方向。

&emsp;&emsp;四个点选择使用的是**vtkBiDimensionalWidget**

![请添加图片描述](https://img-blog.csdnimg.cn/2020051613083416.gif)![请添加图片描述](https://img-blog.csdnimg.cn/2020051613083472.gif)


# 2切割类介绍
## 3.0 vtkExtractVOI
&emsp;&emsp;vtkExtractVOI是一个筛选器，用于选择一部分输入结构化点数据集或对输入数据集进行子采样。（感兴趣的选定部分称为感兴趣的体积或VOI。）此过滤器的输出是结构化的点数据集。该过滤器处理任何拓扑尺寸（即点，线，图像或体积）的输入数据，并可以生成任何拓扑尺寸的输出数据。
&emsp;&emsp;要使用此过滤器，请设置VOI ivar，它们是ijk最小/最大索引，用于指定数据中的矩形区域。（请注意，这些是0偏移。）您还可以指定采样率对数据进行二次采样。
&emsp;&emsp;该过滤器的典型应用是从体积中提取切片以进行图像处理，对大体积进行二次采样以减小数据大小，或使用感兴趣的数据提取体积区域。
&emsp;&emsp;用法：
```cpp
virtual void 	SetVOI (int[6]) 
// 提取roi在原来影像坐标系上的对角坐标
virtual void 	SetSampleRate (int, int, int)
// xyz三个轴上的采样频率
```
## 3.1 vtkImageReslice
&emsp;&emsp;沿一组新轴重新切割体积。
&emsp;&emsp;**vtkImageReslice**是图像几何过滤器的瑞士军刀：它可以以相当高的效率以任意组合来置换，旋转，翻转，缩放，重采样，变形和填充图像数据。
&emsp;&emsp;用法：

```cpp
    SetOutputDimensionality (int);
    // 设置输出 结果是几维的 1/2/3
    SetResliceAxes (vtkMatrix4x4 *);
    // 设置变换矩阵
    SetInterpolationModeToLinear();
    // 设置采样方法
```
&emsp;&emsp;变换矩阵有很多接口输入
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516134226152.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;重采样方法：线性、三次线性、最邻近
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516134301862.png#pic_center)




# 3 案例实现
## 1.1 切割的实现：
&emsp;&emsp;计算新坐标系用**vtkImageReslice**切割

```cpp
    QList<QList<double>>points = original_bidimensional_->GetDisplayPosition();
    QList<double> center = vti_original_widget_->GetCenter();
    QList<double> origin = vti_original_widget_->GetOrigin();
    QList<double> spacing = vti_original_widget_->GetSpacing();
    QList<qint32> extent = vti_original_widget_->GetExtent();
    double k = (points.at(0).at(1) - points.at(1).at(1)) /
               (points.at(0).at(0) - points.at(1).at(0));
    double jiaodu = atan(k);
    double axialElements[16] = {
        cos(jiaodu), 0, cos(jiaodu + 1.57), 0,
        sin(jiaodu), 0,  sin(jiaodu + 1.57), 0,
        0, 1, 0, 0,
        0, 0, 0, 1
    };
    vtkNew<vtkMatrix4x4> resliceAxes ;
    resliceAxes->DeepCopy(axialElements);
    resliceAxes->SetElement(0, 3, center.at(0));
    resliceAxes->SetElement(1, 3, center.at(1));
    resliceAxes->SetElement(2, 3, center.at(2));
    vtkNew<vtkImageReslice> reslice;
    reslice->SetInputData(vti_original_widget_->GetVtkImageData());
    reslice->SetOutputDimensionality(3);
    reslice->SetResliceAxes(resliceAxes);
    reslice->SetInterpolationModeToLinear();
    reslice->Update();
```
&emsp;&emsp;计算距离，用**vtkExtractVOI**提取。

```cpp
int dims[3];
    reslice->GetOutput()->GetDimensions(dims);
    vtkNew<vtkExtractVOI>  extract_voi;
    extract_voi->SetInputData(reslice->GetOutput());
    qint32 new_z1, new_z2, new_y1, new_y2;
    {
        double b = center.at(1) - center.at(0) * k;
        double line_a, line_b, line_c;
        line_a = k;
        line_b = -1;
        line_c = b;
        double length1, length2;
        length1 = abs(line_a * points.at(2).at(0) +
                      line_b * points.at(2).at(1) +
                      line_c)
                  / sqrt(line_a * line_a + line_b * line_b);
        length2 = abs(line_a * points.at(3).at(0) +
                      line_b * points.at(3).at(1) +
                      line_c)
                  / sqrt(line_a * line_a + line_b * line_b);
        new_z1 =
            static_cast<qint32>(0.5 * (extent.at(1) - extent.at(0)) - length1 / spacing.at(0));
        new_z2 =
            static_cast<qint32>(0.5 * (extent.at(1) - extent.at(0)) + length2 / spacing.at(0));
    }
    {
        double b = center.at(1) - center.at(0) * (-1 / k);
        double line_a, line_b, line_c;
        line_a = -1 / k;
        line_b = -1;
        line_c = b;
        double length1, length2;
        length1 = abs(line_a * points.at(1).at(0) +
                      line_b * points.at(1).at(1) +
                      line_c)
                  / sqrt(line_a * line_a + line_b * line_b);
        length2 = abs(line_a * points.at(0).at(0) +
                      line_b * points.at(0).at(1) +
                      line_c)
                  / sqrt(line_a * line_a + line_b * line_b);
        new_y1 =
            static_cast<qint32>(0.5 * (extent.at(3) - extent.at(2)) -
                                (length1 / spacing.at(0)));
        new_y2 =
            static_cast<qint32>(0.5 * (extent.at(3) - extent.at(2)) +
                                (length2 / spacing.at(0)));
    }
    extract_voi->SetVOI(
        new_y1 > new_y2 ? new_y2 : new_y1,
        new_y1 > new_y2 ? new_y1 : new_y2,
        0, dims[1],
        new_z1 > new_z2 ? new_z2 : new_z1,
        new_z1 > new_z2 ? new_z1 : new_z2
    );
    extract_voi->Update();
    vti_process_widget_->SetVtkImageData(extract_voi->GetOutput());
    vti_process_widget_->BuildView();
```
## 1.2 计算焦点点：
&emsp;&emsp;**vtkBiDimensionalRepresentation2D**好像只有四个点世界坐标和局部坐标以及两条直线长度，没有中心焦点，需要自己求一下。
```cpp
QList<QList<double> > ImageBiDimensional::GetDisplayPosition() const {
    double p1[3];
    representation_->GetPoint1WorldPosition(p1);
    double p2[3];
    representation_->GetPoint2WorldPosition(p2);
    double p3[3];
    representation_->GetPoint3WorldPosition(p3);
    double p4[3];
    representation_->GetPoint4WorldPosition(p4);
    QList<QList<double>>points;
    QList<double> point1, point2, point3, point4, point5;
    point1 << p1[0] << p1[1] << p1[2];
    point2 << p2[0] << p2[1] << p2[2];
    point3 << p3[0] << p3[1] << p3[2];
    point4 << p4[0] << p4[1] << p4[2];
    points << point1 << point2 << point3 << point4;
    double p5[2];
    double a1 = p2[1] - p1[1];
    double b1 = p1[0] - p2[0];
    double c1 = p1[0] * p2[1] - p2[0] * p1[1];
    double a2 = p4[1] - p3[1];
    double b2 = p3[0] - p4[0];
    double c2 = p3[0] * p4[1] - p4[0] * p3[1];
    double det = a1 * b2 - a2 * b1;
    p5[0] = (c1 * b2 - c2 * b1) / det;
    p5[1] = (a1 * c2 - a2 * c1) / det;
    point5 << p5[0] << p5[1];
    points << point5;
    return  points;
}
```


## 1.3 一般输入影像都是dcm，需要保存成vti：
&emsp;&emsp; 感觉 **vtkDICOMXXXXX**贼难用，所以dcm、nii影像都用itk读写，让后转换成vti。mhd可以直接用vtk读写。
```cpp
    IntensityWindowingImageFilterType::Pointer intensityFilter =
        IntensityWindowingImageFilterType::New();
    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicomIO = ImageIOType::New();
    reader->SetImageIO(dicomIO);
    NamesGeneratorType::Pointer nameGenerator = NamesGeneratorType::New();
    nameGenerator->SetUseSeriesDetails(true);
    nameGenerator->SetDirectory("/home/yx/Pictures/影像/Deeplv_测试影像/75%");
    using SeriesIdContainer = std::vector< std::string >;
    const SeriesIdContainer &seriesUID = nameGenerator->GetSeriesUIDs();
    auto seriesItr = seriesUID.begin();
    auto seriesEnd = seriesUID.end();
    using FileNamesContainer = std::vector< std::string >;
    FileNamesContainer fileNames ;
    std::string seriesIdentifier;
    while (seriesItr != seriesEnd) {
        seriesIdentifier = seriesItr->c_str();
        fileNames = nameGenerator->GetFileNames(seriesIdentifier);
        ++seriesItr;
    }
    reader->SetFileNames(fileNames);
    try {
        reader->Update();
    } catch (itk::ExceptionObject &ex) {
        Q_UNUSED(ex)
        qWarning() << "read error";
    }
    intensityFilter->SetInput(reader->GetOutput());
    intensityFilter->SetWindowMinimum(-200);
    intensityFilter->SetWindowMaximum(400);
    intensityFilter->SetOutputMinimum(0);
    intensityFilter->SetOutputMaximum(1);
    intensityFilter->Update();
    typedef itk::ImageToVTKImageFilter< ImageType> itkTovtkFilterType;
    itkTovtkFilterType::Pointer itkTovtkImageFilter = itkTovtkFilterType::New();
    itkTovtkImageFilter->SetInput(intensityFilter->GetOutput());
    itkTovtkImageFilter->Update();
    vtkSmartPointer<vtkImageData> double_image_;
    if (double_image_ == nullptr) {
        double_image_ = vtkSmartPointer<vtkImageData>::New();
    }
    double_image_->DeepCopy(itkTovtkImageFilter->GetOutput());
    qint32 extent[6];
    double spacing[3];
    double origin[3];
    double_image_->GetExtent(extent);
    double_image_->GetSpacing(spacing);
    double_image_->GetOrigin(origin);
    qDebug() << extent[0] << extent[1] << extent[2] << extent[3] << extent[4] << extent[5];
    qDebug() << spacing[0] << spacing[1] << spacing[2];
    qDebug() << origin[0] << origin[1] << origin[2];
    vtkNew<vtkXMLImageDataWriter> writer;
    writer->SetInputData(double_image_);
    writer->SetFileName("/home/yx/Desktop/original.vti");
    writer->Write();
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

