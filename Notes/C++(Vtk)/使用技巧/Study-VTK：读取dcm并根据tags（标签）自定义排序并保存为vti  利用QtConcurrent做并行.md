# Study-VTK：读取dcm并根据tags（标签）自定义排序并保存为vti  利用QtConcurrent做并行

@[TOC]( )

**注意：自定义排序逻辑需要自己清楚，不同数据肯定不同。下边案例是根据实际高度分组，采样时间排序。（对应标签Slice Location、Acquisition Number）**

![
](https://img-blog.csdnimg.cn/20200607122401878.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607122412170.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
# 0 背景&需求
- **背景**
&emsp;&emsp;有时候设备上自动保存的dcm文件名顺序是乱序，需要根据dcm里标签来自定义决定顺序。Itk我看说明有按照字典排序读取，但是看了半天每搞明白，干脆自己写一下自定义排序。	
- **需求**
&emsp;&emsp;输入一组文件名乱序的dcm序列，根据标签分类和重命名。数据量不大，300m左右，并行转为vtk并写出。

# 1 利用itk遍历文件夹内所有dicom类型文件
&emsp;&emsp;dicom类型文件有各种后缀，而且原始数据大部分没有后缀。itk可以自动判断，那些是dcm文件。

```cpp
/**
 * @brief GetFileNames 利用寻找文件夹里所有dicom文件（跟后缀无关）
 * @param dicom_file_path 输入路径（文件）
 * @param file_names dicom_file_path同级文件所有dicom类型文件
 * @return
 */
using FileNamesContainer = std::vector< std::string >;
bool GetFileNames(const QString &dicom_file_path,
                  FileNamesContainer &file_names) {
    if (dicom_file_path.isEmpty()) {
        return false;
    }
    QFileInfo file_info(dicom_file_path);
    QString extension = file_info.path();
    std::string series_identifier;
    using NamesGeneratorType = itk::GDCMSeriesFileNames;
    using SeriesIdContainer = std::vector< std::string >;
    NamesGeneratorType::Pointer name_generator = NamesGeneratorType::New();
    name_generator->SetUseSeriesDetails(true);
    name_generator->SetDirectory(extension.toLocal8Bit().data());
    const SeriesIdContainer &seriesUID = name_generator->GetSeriesUIDs();
    auto seriesItr = seriesUID.begin();
    auto seriesEnd = seriesUID.end();
    while (seriesItr != seriesEnd) {
        series_identifier = seriesItr->c_str();
        file_names = name_generator->GetFileNames(series_identifier);
        ++seriesItr;
    }
    return true;
}
```

# 2利用ITK读取DICOM文件（2/3维）
&emsp;&emsp;读取单张dcm和序列dcm的函数。

```cpp
/**
 * @brief ReadDicoms/ReadDicom 读取文件（3维/2维）
 */
typedef signed short InputPixelType;
typedef itk::Image< InputPixelType, 2 > InputImageType;
typedef itk::Image< InputPixelType, 3 > InputImageTypes;
bool ReadDicoms(const FileNamesContainer &file_names,
                InputImageTypes::Pointer &image) {
    typedef itk::ImageSeriesReader<InputImageTypes> ReaderType;
    using ImageIOType = itk::GDCMImageIO;
    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicomIO = ImageIOType::New();
    reader->SetImageIO(dicomIO);
    reader->SetFileNames(file_names);
    try {
        reader->Update();
    } catch (itk::ExceptionObject &) {
        return false;
    }
    image = reader->GetOutput();
    return true;
}
bool ReadDicom(const std::string &file_name,
               InputImageType::Pointer &image) {
    typedef itk::ImageFileReader<InputImageType> ReaderType;
    ReaderType::Pointer reader = ReaderType::New();
    typedef itk::GDCMImageIO  ImageIOType;
    ImageIOType::Pointer gdcmImageIO = ImageIOType::New();
    reader->SetFileName(file_name);
    reader->SetImageIO( gdcmImageIO );
    try {
        reader->Update();
    } catch (itk::ExceptionObject &) {
        return false;
    }
    image = reader->GetOutput();
    return true;
}
```
# 3 根据标签拷贝文件
&emsp;&emsp;这一步用我的没用，需要你清楚自己的排序规则。所有标签保存在key_list里
```cpp
/**
 * @brief CopyDicom 拷贝dicom到指定目录，根据Slice Location、Acquisition Number排序
 * @param dicom_path
 * @param list
 * @param out_paths
 * @return
 */
bool CopyDicom(const QString &dicom_path,
               QStringList &list,
               const QString &out_paths) {
    // 读入dcm
    FileNamesContainer file_names;
    if (!GetFileNames(dicom_path, file_names)) {
        return false;
    }
    std::vector<std::string>::iterator the_iterator;
    for( the_iterator = file_names.begin(); the_iterator
            != file_names.end(); the_iterator++ ) {
        // 记录tags
        InputImageType::Pointer image = InputImageType::New();
        ReadDicom(the_iterator->c_str(), image);
        typedef itk::MetaDataDictionary   DictionaryType;
        using MetaDataStringType = itk::MetaDataObject<std::string>;
        DictionaryType &dictionary = image->GetMetaDataDictionary();
        QHash<QString, QString> key_list;
        for (auto ite = dictionary.Begin(); ite != dictionary.End(); ++ite) {
            QString id = QString::fromStdString(ite->first);
            itk::MetaDataObjectBase::Pointer entry = ite->second;
            MetaDataStringType::ConstPointer entry_value =
                dynamic_cast<const MetaDataStringType *>(ite->second.GetPointer());
            std::string key_string;
            itk::GDCMImageIO::GetLabelFromTag(id.toStdString().c_str(), key_string);
            QString key = QString::fromStdString(key_string);
            QString value = QString::fromStdString(entry_value->GetMetaDataObjectValue());
            itk::EncapsulateMetaData<std::string>(dictionary, key_string, "value" );
            key_list.insert(key, value);
        }
        // 根据Slice Location分组，根据Acquisition Number重命名拷贝文件
        QString out_path =
            out_paths + QString::number(key_list.value("Slice Location").toDouble());
        DirMake(out_path);
        list << out_path;
        out_path += "/" + key_list.value("Acquisition Number") + ".dcm";
        QFile::copy(the_iterator->c_str(), out_path);
    }
    list = list.toSet().toList();// 剔除重复数据
    return true;
}

```

# 4 itk数据转vtk并写出
```cpp
/**
 * @brief GenerateVti 把输入路径里所有dcm写出为vti
 * @param path 输入dcm路径
 */
void GenerateVti(QString &path) {
    vtkNew<vtkImageData> imagedata;
    // 读入dcm
    FileNamesContainer file_names;
    InputImageTypes::Pointer input_image = InputImageTypes::New();
    GetFileNames((path + "/1.dcm"), file_names);
    ReadDicoms(file_names, input_image);
    typedef itk::ImageToVTKImageFilter< InputImageTypes> itkTovtkFilterType;
    itkTovtkFilterType::Pointer itkTovtkImageFilter = itkTovtkFilterType::New();
    itkTovtkImageFilter->SetInput(input_image);
    itkTovtkImageFilter->Update();
    imagedata->DeepCopy(itkTovtkImageFilter->GetOutput());
    // 写出vti
    vtkNew<vtkXMLImageDataWriter> writer;
    writer->SetInputData(imagedata);
    writer->SetFileName((path + "/floor.vti").toLocal8Bit().data());
    writer->Write();
}

```

# 5 路径相关设置函数

```cpp
/**
 * @brief GetFullPath 判读是否全局路径
 * @param path
 * @return
 */
QString GetFullPath(const QString &path) {
    QFileInfo file_info(path);
    return file_info.absoluteFilePath();
}

/**
 * @brief DirMake 生成文件夹
 * @param path
 * @return
 */
bool DirMake(const QString &path) {
    QString full_path = GetFullPath(path);
    QDir dir(full_path);
    if (dir.exists()) {
        return true;
    } else {
        return dir.mkpath(full_path);
    }
}
```

# 6 利用qt接口做并行处理
&emsp;&emsp;因为就是个测试工程，直接写在main里，所以必须阻塞调用（blockingMap）。正常使用写在线程里不用阻塞了就。

```cpp
int main(int, char *[]) {
    QString in_paths = "/home/yx/Downloads/CTP病例/IM000162";
    QString out_paths = "/home/yx/Desktop/tmp/";
    QTime time;
    time.start();
    QStringList list;// 目标路径
    // 拷贝文件
    CopyDicom(in_paths, list, out_paths);
    // 并行写出vti （阻塞）
    QtConcurrent::blockingMap(list, GenerateVti);
    qDebug() <<  QString("%1").arg(time.elapsed() / 1000.0);
    return 0;
}
```

&emsp;
&emsp;
&emsp;
&emsp;


---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)

本案例代码：
[https://gitee.com/yaoxin001/WorkDemo](https://gitee.com/yaoxin001/WorkDemo)

个人博客首页
[http://118.25.63.144/](http://118.25.63.144/)