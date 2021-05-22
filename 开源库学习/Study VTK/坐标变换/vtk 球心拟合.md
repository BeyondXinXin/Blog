# vtk 球心拟合


<details>
<summary> 代码 </summary>

```cpp
double *GetBallCentre(vtkPoints &points) {
    double matrix[16];
    double in[4];
    vtkIdType num = points.GetNumberOfPoints();
    matrix[15] = static_cast<double>(num);
    for(vtkIdType i = 0; i < num; i++ ) {
        double pos[3];
        points.GetPoint(i, pos);
        double temp = pos[0] * pos[0] + pos[1] * pos[1] + pos[2] * pos[2];
        in[0] += pos[0] * temp;
        in[1] += pos[1] * temp;
        in[2] += pos[2] * temp;
        in[3] -= temp;
        matrix[ 0] += pos[0] * pos[0];
        matrix[ 1] += pos[0] * pos[1];
        matrix[ 2] += pos[0] * pos[2];
        matrix[ 3] -= pos[0];
        matrix[ 4] += pos[0] * pos[1];
        matrix[ 5] += pos[1] * pos[1];
        matrix[ 6] += pos[2] * pos[1];
        matrix[ 7] -= pos[1];
        matrix[ 8] += pos[0] * pos[2];
        matrix[ 9] += pos[1] * pos[2];
        matrix[10] += pos[2] * pos[2];
        matrix[11] -= pos[2];
        matrix[12] -= pos[0];
        matrix[13] -= pos[1];
        matrix[14] -= pos[2];
    }
    vtkNew<vtkMatrix4x4> vtk_matrix;
    vtk_matrix->DeepCopy(matrix);
    vtk_matrix->Invert();
    double *out = vtk_matrix->MultiplyDoublePoint(in);
    out[0] *= 0.5;
    out[1] *= 0.5;
    out[2] *= 0.5;
    out[4] = pow(out[0] * out[0] + out[1] * out[1] + out[2] * out[2] - out[4], 0.5);
    return out;
}
```

</details>




![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/xxx.3l7ukslwua00.png)








