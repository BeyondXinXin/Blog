# Study-VTK：调试时随时浏览模型 图像

&emsp;&emsp;平时使用vtk时候，如果需要经常看当前计算效果，可以用下这个类。支持vtkPolyData、vtkImageData自动在需要的地方显示，支持自定义颜色（vtkUnsignedCharArray需要传入）。


&emsp;&emsp;使用方法：在需要的计算cpp里引入**#include "vtkutil.h"**，计算中需要显示步骤，把**data**直接放到ShowVtkDebugPolydata里，程序执行到这里会自动断点，弹出当前计算结果，关闭弹窗后程序接着运行。保存数据的话这里只留了个vtp的输出（计算中间量，带各种信息）。

&emsp;&emsp;举列，下面这个提取中心线的程序。每计算一部，用一次**ShowVtkDebugPolydata**，可以看到当前结果，确认才计算下一步。
```cpp
	// 0 显示结果  输入
	VtkUtil::ShowVtkDebugPolydata(surface);
	// 1 计算  压缩模型
    vtkNew<vtkDecimatePro> decimation;
    decimation->SetInputConnection(surface);
    decimation->SetTargetReduction(0.9);
    decimation->Update();
    // 1 显示结果 压缩模型
	VtkUtil::ShowVtkDebugPolydata(decimation->GetOutput);
    // 2 计算  表面整理
    vtkNew<vtkCleanPolyData> surface_cleaner;
    surface_cleaner->SetInputData(decimation->GetOutput);
    surface_cleaner->Update();
    // 2 显示结果  表面整理 
    VtkUtil::ShowVtkDebugPolydata(surface_cleaner->GetOutput);
    // 3 计算  三角形相交检查
    vtkNew<vtkTriangleFilter> surface_triangulator;
    surface_triangulator->SetInputConnection(surface_cleaner->GetOutputPort());
    surface_triangulator->PassLinesOff();
    surface_triangulator->PassVertsOff();
    surface_triangulator->Update();
    vtkSmartPointer<vtkPolyData> centerline_input_surface =
    surface_triangulator->GetOutput();
    vtkSmartPointer<vtkIdList> cap_center_ids = nullptr;
    vtkSmartPointer<vtkvmtkCapPolyData> surface_capper;
    // 3 显示结果  表面整理 
    VtkUtil::ShowVtkDebugPolydata(surface_capper->GetOutput);
    // 4 计算  表面封闭
    surface_capper = vtkSmartPointer<vtkvmtkCapPolyData>::New();
    surface_capper->SetInputConnection(surface_triangulator->GetOutputPort());
    surface_capper->SetDisplacement(0);
    surface_capper->SetInPlaneDisplacement(0);
    surface_capper->Update();
    centerline_input_surface = surface_capper->GetOutput();
    cap_center_ids = surface_capper->GetCapCenterIds();
    vtkNew<vtkIdList> inlet_seed_ids, outlet_seed_ids;
    inlet_seed_ids->InsertNextId(0);
    outlet_seed_ids->InsertNextId(cap_center_ids->GetNumberOfIds() - 1);
    // 4 显示结果  表面封闭
    VtkUtil::ShowVtkDebugPolydata(centerline_input_surface);
    // 5 计算  计算中心线
    vtkNew<vtkvmtkPolyDataCenterlines> centerline_filter;
    centerline_filter->SetInputData(centerline_input_surface);
    centerline_filter->SetCapCenterIds(cap_center_ids);
    centerline_filter->SetSourceSeedIds(inlet_seed_ids);
    centerline_filter->SetTargetSeedIds(outlet_seed_ids);
    centerline_filter->SetRadiusArrayName("MaximumInscribedSphereRadius");
    centerline_filter->SetCostFunction("1/R");
    centerline_filter->SetFlipNormals(0);
    centerline_filter->SetAppendEndPointsToCenterlines(0);
    centerline_filter->SetSimplifyVoronoi(0);
    centerline_filter->SetCenterlineResampling(0);
    centerline_filter->SetResamplingStepLength(1.0);
    centerline_filter->Update();
    // 5 显示结果  计算中心线
    VtkUtil::ShowVtkDebugPolydata(centerline_filter->Update());
    return centerline_filter->GetOutput();
```




```cpp
#ifndef VTKUTIL_H
#define VTKUTIL_H

#include <QImage>
#include <vtkPolyData.h>
#include <vtkImageData.h>
#include <vtkSmartPointer.h>

class VtkUtil {
  public:
    /*!
     * @brief VtkImageDataToQImage 屏幕图片截取
     */
    static QImage VtkImageDataToQImage(
        vtkSmartPointer<vtkImageData> imageData, const qint32 value = 0);

    /*!
     * @brief ShowVtkDebugPolydata 调试时可以临时显示vtk数据
     */
    static void ShowVtkDebugPolydata(vtkSmartPointer<vtkPolyData> surface);
    static void ShowVtkDebugPolydata(vtkSmartPointer<vtkPolyData> surface,
                                     QList<quint32> self_intersected_list);
    static void ShowVtkDebugPolydata(vtkSmartPointer<vtkImageData> surface);

    /*!
     * @brief WriteVTP 调试时保存出vtp数据
     */
    static void WriteVTP(vtkSmartPointer<vtkPolyData> surface,
                         QString filename = "tmp.vtp");

};

#endif // VTKUTIL_H
```

