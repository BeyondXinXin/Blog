# Study-VTK：vtkWidget 分割 配准类之   操纵折线 vtkBrokenLineWidget

@[TOC](vtkBrokenLineWidget)

# 1 vtkBrokenLineWidget介绍
&emsp;&emsp;**vtkBrokenLineWidget**定义了一个用于操纵折线的**Widget**。
&emsp;&emsp;该**Widget**定义了可以交互地放置在场景中的虚线。虚线具有手柄，可以更改其数量，还可以在虚线本身上拾取它以在场景中平移或旋转它。该对象的一个​​不错的功能是vtkBrokenLineWidget像任何**Widget**一样，都可以使用当前的交互器样式。也就是说，如果vtkBrokenLineWidget不处理事件，则所有其他已注册观察者（包括交互器样式）都有机会处理事件。否则，vtkBrokenLineWidget将终止其处理的事件的处理。
&emsp;&emsp;默认交互：
&emsp;&emsp;&emsp;&emsp; 1）向下按住鼠标左键并拖动球形手柄之一以更改虚线的形状：这些手柄充当“控制点”。
&emsp;&emsp;&emsp;&emsp; 2）在线段上按下左键可以移动widget。 
&emsp;&emsp;&emsp;&emsp; 3）ctrl+鼠标中键实现围绕它本身旋转	
&emsp;&emsp;&emsp;&emsp; 4）鼠标右键按下后上下移动启用自身缩放（滚轮则是全局整体缩放）。 
&emsp;&emsp;&emsp;&emsp; 5）ctrl+鼠标右键删除点（最少保留两个）
&emsp;&emsp;&emsp;&emsp; 6）增加控制点 sheft+鼠标右键

# 2 vtkBrokenLineWidget官方案例

&emsp;&emsp;绑定了下**vtkBrokenLineWidget**的回调函数。移动点后，在右侧画出几个点以及检测线上穿过的mesh一并画出来。可以作为一个选择器。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200403084047505.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020040308421391.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200403084741555.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

