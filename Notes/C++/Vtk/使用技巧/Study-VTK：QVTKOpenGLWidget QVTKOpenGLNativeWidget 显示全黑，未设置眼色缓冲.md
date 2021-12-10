# Study-VTK：QVTKOpenGLWidget QVTKOpenGLNativeWidget 显示全黑，未设置眼色缓冲

QVTKWidget有默认的RenderWindow，而QVTKOpenGLWidget是没有的（是空指针）
如果继承重写QVTKOpenGLWidget需要设置QSurfaceFormat（QSurface的颜色缓冲）

>     vtkOpenGLRenderWindow::SetGlobalMaximumNumberOfMultiSamples(8);
>     QSurfaceFormat::setDefaultFormat(QVTKOpenGLWidget::defaultFormat()); 



```cpp
int main(int argc, char *argv[]) {
    vtkOutputWindow::SetGlobalWarningDisplay(0);
    vtkOpenGLRenderWindow::SetGlobalMaximumNumberOfMultiSamples(8);
    QSurfaceFormat::setDefaultFormat(QVTKOpenGLWidget::defaultFormat()); 
    Application a(argc, argv);
    if (!a.lock()) {
        QUIHelper::showMessageBoxError("正在运行，请不要重复启动", 5, true);
        return 0;
    }
    FormTitle qui;
    TrayIcon::Instance()->setMainWidget(&qui);
    MaskWidget::Instance()->setMainWidget(&qui);
    QUIHelper::setStyle(":/Style/style.qss");
    //------开始------//
    qui.show();

    return a.exec();
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