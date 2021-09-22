# KISS Dicom Viewer 体渲染插件（利用vtk Volume 实现体渲染）

项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  

---

&emsp;&emsp;参考代码：
* 可视化借鉴：**F3D**  [https://kitware.github.io/F3D/](https://kitware.github.io/F3D/)
* Volume Filter参数参考：**GavriloviciEduard** [https://github.com/GavriloviciEduard?tab=repositories](https://github.com/GavriloviciEduard?tab=repositories)

&emsp;&emsp;参考资料：

* [GPU编程与CG语言之阳春白雪下里巴人](https://zhuanlan.zhihu.com/p/84268704) 14章-15章 
* [VTK图形图像开发进阶](https://blog.csdn.net/www_doling_net)  7章
* [VTKUsersGuide](https://vtk.org/vtk-users-guide/)

---

## 展示
&emsp;&emsp;小蚂蚁自带体渲染模块，并且可以修改阈值。模仿小蚂蚁也简单实现了一下。小蚂蚁体渲染有一个手术刀剪裁功能，之前实现过针对`vtkPolydata`的，后续增加针对`vtkVolume`的，先用一个`vtkBoxWidget2`代替下。下面是效果：

&emsp;&emsp;交互使用`vtk`默认的 + 阈值调整 + filters + `BoxWidget`剪裁  

* 左键按下：旋转
* ctrl+左键按下：修改阈值
* 中键按下：移动
* 中建滚动：缩放
* 右键按下：缩放
* 方向左右按键：切换渲染类型

* `vtkBoxWidget2`交互也是默认，支持调整大小、移动和缩放。每次移动完成后对`vtkVolume`进行一个剪裁。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210207213048300.gif#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210207213054778.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2021020721305998.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



## 原理

&emsp;&emsp;使用了`VTK`现成的接口：`vtkSmartVolumeMapper`（光线投射）

> 在同一射线方向上对体数据进行采样，获取每个体素的颜色值，根据其透明度进行合成。体数据与面数据：实心铅球跟空心乒乓球。体数据和面数据本质区别在于是否包含了体细节，跟维度无关。




## 实现 ： Filters设计

&emsp;&emsp;针对不同成像方式、不同身体部位。体渲染应使用不同参数，`vtkVolume`默认接口有：

1. color  `SetColor` `vtkColorTransferFunction` 设置不同灰度图显示不同颜色（过度方式有线性、阶梯、平滑） 
2. opacity `SetScalarOpacity`设置不同灰度图显示不同透明度（过度方式有线性、阶梯、平滑）
3. ambient `SetAmbient`环境光照系数 
4. diffuse `SetDiffuse`漫射光照系数   
5. specular `SetSpecular` 镜面反射能力
6. specularpower `SetSpecularPower` 镜面照明系数  
7. shade `ShadeOn/ShadeOff` 阴影  

&emsp;&emsp;针对不同的位置设计不同的参数保存成`***.json`作为本地配置文件，比如：


```json
{
    "name":"Abdomen bones",
    "color": [
      {
        "value": -1024,
        "red": 1,
        "green": 0.5686274509803921,
        "blue": 0.203921568627451
      },
      {
        "value": -24,
        "red": 1,
        "green": 0.5686274509803921,
        "blue": 0.203921568627451
      },
      {
        "value": 71,
        "red": 1,
        "green": 0.5686274509803921,
        "blue": 0.203921568627451
      },
      {
        "value": 322,
        "red": 1,
        "green": 0.5686274509803921,
        "blue": 0.203921568627451
      },
      {
        "value": 603,
        "red": 1,
        "green": 0.9764705882352941,
        "blue": 0.407843137254902
      },
      {
        "value": 1222,
        "red": 1,
        "green": 1,
        "blue": 1
      },
      {
        "value": 3071,
        "red": 1,
        "green": 1,
        "blue": 1
      }
    ],
    "opacity": [
      {
        "value": -1024,
        "alpha": 0
      },
      {
        "value": -24,
        "alpha": 0
      },
      {
        "value": 71,
        "alpha": 0
      },
      {
        "value": 322,
        "alpha": 0.2823529411764706
      },
      {
        "value": 603,
        "alpha": 0.6274509803921569
      },
      {
        "value": 1222,
        "alpha": 0.611764705882353
      },
      {
        "value": 3071,
        "alpha": 0.5607843137254902
      }
    ],
    "ambient":
      {
        "value": 0.1
      },
    "diffuse":
      {
        "value": 0.7
      },
    "specular":
      {
        "value": 1.0
      },
    "specularpower":
      {
        "value": 64
      },
    "shade":
      {
        "value": 1
      }
  }
```

## 实现 ： 阈值调整
&emsp;&emsp;自定义回调函数并绑定`vtkRenderWindowInteractor`。拦截`ctrl`+左键按下事件，修改当前`FIlter`的`color`和`opacity`。

```cpp
namespace KISS::VtkPlugan {
    class vtkWidget3D;
    class vtkWidget3DInteractorStyle final : public vtkInteractorStyleTrackballCamera {
      public:
        static vtkWidget3DInteractorStyle *New();
        vtkTypeMacro(vtkWidget3DInteractorStyle, vtkInteractorStyleTrackballCamera);
        vtkWidget3DInteractorStyle() = default;
        ~vtkWidget3DInteractorStyle() = default;
        //getters
        [[nodiscard]] vtkWidget3D *getWidget() const {
            return  m_widget3D;
        }
        [[nodiscard]] TransferFunction *getTransferFunction() const {
            return m_transferFunction;
        }

        //setters
        void setWidget(vtkWidget3D *t_widget) {
            m_widget3D = t_widget;
        }
        void setTransferFunction(TransferFunction *t_function) {
            m_transferFunction = t_function;
        }
      protected:
        void OnMouseMove() override;
      private:
        vtkWidget3D *m_widget3D = {};
        TransferFunction *m_transferFunction = {};
    };
}
```
```cpp
//-----------------------------------------------------------------------------
vtkStandardNewMacro(KISS::VtkPlugan::vtkWidget3DInteractorStyle);
void KISS::VtkPlugan::vtkWidget3DInteractorStyle::OnMouseMove() {
    auto *const currentEventPosition = Interactor->GetEventPosition();
    auto *const lastEventPosition = Interactor->GetLastEventPosition();
    if (State == VTKIS_SPIN) {
        m_transferFunction->
        updateWindowLevel(currentEventPosition[0] - lastEventPosition[0],
                          currentEventPosition[1] - lastEventPosition[1]);
        m_widget3D->updateFilter();
        Interactor->Render();
        return;
    }
    vtkInteractorStyleTrackballCamera::OnMouseMove();
}
```



## 实现 ： 剪裁

* vtkVolume::SetClippingPlanes : 设置剪裁平面的另一种方法：使用提供的隐式函数vtkPlanes实例中的最多六个平面。
&emsp;&emsp;`vtkBoxWidget2`和体渲染的`vtkRenderer`共用一个`Interactor`。重写`vtkBoxWidget2`的回调，实现每次修改`vtkBoxWidget2`的位置/大小后把`Planes`传给`vtkVolume`；


```cpp
namespace KISS::VtkPlugan {
    class vtkBoxWidget3DCallback final : public vtkCommand {
      public:
        static vtkBoxWidget3DCallback *New();
        vtkTypeMacro(vtkBoxWidget3DCallback, vtkCommand);
        vtkBoxWidget3DCallback() :
            m_transform(vtkSmartPointer<vtkTransform>::New()) {}
        ~vtkBoxWidget3DCallback() = default;
        //getters
        [[nodiscard]] vtkVolume *getVolume() const {
            return m_volume;
        }
        //setters
        void setVolume(vtkVolume *t_volume) {
            m_volume = t_volume;
        }
        void Execute(
            vtkObject *caller,
            unsigned long eventId,
            void *callData) override;
      private:
        vtkVolume *m_volume = {};
        vtkNew<vtkPlanes> m_planes;
        vtkSmartPointer<vtkTransform> m_transform = {};
    };
}
```

```cpp
vtkStandardNewMacro(KISS::VtkPlugan::vtkBoxWidget3DCallback);
void KISS::VtkPlugan::vtkBoxWidget3DCallback::Execute(
    vtkObject *caller,
    [[maybe_unused]]unsigned long eventId,
    [[maybe_unused]]void *callData) {
    auto *const boxWidget = vtkBoxWidget2::SafeDownCast(caller);
    auto *const  boxRepresentation = vtkBoxRepresentation::SafeDownCast(
                                         boxWidget->GetRepresentation());
    boxRepresentation->SetInsideOut(1);
    boxRepresentation->GetPlanes(m_planes);
    m_volume->GetMapper()->SetClippingPlanes(m_planes);
}
```



