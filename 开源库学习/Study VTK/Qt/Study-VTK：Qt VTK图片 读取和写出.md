# Study-VTK：Qt VTK图片 读取和写出

以前从未接触过vtk,用这玩意每次读取数据总要各种搜索,特此记录下vtk下自己常用的数据读入读出
[主要参考:vtk帮助文档](https://lorensen.github.io/VTKExamples/site/Cxx/#image-format)
[案例源码](https://github.com/lorensen/VTKWikiExamplesTarballs)


**vtk 图像读取**
[ImageReader2Factory](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ImageReader2Factory/)  读取任意格式图片
[JPEGReader](https://lorensen.github.io/VTKExamples/site/Cxx/IO/JPEGReader/)  读取jpg图片
[MetaImageReader](https://lorensen.github.io/VTKExamples/site/Cxx/IO/MetaImageReader/) 读取mha,mhd,raw图片
[PNGReader](https://lorensen.github.io/VTKExamples/site/Cxx/IO/PNGReader/) 读取png图片
[ReadBMP](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ReadBMP/) 读取bmp图片
[ReadDICOM](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ReadDICOM/)读取dicom图片单张
[ReadDICOMSeries](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ReadDICOMSeries/)读取连续dicom图片
[ReadPNM](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ReadPNM/)读取pnm图片
[ReadTIFF](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ReadTIFF/)读取tif图片

使用方法基本雷同,读取不同格式替换为不同类即可,实在烦就直接用ImageReader2Factory
下边输入参数解释下

> 读取连续dicom图片argv[1] 是文件夹名字
> 其余读取图片argv[1]是文件名字

```javascript
// 读取任意格式图片
  vtkSmartPointer<vtkImageReader2Factory> readerFactory =vtkSmartPointer<vtkImageReader2Factory>::New();
  vtkSmartPointer<vtkImageReader2> imageReader;
  imageReader.TakeReference(
  readerFactory->CreateImageReader2(argv[1] c_str()));
  imageReader->SetFileName(argv[1] .c_str());
  imageReader->Update();
```

```javascript
 //读取jpg图片
  vtkSmartPointer<vtkJPEGReader> jpegReader =vtkSmartPointer<vtkJPEGReader>::New();
  jpegReader->SetFileName ( argv[1] );
```

```javascript
 //读取mha,mhd,raw图片
 vtkSmartPointer<vtkMetaImageReader> reader =vtkSmartPointer<vtkMetaImageReader>::New();
reader->SetFileName(inputFilename.c_str());
reader->Update();
```
```javascript
 //读取png图片
  vtkSmartPointer<vtkPNGReader> reader =vtkSmartPointer<vtkPNGReader>::New();
  reader->SetFileName(argv[1]);
```
```javascript
 //读取bmp图片
  vtkSmartPointer<vtkBMPReader> reader =vtkSmartPointer<vtkBMPReader>::New();
  reader->SetFileName ( argv[1] );
```
```javascript
 //读取dicom图片单张
  vtkSmartPointer<vtkDICOMImageReader> reader = vtkSmartPointer<vtkDICOMImageReader>::New();
  reader->SetFileName(inputFilename.c_str());
  reader->Update();
```
```javascript
 //读取连续dicom图片
   vtkSmartPointer<vtkDICOMImageReader> reader =vtkSmartPointer<vtkDICOMImageReader>::New();
   reader->SetDirectoryName(folder.c_str());
   reader->Update();
```
```javascript
 //读取pnm图片
  vtkSmartPointer<vtkPNMReader> reader =vtkSmartPointer<vtkPNMReader>::New();
  reader->SetFileName ( argv[1] );
```
```javascript
 //读取tif图片
vtkSmartPointer<vtkTIFFReader> reader =vtkSmartPointer<vtkTIFFReader>::New();
  reader->SetFileName ( argv[1] );
```

获取读取的图片统一用

>  imageReader->GetOutputPort()


**vtk 图像写出**



[WriteImage()](https://lorensen.github.io/VTKExamples/site/Cxx/IO/ImageWriter/) 
提供了一个通用函数writeImage（），该函数根据文件扩展名选择要使用的图像编写器，然后将渲染窗口写入文件。支持以下格式：bmp、jpeg、pnm、png、postscript、tiff。
[vtkJPEGWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/JPEGWriter)写出jpg图片
[vtkMetaImageWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/MetaImageWriter)写出 .mha/.mhd + .raw图片
[vtkPNGWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/PNGWriter)写出png图片
[vtkBMPWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/WriteBMP)写出bmp图片
[vtkPNMWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/WritePNM)写出pnm图片
[vtkTIFFWriter](https://lorensen.github.io/VTKExamples/site/Cxx/IO/WriteTIFF)写出tif图片

这个是直接根据图片格式保存对应图片,单独某一个类型的用法类似
```javascript
#include <vtkActor.h>
#include <vtkNamedColors.h>
#include <vtkPolyDataMapper.h>
#include <vtkProperty.h>
#include <vtkRenderWindow.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderer.h>
#include <vtkSmartPointer.h>
#include <vtkSphereSource.h>

#include <vtkBMPWriter.h>
#include <vtkImageWriter.h>
#include <vtkJPEGWriter.h>
#include <vtkPNGWriter.h>
#include <vtkPNMWriter.h>
#include <vtkPostScriptWriter.h>
#include <vtkTIFFWriter.h>
#include <vtkWindowToImageFilter.h>

#include <array>
#include <locale>
#include <string>

namespace {
void WriteImage(std::string const &fileName, vtkRenderWindow *renWin,
                bool rgba = true);
}

int main(int, char *[]) {
    auto colors = vtkSmartPointer<vtkNamedColors>::New();
    std::array<unsigned char, 4> bkg{{26, 51, 102, 255}};
    colors->SetColor("BkgColor", bkg.data());
    auto ren = vtkSmartPointer<vtkRenderer>::New();
    auto renWin = vtkSmartPointer<vtkRenderWindow>::New();
    renWin->AddRenderer(ren);
    auto iren = vtkSmartPointer<vtkRenderWindowInteractor>::New();
    iren->SetRenderWindow(renWin);
    auto source = vtkSmartPointer<vtkSphereSource>::New();
    source->SetCenter(0, 0, 0);
    source->SetRadius(5.0);
    auto mapper = vtkSmartPointer<vtkPolyDataMapper>::New();
    mapper->SetInputConnection(source->GetOutputPort());
    auto actor = vtkSmartPointer<vtkActor>::New();
    actor->SetMapper(mapper);
    actor->GetProperty()->SetColor(colors->GetColor3d("Yellow").GetData());
    ren->AddActor(actor);
    ren->SetBackground(colors->GetColor3d("BkgColor").GetData());
    renWin->Render();
    std::vector<std::string> ext = {{""},      {".png"}, {".jpg"}, {".ps"},
        {".tiff"}, {".bmp"}, {".pnm"}
    };
    std::vector<std::string> filenames;
    std::transform(ext.begin(), ext.end(), std::back_inserter(filenames),
    [](const std::string & e) {
        return "ImageWriter" + e;
    });
    filenames[0] = filenames[0] + '1';
    for (auto f : filenames) {
        WriteImage(f, renWin, false);
    }
    iren->Initialize();
    iren->Start();
    return EXIT_SUCCESS;
}
namespace {
void WriteImage(std::string const &fileName, vtkRenderWindow *renWin, bool rgba) {
    if (!fileName.empty()) {
        std::string fn = fileName;
        std::string ext;
        auto found = fn.find_last_of(".");
        if (found == std::string::npos) {
            ext = ".png";
            fn += ext;
        } else {
            ext = fileName.substr(found, fileName.size());
        }
        std::locale loc;
        std::transform(ext.begin(), ext.end(), ext.begin(),
        [ = ](char const & c) {
            return std::tolower(c, loc);
        });
        auto writer = vtkSmartPointer<vtkImageWriter>::New();
        if (ext == ".bmp") {
            writer = vtkSmartPointer<vtkBMPWriter>::New();
        } else if (ext == ".jpg") {
            writer = vtkSmartPointer<vtkJPEGWriter>::New();
        } else if (ext == ".pnm") {
            writer = vtkSmartPointer<vtkPNMWriter>::New();
        } else if (ext == ".ps") {
            if (rgba) {
                rgba = false;
            }
            writer = vtkSmartPointer<vtkPostScriptWriter>::New();
        } else if (ext == ".tiff") {
            writer = vtkSmartPointer<vtkTIFFWriter>::New();
        } else {
            writer = vtkSmartPointer<vtkPNGWriter>::New();
        }
        auto window_to_image_filter =
            vtkSmartPointer<vtkWindowToImageFilter>::New();
        window_to_image_filter->SetInput(renWin);
        window_to_image_filter->SetScale(1); // image quality
        if (rgba) {
            window_to_image_filter->SetInputBufferTypeToRGBA();
        } else {
            window_to_image_filter->SetInputBufferTypeToRGB();
        }
        // Read from the front buffer.
        window_to_image_filter->ReadFrontBufferOff();
        window_to_image_filter->Update();

        writer->SetFileName(fn.c_str());
        writer->SetInputConnection(window_to_image_filter->GetOutputPort());
        writer->Write();
    } else {
        std::cerr << "No filename provided." << std::endl;
    }
    return;
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

