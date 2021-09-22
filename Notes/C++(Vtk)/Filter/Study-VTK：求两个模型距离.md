# Study-VTK：求两个模型距离

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314120132138.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314120221965.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

&emsp;&emsp;计算距离使用的vtkDistancePolyDataFilter这个类。

```cpp
DistancePolyData类
   输入两个模型、压缩两个模型、比较两个模型体积、计算两个模型距离、渲染在小模型上显示。
   double target_reduction_;// 输入模型压缩系数（模型比较大时候压缩下，减少计算时间）
   double scalar_range_[2];// 标量范围
   vtkSmartPointer<vtkPolyData> surface_small_;// 小模型
   vtkSmartPointer<vtkPolyData> surface_big_;// 大模型
   vtkSmartPointer<vtkPolyData> surface_;// 结果模型
   
   Execute()表示开始计算
   BuildView()可视化结果   
   SetSurfaces()结果模型 写入/读取
   GetSurfaces()结果模型 写入/读取   
   SetSurfaces()计算模型 写入/读取
   GetSurfaces()计算模型 写入/读取   
   SetScalarRange()标量范围 写入/读取
   GetScalarRange()标量范围 写入/读取   
   SetTargetReduction()压缩系数 写入/读取
   GetTargetReduction()压缩系数 写入/读取
ReadMode类
   读取本地模型或自动生成两个模型。
```


```cpp
cmake_minimum_required(VERSION 3.3 FATAL_ERROR)
project(DistancePolyDataFilter)
   set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR}/bin)
find_package(VTK REQUIRED)
include(${VTK_USE_FILE})
add_executable(
    ${PROJECT_NAME} main.cpp)
target_link_libraries(#vtk lib文件
    ${PROJECT_NAME} "${VTK_LIBRARIES}")
```

