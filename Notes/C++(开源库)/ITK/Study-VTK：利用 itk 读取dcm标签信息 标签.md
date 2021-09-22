实用至上
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190919181223578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


先创建list
```javascript
  QHash<QString, QString> dcm_tig;
```
读取dcm
```javascript
      using PixelType = signed short;
    constexpr unsigned int dimension = 2;
    using ImageType = itk::Image<PixelType, dimension>;
    using ReaderType = itk::ImageFileReader<ImageType>;
    using ImageIOType = itk::GDCMImageIO;

    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicom_io = ImageIOType::New();
    reader->SetFileName("/home/yx/图片/left.dcm");
    reader->SetImageIO(dicom_io);
    try {
        reader->Update();
    } catch (itk::ExceptionObject &ex) {
        qDebug() << "dicom open fail " << ex.GetDescription();
    }
```

//读取dcm信息并
```javascript
// DCM 信息读取
    using DictionaryType = itk::MetaDataDictionary;
    const DictionaryType &dictionary = dicom_io->GetMetaDataDictionary();
    using MetaDataStringType = itk::MetaDataObject<std::string>;  
```
//遍历dcm信息并写入list
```javascript
 for (auto ite = dictionary.Begin(); ite != dictionary.End(); ++ite) {
        QString id = QString::fromStdString(ite->first);
        itk::MetaDataObjectBase::Pointer entry = ite->second;
        MetaDataStringType::ConstPointer entry_value =
            dynamic_cast<const MetaDataStringType *>(ite->second.GetPointer());
        std::string key_string;
        itk::GDCMImageIO::GetLabelFromTag(id.toStdString().c_str(), key_string);
        QString key = QString::fromStdString(key_string);
        QString value = QString::fromStdString(entry_value->GetMetaDataObjectValue());
        dcm_tig.insert(key, value);
    }
```
打印QHash
```javascript
    QHash<QString, QString> ::const_iterator it;
    for (it = dcm_tig.begin(); it != dcm_tig.end(); it++) {
        qDebug() << it.key() << "," << it.value();
    }
```
这个是我把提取出来的id 丢到百度翻译里出来的结果,翻译准确性不敢保证哈.
其实不用QHash都提取出来,你要什么就对照id提取成qmap就可以了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190919180653377.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


完整测试代码
```javascript
   // DCM 信息读取
    QHash<QString, QString> dcm_tig;

    using PixelType = signed short;
    constexpr unsigned int dimension = 2;
    using ImageType = itk::Image<PixelType, dimension>;
    using ReaderType = itk::ImageFileReader<ImageType>;
    using ImageIOType = itk::GDCMImageIO;

    ReaderType::Pointer reader = ReaderType::New();
    ImageIOType::Pointer dicom_io = ImageIOType::New();
    reader->SetFileName("/home/yx/图片/left.dcm");
    reader->SetImageIO(dicom_io);
    try {
        reader->Update();
    } catch (itk::ExceptionObject &ex) {
        qDebug() << "dicom open fail " << ex.GetDescription();
        return 0;
    }

    using DictionaryType = itk::MetaDataDictionary;
    const DictionaryType &dictionary = dicom_io->GetMetaDataDictionary();
    using MetaDataStringType = itk::MetaDataObject<std::string>;

    for (auto ite = dictionary.Begin(); ite != dictionary.End(); ++ite) {
        QString id = QString::fromStdString(ite->first);
        itk::MetaDataObjectBase::Pointer entry = ite->second;
        MetaDataStringType::ConstPointer entry_value =
            dynamic_cast<const MetaDataStringType *>(ite->second.GetPointer());
        std::string key_string;
        itk::GDCMImageIO::GetLabelFromTag(id.toStdString().c_str(), key_string);
        QString key = QString::fromStdString(key_string);
        QString value = QString::fromStdString(entry_value->GetMetaDataObjectValue());
        dcm_tig.insert(key, value);
    }

    QHash<QString, QString> ::const_iterator it;
    for (it = dcm_tig.begin(); it != dcm_tig.end(); it++) {
        qDebug() << it.key() << "," << it.value();
    }
```
头文件就用几个,我不去拆了,都复制了
```
// ITK includes
#include <itkImage.h>
#include <itkPNGImageIO.h>
#include <itkGDCMImageIO.h>
#include <itkPathIterator.h>
#include <itkNumericTraits.h>
#include <itkMetaDataObject.h>
#include <itkImageFileReader.h>
#include <itkCastImageFilter.h>
#include <itkImageFileWriter.h>
#include <itkImageFileReader.h>
#include <itkImageSeriesReader.h>
#include <itkExtractImageFilter.h>
#include <itkPolyLineParametricPath.h>
#include <itkNumericSeriesFileNames.h>
#include <itkGradientDescentOptimizer.h>
#include <itkSpeedFunctionToPathFilter.h>
#include <itkArrivalFunctionToPathFilter.h>
#include <itkRegionOfInterestImageFilter.h>
#include <itkRescaleIntensityImageFilter.h>
#include <itkIterateNeighborhoodOptimizer.h>
#include <itkIntensityWindowingImageFilter.h>
#include <itkMinimumMaximumImageCalculator.h>
#include <itkLinearInterpolateImageFunction.h>
#include <itkRegularStepGradientDescentOptimizer.h>
#include <itkNearestNeighborInterpolateImageFunction.h>
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