```cpp
#include "vtkSmartPointer.h"
#include "vtkActor.h"
#include "vtkBrokenLineWidget.h"
#include "vtkCamera.h"
#include "vtkCommand.h"
#include "vtkDataSetMapper.h"
#include "vtkExtractSelection.h"
#include "vtkInformation.h"
#include "vtkLinearSelector.h"
#include "vtkMultiBlockDataSet.h"
#include "vtkPolyData.h"
#include "vtkPolyDataMapper.h"
#include "vtkProgrammableFilter.h"
#include "vtkProperty.h"
#include "vtkRenderWindow.h"
#include "vtkRenderWindowInteractor.h"
#include "vtkRenderer.h"
#include "vtkTextActor.h"
#include "vtkTextProperty.h"
#include "vtkUnstructuredGrid.h"
#include "vtkUnstructuredGridReader.h"
#include <vtkSTLReader.h>
#include <sstream>

// Callback for the broken line widget interaction
class vtkBLWCallback : public vtkCommand {
  public:
    static vtkBLWCallback *New() {
        return new vtkBLWCallback;
    }
    void Execute(vtkObject *caller, unsigned long, void *) override {
        // Retrieve polydata line
        vtkBrokenLineWidget *line = reinterpret_cast<vtkBrokenLineWidget *>(caller);
        line->GetPolyData(Poly);
        // Update linear extractor with current points
        this->Selector->SetPoints(Poly->GetPoints());
        // Update selection from mesh
        this->Extractor->Update();
        vtkMultiBlockDataSet *outMB = vtkMultiBlockDataSet::SafeDownCast(this->Extractor->GetOutput());
        vtkUnstructuredGrid *selection = vtkUnstructuredGrid::SafeDownCast(outMB->GetBlock(0));
        this->Mapper->SetInputData(selection);
        // Update cardinality of selection
        std::ostringstream txt;
        txt << "Number of selected elements: " << (selection ? selection->GetNumberOfCells() : 0);
        this->Text->SetInput(txt.str().c_str());
    }
    vtkBLWCallback()
        : Poly(nullptr)
        , Selector(nullptr)
        , Extractor(nullptr)
        , Mapper(nullptr)
        , Text(nullptr) {
    }
    vtkPolyData *Poly;
    vtkLinearSelector *Selector;
    vtkExtractSelection *Extractor;
    vtkDataSetMapper *Mapper;
    vtkTextActor *Text;
};

int main(int argc, char *argv[]) {
    // Create render window and interactor
    vtkSmartPointer<vtkRenderWindow> win = vtkSmartPointer<vtkRenderWindow>::New();
    win->SetMultiSamples(0);
    win->SetSize(600, 300);
    vtkSmartPointer<vtkRenderWindowInteractor> iren =
        vtkSmartPointer<vtkRenderWindowInteractor>::New();
    iren->SetRenderWindow(win);
    iren->Initialize();
    // Create 2 viewports in window
    vtkSmartPointer<vtkRenderer> ren1 = vtkSmartPointer<vtkRenderer>::New();
    ren1->SetBackground(.4, .4, .4);
    ren1->SetBackground2(.8, .8, .8);
    ren1->GradientBackgroundOn();
    ren1->SetViewport(0., 0., .5, 1.);
    win->AddRenderer(ren1);
    vtkSmartPointer<vtkRenderer> ren2 = vtkSmartPointer<vtkRenderer>::New();
    ren2->SetBackground(1., 1., 1.);
    ren2->SetViewport(.5, 0., 1., 1.);
    win->AddRenderer(ren2);
    // Create a good view angle
    vtkCamera *camera = ren1->GetActiveCamera();
    camera->SetFocalPoint(.12, 0., 0.);
    camera->SetPosition(.38, .3, .15);
    camera->SetViewUp(0., 0., 1.);
    ren2->SetActiveCamera(camera);
    // Read 3D unstructured input mesh
    // char *fileName = vtkTestUtilities::ExpandDataFileName(argc, argv, "Data/AngularSector.vtk");
    vtkSmartPointer<vtkUnstructuredGridReader> reader =
        vtkSmartPointer<vtkUnstructuredGridReader>::New();
    reader->SetFileName("tmp.vtk");
//    delete[] fileName;
    reader->Update();
    // Create mesh actor to be rendered in viewport 1
    vtkSmartPointer<vtkDataSetMapper> meshMapper = vtkSmartPointer<vtkDataSetMapper>::New();
    meshMapper->SetInputConnection(reader->GetOutputPort());
    vtkSmartPointer<vtkActor> meshActor = vtkSmartPointer<vtkActor>::New();
    meshActor->SetMapper(meshMapper);
    meshActor->GetProperty()->SetColor(.23, .37, .17);
    meshActor->GetProperty()->SetRepresentationToWireframe();
    ren1->AddActor(meshActor);
    // Create multi-block mesh for linear extractor
    reader->Update();
    vtkUnstructuredGrid *mesh = reader->GetOutput();
    vtkSmartPointer<vtkMultiBlockDataSet> meshMB = vtkSmartPointer<vtkMultiBlockDataSet>::New();
    meshMB->SetNumberOfBlocks(1);
    meshMB->GetMetaData(static_cast<unsigned>(0))->Set(vtkCompositeDataSet::NAME(), "Mesh");
    meshMB->SetBlock(0, mesh);
    // Create broken line widget, attach it to input mesh
    vtkSmartPointer<vtkBrokenLineWidget> line = vtkSmartPointer<vtkBrokenLineWidget>::New();
    line->SetInteractor(iren);
    line->SetInputData(mesh);
    line->SetPriority(1.);
    line->KeyPressActivationOff();
    line->PlaceWidget();
    line->ProjectToPlaneOff();
    line->On();
    line->SetHandleSizeFactor(1.2);
    // Create list of points to define broken line
    vtkSmartPointer<vtkPoints> points = vtkSmartPointer<vtkPoints>::New();
    points->InsertNextPoint(.23, .0, .0);
    points->InsertNextPoint(.0, .0, .0);
    points->InsertNextPoint(.23, .04, .04);
    line->InitializeHandles(points);
    // Extract polygonal line and then its points
    vtkSmartPointer<vtkPolyData> linePD = vtkSmartPointer<vtkPolyData>::New();
    line->GetPolyData(linePD);
    vtkSmartPointer<vtkPolyDataMapper> lineMapper = vtkSmartPointer<vtkPolyDataMapper>::New();
    lineMapper->SetInputData(linePD);
    vtkSmartPointer<vtkActor> lineActor = vtkSmartPointer<vtkActor>::New();
    lineActor->SetMapper(lineMapper);
    lineActor->GetProperty()->SetColor(1., 0., 0.);
    lineActor->GetProperty()->SetLineWidth(2.);
    ren2->AddActor(lineActor);
    // Create selection along broken line defined by list of points
    vtkSmartPointer<vtkLinearSelector> selector = vtkSmartPointer<vtkLinearSelector>::New();
    selector->SetInputData(meshMB);
    selector->SetPoints(points);
    selector->IncludeVerticesOff();
    selector->SetVertexEliminationTolerance(1.e-12);
    // Extract selection from mesh
    vtkSmartPointer<vtkExtractSelection> extractor = vtkSmartPointer<vtkExtractSelection>::New();
    extractor->SetInputData(0, meshMB);
    extractor->SetInputConnection(1, selector->GetOutputPort());
    extractor->Update();
    vtkMultiBlockDataSet *outMB = vtkMultiBlockDataSet::SafeDownCast(extractor->GetOutput());
    vtkUnstructuredGrid *selection = vtkUnstructuredGrid::SafeDownCast(outMB->GetBlock(0));
    // Create selection actor
    vtkSmartPointer<vtkDataSetMapper> selMapper = vtkSmartPointer<vtkDataSetMapper>::New();
    selMapper->SetInputData(selection);
    vtkSmartPointer<vtkActor> selActor = vtkSmartPointer<vtkActor>::New();
    selActor->SetMapper(selMapper);
    selActor->GetProperty()->SetColor(0., 0., 0.);
    selActor->GetProperty()->SetRepresentationToWireframe();
    ren2->AddActor(selActor);
    // Annotate with number of elements
    vtkSmartPointer<vtkTextActor> txtActor = vtkSmartPointer<vtkTextActor>::New();
    std::ostringstream txt;
    txt << "Number of selected elements: " << (selection ? selection->GetNumberOfCells() : 0);
    txtActor->SetInput(txt.str().c_str());
    txtActor->SetTextScaleModeToViewport();
    txtActor->SetNonLinearFontScale(.2, 18);
    txtActor->GetTextProperty()->SetColor(0., 0., 1.);
    txtActor->GetTextProperty()->SetFontSize(18);
    ren2->AddActor(txtActor);
    // Invoke callback on polygonal line to interactively select elements
    vtkSmartPointer<vtkBLWCallback> cb = vtkSmartPointer<vtkBLWCallback>::New();
    cb->Poly = linePD;
    cb->Selector = selector;
    cb->Extractor = extractor;
    cb->Mapper = selMapper;
    cb->Text = txtActor;
    line->AddObserver(vtkCommand::InteractionEvent, cb);
    // Render and test
    win->Render();
    iren->Start();
    return 0;
}

```
# 3 vtkBrokenLineWidget 常用函数

