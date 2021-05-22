# Study-VTK ： windos下vtk弹窗全黑 没有影响 需要鼠标点击或者按R键才显示

&emsp;&emsp;估计接下来公司会把几个项目从llinux搞到windos，假期比较空在windos下配了一套环境先做几个单元测试，发现原来linux下项目直接搞过来各种问题。比如最基本的弹窗显示模型：**vtkRenderWindow**必须在**vtkRenderWindowInteractor::star()**之前主动调用**Render()**,而linux下则无需这样。


- 原来代码
```cpp
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    vtkNew<vtkInteractorStyleTrackballCamera>style ;
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetInteractorStyle(style);
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
```


<img src="https://img-blog.csdnimg.cn/20200503111222654.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center" width="60%">

<img src="https://img-blog.csdnimg.cn/20200503111301876.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF#pic_center" width="60%">




- 新代码
```cpp
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    renwin->Render();
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
```
<img src="https://img-blog.csdnimg.cn/20200503111359169.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center" width="60%">
