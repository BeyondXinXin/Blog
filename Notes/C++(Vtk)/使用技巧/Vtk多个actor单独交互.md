# Vtk多个actor单独交互


挺常用的需求，其实只要使用 **TrackballActor** 即可。（不是**TrackballCamera**）

## 效果

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.2lubdj6cm2o0.gif)



## 项目地址

在官方案例基础上改的

* 案例 [https://kitware.github.io/vtk-examples/site/Cxx/Interaction/TrackballActor/](https://kitware.github.io/vtk-examples/site/Cxx/Interaction/TrackballActor/)
* 修改后工程 ~~[https://github.com/BeyondXinXin/study_vtk](https://github.com/BeyondXinXin/study_vtk)~~


## 原文


[Vtk多个actor单独交互](https://github.com/BeyondXinXin/Blog/blob/master/%E5%BC%80%E6%BA%90%E5%BA%93%E5%AD%A6%E4%B9%A0/Study%20VTK/%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7/Vtk%E5%A4%9A%E4%B8%AAactor%E5%8D%95%E7%8B%AC%E4%BA%A4%E4%BA%92.md)


## 实现

```cpp

static QStringList filename {
    "./etc/STL/L5.STL",
    "./etc/STL/S1.STL",
    "./etc/STL/S2.STL",
};

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);

    vtkNew<vtkNamedColors> colors;
    vtkNew<vtkRenderer> renderer;
    renderer->SetBackground(colors->GetColor3d("SteelBlue").GetData());
    vtkNew<vtkRenderWindow> renderWindow;
    renderWindow->SetSize(640, 480);
    renderWindow->AddRenderer(renderer);
    renderWindow->SetWindowName("HighlightPicked");
    vtkNew<vtkRenderWindowInteractor> renderWindowInteractor;
    renderWindowInteractor->SetRenderWindow(renderWindow);
    vtkNew<vtkInteractorStyleTrackballActor> style;
    style->SetDefaultRenderer(renderer);
    renderWindowInteractor->SetInteractorStyle(style);
    foreach (auto var, filename) {
        vtkNew<vtkSTLReader> reader;
        reader->SetFileName(var.toLocal8Bit().data());
        vtkNew<vtkSphereSource> source;
        vtkNew<vtkPolyDataMapper> mapper;
        mapper->SetInputConnection(reader->GetOutputPort());
        vtkNew<vtkActor> actor;
        actor->SetMapper(mapper);
        actor->GetProperty()->SetSpecularColor(colors->GetColor3d("White").GetData());
        actor->GetProperty()->SetSpecularPower(30.0);
        renderer->AddActor(actor);
    }
    renderWindow->Render();
    renderWindowInteractor->Initialize();
    renderWindowInteractor->Start();

    return 0;
}

```