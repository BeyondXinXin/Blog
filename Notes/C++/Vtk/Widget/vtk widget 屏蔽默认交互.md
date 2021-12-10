# vtk widget 屏蔽默认交互

&emsp;&emsp;**vtk widget**默认带一些常用交互，但有时候我们需要屏蔽（修改）默认交互事件。可以使用**vtkWidgetEventTranslator**来屏蔽/修改默认交互。



&emsp;&emsp;比如  [vtkContourWidget](https://vtk.org/doc/nightly/html/classvtkContourWidget.html)  

默认交互

操作     | 交互
-------- | -----
左键按下  | 触发选择事件
右键按下  | 触发AddFinalPoint事件
鼠标移动  | 触发移动事件
左键松开  | 触发EndSelect事件
Delete按键  | 触发删除事件
Shift+Delete按键 | 触发重置事件

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200827154136773.png#pic_center)

&emsp;&emsp;如果在红色边缘附近按下鼠标中键，则会触发整体移动事件。我想屏蔽这种交互，只需要

```cpp
    if (this->widget_left_ == nullptr) {
        this->widget_left_ = vtkSmartPointer<vtkContourWidget>::New();
    }
    if (this->widget_right_ == nullptr) {
        this->widget_right_ = vtkSmartPointer<vtkContourWidget>::New();
    }
    vtkWidgetEventTranslator *event_translator_left =  widget_left_->GetEventTranslator();
    event_translator_left->SetTranslation(
        vtkCommand::MiddleButtonPressEvent, vtkWidgetEvent::NoEvent);
    event_translator_left->SetTranslation(
        vtkCommand::MiddleButtonReleaseEvent, vtkWidgetEvent::NoEvent);
    vtkWidgetEventTranslator *event_translator_right =  widget_right_->GetEventTranslator();
    event_translator_right->SetTranslation(
        vtkCommand::MiddleButtonPressEvent, vtkWidgetEvent::NoEvent);
    event_translator_right->SetTranslation(
        vtkCommand::MiddleButtonReleaseEvent, vtkWidgetEvent::NoEvent);
```
