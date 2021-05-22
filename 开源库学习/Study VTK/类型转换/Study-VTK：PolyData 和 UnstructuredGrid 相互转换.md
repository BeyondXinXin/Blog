# Study-VTK：PolyData 和 UnstructuredGrid 相互转换


- PolyData -> UnstructuredGrid




```cpp
void WriteVTU(vtkSmartPointer<vtkPolyData> &surface, QString filename) {
    vtkSmartPointer<vtkUnstructuredGrid> unstructuredGrid =
        vtkSmartPointer<vtkUnstructuredGrid>::New();
    unstructuredGrid->ShallowCopy(surface);
    vtkSmartPointer<vtkXMLUnstructuredGridWriter> writer =
        vtkSmartPointer<vtkXMLUnstructuredGridWriter>::New();
    writer->SetFileName(filename.toLocal8Bit().data());
    writer->SetInputData(unstructuredGrid);
    writer->Write();
}

void WriteVTU(vtkSmartPointer<vtkUnstructuredGrid> &surface, QString filename) {
    vtkSmartPointer<vtkXMLUnstructuredGridWriter> writer =
        vtkSmartPointer<vtkXMLUnstructuredGridWriter>::New();
    writer->SetFileName(filename.toLocal8Bit().data());
    writer->SetInputData(surface);
    writer->Write();
}
```

- UnstructuredGrid  -> PolyData

```cpp
void ReadVTU(vtkSmartPointer<vtkUnstructuredGrid> &surface, QString filename) {
    vtkNew<vtkXMLUnstructuredGridReader> reader;
    reader->SetFileName(filename.toLocal8Bit().data());
    reader->Update();
    surface = reader->GetOutput();
}

void ReadVTU(vtkSmartPointer<vtkPolyData> &surface, QString filename) {
    vtkNew<vtkXMLUnstructuredGridReader> reader;
    reader->SetFileName(filename.toLocal8Bit().data());
    reader->Update();
    vtkSmartPointer<vtkDataSetSurfaceFilter> surface_filter =
        vtkSmartPointer<vtkDataSetSurfaceFilter>::New();
    surface_filter->SetInputData(reader->GetOutput());
    surface_filter->Update();
    surface = surface_filter->GetOutput();
}
```
