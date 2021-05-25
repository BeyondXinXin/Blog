# Qt 自定义  一个读写变量函数的宏

##### 需求：
&emsp;&emsp;类有很多变量是需要定义很多的读写函数，用一个宏来替代。

##### 实现：
```cpp
#define QUICK_GETSET(name,type) \
    virtual void Set_##name (const type &_arg) \
    { \
        this->name = _arg; \
    } \
    virtual type Get_##name () const{ \
        return this->name; \
    }


#define QUICK_GETSET_Object(name,type)\
    virtual type *Get_##name ()const\
    {\
        return this->name;\
    }\
    virtual void Set_##name (type* _arg)\
    {\
        this->name = _arg;\
    }
```

##### 使用：

```cpp
#ifndef DISTANCEPOLYDATA_H
#define DISTANCEPOLYDATA_H


#include <ArteryflowScript>

class vtkActor;
class QVtkRenderer;
class vtkScalarBarActor;

class DistancePolyData : public Script {
    Q_OBJECT
  public:
    explicit DistancePolyData(QObject *parent = nullptr);
    virtual ~DistancePolyData() override;
    virtual void Execute() override;
    virtual bool BuildView()override;
  private:
    virtual void Initial() override;
  public:
    void ViewOff();
    QUICK_GETSET_Object(vmtk_renderer_, QVtkRenderer)
    QUICK_GETSET_Object(surface_small_, vtkPolyData)
    QUICK_GETSET_Object(surface_big_, vtkPolyData)
    QUICK_GETSET_Object(surface_, vtkPolyData)
    QUICK_GETSET(target_reduction_, double)
    void SetScalarRange(double value[2]);
    void GetScalarRange(double &value1, double &value2);
  private:
    double target_reduction_;// 压缩系数
    double scalar_range_[2];// 标量范围
    vtkSmartPointer<vtkPolyData> surface_small_;// 小模型
    vtkSmartPointer<vtkPolyData> surface_big_;// 大模型
    vtkSmartPointer<vtkPolyData> surface_;// 结果模型
    QPointer<QVtkRenderer> vmtk_renderer_;
    vtkSmartPointer<vtkActor> actor_;
    vtkSmartPointer<vtkScalarBarActor> scalar_bar_actor_;
};

#endif // DISTANCEPOLYDATA_H
```

