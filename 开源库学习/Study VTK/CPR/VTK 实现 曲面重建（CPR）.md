## VTK 实现 曲面重建（CPR）


### 原理

CPR+-+Curved+Planar+Reformation
下载: [https://www.jianguoyun.com/p/DXY5HOoQgYiuCRia-PED](https://www.jianguoyun.com/p/DXY5HOoQgYiuCRia-PED) (访问密码 : r0ga0d)


### 曲面重建CPR步骤

1. 输入点拟合样条曲线（利用`vtkSplineFilter`）
2. 计算样条曲线各点的法向量(弗莱纳公式)
3. 根据点和法向量截取图片(`vtkProbeFilter`)
4. 每张图片拼接起来(`vtkImageAppend`)




### VTK实现

常用功能vtk肯定提供现成办法
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/image.6vni6vys2to.png)

* 期刊 地址
[https://www.vtkjournal.org/browse/publication/838](https://www.vtkjournal.org/browse/publication/838)
* 期刊 Github 地址(只包含了计算曲线法相和样条曲线切割的实现和测试)   
 [https://github.com/midas-journal/midas-journal-838](https://github.com/midas-journal/midas-journal-838)
* 作者项目 Github 地址(还带了一堆其他的算法和测试以及paraview的插件) 
[https://github.com/djelouze/vtkKinship](https://github.com/djelouze/vtkKinship)







### 使用

作者案例写的很完整。

* 方法一：增加远程模块： `Module_SplineDrivenImageSlicer:BOOL`（vtk9要自己改一下cmakelists）
> 作者写的我看起来比较吃力，改了下，剔除一些没用的，并添加注释。下边2和3是自己完整改完之后的

* 方法二：把`FrenetSerretFrame`和`SplineDrivenImageSlicer`直接添加到自己工程


两个都用过，第二个更好。自己可以改，这个是我最终改的版本：

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/image.15fqubkr7xhc.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/image.37oqxbwvg6y0.png)



#### 1. 输入点拟合样条曲线（利用`vtkSplineFilter`）

捕获样条曲线直接用 `vtkContourWidget`即可，他的rep可以得到世界坐标。结合背景`ImageReslicers`的4*4变换矩阵可以得到点的空间位置。

利用`vtkContourWidget`捕获点

```cpp
vtkContourWidget *wid = vtkContourWidget::New();
wid->SetInteractor(m_renderWindows[2]->GetInteractor());
wid->CreateDefaultRepresentation();
wid->On();
m_scrollConnection->Connect(
    wid, vtkCommand::EndInteractionEvent, this, SLOT(
        SlotContourEndInteractionEvent(
            vtkObject *, unsigned long, void *, void *))
    , nullptr, 0.0, Qt::UniqueConnection);
```

计算点的空间位置

```cpp
auto widget = dynamic_cast<vtkContourWidget *>(t_obj);
auto rep = dynamic_cast<vtkOrientedGlyphContourRepresentation *>(widget->GetContourRepresentation());
if(rep) {
    vtkMatrix4x4 *sourceMatrix = m_resliceWidget->getImageReslicers()[2]->GetResliceAxes();
    qint32 n = rep->GetNumberOfNodes();
    for (qint32 i = 0; i < n; ++i) {
        double p[3];
        rep->GetNthNodeWorldPosition(i, p);
        vtkNew<vtkTransform> transform1;
        transform1->SetMatrix(sourceMatrix);
        transform1->Translate(p[0], p[1], 0);
        qDebug() << i
                    << transform1->GetMatrix()->GetElement(0, 3)
                    << transform1->GetMatrix()->GetElement(1, 3)
                    << transform1->GetMatrix()->GetElement(2, 3);
    }
}
```

拟合曲线
```cpp
vtkNew<vtkSplineFilter> spline_filter;
spline_filter->SetSubdivideToLength();
spline_filter->SetLength(0.2);
spline_filter->SetInputData(poly_data);
spline_filter->Update();
```



#### 2. 计算样条曲线各点的法向量(弗莱纳公式)

根据弗莱纳公式计算曲线向量

```cpp
#include"vtkPoints.h"
#include"vtkPolyDataAlgorithm.h"
#include"vtkPolyData.h"
#include"vtkCellArray.h"

/**
 * @brief The CBCTFrenetSerretFrame class
 * 弗莱纳公式（Frenet–Serret formulas）
 */
class CBCTFrenetSerretFrame : public vtkPolyDataAlgorithm {
  public:
    vtkTypeMacro(CBCTFrenetSerretFrame, vtkPolyDataAlgorithm)
    static CBCTFrenetSerretFrame *New();
    vtkSetMacro(view_up_, double)
    vtkGetMacro(view_up_, double)
    static void RotateVector( double *vector, const double *axis, double angle );
  protected:
    CBCTFrenetSerretFrame();
    ~CBCTFrenetSerretFrame() override;
    virtual int RequestData(
        vtkInformation *, vtkInformationVector **, vtkInformationVector *)override;
    virtual int FillInputPortInformation(int port, vtkInformation *info)override;
    // 计算导数
    void ComputeTangentVectors(vtkIdType pointIdNext,
                               vtkIdType pointIdLast,
                               double *tangent);
    // 计算二阶导数
    void ComputeNormalVectors(double *tgNext,
                              double *tgLast,
                              double *normal );
    // 由切线定义的平面上最后法线的投影
    void ComputeConsistentNormalVectors( double *tangent,
                                         double *lastNormal,
                                         double *normal);
  private:
    CBCTFrenetSerretFrame(const CBCTFrenetSerretFrame &);
    void operator=(const CBCTFrenetSerretFrame &);
    double view_up_;
    int consistent_normals_;
};
```

```cpp

#include "vtkDoubleArray.h"
#include "vtkPointData.h"
#include "vtkMath.h"
#include "vtkInformation.h"
#include "vtkInformationVector.h"
#include "vtkObjectFactory.h"

vtkStandardNewMacro(CBCTFrenetSerretFrame);

CBCTFrenetSerretFrame::CBCTFrenetSerretFrame( ) {
    this->consistent_normals_ = 1;
    this->view_up_ = 0;
}

CBCTFrenetSerretFrame::~CBCTFrenetSerretFrame( ) {
}

int CBCTFrenetSerretFrame::FillInputPortInformation(int port, vtkInformation *info) {
    if( port == 0 ) {
        info->Set(vtkAlgorithm::INPUT_REQUIRED_DATA_TYPE(), "vtkPolyData");
    }
    return 1;
}

int CBCTFrenetSerretFrame::RequestData(
    vtkInformation *vtkNotUsed(request),
    vtkInformationVector **inputVector,
    vtkInformationVector *outputVector) {
    vtkInformation *inInfo = inputVector[0]->GetInformationObject(0);
    vtkInformation *outInfo = outputVector->GetInformationObject(0);
    vtkPolyData *input = vtkPolyData::SafeDownCast(
                             inInfo->Get(vtkDataObject::DATA_OBJECT()));
    vtkPolyData *output = vtkPolyData::SafeDownCast(
                              outInfo->Get(vtkDataObject::DATA_OBJECT()));
    output->DeepCopy( input );
    vtkDoubleArray *tangents = vtkDoubleArray::New( );
    tangents->SetNumberOfComponents( 3 );
    tangents->SetNumberOfTuples( input->GetNumberOfPoints( ) );
    tangents->SetName("FSTangents");
    vtkDoubleArray *normals = vtkDoubleArray::New( );
    normals->SetNumberOfComponents( 3 );
    normals->SetNumberOfTuples( input->GetNumberOfPoints( ) );
    normals->SetName("FSNormals");
    vtkCellArray *lines = output->GetLines( );
    lines->InitTraversal();
    vtkIdType nbPoints;
    vtkIdType *points;
    int cellIdx;
    for( cellIdx = 0; cellIdx < lines->GetNumberOfCells( ); cellIdx++ ) {
        lines->GetNextCell( nbPoints, points);
        for( int i = 0 ; i < nbPoints; i++) {
            double tangent[3];
            if( i == 0 ) {
                this->ComputeTangentVectors( points[0], points[1], tangent );
            } else if( i == nbPoints - 1 ) {
                this->ComputeTangentVectors( points[nbPoints - 2], points[nbPoints - 1], tangent );
            } else {
                this->ComputeTangentVectors( points[i - 1], points[i + 1], tangent );
            }
            vtkMath::Normalize( tangent );
            tangents->SetTuple(points[i], tangent);
        }
        for( int i = 0 ; i < nbPoints; i++) {
            if( !this->consistent_normals_ || i == 0) {
                double tangentLast[3], tangentNext[3], normal[3];
                if( i == 0 ) {
                    tangents->GetTuple( points[i], tangentLast);
                } else {
                    tangents->GetTuple( points[i - 1], tangentLast);
                }
                if( i == nbPoints - 1 ) {
                    tangents->GetTuple( points[i], tangentNext);
                } else {
                    tangents->GetTuple( points[i + 1], tangentNext);
                }
                this->ComputeNormalVectors( tangentLast, tangentNext, normal );
                if( this->consistent_normals_ ) {
                    this->RotateVector( normal, tangentLast, this->view_up_ );
                }
                vtkMath::Normalize( normal );
                normals->SetTuple(points[i], normal);
            }
            if( this->consistent_normals_ && i != 0) {
                double tangent[3], lastNormal[3], normal[3];
                normals->GetTuple(points[i - 1], lastNormal);
                tangents->GetTuple(points[i], tangent);
                this->ComputeConsistentNormalVectors( tangent,
                                                      lastNormal,
                                                      normal );
                vtkMath::Normalize( normal );
                normals->SetTuple(points[i], normal);
            }
        }
    }
    output->GetPointData( )->AddArray( normals );
    output->GetPointData( )->AddArray( tangents );
    normals->Delete( );
    tangents->Delete( );
    return 1;
}

void CBCTFrenetSerretFrame::ComputeTangentVectors(
    vtkIdType pointIdNext, vtkIdType pointIdLast, double *tangent ) {
    vtkPolyData *input = static_cast<vtkPolyData *>(this->GetInput( 0 ));
    double ptNext[3];
    double ptLast[3];
    input->GetPoint( pointIdNext, ptNext);
    input->GetPoint( pointIdLast, ptLast);
    int comp;
    for( comp = 0; comp < 3; comp++ ) {
        tangent[comp] = ( ptLast[comp] - ptNext[comp] ) / 2;
    }
}

void CBCTFrenetSerretFrame::ComputeConsistentNormalVectors( double *tangent,
        double *normalLast,
        double *normal ) {
    double temp[3];
    vtkMath::Cross( normalLast, tangent, temp);
    vtkMath::Cross( tangent, temp, normal );
}

void CBCTFrenetSerretFrame::ComputeNormalVectors( double *tgNext,
        double *tgLast,
        double *normal ) {
    int comp;
    for( comp = 0; comp < 3; comp++ ) {
        normal[comp] = ( tgNext[comp] - tgLast[comp] );
    }
    if( vtkMath::Norm(normal) == 0 ) {
        double unit[3] = {1, 0, 0};
        vtkMath::Cross( tgLast, unit, normal );
    }
}

void CBCTFrenetSerretFrame::RotateVector( double *vector, const double *axis, double angle ) {
    double UdotN = vtkMath::Dot(vector, axis);
    double NvectU[3];
    vtkMath::Cross(axis, vector, NvectU);
    for( int comp = 0; comp < 3 ; comp++) {
        vector[comp] =  cos( angle ) * vector[comp]
                        + (1 - cos( angle )) * UdotN * axis[comp]
                        + sin( angle ) * NvectU[comp];
    }
}

```



#### 3. 根据点和法向量截取图片(`vtkProbeFilter`)

沿着样条曲线切割图片

```cpp
class CBCTFrenetSerretFrame;
class vtkImageReslice;

/**
 * @brief The CBCTSplineDrivenImageSlicer class
 * 沿着样条曲线切割图片
 */
class CBCTSplineDrivenImageSlicer : public vtkImageAlgorithm {
  public:
    vtkTypeMacro(CBCTSplineDrivenImageSlicer, vtkImageAlgorithm)
    static CBCTSplineDrivenImageSlicer *New();
    void SetPathConnection(int id, vtkAlgorithmOutput *algOutput);
    void SetPathConnection(vtkAlgorithmOutput *algOutput);
    vtkAlgorithmOutput *GetPathConnection( );
    vtkSetMacro(offset_point_, vtkIdType)
  protected:
    CBCTSplineDrivenImageSlicer();
    ~CBCTSplineDrivenImageSlicer()override;

    virtual int RequestData(vtkInformation *, vtkInformationVector **,
                            vtkInformationVector *)override;
    virtual int FillInputPortInformation(int port, vtkInformation *info)override;
    virtual int FillOutputPortInformation( int, vtkInformation *)override;
    virtual int RequestInformation(vtkInformation *, vtkInformationVector **,
                                   vtkInformationVector *)override;
  private:
    CBCTSplineDrivenImageSlicer(const CBCTSplineDrivenImageSlicer &);
    void operator=(const CBCTSplineDrivenImageSlicer &);
    CBCTFrenetSerretFrame *local_frenetFrames_;
    vtkImageReslice *reslicer_;
    int slice_extent_[2]; // 输出image的xy像素数量
    double slice_spacing_[2]; // 输出image的xy间隔
    double slice_thickness_; // 输出image的z轴间隔
    double incidence_;// 初始法向量的旋转
    vtkIdType offset_point_;
    vtkIdType offset_line_;
    vtkIdType probe_input_;
};
```


```cpp
#include"vtkPoints.h"
#include"vtkPolyData.h"
#include"vtkCellArray.h"
#include "vtkImageReslice.h"

#include "vtkFrenetSerretFrame.h"
#include "vtkPlaneSource.h"
#include "vtkImageData.h"
#include "vtkProbeFilter.h"
#include "vtkMatrix4x4.h"
#include "vtkImageAppend.h"
#include "vtkDoubleArray.h"
#include "vtkPointData.h"
#include "vtkMath.h"
#include "vtkInformation.h"
#include "vtkInformationVector.h"
#include "vtkObjectFactory.h"
#include "vtkSmartPointer.h"
#include "vtkStreamingDemandDrivenPipeline.h"


vtkStandardNewMacro(CBCTSplineDrivenImageSlicer);

CBCTSplineDrivenImageSlicer::CBCTSplineDrivenImageSlicer( ) {
    this->local_frenetFrames_ = CBCTFrenetSerretFrame::New( );
    this->reslicer_ = vtkImageReslice::New();
    this->slice_extent_[0] = 256;
    this->slice_extent_[1] = 256;
    this->slice_spacing_[0] = 0.2;
    this->slice_spacing_[1] = 0.2;
    this->slice_thickness_ = 0.2;
    this->offset_point_ = 0;
    this->offset_line_ = 0;
    this->incidence_ = 0;
    this->probe_input_ = 0;
    this->SetNumberOfInputPorts( 2 );
    this->SetNumberOfOutputPorts( 2 );
    this->SetInputArrayToProcess(0, 0, 0, vtkDataObject::FIELD_ASSOCIATION_POINTS,
                                 vtkDataSetAttributes::SCALARS);
}

CBCTSplineDrivenImageSlicer::~CBCTSplineDrivenImageSlicer( ) {
    this->local_frenetFrames_->Delete( );
    this->reslicer_->Delete( );
}


void CBCTSplineDrivenImageSlicer::SetPathConnection(int id, vtkAlgorithmOutput *algOutput) {
    if (id < 0) {
        vtkErrorMacro("Bad index " << id << " for source.");
        return;
    }
    int numConnections = this->GetNumberOfInputConnections(1);
    if (id < numConnections) {
        this->SetNthInputConnection(1, id, algOutput);
    } else if (id == numConnections && algOutput) {
        this->AddInputConnection(1, algOutput);
    } else if (algOutput) {
        vtkWarningMacro("The source id provided is larger than the maximum "
                        "source id, using " << numConnections << " instead.");
        this->AddInputConnection(1, algOutput);
    }
}

void CBCTSplineDrivenImageSlicer::SetPathConnection(vtkAlgorithmOutput *algOutput) {
    this->SetPathConnection(0, algOutput);
}

vtkAlgorithmOutput *CBCTSplineDrivenImageSlicer::GetPathConnection() {
    return( this->GetInputConnection( 1, 0 ) );
}

int CBCTSplineDrivenImageSlicer::FillInputPortInformation(
    int port, vtkInformation *info) {
    if( port == 0 ) {
        info->Set(vtkAlgorithm::INPUT_REQUIRED_DATA_TYPE(), "vtkImageData");
    } else {
        info->Set(vtkAlgorithm::INPUT_REQUIRED_DATA_TYPE(), "vtkPolyData");
    }
    return 1;
}


int CBCTSplineDrivenImageSlicer::FillOutputPortInformation(
    int port, vtkInformation *info) {
    if (port == 0) {
        info->Set(vtkDataObject::DATA_TYPE_NAME(), "vtkImageData");
    }
    if (port == 1) {
        info->Set(vtkDataObject::DATA_TYPE_NAME(), "vtkPolyData");
    }
    return 1;
}


int CBCTSplineDrivenImageSlicer::RequestInformation (
    vtkInformation *vtkNotUsed(request),
    vtkInformationVector **inputVector,
    vtkInformationVector *outputVector) {
    vtkInformation *outInfo = outputVector->GetInformationObject(0);
    int extent[6] = {0, this->slice_extent_[0] - 1,
                     0, this->slice_extent_[1] - 1,
                     0, 1
                    };
    double spacing[3] = {this->slice_spacing_[0], this->slice_spacing_[1], this->slice_thickness_};
    outInfo->Set(vtkDataObject::SPACING(), spacing, 3);
    outInfo->Set(vtkStreamingDemandDrivenPipeline::WHOLE_EXTENT(), extent, 6);
    return 1;
}

int CBCTSplineDrivenImageSlicer::RequestData(
    vtkInformation *vtkNotUsed(request),
    vtkInformationVector **inputVector,
    vtkInformationVector *outputVector) {
    // 获取信息对象
    vtkInformation *inInfo = inputVector[0]->GetInformationObject(0);
    vtkInformation *pathInfo = inputVector[1]->GetInformationObject(0);
    vtkInformation *outImageInfo = outputVector->GetInformationObject(0);
    vtkInformation *outPlaneInfo = outputVector->GetInformationObject(1);
    // 获取输入和输出
    vtkImageData *input = vtkImageData::SafeDownCast(
                              inInfo->Get(vtkDataObject::DATA_OBJECT()));
    vtkImageData *inputCopy = vtkImageData::New( );
    inputCopy->ShallowCopy( input );
    vtkPolyData *inputPath = vtkPolyData::SafeDownCast(
                                 pathInfo->Get(vtkDataObject::DATA_OBJECT()));
    vtkImageData *outputImage = vtkImageData::SafeDownCast(
                                    outImageInfo->Get(vtkDataObject::DATA_OBJECT()));
    vtkPolyData *outputPlane = vtkPolyData::SafeDownCast(
                                   outPlaneInfo->Get(vtkDataObject::DATA_OBJECT()));
    vtkSmartPointer<vtkPolyData> pathCopy = vtkSmartPointer<vtkPolyData>::New( );
    pathCopy->ShallowCopy( inputPath );
    // 计算路径的局部法线和切线
    this->local_frenetFrames_->SetInputData( pathCopy );
    this->local_frenetFrames_->Setview_up_(this->incidence_ );
    this->local_frenetFrames_->Update( );
    // 路径将包含点数据数组“切线”和“向量”
    vtkPolyData *path = static_cast<vtkPolyData *>
                        (this->local_frenetFrames_->GetOutputDataObject( 0 ));
    // 计算单元格中使用了多少个点。如果循环，点可以使用多次
    // 不使用NumberOfPoints，因为我们只需要线条和点
    vtkCellArray *lines = path->GetLines( );
    lines->InitTraversal( );
    vtkIdType nbCellPoints;
    vtkIdType *points;
    vtkIdType cellId = -1;
    do {
        lines->GetNextCell( nbCellPoints, points);
        cellId++;
    } while( cellId != this->offset_line_ );
    vtkIdType ptId = this->offset_point_;
    if( ptId >= nbCellPoints ) {
        ptId = nbCellPoints - 1;
    }
    // 建立一个新的reslicer与图像输入作为输入。
    this->reslicer_->SetInputData( inputCopy );
    // 获取ptId点的Frenet-Serret图表：
    // - position (center)
    // - tangent T
    // - normal N
    double center[3];
    path->GetPoints( )->GetPoint( ptId, center );
    vtkDoubleArray *pathTangents = static_cast<vtkDoubleArray *>
                                   (path->GetPointData( )->GetArray( "FSTangents" ));
    double tangent[3];
    pathTangents->GetTuple( ptId, tangent );
    vtkDoubleArray *pathNormals = static_cast<vtkDoubleArray *>
                                  (path->GetPointData( )->GetArray( "FSNormals" ));
    double normal[3];
    pathNormals->GetTuple( ptId, normal );
    // Frenet-Serret 图表由 T, N and B = T ^ N
    double crossProduct[3];
    vtkMath::Cross( tangent, normal, crossProduct );
    // 构建平面输出，该输出将表示三维视图中的切片位置
    vtkSmartPointer<vtkPlaneSource> plane
        = vtkSmartPointer<vtkPlaneSource>::New( );
    double planeOrigin[3];
    double planePoint1[3];
    double planePoint2[3];
    for( int comp = 0; comp < 3; comp ++) {
        planeOrigin[comp] = center[comp] - normal[comp] * this->slice_extent_[1] * this->slice_spacing_[1] / 2.0
                            - crossProduct[comp] * this->slice_extent_[0] * this->slice_spacing_[0] / 2.0;
        planePoint1[comp] = planeOrigin[comp] + crossProduct[comp] * this->slice_extent_[0] * this->slice_spacing_[0];
        planePoint2[comp] = planeOrigin[comp] + normal[comp] * this->slice_extent_[1] * this->slice_spacing_[1];
    }
    plane->SetOrigin(planeOrigin);
    plane->SetPoint1(planePoint1);
    plane->SetPoint2(planePoint2);
    plane->SetResolution(this->slice_extent_[0],
                         this->slice_extent_[1]);
    plane->Update();
    if( this->probe_input_ == 1 ) {
        vtkSmartPointer<vtkProbeFilter> probe = vtkSmartPointer<vtkProbeFilter>::New( );
        probe->SetInputConnection( plane->GetOutputPort( ) );
        probe->SetSourceData( inputCopy );
        probe->Update( );
        outputPlane->DeepCopy(probe->GetOutputDataObject(0));
    } else {
        outputPlane->DeepCopy(plane->GetOutputDataObject(0));
    }
    // 构建转换矩阵
    vtkMatrix4x4 *resliceAxes = vtkMatrix4x4::New( );
    resliceAxes->Identity();
    double origin[4];
    // 仿照 vtkImageReslice:
    // - 1st column contains the resliced image x-axis
    // - 2nd column contains the resliced image y-axis
    // - 3rd column contains the normal of the resliced image plane
    // -> 1st column is normal to the path
    // -> 3nd column is tangent to the path
    // -> 2nd column is B = T^N
    for ( int comp = 0; comp < 3; comp++ ) {
        resliceAxes->SetElement(0, comp, crossProduct[comp]);
        resliceAxes->SetElement(1, comp, normal[comp]);
        resliceAxes->SetElement(2, comp, tangent[comp]);
        origin[comp] = center[comp] -
                       normal[comp] * this->slice_extent_[1] * this->slice_spacing_[1] / 2.0 -
                       crossProduct[comp] * this->slice_extent_[0] * this->slice_spacing_[0] / 2.0;
    }
    origin[3] = 1.0;
    double originXYZW[4];
    resliceAxes->MultiplyPoint(origin, originXYZW);
    resliceAxes->Transpose();
    double neworiginXYZW[4];
    resliceAxes->MultiplyPoint(originXYZW, neworiginXYZW);
    resliceAxes->SetElement(0, 3, neworiginXYZW[0]);
    resliceAxes->SetElement(1, 3, neworiginXYZW[1]);
    resliceAxes->SetElement(2, 3, neworiginXYZW[2]);
    this->reslicer_->SetResliceAxes( resliceAxes );
    this->reslicer_->SetInformationInput( input );
    this->reslicer_->SetInterpolationModeToCubic( );
    this->reslicer_->SetOutputDimensionality( 2 );
    this->reslicer_->SetOutputOrigin(0, 0, 0);
    this->reslicer_->SetOutputExtent(0, this->slice_extent_[0] - 1,
                                     0, this->slice_extent_[1] - 1,
                                     0, 1);
    this->reslicer_->SetOutputSpacing(this->slice_spacing_[0],
                                      this->slice_spacing_[1],
                                      this->slice_thickness_);
    this->reslicer_->Update();
    resliceAxes->Delete();
    outputImage->DeepCopy(this->reslicer_->GetOutputDataObject(0));
    outputImage->GetPointData()->GetScalars()->SetName("ReslicedImage");
    return 1;
}


```








#### 4. 每张图片拼接起来(`vtkImageAppend`)

就是作者的案例，加了个Permute和Flip用来摆正

```cpp
vtkNew<vtkImageAppend> append;
append->SetAppendAxis(2);
vtkNew<CBCTSplineDrivenImageSlicer> reslicer;
reslicer->SetInputData(img_reader->GetOutput());
reslicer->SetPathConnection(spline_filter->GetOutputPort());
long long nb_points = spline_filter->GetOutput()->GetNumberOfPoints();
for(int pt_id = 0; pt_id < nb_points; pt_id++) {
    reslicer->Setoffset_point_(pt_id);
    reslicer->Update();
    vtkNew<vtkImageData> tempSlice;
    tempSlice->DeepCopy(reslicer->GetOutput());
    append->AddInputData(tempSlice);
}
append->Update();
vtkNew<vtkImagePermute> permute_filter;
permute_filter->SetInputData(append->GetOutput());
permute_filter->SetFilteredAxes(2, 0, 1);
permute_filter->Update();
vtkNew<vtkImageFlip> flip_filter;
flip_filter->SetInputData(permute_filter->GetOutput());
flip_filter->SetFilteredAxes(1);
flip_filter->Update();
```









