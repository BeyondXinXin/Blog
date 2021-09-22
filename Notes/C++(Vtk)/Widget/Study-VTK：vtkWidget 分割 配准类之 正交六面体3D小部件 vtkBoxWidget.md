# Study-VTK：vtkWidget 分割 配准类之 正交六面体3D小部件 vtkBoxWidget

@[TOC](vtkBoxWidget)


# 1 vtkBoxWidget介绍
&emsp;&emsp;**vtkBoxWidget**定义了一个ROI该区域由任意方向的六面体表示，每个面相互垂直（正交面）跟长方体一样。他有七个可以交互的点，每个面中心一个可以缩放、第七个位于模型中心用来整体等比例缩放。单独选中每个面都可以旋转。这个类非常灵活，主要用来选择、剪切、剪裁；也可以也可以用于使用线性转换对象GetTransform。

# 2 vtkBoxWidget官方案例

[http://118.25.63.144/VTKExamples/site/Cxx/Widgets/BoxWidget.html](http://118.25.63.144/VTKExamples/site/Cxx/Widgets/BoxWidget.html)

&emsp;&emsp;案例是绑定**vtkBoxWidget** 和模型的 **GetTransform**，用来实现模型的沿某一方向（或整体）线性缩放。这也是分割配准这一类widget的典型用法：使用StartInteractionEvent、InteractionEvent和EndInteractionEvent事件。InteractionEvent在鼠标移动时调用；另外两个事件在button down和button up（左键或右键）时调用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020033008111696.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center =500x500)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330082821217.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center )
# 3 vtkBoxWidget 常用函数

```cpp

// 初始位置 
// 第一种根据vtkBoxWidget 放置的actor来确定、第二三种根据自己定义两个对角来确定
 void PlaceWidget() override
    {this->Superclass::PlaceWidget();}
 void PlaceWidget(double bounds[6]) override;
 void PlaceWidget(double xmin, double xmax, double ymin, double ymax,double zmin, double zmax) override
    {this->Superclass::PlaceWidget(xmin,xmax,ymin,ymax,zmin,zmax);}
// 获取初始位置 vtkPlanes是凸多边形
void vtkBoxWidget::GetPlanes(vtkPlanes*planes)	

// 法线方向 默认关闭，这个开启关闭的区别主要是切割时使用，保留那一部分。
virtual void vtkBoxWidget::SetInsideOut(vtkTypeBool)	
virtual vtkTypeBool vtkBoxWidget::GetInsideOut()	
virtual void vtkBoxWidget::InsideOutOn()	
virtual void vtkBoxWidget::InsideOutOff()	

// 模型跟着线性变换  vtkTransform通过4x4矩阵描述线性变换  
virtual void vtkBoxWidget::GetTransform(vtkTransform *t)	
virtual void vtkBoxWidget::SetTransform(vtkTransform *t)	

// 获取当前widget的位置 数据由6个四边形面和15个点组成。前八个点定义八个角顶点。
// 接下来的六个定义-x，+ x，-y，+ y，-z，+ z面点；最后一点（15个点中的第15个）定义了六面体的中心。
// 当调用InteractionEvent或EndInteractionEvent事件时，可以保证这些点值是最新的。
// 用户提供vtkPolyData并将点和单元格添加到其中。
void vtkBoxWidget::GetPolyData(vtkPolyData*pd)	

// 获取手柄属性（那七个小球）第一个是全部属性，第二个是选中的属性。可以自顶一个选中/未选中样式
virtual vtkProperty* vtkBoxWidget::GetHandleProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedHandleProperty() virtual

// 保留盒子，手柄是否可用。默认开启的，这个仅仅是手柄，法线还留着
void vtkBoxWidget::HandlesOn()	
void vtkBoxWidget::HandlesOff()	

// 获取面的属性 第一个是全部6个面，第二个是选中的那个面
virtual vtkProperty* vtkBoxWidget::GetFaceProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedFaceProperty()	

// 获取轮廓的属性 第一个未选中时轮廓属性，第二个是选中是轮廓属性
virtual vtkProperty* vtkBoxWidget::GetOutlineProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedOutlineProperty()	

// 平移旋转缩放是否禁用
virtual void vtkBoxWidget::SetTranslationEnabled(vtkTypeBool)
virtual vtkTypeBool vtkBoxWidget::GetTranslationEnabled()
virtual void vtkBoxWidget::TranslationEnabledOn()
virtual void vtkBoxWidget::TranslationEnabledOff()
virtual void vtkBoxWidget::SetScalingEnabled(vtkTypeBool)
virtual vtkTypeBool vtkBoxWidget::GetScalingEnabled()
virtual void vtkBoxWidget::ScalingEnabledOn()
virtual void vtkBoxWidget::ScalingEnabledOff()
virtual void vtkBoxWidget::SetRotationEnabled(vtkTypeBool)
virtual vtkTypeBool vtkBoxWidget::GetRotationEnabled()
virtual void vtkBoxWidget::RotationEnabledOn()
virtual void vtkBoxWidget::RotationEnabledOff()
```

# 4 vtkBoxWidget 事件绑定
&emsp;&emsp;AddObserver()函数的作用就是针对某个事件添加挂插着到某个VTK对象中。
1. 从vtkCommand类中派生出子类，并实现vtkCommand::Execute()虚函数。
2. 实例化vtkCommand子类的对象，并调用相关的方法。
3. 调用观察者函数。
调用AddObserver()函数监听感兴趣的事件，如果所监听的事件发生，就会调用vtkCommand子类中定义的Execute()函数。
因此，针对所监听的事件，程序需要把实现的功能放在Execute函数中。

