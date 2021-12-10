# Study-VTK：vtkWidget  标注类Widget之  在2D矩形区域周围放置边框 vtkBorderWidget

@[TOC]( )


# 1 vtkBorderWidget介绍
&emsp;&emsp;此类是可能需要矩形边框的2D小部件的父类。除了绘制边框之外，小部件还提供用于调整和移动矩形区域（及相关边框）的大小的方法。窗口小部件提供方法和内部数据成员，以便子类可以利用此窗口小部件的功能，仅要求子类定义“表示形式”，即可以在2D矩形区域中管理的道具或演员的某种组合。

&emsp;&emsp;该类定义基本的定位功能，包括使用锁定的x / y比例调整窗口小部件大小的功能。边界内的区域也可以设为“可选”，这意味着小部件内部的选择事件将调用虚拟SelectRegion（）方法，该方法可用于拾取对象或以其他方式操纵小部件内部的数据。


# 2 vtkBorderWidget 官方案例

[BorderWidget](http://118.25.63.144/VTKExamples/site/Cxx/Widgets/BorderWidget.html)
&emsp;&emsp;生成一个2D矩形区域，可以改变长和宽（鼠标移动到边缘），可以拖动（鼠标移动到中间）。绑定了回调函数，每次移动完或者调整大小后，打印矩形对角坐标。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200322143558435.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

# 3 vtkBorderWidget事件绑定
&emsp;&emsp;默认情况下**vtkBorderWidget**响应

边界上事件     | 说明
-------- | -----
LeftButtonPressEvent  | 选择边界
LeftButtonReleaseEvent| 取消选择边界
MouseMoveEvent  | 移动/调整大小的widget，具体取决于是否选择边界。

内部事件     | 说明
-------- | -----
LeftButtonPressEvent  | 调用SelectButton（）回调

任何位置事件     | 说明
-------- | -----
MiddleButtonPressEvent  | 移动widget

&emsp;&emsp;自定义的话

 &emsp;&emsp; 可以使用此类的**vtkWidgetEventTranslator**更改上述事件绑定。此类将VTK事件转换为**vtkBorderWidget**的小部件事件：

事件     | 说明
-------- | -----
 vtkWidgetEvent :: Select  | 开始选择（选择一部分）
vtkWidgetEvent :: EndSelect| 选择过程已完成
vtkWidgetEvent :: Translate  | widget将被翻译
vtkWidgetEvent :: Move  | 请求运动

  &emsp;&emsp; 反过来，在处理这些窗口小部件事件时，此窗口小部件会自行调用以下VTK事件（观察者可以侦听）：
  事件     | 说明
-------- | -----
 vtkCommand :: StartInteractionEvent  | Select
vtkCommand :: EndInteractionEvent| EndSelect
vtkCommand :: InteractionEvent  | Move
   &emsp;&emsp; 举例说明，我现在要绑定选择结束事件（每次拖动完或者改变完大小）只需要绑定vtkWidgetEvent :: EndSelect就可以了。或者监听vtkCommand :: EndInteractionEvent。


```cpp
class vtkCustomBorderWidget : public vtkBorderWidget {
  public:
    vtkCustomBorderWidget() {
        this->CallbackMapper->SetCallbackMethod(
            vtkCommand::MiddleButtonReleaseEvent,
            vtkWidgetEvent::EndSelect,
            this,
            vtkCustomBorderWidget::CustomEndSelectAction);
    }
    static void CustomEndSelectAction(vtkAbstractWidget *w) {
        std::cout << "vtkWidgetEvent::EndSelect" << std::endl;
        vtkBorderWidget::EndSelectAction(w);
    }
    static vtkCustomBorderWidget *New();
};
vtkStandardNewMacro(vtkCustomBorderWidget);
```
   &emsp;&emsp; 使用的时候
```cpp
 auto borderWidget =
        vtkSmartPointer<vtkCustomBorderWidget>::New();
    borderWidget->SetInteractor(renderWindowInteractor);
    borderWidget->CreateDefaultRepresentation();
    borderWidget->SelectableOff();
    borderWidget->On();
```

# 4 vtkBorderWidget常用函数
```cpp
// 是否可以选择
virtual void SetSelectable (vtkTypeBool)// 设置是否可以选择
virtual vtkTypeBool GetSelectable ()// 获取当前是否可以选择
virtual void SelectableOn ()// 设置是否可以选择
virtual void SelectableOff ()// 设置是否可以选择

// 是否可以改变大小
virtual void SetResizable (vtkTypeBool) // 设置是否可以调整大小
virtual vtkTypeBool GetSelectable () // 获取当前是否可以调整大小
virtual void SelectableOn () // 设置是否可以调整大小
virtual void SelectableOff () // 设置是否可以调整大小
```
# 5 vtkBorderWidget 使用技巧

## 5.1设置左键可以拖拽
   &emsp;&emsp; 默认**vtkBorderWidget**中间才是拖拽，很多时候不爽，需要左键拖拽。
```cpp
    auto borderWidget =
        vtkSmartPointer<vtkBorderWidget>::New();
    borderWidget->SetInteractor(renderWindowInteractor);
    borderWidget->CreateDefaultRepresentation();
    borderWidget->SelectableOff();//默认左键是选择事件，如果设置无法选择左键就是可以拖拽事件
```
## 5.2 获取当前坐标（左上、右下角）

```cpp
static void CustomEndSelectAction(vtkAbstractWidget *w) {
        vtkBorderWidget *borderWidget = dynamic_cast<vtkBorderWidget *>(w);
        auto lowerLeft =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition();
        std::cout << "Lower left: " << lowerLeft[0] << " " << lowerLeft[1] << std::endl;
        auto upperRight =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition2();
        std::cout << "Upper right: " << upperRight[0] << " " << upperRight[1] << std::endl;
        vtkBorderWidget::EndSelectAction(w);
    }
```

## 5.3 移动位置时打印坐标
第二节的vtkWidgetEvent::EndSelect 改为 vtkWidgetEvent::Move

```cpp
	vtkCustomBorderWidget() {
        this->CallbackMapper->SetCallbackMethod(
            vtkCommand::LeftButtonPressEvent,
            vtkWidgetEvent::Move,
            this,
            vtkCustomBorderWidget::CustomEndSelectAction);
    }
    static void CustomEndSelectAction(vtkAbstractWidget *w) {
        vtkBorderWidget *borderWidget = dynamic_cast<vtkBorderWidget *>(w);
        auto lowerLeft =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition();
        std::cout << "Lower left: " << lowerLeft[0] << " " << lowerLeft[1] << std::endl;
        auto upperRight =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition2();
        std::cout << "Upper right: " << upperRight[0] << " " << upperRight[1] << std::endl;
        vtkBorderWidget::MoveAction(w);
    }
```
## 5.4 开启关闭

```cpp
borderWidget->On();
borderWidget->Off();

或者键盘上i 也可以开启关闭交互
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