```cpp
#include "vtkutil.h"
#include <QDebug>

// vtk include
#include <vtkActor.h>
#include <vtkCellData.h>
#include <vtkRenderer.h>
#include <vtkImageViewer2.h>
#include <vtkRenderWindow.h>
#include <vtkPolyDataMapper.h>
#include <vtkXMLPolyDataWriter.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkInteractorStyleTrackballCamera.h>

#define ISDEBUGGING 0

QImage VtkUtil::VtkImageDataToQImage(
    vtkSmartPointer<vtkImageData> imageData, const qint32 value) {
    if (!imageData) {
        qWarning() << "image data is null";
        return QImage();
    }
    /// \todo retrieve just the UpdateExtent
    qint32 width = imageData->GetDimensions()[0];
    qint32 height = imageData->GetDimensions()[1];
    QImage image(width, height, QImage::Format_RGB32);
    QRgb *rgbPtr = reinterpret_cast<QRgb *>(image.bits()) + width * (height - 1);
    unsigned char *colorsPtr =
        reinterpret_cast<unsigned char *>(imageData->GetScalarPointer());

    // Loop over the vtkImageData contents.
    for (qint32 row = 0; row < height; row++) {
        for (qint32 col = 0; col < width; col++) {
            // Swap the vtkImageData RGB values with an equivalent QColor
            *(rgbPtr++) = QColor(colorsPtr[0], colorsPtr[1], colorsPtr[2]).rgb();
            colorsPtr += imageData->GetNumberOfScalarComponents();
        }

        rgbPtr -= width * 2;
    }
    if(1 == value) {
        image = image.copy((image.width() - image.height()) / 2, 0,
                           image.height(), image.height());
    } else if(2 == value) {
        image = image.scaled(image.width(), image.width());
    }
    return image;
}

void VtkUtil::ShowVtkDebugPolydata(vtkSmartPointer<vtkPolyData> surface) {
#if ISDEBUGGING
    vtkNew<vtkPolyDataMapper> polydatamapper ;
    polydatamapper->SetInputData(surface);
    vtkNew<vtkActor> actor ;
    actor->SetMapper(polydatamapper);
    // actor->GetProperty()->SetOpacity(0.1);
    vtkNew<vtkRenderer> renderer;
    renderer->AddActor(actor);
    renderer->SetBackground(0.2, 0.2, 0.2);
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    vtkNew<vtkInteractorStyleTrackballCamera>style ;
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetInteractorStyle(style);
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
#else
    Q_UNUSED(surface);
#endif
}

void VtkUtil::ShowVtkDebugPolydata(vtkSmartPointer<vtkPolyData> surface,
                                   QList<quint32> self_intersected_list) {
#if ISDEBUGGING
    qSort(self_intersected_list.begin(), self_intersected_list.end());
    self_intersected_list = self_intersected_list.toSet().toList();
    unsigned char color1[3] = { 255, 0, 0 };
    unsigned char color2[3] = { 0, 0, 0 };
    vtkNew<vtkUnsignedCharArray> cellColor;
    cellColor->SetNumberOfComponents(3);

    for(quint32 id = 0; id < surface->GetNumberOfCells(); id++) {
        if(self_intersected_list.contains(id)) {
            cellColor->InsertNextTypedTuple(color1);
        } else {
            cellColor->InsertNextTypedTuple(color2);
        }
    }
    surface->GetCellData()->SetScalars(cellColor);
    vtkNew<vtkPolyDataMapper> polydatamapper ;
    polydatamapper->SetInputData(surface);
    vtkNew<vtkActor> actor ;
    actor->SetMapper(polydatamapper);
    // actor->GetProperty()->SetOpacity(0.1);
    vtkNew<vtkRenderer> renderer;
    renderer->AddActor(actor);
    renderer->SetBackground(0.2, 0.2, 0.2);
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    vtkNew<vtkInteractorStyleTrackballCamera>style ;
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetInteractorStyle(style);
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
#else
    Q_UNUSED(surface);
    Q_UNUSED(self_intersected_list);
#endif
}

void VtkUtil::ShowVtkDebugPolydata(
    vtkSmartPointer<vtkImageData> surface) {
#if ISDEBUGGING
    vtkNew<vtkImageViewer2> imageViewer ;
    imageViewer->SetInputData(surface);
    vtkNew<vtkRenderWindowInteractor> renderWindowInteractor ;
    imageViewer->SetupInteractor(renderWindowInteractor);
    imageViewer->Render();
    imageViewer->GetRenderer()->ResetCamera();
    imageViewer->Render();
    renderWindowInteractor->Start();
#else
    Q_UNUSED(surface);
#endif
}

void VtkUtil::WriteVTP(
    vtkSmartPointer<vtkPolyData> surface, QString filename) {
#if ISDEBUGGING
    vtkNew<vtkXMLPolyDataWriter> writer;
    writer->SetFileName(filename.toLocal8Bit().data());
    writer->SetInputData(surface);
    writer->Write();
#else
    Q_UNUSED(surface);
    Q_UNUSED(filename);
#endif
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