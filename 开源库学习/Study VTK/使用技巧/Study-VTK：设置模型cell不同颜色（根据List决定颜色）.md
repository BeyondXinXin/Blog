# Study-VTK：设置模型cell不同颜色（根据List决定颜色）


surface_是模型，self_intersected_list是模型里需要特殊标记的cell


```cpp
void ShowPolydata(vtkSmartPointer<vtkPolyData> surface_,
                  QList<quint32>  self_intersected_list) {
    qSort(self_intersected_list.begin(), self_intersected_list.end());
    self_intersected_list = self_intersected_list.toSet().toList();
    unsigned char color1[3] = { 255, 0, 0 };
    unsigned char color2[3] = { 0, 0, 0 };
    vtkNew<vtkUnsignedCharArray> cellColor;
    cellColor->SetNumberOfComponents(3);
    for(quint32 i = 0; i < surface_->GetNumberOfCells(); i++) {
        if(self_intersected_list.contains(i)) {
            cellColor->InsertNextTypedTuple(color1);
        } else {
            cellColor->InsertNextTypedTuple(color2);
        }
    }
    surface_->GetCellData()->SetScalars(cellColor);
    vtkNew<vtkPolyDataMapper> polydatamapper ;
    polydatamapper->SetInputData(surface_);
    vtkNew<vtkActor> actor ;
    actor->SetMapper(polydatamapper);
    actor->GetProperty()->SetOpacity(0.1);
    vtkNew<vtkRenderer> renderer;
    renderer->AddActor(actor);
    renderer->SetBackground(0.2, 0.2, 0.2);
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    vtkNew<vtkInteractorStyleTrackballCamera>style ;
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetInteractorStyle(style);
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
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