&emsp;&emsp;下边这个案例就是绑定**vtkBoxWidget**的所有信号到回调函数。回调函数里实现**vtkBoxWidget**绑定的actor跟着本身实现缩放、移动、旋转。
```cpp
class vtkMyCallback : public vtkCommand {
  public:
    static vtkMyCallback *New() {
        return new vtkMyCallback;
    }
    virtual void Execute( vtkObject *caller, unsigned long, void * ) {
        // Here we use the vtkBoxWidget to transform the underlying coneActor
        // (by manipulating its transformation matrix).
        vtkSmartPointer<vtkTransform> t =
            vtkSmartPointer<vtkTransform>::New();
        vtkBoxWidget *widget = reinterpret_cast<vtkBoxWidget *>(caller);
        widget->GetTransform( t );
        widget->GetProp3D()->SetUserTransform( t );
    }
};


	vtkSmartPointer<vtkMyCallback> callback =
        vtkSmartPointer<vtkMyCallback>::New();
    boxWidget->AddObserver( vtkCommand::InteractionEvent, callback );
```
# 5 vtkBoxWidget 使用技巧
## 5.1 vtkBoxWidget 是否可以平移、旋转、缩放
&emsp;&emsp;这里的平移旋转缩放仅仅是针对本身而言，他绑定的actor里的模型如果需要跟着移动，则自己写回调。
```cpp
    vtkSmartPointer<vtkBoxWidget> boxWidget =
        vtkSmartPointer<vtkBoxWidget>::New();
    boxWidget->SetInteractor( interactor );

    boxWidget->TranslationEnabledOn();
    boxWidget->TranslationEnabledOff();
    boxWidget->ScalingEnabledOn();
    boxWidget->ScalingEnabledOff();
    boxWidget->RotationEnabledOn();
    boxWidget->RotationEnabledOff();
```
## 5.2 vtkBoxWidget 初始位置
&emsp;&emsp;**vtkBoxWidget**默认初始位置原点在其绑定actor的原点，大小是其绑定actor里renderer下模型边框的0.5倍。如果不想要这个位置可以直接设置两个对角位置
```cpp
 void PlaceWidget() override
    {this->Superclass::PlaceWidget();}
 void PlaceWidget(double bounds[6]) override;
 void PlaceWidget(double xmin, double xmax, double ymin, double ymax,double zmin, double zmax) 
```


## 5.3 vtkBoxWidget 手柄边线
```cpp
// 7个控制点是否增加到边界连线，默认不开启
void vtkBoxWidget::SetOutlineFaceWires(int);
virtual int vtkBoxWidget::GetOutlineFaceWires();
void vtkBoxWidget::OutlineFaceWiresOn();
void vtkBoxWidget::OutlineFaceWiresOff();	
```

```cpp
// 7个控制点是否增加连线，默认开启
void vtkBoxWidget::SetOutlineCursorWires(int);	
virtual int vtkBoxWidget::GetOutlineCursorWires();
void vtkBoxWidget::OutlineCursorWiresOn();
void vtkBoxWidget::OutlineCursorWiresOff();
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330194449269.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


## 5.4 vtkBoxWidget 只显示盒子，无法缩放。
```cpp
// 保留盒子，手柄是否可用。默认开启的，这个仅仅是手柄，法线还留着
void vtkBoxWidget::HandlesOn()	
void vtkBoxWidget::HandlesOff()	
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330194617788.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

## 5.5 vtkBoxWidget 修改交互属性（顶点、轮廓、中心线等）。

```cpp
    vtkSmartPointer<vtkBoxWidget> boxWidget =
        vtkSmartPointer<vtkBoxWidget>::New();
    boxWidget->SetInteractor( interactor );
    boxWidget->SetProp3D(coneActor);
    boxWidget->SetPlaceFactor(5);
    boxWidget->PlaceWidget();
    boxWidget->SetInsideOut(0);

    vtkProperty *pr = boxWidget->GetHandleProperty();
    vtkProperty *spr = boxWidget->GetSelectedHandleProperty();
    pr->SetColor(1, 0, 0);
    spr->SetColor(0, 0, 1);

```

```cpp
// 获取手柄属性（那七个小球）第一个是全部属性，第二个是选中的属性。可以自顶一个选中/未选中样式
virtual vtkProperty* vtkBoxWidget::GetHandleProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedHandleProperty() virtual


// 获取面的属性 第一个是全部6个面，第二个是选中的那个面
virtual vtkProperty* vtkBoxWidget::GetFaceProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedFaceProperty()	

// 获取轮廓的属性 第一个未选中时轮廓属性，第二个是选中是轮廓属性
virtual vtkProperty* vtkBoxWidget::GetOutlineProperty()	
virtual vtkProperty* vtkBoxWidget::GetSelectedOutlineProperty()	
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330195629368.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330195647526.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
## 5.6 vtkBoxWidget 切割时保留那一部分。

```cpp
// 法线方向 默认关闭，这个开启关闭的区别主要是切割时使用，保留那一部分。
virtual void vtkBoxWidget::SetInsideOut(vtkTypeBool)	
virtual vtkTypeBool vtkBoxWidget::GetInsideOut()	
virtual void vtkBoxWidget::InsideOutOn()	
virtual void vtkBoxWidget::InsideOutOff()	
```
