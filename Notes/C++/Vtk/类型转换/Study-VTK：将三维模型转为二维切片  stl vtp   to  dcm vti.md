# Study-VTK：将三维模型转为二维切片  stl vtp   to  dcm vti

<font color=#0099ff size=5 face="黑体">欢迎访问个人博客：</font><font color=#0099ff size=5 face="黑体">[http://118.25.63.144:501/](http://118.25.63.144:501/)</font>

---
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;

&emsp;&emsp;很多时候需要验证自己算法是否正确，需要选一个标准模型，让后将其切为二维切片。
&emsp;&emsp;把一个模型（必须封闭），找到所在的最小矩形，让后沿着某一个角度一层一层切开。每一层中每一行从最小矩形边开始，初始颜色是背景色，遇到模型边界后线颜色翻转（改为前景色），因此必须是封闭模型。


### 重构效果：
&emsp;&emsp;保存的vti跟输入stl完美契合，保存的dcm通过snap重构后跟输入stl完美契合。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516110217231.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051611022898.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516110240748.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200516110344852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




### 案例：
**vtk的vtkImageStencilSource**
[http://118.25.63.144/VTKExamples/site/Cxx/PolyData/PolyDataToImageData.html](http://118.25.63.144/VTKExamples/site/Cxx/PolyData/PolyDataToImageData.html)
**MeshToLabelMap**
[https://github.com/NIRALUser/MeshToLabelMap](https://github.com/NIRALUser/MeshToLabelMap)

&emsp;&emsp;**vtkImageStencilSource**是官方提供的一种切片方法，输入是**vtkpolydata**（可以由stl、off等模型转换），输出是**vtkimagedata**（可以保存成mhd，dcm的话vtk的vtkDICOXXX类贼难用）。
&emsp;&emsp;
&emsp;&emsp;**MeshToLabelMap**是 **3D Slicer**的插件。其实也是用**vtkImageStencilSource**这个类实现的，让后他封装了两层**vtkPolyDataToImageStencilOBBTree**和**vtkAttributedPolyDataToImage**把**vtkImageStencilSource**的输入输出类型变得更宽泛，增加了变换矩阵，支持根据输入的nii尺寸导出想要的nii数据。我简单改了下，改成输入stl输出dcm。


### 程序：
&emsp;&emsp;可以直接去上边网址看，那两个案例代码我整理了下，跟测试模型放在一起，有需要的话
CSDN_Blog_vtkImageStencilSource 
[http://118.25.63.144/temporary/CSDN_Blog_vtkImageStencilSource.zip](http://118.25.63.144/temporary/CSDN_Blog_vtkImageStencilSource.zip)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020051611103137.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


### 代码：
**vtk的vtkImageStencilSource**

```cpp
#include <vtkSmartPointer.h>
#include <vtkPolyData.h>
#include <vtkImageData.h>
#include <vtkSphereSource.h>
#include <vtkMetaImageWriter.h>
#include <vtkPolyDataToImageStencil.h>
#include <vtkImageStencil.h>
#include <vtkPointData.h>
#include <vtkSTLReader.h>
#include <vtkDICOMWriter.h>
#include <vtkXMLImageDataWriter.h>


int main(int, char *[]) {
    vtkNew<vtkPolyData> pd ;
    vtkNew<vtkSTLReader> reader;
    reader->SetFileName("tmp.stl");
    reader->Update();
    pd->DeepCopy(reader->GetOutput());
    vtkNew<vtkImageData> whiteImage;
    double bounds[6];
    pd->GetBounds(bounds);
    double spacing[3]; // 所需的体积间距
    spacing[0] = 0.5;
    spacing[1] = 0.5;
    spacing[2] = 0.5;
    whiteImage->SetSpacing(spacing);
    // 计算尺寸
    int dim[3];
    for (int i = 0; i < 3; i++) {
        dim[i] = static_cast<int>(ceil((bounds[i * 2 + 1] - bounds[i * 2]) / spacing[i]));
    }
    whiteImage->SetDimensions(dim);
    whiteImage->SetExtent(0, dim[0] - 1, 0, dim[1] - 1, 0, dim[2] - 1);
    double origin[3];
    origin[0] = bounds[0] + spacing[0] / 2;
    origin[1] = bounds[2] + spacing[1] / 2;
    origin[2] = bounds[4] + spacing[2] / 2;
    whiteImage->SetOrigin(origin);
    whiteImage->AllocateScalars(VTK_UNSIGNED_CHAR, 1);
    // 用前景体素填充图像：
    unsigned char inval = 255;
    unsigned char outval = 0;
    vtkIdType count = whiteImage->GetNumberOfPoints();
    for (vtkIdType i = 0; i < count; ++i) {
        whiteImage->GetPointData()->GetScalars()->SetTuple1(i, inval);
    }
    // 多边形数据->图像模具：
    vtkNew<vtkPolyDataToImageStencil> pol2stenc;
    pol2stenc->SetInputData(pd);
    pol2stenc->SetOutputOrigin(origin);
    pol2stenc->SetOutputSpacing(spacing);
    pol2stenc->SetOutputWholeExtent(whiteImage->GetExtent());
    pol2stenc->Update();
    // 剪切相应的白色图像并设置背景：
    vtkNew<vtkImageStencil> imgstenc ;
    imgstenc->SetInputData(whiteImage);
    imgstenc->SetStencilConnection(pol2stenc->GetOutputPort());
    imgstenc->ReverseStencilOff();
    imgstenc->SetBackgroundValue(outval);
    imgstenc->Update();
    vtkNew<vtkXMLImageDataWriter> writer;
    writer->SetInputData(imgstenc->GetOutput());
    writer->SetFileName("/home/yx/Desktop/original.vti");
    writer->Write();
    return 1;
}

```
**MeshToLabelMap**

vtkAttributedPolyDataToImage、vtkPolyDataToImageStencilOBBTree就是上边网址的git

```cpp
#include <iostream>
#include <vector>
#include <string>

#include <itkImage.h>
#include <itkImageFileWriter.h>
#include <itkImageFileReader.h>
#include <itkMedianImageFilter.h>

#include <vtkSmartPointer.h>
#include <vtkTransform.h>
#include <vtkMatrix4x4.h>
#include <vtkPolyData.h>
#include <vtkPolyDataReader.h>
#include <vtkXMLPolyDataReader.h>
#include <vtkImageData.h>
#include <vtkCommand.h>
#include <vtkTransformPolyDataFilter.h>
#include "vtkAttributedPolyDataToImage.h"

#include <QDebug>
#include <QFile>

// vtk include
#include <vtkActor.h>
#include <vtkCellData.h>
#include <vtkRenderer.h>
#include <vtkProperty.h>
#include <vtkSTLReader.h>
#include <vtkSTLWriter.h>
#include <vtkImageViewer2.h>
#include <vtkRenderWindow.h>
#include <vtkMassProperties.h>
#include <vtkTriangleFilter.h>
#include <vtkPolyDataMapper.h>
#include <vtkPolyDataNormals.h>
#include <vtkXMLPolyDataReader.h>
#include <vtkXMLPolyDataWriter.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkInteractorStyleTrackballCamera.h>
#include <vtkUnstructuredGrid.h>
#include <vtkXMLUnstructuredGridWriter.h>
#include <vtkXMLUnstructuredGridReader.h>
#include <vtkDataSetSurfaceFilter.h>
#include <vtkAppendFilter.h>


int WriteITKImage (
    itk::Image < unsigned char, 3 >::Pointer image, std::string fileName ) {
    try {
        typedef itk::Image < unsigned char, 3 > ImageType ;
        typedef itk::ImageFileWriter < ImageType > ImageWriterType ;
        ImageWriterType::Pointer itkWriter = ImageWriterType::New() ;
        itkWriter->SetFileName ( fileName ) ;
        itkWriter->SetInput ( image ) ;
        itkWriter->UseCompressionOn() ;
        itkWriter->Write() ;
    } catch( itk::ExceptionObject &err ) {
        std::cerr << "ExceptionObject caught !" << std::endl ;
        std::cerr << err << std::endl ;
        return 1 ;
    }
    return 0 ;
}

itk::Image < unsigned char, 3 >::Pointer VTK2BinaryITK (
    vtkSmartPointer<vtkImageData> vtkImage,
    itk::Matrix< double, 3, 3 > direction,
    unsigned char value ) {
    typedef itk::Image < unsigned char, 3 > ImageType ;
    typedef ImageType::Pointer ImagePointer ;
    // 将vtk图像转换为itk图像
    int extent[ 6 ] ;
    vtkImage->GetExtent( extent ) ;
    ImageType::SizeType size ;
    size[0] = static_cast<quint32>(extent[ 1 ] - extent[0] + 1);
    size[1] = static_cast<quint32>(extent[ 3 ] - extent[2] + 1);
    size[2] = static_cast<quint32>(extent[ 5 ] - extent[4] + 1);
    ImagePointer itkImage = ImageType::New () ;
    ImageType::RegionType region ;
    region.SetSize( size ) ;
    ImageType::IndexType start ;
    start[0] = start[1] = start[2] = 0 ;
    region.SetIndex( start ) ;
    itkImage->SetRegions( region ) ;
    double origin[ 3 ] ;
    vtkImage->GetOrigin( origin ) ;
    itkImage->SetOrigin( origin ) ;
    double spacing[ 3 ] ;
    vtkImage->GetSpacing( spacing ) ;
    itkImage->SetSpacing( spacing ) ;
    itkImage->SetDirection( direction ) ;
    itkImage->Allocate() ;
    ImageType::IndexType index ;
    ImageType::IndexType maxIndex ;
    // 由于有符号和无符号的比较，从size到mavariables in the scope below
    for( quint32 i = 0 ; i < 3 ; i++ ) {
        maxIndex[ i ] = static_cast<quint32>(size[i]) ;
    }
    int pixel ;
    for ( index[ 0 ] = 0 ; index[ 0 ] < maxIndex[ 0 ] ; index[ 0 ]++ ) {
        for ( index[ 1 ] = 0 ; index[ 1 ] < maxIndex[ 1 ] ; index[ 1 ]++ ) {
            for ( index[ 2 ] = 0 ; index[ 2 ] < maxIndex[ 2 ] ; index[ 2 ]++ ) {
                pixel = static_cast<qint32>(
                            vtkImage->GetScalarComponentAsFloat(
                                static_cast<qint32>(index[0]),
                                static_cast<qint32>(index[1]),
                                static_cast<qint32>(index[2]), 0 )) ;
                if ( pixel != 128 ) {
                    pixel = 0 ;
                } else {
                    pixel = value ;
                }
                itkImage->SetPixel ( index, static_cast<unsigned char>(pixel)) ;
            }
        }
    }
    return itkImage ;
}

void ComputeBoundingBoxFromPolyData( vtkSmartPointer<vtkPolyData> mesh,
                                     double spacing[ 3 ],
                                     int size[ 3 ],
                                     double origin [ 3 ]
                                   ) {
    // 我们需要计算网格的边界框
    double largestBoundaries[ 6 ] ;
    int largestPossibleImage = 2000 ;
    mesh->GetBounds ( largestBoundaries ) ;
    qDebug() << "输入网格边界框: " << largestBoundaries[0]
             << largestBoundaries[1] << largestBoundaries[2]
             << largestBoundaries[3] << largestBoundaries[4] << largestBoundaries[5];
    // 给定边界框，给定间距和边界扩展，计算图像大小和原点
    int size_tmp[ 3 ];
    int boundary_extension[3] = {1, 1, 1};
    for ( quint32 i = 0 ; i < 3 ; i++ ) {
        size_tmp[i] = static_cast<qint32>(
                          ceil((largestBoundaries[2 * i + 1] - origin[i]) / spacing[i] ));
    }
    for ( quint32 i = 0 ; i < 3 ; i++ ) {
        origin[i] = largestBoundaries[ 2 * i ] - boundary_extension[i] * spacing[ i ] ;
        size[i] = static_cast<qint32>(
                      ceil((largestBoundaries[2 * i + 1] - origin[i]) / spacing[i] ));
        size[i] += boundary_extension[i];
        if( size[ i ] > largestPossibleImage ) {
            std::cout << "尺寸很大，可能崩溃" << std::endl ;
        }
    }
}


bool ReadSTL(vtkNew<vtkPolyData> &surface, QString filename) {
    vtkNew<vtkSTLReader> reader;
    reader->SetFileName(filename.toLocal8Bit().data());
    reader->Update();
    surface->DeepCopy(reader->GetOutput());
    return 1;
}

int main ( int, char *[] ) {
    //加载网格
    vtkNew<vtkPolyData> polyData;
    ReadSTL(polyData, "tmp.stl");
    vtkSmartPointer<vtkMatrix4x4> RASMatrix = vtkSmartPointer<vtkMatrix4x4>::New() ;
    RASMatrix->Identity() ;
    RASMatrix->SetElement( 0, 0, -1 ) ;
    RASMatrix->SetElement( 1, 1, -1 ) ;
    vtkNew<vtkTransform> transform;
    transform->SetMatrix( RASMatrix ) ;
    vtkNew<vtkTransformPolyDataFilter> transformFilter;
    transformFilter->SetInputData( polyData ) ;
    transformFilter->SetTransform( transform ) ;
    transformFilter->Update() ;
    polyData->ShallowCopy( transformFilter->GetOutput() ) ;
    double spacing[3] = {.5, .5, .5};
    double origin[3];
    int size[3];
    itk::Matrix<double, 3, 3> direction ;
    direction.SetIdentity();
    ComputeBoundingBoxFromPolyData( polyData, spacing, size, origin) ;
    qDebug() << "Origin: " << origin[0] << " " << origin[1] << " " << origin[2];
    qDebug() << "Size: " << size[0] << " " << size[1] << " " << size[2];
    qDebug() << "Spacing: " << spacing[0] << " " << spacing[1] << " " << spacing[2] ;
    qDebug() << "Direction: ";
    std::cout << direction;
    // 扫描转换网格
    vtkNew<vtkAttributedPolyDataToImage> scanConverter;
    scanConverter->SetTolerance (0.0) ;
    scanConverter->SetInput (polyData) ;
    scanConverter->SetOutputOrigin (origin) ;
    scanConverter->SetOutputSpacing (spacing) ;
    scanConverter->SetOutputWholeExtent ( 0, size[0] - 1, 0, size[1] - 1, 0, size[2] - 1 ) ;
    scanConverter->Update ();
    vtkNew<vtkImageData> vtkBinaryVolume;
    typedef itk::Image < unsigned char, 3 > ImageType ;
    typedef ImageType::Pointer ImagePointer ;
    ImagePointer binaryVolume;
    binaryVolume = VTK2BinaryITK (vtkBinaryVolume, direction,  static_cast<unsigned char>(255));
    WriteITKImage( binaryVolume, "tmp.dcm");
    return EXIT_SUCCESS ;
}

```
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;



---


<font color=#0099ff size=5 face="黑体">欢迎访问个人博客：</font><font color=#0099ff size=5 face="黑体">[http://118.25.63.144:501/](http://118.25.63.144:501/)</font>


