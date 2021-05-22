# Study-VTK：vtk imagedata 和 cv mat 相互转换
**mat 转 imagedata**
```cpp
    /*!
     * \brief mat 转 imagedata
     * srcImg        输入opencv图像
     * vtkImg_data_  输出vtkImageData图像
     */
void ConvertMatToVtkImageData(const cv::Mat &srcImg) {
    vtkImg_data_ = vtkSmartPointer<vtkImageData>::New();
    vtkNew<vtkInformation> info ;
    vtkImg_data_->SetDimensions(srcImg.cols, srcImg.rows, 1);
    vtkImg_data_->SetScalarType(VTK_UNSIGNED_CHAR, info);
    vtkImg_data_->SetNumberOfScalarComponents(1, info);
    vtkImg_data_->AllocateScalars(info);
    unsigned char *ptr_vtk =
        static_cast<unsigned char *>(vtkImg_data_->GetScalarPointer());
    cv::Mat tempImg;
    cv::flip(srcImg, tempImg, 0);
    cv::MatIterator_<uchar> itr_mat = tempImg.begin<uchar>();
    for (; itr_mat != tempImg.end<uchar>(); itr_mat++) {
        *ptr_vtk++ = *itr_mat;
    }
}
```
**itkread 转 imagedata 转 mat**

```cpp
    /*!
     * \brief itkread 转 imagedata 转 mat
     * input_file_name_        读取dcm路径，如果dcm为单张。using ImageTypes = itk::Image< PixelType, 2>;
     * index_                  dcm系列第几张
     * org_img_data_           输出mat图像
     */
void Execute() {
    using PixelType = signed short;
    using ImageTypes = itk::Image< PixelType, 3>;
    using ReaderType = itk::ImageFileReader<ImageTypes>;
    using ImageIOType = itk::GDCMImageIO;
    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicomIO = ImageIOType::New();
    reader->SetImageIO(dicomIO);
    reader->SetFileName(input_file_name_.toLocal8Bit().data());
    try {
        reader->Update();
    } catch (itk::ExceptionObject &ex) {
        std::cout << ex << std::endl;
        return ;
    }
    typedef itk::ImageToVTKImageFilter<ImageTypes> itkTovtkFilterType;
    itkTovtkFilterType::Pointer itkTovtkImageFilter = itkTovtkFilterType::New();
    itkTovtkImageFilter->SetInput(reader->GetOutput());
    itkTovtkImageFilter->Update();
    vtkImageData *vtkImage = itkTovtkImageFilter->GetOutput();
    qint32 dims[3];
    vtkImage->GetDimensions(dims);
    if(this->index_ < dims[2]) {
        cv::Mat vtkToCVImg(dims[1], dims[0], CV_16SC1,
                           vtkImage->GetScalarPointer(0, 0, this->index_));
        org_img_data_ = vtkToCVImg.clone();
    }
}
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