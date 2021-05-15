# VTK 切换相机视角实现前后左右


![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/.35d5h03bbrc0.gif)




```cpp
enum CamOrientation {
    OrientationR,
    OrientationL,
    OrientationA,
    OrientationH,
    OrientationF,
    OrientationP
};

void CBvtkVRWidget::SetCameraOrientation(
    const CBvtkVRWidget::CamOrientation &t_camOrientation) {
    vtkRenderer *renderer =
        render_window_->GetRenderers()->GetFirstRenderer();
    if(renderer->GetActiveCamera()) {
        vtkNew<vtkCamera> camera;
        switch (t_camOrientation) {
            case OrientationR: {
                    camera->SetPosition (1, -1, 0);
                    break;
                }
            case OrientationL: {
                    camera->SetPosition (-1, -1, 0);
                    break;
                }
            case OrientationA: {
                    camera->SetPosition (0, -1, 0);
                    break;
                }
            case OrientationH: {
                    camera->SetPosition (0, -1, 1);
                    break;
                }
            case OrientationF: {
                    camera->SetPosition (0, -1, -1);
                    break;
                }
            case OrientationP: {
                    camera->SetPosition (0, 1, 0);
                    break;
                }
        }
        camera->SetViewUp (0, 0, 1);
        camera->SetFocalPoint (0, 0, 0);
        renderer->SetActiveCamera(camera);
        renderer->ResetCamera();
        render_window_->Render();
    }
}
```


上下左右相机都是45°，垂直的话改一下`SetPosition`






