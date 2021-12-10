# dcm 图像批量保存png

&emsp;&emsp;需要处理序列的dcm文件，vtk的dcmread兼容性太差，利用itk读取dcm让后转成vti文件。利用imagecast可以直接转成unsigned char 保存成png。我还需要opencv操作下，干脆就把vti转成cv::mat保存了。

如果觉得下边这个工程有用的话，下载：[http://118.25.63.144/temporary/DcmsToPngs.zip](http://118.25.63.144/temporary/DcmsToPngs.zip)

```cpp
bool ReadDcm(const QString &input_file_name,
             const vtkSmartPointer<vtkImageData> &imagedata) {
    if (input_file_name.isEmpty()) {
        return false;
    }
    QFileInfo file_info(input_file_name);
    QString extension = file_info.path();
    using PixelType = float;
    constexpr unsigned int Dimension = 3;
    using ImageType = itk::Image< PixelType, Dimension >;
    using ReaderType = itk::ImageSeriesReader< ImageType >;
    using ImageIOType = itk::GDCMImageIO;
    using NamesGeneratorType = itk::GDCMSeriesFileNames;
    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicomIO = ImageIOType::New();
    reader->SetImageIO(dicomIO);
    NamesGeneratorType::Pointer nameGenerator = NamesGeneratorType::New();
    nameGenerator->SetUseSeriesDetails(true);
    nameGenerator->SetDirectory(extension.toLocal8Bit().data());
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
        std::cout << ex << std::endl;
        return false;
    }
    ImageType::Pointer input_image;
    input_image = ImageType::New();
    input_image = reader->GetOutput();
    typedef itk::ImageToVTKImageFilter< ImageType> itkTovtkFilterType;
    itkTovtkFilterType::Pointer itkTovtkImageFilter = itkTovtkFilterType::New();
    itkTovtkImageFilter->SetInput(input_image);
    itkTovtkImageFilter->Update();
    imagedata->DeepCopy(itkTovtkImageFilter->GetOutput());
    return true;
}

bool WritePng(const vtkSmartPointer<vtkImageData> &imagedata,
              const QString &output_file) {
    qint32 dims[3];
    imagedata->GetDimensions(dims);
    for(qint32 i = 0; i < dims[2]; i++) {
        cv::Mat vtk_to_cvimg(dims[0], dims[1], CV_32FC1,
                             imagedata->GetScalarPointer(0, 0, i));
        cv::imwrite((output_file + QString("%1.png").arg(
                         i, 4, 10, QLatin1Char('0')))
                    .toLocal8Bit().data(), vtk_to_cvimg);
    }
    return true;
}

int main(int, char *[]) {
    vtkSmartPointer<vtkImageData> imagedata =
        vtkSmartPointer<vtkImageData>::New();
    ReadDcm("/home/yx/Documents/arteryflow/qt/DcmsToPngs/build-DcmsToPngs-Desktop_Qt_5_11_3_GCC_64bit-Release/dcm/0.dcm", imagedata);
    WritePng(imagedata, "/home/yx/Documents/arteryflow/qt/DcmsToPngs/build-DcmsToPngs-Desktop_Qt_5_11_3_GCC_64bit-Release/tmp/");
    return 0;
}
```




&emsp;&emsp;如果不用opencv处理的话（这里用extent因为数据我切割过，不是从0,0,0开始的）
```cpp
void ExportVtiToPngs(
    const vtkSmartPointer<vtkImageData> &imagedata,
    const QString &output_file) {
    int extent[6];
    imagedata->GetExtent(extent);
    vtkNew<vtkImageCast>cast;
    cast->SetInputData(imagedata);
    cast->SetOutputScalarTypeToUnsignedChar();
    cast->Update();
    vtkNew<vtkExtractVOI>  extract_voi;
    vtkNew<vtkPNGWriter> writer;
    extract_voi->SetInputData(cast->GetOutput());
    for(qint32 i = extent[4]; i < extent[5]; i++) {
        extract_voi->SetVOI(extent[0], extent[1],
                            extent[2], extent[3],
                            i, i);
        extract_voi->Update();
        writer->SetFileName(QString(output_file + "/%1.png")
                            .arg(i, 4, 10, QLatin1Char('0'))
                            .toLocal8Bit().data());
        writer->SetInputData(extract_voi->GetOutput());
        writer->Write();
    }
}
```

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)

本案例代码：
[https://gitee.com/yaoxin001/WorkDemo](https://gitee.com/yaoxin001/WorkDemo)

docsify首页
[http://118.25.63.144/](http://118.25.63.144/)