```cpp
// 初始位置 
// 第一种根据vtkBrokenLineWidget 放置的actor来确定、第二三种根据自己定义两个对角来确定
 void PlaceWidget() override
    {this->Superclass::PlaceWidget();}
 void PlaceWidget(double bounds[6]) override;
 void PlaceWidget(double xmin, double xmax, double ymin, double ymax,double zmin, double zmax) override

// 把widget投影到正交平面上,这类widget使用方式基本都一样。就一个投影到某一平面，搞了这么多接口，方便使用。下边这个分不清无所谓，使用前测试下那个合适就可以了，其实就是x、y、z、正交、任意。
virtual void vtkBrokenLineWidget::SetProjectToPlane(vtkTypeBool)	
virtual vtkTypeBool vtkBrokenLineWidget::GetProjectToPlane()	
virtual void vtkBrokenLineWidget::ProjectToPlaneOn()	
virtual void vtkBrokenLineWidget::ProjectToPlaneOff()	
void vtkBrokenLineWidget::SetPlaneSource(vtkPlaneSource*plane)	
virtual void vtkBrokenLineWidget::SetProjectionNormal(int)	
virtual int vtkBrokenLineWidget::GetProjectionNormal()	
void vtkBrokenLineWidget::SetProjectionNormalToXAxes()	
void vtkBrokenLineWidget::SetProjectionNormalToYAxes()
void vtkBrokenLineWidget::SetProjectionNormalToZAxes()	
void vtkBrokenLineWidget::SetProjectionNormalToOblique()
void vtkBrokenLineWidget::SetProjectionPosition(double position)	
virtual double vtkBrokenLineWidget::GetProjectionPosition()	
	
// 获取直线（几个点的坐标）
void vtkBrokenLineWidget::GetPolyData(vtkPolyData*pd)	

// 设置手柄属性 前两个是未选择属性、后两个是选择属性
virtual void vtkBrokenLineWidget::SetHandleProperty(vtkProperty * )	
virtual vtkProperty* vtkBrokenLineWidget::GetHandleProperty()	
virtual void vtkBrokenLineWidget::SetSelectedHandleProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetSelectedHandleProperty()	


// 设置折线属性 前两个是未选择属性、后两个是选择属性
virtual void vtkBrokenLineWidget::SetLineProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetLineProperty()	
virtual void vtkBrokenLineWidget::SetSelectedLineProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetSelectedLineProperty()	

// 设置控制点  数量和位置
virtual void vtkBrokenLineWidget::SetNumberOfHandles(int npts)
virtual int vtkBrokenLineWidget::GetNumberOfHandles(）
void vtkBrokenLineWidget::SetHandlePosition(int handle,double x,double y,double z)	
void vtkBrokenLineWidget::SetHandlePosition(int	handle,double xyz[3])	
void vtkBrokenLineWidget::GetHandlePosition(int handle,double xyz[3])	
double* vtkBrokenLineWidget::GetHandlePosition(int handle)	
// 直接用 vtkPoints初始化点数量
void vtkBrokenLineWidget::InitializeHandles(vtkPoints *points)	

// 各个折线长度总和
double vtkBrokenLineWidget::GetSummedLength()	

// 开启关闭 widget选择功能  关闭后点和折线都显示，只是无法调整位置
virtual void vtkBrokenLineWidget::SetProcessEvents(vtkTypeBool)	
virtual vtkTypeBool vtkBrokenLineWidget::GetProcessEvents()	
virtual void vtkBrokenLineWidget::ProcessEventsOn()	
virtual void vtkBrokenLineWidget::ProcessEventsOff()	

// 控制点尺寸（默认值1.0）
virtual void vtkBrokenLineWidget::SetHandleSizeFactor(double)	
virtual double vtkBrokenLineWidget::GetHandleSizeFactor()	
```

