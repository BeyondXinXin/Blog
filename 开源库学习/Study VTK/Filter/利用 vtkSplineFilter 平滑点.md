# 利用 vtkSplineFilter 平滑点

```cpp
/**
 * @brief SplinePoints 平滑点
 * @param adjust_list
 * @param spline_list
 * @param resolution
 * @return
 */
bool SplinePoints(const QList<QList<double>> &adjust_list,
                  QList<QList<double>> &spline_list, qint32 resolution) {
    vtkNew<vtkPoints> points;
    for (qint32 i = 0; i < adjust_list.size(); ++i) {
        points->InsertPoint(static_cast<vtkIdType>(i),
                            adjust_list[i][0], adjust_list[i][1], adjust_list[i][2]);
    }
    vtkNew<vtkCellArray> lines;
    lines->InsertNextCell(adjust_list.size());
    vtkNew<vtkPolyData> poly_data;
    for (qint32 i = 0; i < adjust_list.size(); ++i) {
        lines->InsertCellPoint(static_cast<vtkIdType>(i));
    }
    poly_data->SetPoints(points);
    poly_data->SetLines(lines);
    vtkNew<vtkCardinalSpline> spline;
    spline->SetLeftConstraint(2);
    spline->SetLeftValue(0.0);
    spline->SetRightConstraint(2);
    spline->SetRightValue(0.0);
    vtkNew<vtkSplineFilter> filter;
    filter->SetInputData(poly_data);
    filter->SetNumberOfSubdivisions(resolution - 1);
    filter->SetSpline(spline);
    filter->Update();
    double temp_point[3];
    for (qint32 i = 0; i < filter->GetOutput()->GetNumberOfPoints(); ++i) {
        filter->GetOutput()->GetPoint(i, temp_point);
        spline_list.append({temp_point[0], temp_point[1], temp_point[2]});
    }
    return true;
}
```
