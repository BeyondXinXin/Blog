# Study-VTK：vtkWidget  标注类Widget之  文本显示vtkTextWidget


@[TOC]( )


&emsp;
&emsp;
&emsp;
**&emsp;&emsp;vtkTextWidget继承自vtkBorderWidget。使用方法基本一样，详情可以参考
[Study-VTK：vtkWidget 标注类Widget之 在2D矩形区域周围放置边框 vtkBorderWidget](https://blog.csdn.net/a15005784320/article/details/105027710)**


# 1 vtkTextWidget介绍
&emsp;&emsp;用于在覆盖平面上放置文本的小部件。
&emsp;&emsp;如果你只需要固定位置显示文本，不需要用widget，只需要vtkCornerAnnotation把文字挂上去就可以。vtkTextWidget的使用是可以可以任意拖动到位置后不可再移动。
&emsp;&emsp;此类提供了将文本交互式放置在2D覆盖平面上的支持。文本由vtkTextActor的实例定义。它使用其超类（vtkBorderWidget）的事件绑定。另外，当选择文本时，小部件会发出一个WidgetActivateEvent，观察者可以观看。这对于打开GUI对话框以调整字体特征等很有用。

# 2 vtkTextWidget 官方案例
&emsp;&emsp;官方就给了一个案例，字体大小会跟着界面大小改变而改变，文字位置可以任意拖动。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200322141644254.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)


# 3 vtkTextWidget事件绑定
&emsp;&emsp;默认情况下**vtkTextWidget**响应

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

 &emsp;&emsp; 可以使用此类的**vtkWidgetEventTranslator**更改上述事件绑定。此类将VTK事件转换为**vtkTextWidget**Widget事件：

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
class vtkCustomBorderWidget : public vtkTextWidget {
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
        vtkTextWidget::EndSelectAction(w);
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

# 4 vtkTextWidget常用函数
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
# 5 vtkTextWidget 使用技巧

## 5.1设置左键可以拖拽
   &emsp;&emsp; 默认**vtkTextWidget**中间才是拖拽，很多时候不爽，需要左键拖拽。
```cpp
    auto borderWidget =
        vtkSmartPointer<vtkTextWidget>::New();
    borderWidget->SetInteractor(renderWindowInteractor);
    borderWidget->CreateDefaultRepresentation();
    borderWidget->SelectableOff();//默认左键是选择事件，如果设置无法选择左键就是可以拖拽事件
```
## 5.2 获取当前坐标（左上、右下角）

```cpp
static void CustomEndSelectAction(vtkAbstractWidget *w) {
        vtkTextWidget *borderWidget = dynamic_cast<vtkTextWidget *>(w);
        auto lowerLeft =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition();
        std::cout << "Lower left: " << lowerLeft[0] << " " << lowerLeft[1] << std::endl;
        auto upperRight =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition2();
        std::cout << "Upper right: " << upperRight[0] << " " << upperRight[1] << std::endl;
        vtkTextWidget::EndSelectAction(w);
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
        vtkTextWidget *borderWidget = dynamic_cast<vtkTextWidget *>(w);
        auto lowerLeft =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition();
        std::cout << "Lower left: " << lowerLeft[0] << " " << lowerLeft[1] << std::endl;
        auto upperRight =
            static_cast<vtkBorderRepresentation *>(
                borderWidget->GetRepresentation())->GetPosition2();
        std::cout << "Upper right: " << upperRight[0] << " " << upperRight[1] << std::endl;
        vtkTextWidget::MoveAction(w);
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