# 4 vtkBrokenLineWidget 使用技巧

## 4.1 vtkBrokenLineWidget 绑定回调函数
```cpp
class vtkBLWCallback : public vtkCommand {
  public:
    static vtkBLWCallback *New() {
        return new vtkBLWCallback;
    }
    void Execute(vtkObject *caller, unsigned long, void *) override {
        // Retrieve polydata line
        vtkBrokenLineWidget *line = reinterpret_cast<vtkBrokenLineWidget *>(caller);
        line->GetPolyData(Poly);
        // Update linear extractor with current points
        this->Selector->SetPoints(Poly->GetPoints());
        // Update selection from mesh
        this->Extractor->Update();
        vtkMultiBlockDataSet *outMB = vtkMultiBlockDataSet::SafeDownCast(this->Extractor->GetOutput());
        vtkUnstructuredGrid *selection = vtkUnstructuredGrid::SafeDownCast(outMB->GetBlock(0));
        this->Mapper->SetInputData(selection);
        // Update cardinality of selection
        std::ostringstream txt;
        txt << "Number of selected elements: " << (selection ? selection->GetNumberOfCells() : 0);
        this->Text->SetInput(txt.str().c_str());
    }
    vtkBLWCallback()
        : Poly(nullptr)
        , Selector(nullptr)
        , Extractor(nullptr)
        , Mapper(nullptr)
        , Text(nullptr) {
    }
    vtkPolyData *Poly;
    vtkLinearSelector *Selector;
    vtkExtractSelection *Extractor;
    vtkDataSetMapper *Mapper;
    vtkTextActor *Text;
};
```

```cpp
	vtkSmartPointer<vtkBLWCallback> cb = vtkSmartPointer<vtkBLWCallback>::New();
    line->AddObserver(vtkCommand::InteractionEvent, cb);
```
## 4.2 vtkBrokenLineWidget 投影到某一个平面
&emsp;&emsp;这个比较实用，就是每次需要的投影平面比较难找，自己测试下就可以。

