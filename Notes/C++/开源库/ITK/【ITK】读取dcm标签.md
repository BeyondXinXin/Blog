# 【ITK】读取dcm标签


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/itk/%E3%80%90itk%E3%80%91%E8%AF%BB%E5%8F%96dcm%E6%A0%87%E7%AD%BE.md/331334415217550.png =800x)


- 先创建list

```c++
  QHash<QString, QString> dcm_tig;
```
- 读取dcm

```c++
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

- 读取dcm信息并

```c++
// DCM 信息读取
    using DictionaryType = itk::MetaDataDictionary;
    const DictionaryType &dictionary = dicom_io->GetMetaDataDictionary();
    using MetaDataStringType = itk::MetaDataObject<std::string>;  
```
- 遍历dcm信息并写入list

```c++
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

- 打印c++

```c++
    QHash<QString, QString> ::const_iterator it;
    for (it = dcm_tig.begin(); it != dcm_tig.end(); it++) {
        qDebug() << it.key() << "," << it.value();
    }
```

- 百度翻译结果

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/itk/%E3%80%90itk%E3%80%91%E8%AF%BB%E5%8F%96dcm%E6%A0%87%E7%AD%BE.md/446244515237716.png =800x)


完整测试代码
```c++
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
