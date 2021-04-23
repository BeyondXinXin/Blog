**ITK图像读写机制**
 1.用户层面：itkImageFileReader（读） itkImageFileWriter（写）
 2. 内部实现：由内部ImageIO对象具体负责图像文件读写操作，该对象通过对象工厂根据用户输入文件类型生成相应的ImageIO对象

**优点**
 1. 使用方便，用户无须关注内部实现细节
 2. 扩展方便，扩展支持新的图像读取而无须修改用户接口，只需添加相应的工厂类和IO类
[ 阿兵先生](https://blog.csdn.net/webzhuce/article/details/70556228)
[ jasonliu1919](https://blog.csdn.net/ljp1919/article/details/41487505)


知道图片  dimension和像素格式就可以方便的读取图片
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906115452208.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


**itk::NumericSeriesFileNames**
[官方文档](https://itk.org/Doxygen/html/classitk_1_1NumericSeriesFileNames.html#a76670caa6d772004190f4e6659ec333e)
便于图片批量读取
SetSeriesFormat () 设置文件名称     %d表示图片名称
SetStartIndex () 设置起始名称序号
SetEndIndex()设置结束名称序号
SetIncrementIndex()设置间隔

举个例子 文件夹图片名称
aaa01bbb.png  aaa02bbb.png  aaa03bbb.png  aaa04bbb.png
SetSeriesFormat应写为
"aaa%2dbbb.png"


这是我用mhd转stl的过程
其中

    this_struct.itk_nameGenerator = "file_path_";
    this_struct.itk_outputFilename =QString("%1/tmp_.mhd").arg(this_struct.itk_nameGenerator);
    this_struct.itk_SetStartIndex = 1;
    this_struct.itk_SetEndIndex = 330;
    this_struct.itk_SetIncrementIndex = 1;

```javascript
//itk 连续读取png转化为mhd(NDims = 3)
    using PixelType = unsigned short;
    constexpr unsigned int itk_dimension = 3;
    using ImageType = itk::Image<PixelType, itk_dimension>;
    using ReaderType = itk::ImageSeriesReader<ImageType>;
    using WriterType = itk::ImageFileWriter<ImageType>;
    using NameGeneratorType = itk::NumericSeriesFileNames;
    ReaderType::Pointer itk_reader_png = ReaderType::New();
    WriterType::Pointer itk_writer_mhd = WriterType::New();
    NameGeneratorType::Pointer itk_nameGenerator = NameGeneratorType::New();
    emit SignalPNG2STLInformationOut("初始化中....");
    emit SignalPNG2STLPercentageCurrentOut(10, 100);
    QString tmp = QString("%1/%03d.png").arg(this_struct.itk_nameGenerator);

    itk_nameGenerator->SetSeriesFormat(tmp.toLocal8Bit().data());
    itk_nameGenerator->SetStartIndex(
        static_cast<unsigned long>(this_struct.itk_SetStartIndex));
    itk_nameGenerator->SetEndIndex(
        static_cast<unsigned long>(this_struct.itk_SetEndIndex));
    itk_nameGenerator->SetIncrementIndex(
        static_cast<unsigned long>(this_struct.itk_SetIncrementIndex));
    itk_reader_png->SetImageIO(itk::PNGImageIO::New());
    itk_reader_png->SetFileNames(itk_nameGenerator->GetFileNames());
    itk_writer_mhd->SetFileName(
        this_struct.itk_outputFilename.toLocal8Bit().data());
    itk_writer_mhd->SetInput(itk_reader_png->GetOutput());
    try {
        itk_writer_mhd->Update();
        emit SignalPNG2STLInformationOut("写入mhd....");
        emit SignalPNG2STLPercentageCurrentOut(50, 100);
    } catch (itk::ExceptionObject &err) {
        qDebug() << "ExceptionObject caught !";
        std::cerr << err << std::endl;
        return ;
    }
```