```cpp
virtual void vtkBrokenLineWidget::SetProjectToPlane(vtkTypeBool)	
virtual vtkTypeBool vtkBrokenLineWidget::GetProjectToPlane()	
virtual void vtkBrokenLineWidget::ProjectToPlaneOn()	
virtual void vtkBrokenLineWidget::ProjectToPlaneOff()	
void vtkBrokenLineWidget::SetPlaneSource(vtkPlaneSource*plane)	
virtual void vtkBrokenLineWidget::SetProjectionNormal(int)	
virtual int vtkBrokenLineWidget::GetProjectionNormal()	
void vtkBrokenLineWidget::SetProjectionNormalToXAxes()	
void vtkBrokenLineWidget::SetProjectionNormalToYAxes()
void vtkBrokenLineWidget::SetProjectionNormalToZAxes()	
void vtkBrokenLineWidget::SetProjectionNormalToOblique()
void vtkBrokenLineWidget::SetProjectionPosition(double position)	
virtual double vtkBrokenLineWidget::GetProjectionPosition()	
```



## 4.3 设置控制点  数量和位置
&emsp;&emsp;可以逐个设置，如果设置了数量，为初始化则那几个点会重叠放在（0,0,0）
```cpp
// 设置控制点  数量和位置
virtual void vtkBrokenLineWidget::SetNumberOfHandles(int npts)
virtual int vtkBrokenLineWidget::GetNumberOfHandles(）
void vtkBrokenLineWidget::SetHandlePosition(int handle,double x,double y,double z)	
void vtkBrokenLineWidget::SetHandlePosition(int	handle,double xyz[3])	
void vtkBrokenLineWidget::GetHandlePosition(int handle,double xyz[3])	
double* vtkBrokenLineWidget::GetHandlePosition(int handle)	
// 直接用 vtkPoints初始化点数量
void vtkBrokenLineWidget::InitializeHandles(vtkPoints *points)
```

```cpp
    vtkNew<vtkBrokenLineWidget> line;
    line->SetInteractor(iren);
    line->SetInputData(mesh);
    line->SetPriority(1.);
    line->KeyPressActivationOff();
    line->PlaceWidget();
    line->ProjectToPlaneOff();
    line->On();
    line->SetHandleSizeFactor(1.2);
    // Create list of points to define broken line
    vtkNew<vtkPoints> points ;
    points->InsertNextPoint(.23, .0, .0);
    points->InsertNextPoint(.0, .0, .0);
    points->InsertNextPoint(.23, .04, .04);
    line->InitializeHandles(points);
```


## 4.4 修改控制点尺寸
&emsp;&emsp;默认控制点尺寸为1.0
```cpp
    vtkNew<vtkBrokenLineWidget> line;
    line->SetHandleSizeFactor(1.2);
```
## 4.5 vtkBrokenLineWidget 修改交互属性（顶点、折线）。
```cpp
    vtkNew<vtkBrokenLineWidget> line;
    vtkProperty *pr = line->GetHandleProperty();
    vtkProperty *spr = line->GetSelectedHandleProperty();
    pr->SetColor(1, 0, 0);
    spr->SetColor(0, 0, 1);
```
```cpp
// 设置手柄属性 前两个是未选择属性、后两个是选择属性
virtual void vtkBrokenLineWidget::SetHandleProperty(vtkProperty * )	
virtual vtkProperty* vtkBrokenLineWidget::GetHandleProperty()	
virtual void vtkBrokenLineWidget::SetSelectedHandleProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetSelectedHandleProperty()	
// 设置折线属性 前两个是未选择属性、后两个是选择属性
virtual void vtkBrokenLineWidget::SetLineProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetLineProperty()	
virtual void vtkBrokenLineWidget::SetSelectedLineProperty(vtkProperty *)	
virtual vtkProperty* vtkBrokenLineWidget::GetSelectedLineProperty()
```

## 4.6 vtkBrokenLineWidget 当前折线长度 当前点坐标
&emsp;&emsp;放在回调函数里或者触发获取槽函数。
```cpp
void vtkBrokenLineWidget::GetPolyData(vtkPolyData*pd)
double vtkBrokenLineWidget::GetSummedLength()	
```