```cpp
// vtk include
#include <vtkActor.h>
#include <vtkRenderer.h>
#include <vtkProperty.h>
#include <vtkSTLReader.h>
#include <vtkPointData.h>
#include <vtkDecimatePro.h>
#include <vtkSmartPointer.h>
#include <vtkSphereSource.h>
#include <vtkRenderWindow.h>
#include <vtkCleanPolyData.h>
#include <vtkMassProperties.h>
#include <vtkScalarBarActor.h>
#include <vtkPolyDataMapper.h>
#include <vtkDistancePolyDataFilter.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkInteractorStyleTrackballCamera.h>


class DistancePolyData {
  public:
    DistancePolyData() {
        this->Initial();
    }
    ~DistancePolyData() {
    }
  public:
    bool Execute();
    void BuildView();
  private:
    void Initial() { // 初始化
        target_reduction_ = 0.9;//范围 0-1 越大越快，测试时0.9 软件里0.8
        scalar_range_[0] = 0.0;
        scalar_range_[1] = 0.0;
        surface_small_ = nullptr;
        surface_big_ = nullptr;
    }
  private:
    double target_reduction_;// 压缩系数
    double scalar_range_[2];// 标量范围
    vtkSmartPointer<vtkPolyData> surface_small_;// 小模型
    vtkSmartPointer<vtkPolyData> surface_big_;// 大模型
    vtkSmartPointer<vtkPolyData> surface_;// 结果模型
  public:
    // 结果模型 写入/读取
    void SetSurfaces(vtkSmartPointer<vtkPolyData> value) {
        this->surface_ = value;
    }
    void GetSurfaces(vtkSmartPointer<vtkPolyData> value) {
        value = this->surface_;
    }

    // 计算模型 写入/读取
    void SetSurfaces(
        vtkSmartPointer<vtkPolyData> value1,
        vtkSmartPointer<vtkPolyData> value2) {
        vtkNew<vtkMassProperties> massProperties;
        massProperties->SetInputData(value1);
        massProperties->Update();
        double volume1 = massProperties->GetVolume();
        massProperties->SetInputData(value2);
        massProperties->Update();
        double volume2 = massProperties->GetVolume();
        if(volume1 - volume2 < 0.0) {
            this->surface_small_ = value1;
            this->surface_big_ = value2;
        } else {
            this->surface_small_ = value1;
            this->surface_big_ = value2;
        }
    }
    void GetSurfaces(vtkSmartPointer<vtkPolyData> &value1,
                     vtkSmartPointer<vtkPolyData> &value2) {
        value1 = this->surface_small_ ;
        value2 = this->surface_big_ ;
    }

    // 标量范围 写入/读取
    void SetScalarRange(double value[2]) {
        this->scalar_range_[0] = value[0];
        this->scalar_range_[1] = value[1];
    }
    void GetScalarRange(double &value1, double &value2) {
        value1 = this->scalar_range_[0];
        value2 = this->scalar_range_[0];
    }

    // 压缩系数 写入/读取
    void SetTargetReduction(double value) {
        this->target_reduction_ = value;
    }
    void GetTargetReduction(double &value) {
        value = this->target_reduction_;
    }
};

bool DistancePolyData::Execute() {

    if (this->surface_small_ == nullptr || this->surface_big_ == nullptr) {
        std::cout << "surface_big_||surface_small_ is nullptr" << std::endl;
        return 0;
    }
    if (this->surface_ == nullptr) {
        this->surface_ = vtkSmartPointer<vtkPolyData>::New();
    }

    vtkNew<vtkCleanPolyData> clean1 ;
    clean1->SetInputData(surface_small_);
    vtkNew<vtkCleanPolyData> clean2;
    clean2->SetInputData(surface_big_);
    vtkNew<vtkDecimatePro> decimation1;
    decimation1->SetInputConnection(clean1->GetOutputPort());
    decimation1->SetTargetReduction(this->target_reduction_);
    decimation1->Update();
    vtkNew<vtkDecimatePro> decimation2;
    decimation2->SetInputConnection(clean2->GetOutputPort());
    decimation2->SetTargetReduction(this->target_reduction_);
    decimation2->Update();
    vtkNew<vtkDistancePolyDataFilter> distanceFilter ;
    distanceFilter->SetInputConnection( 0, decimation1->GetOutputPort() );
    distanceFilter->SetInputConnection( 1, decimation2->GetOutputPort() );
    distanceFilter->Update();
    this->surface_
        = distanceFilter->GetOutput();
    this->scalar_range_[0] =
        distanceFilter->GetOutput()->GetPointData()->GetScalars()->GetRange()[0];
    this->scalar_range_[1] =
        distanceFilter->GetOutput()->GetPointData()->GetScalars()->GetRange()[1];
    return 1;
}

void DistancePolyData::BuildView() {

    if (this->surface_ == nullptr) {
        std::cout << "surface_ is nullptr" << std::endl;
        return ;
    }

    vtkNew<vtkPolyDataMapper> polydatamapper ;
    polydatamapper->SetInputData(surface_);
    polydatamapper->SetScalarRange(scalar_range_[0], scalar_range_[1]);
    vtkNew<vtkScalarBarActor> scalarBar ;
    scalarBar->SetLookupTable(polydatamapper->GetLookupTable());
    scalarBar->SetTitle("Distance");
    scalarBar->SetNumberOfLabels(10);
    vtkNew<vtkActor> actor ;
    actor->SetMapper(polydatamapper);
    actor->GetProperty()->SetOpacity(0.9);
    vtkNew<vtkRenderer> renderer;
    renderer->AddActor2D(scalarBar);
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
}

class ReadMode {
  public:
    ReadMode(bool test) {
        if (test) {
            char file1[] = "tmp_1.stl";
            char file2[] = "tmp_2.stl";
            vtkNew<vtkSTLReader> reader1;
            reader1->SetFileName(file1);
            reader1->Update();
            surface1_ = reader1->GetOutput();
            vtkNew<vtkSTLReader> reader2 ;
            reader2->SetFileName(file2);
            reader2->Update();
            surface2_ = reader2->GetOutput();
        } else {
            vtkNew<vtkSphereSource> sphereSource1 ;
            sphereSource1->SetCenter(1, 0, 0);
            sphereSource1->SetPhiResolution(21);
            sphereSource1->SetThetaResolution(21);
            sphereSource1->Update();
            surface1_ = sphereSource1->GetOutput();
            vtkNew<vtkSphereSource> sphereSource2;
            sphereSource2->SetPhiResolution(21);
            sphereSource2->SetThetaResolution(21);
            sphereSource2->Update();
            surface2_ = sphereSource2->GetOutput();
        }
    }
    ~ReadMode() {
    }

  public:
    vtkSmartPointer<vtkPolyData> surface1_;// 小模型
    vtkSmartPointer<vtkPolyData> surface2_;// 大模型
};

int main() {
    ReadMode *read_mode = new ReadMode(0);

    // 计算　&&　显示
    DistancePolyData *distance_poly_data = new DistancePolyData;
    distance_poly_data->SetSurfaces(read_mode->surface1_, read_mode->surface2_);
    if ( distance_poly_data->Execute()) {
        distance_poly_data->BuildView();
    }
    return 0;
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