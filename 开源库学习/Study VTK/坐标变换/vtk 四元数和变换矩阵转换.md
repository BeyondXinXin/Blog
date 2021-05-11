# vtk 四元数和变换矩阵转换


最近有个需求是根据四元数求齐次变换矩阵然后做计算。

* 看到一篇对这块讲解很好的文章
[https://krasjet.github.io/quaternion/quaternion.pdf](https://krasjet.github.io/quaternion/quaternion.pdf)
* 作者的github地址（matlab的）
[https://github.com/Krasjet/quaternion](https://github.com/Krasjet/quaternion)


Eigen转换办法

```cpp
Eigen::Quaterniond q;
q.x() = x;
q.y() = y;
q.z() = z;
q.w() = w;
Eigen::Matrix3d R = q.normalized().toRotationMatrix();
```


vtk的转换办法

```cpp

struct NDIPosture {
    unsigned short toolHandle; // 传感器唯一指示符
    double q0, qx, qy, qz; // 传感器当前 四元素
    double tx, ty, tz; // 传感器当前空间位置
    itk::Matrix<double, 4, 4> itk_ucs_; // 传感器当前 itk 4*4 矩阵
    vtkMatrix4x4 *vtk_ucs_ = vtkMatrix4x4::New(); // 传感器当前 vtk 4*4 矩阵
    void Generate(const ToolData &tool_data); // 解析ndiapi串口通讯数据
    void GenerateMatrix(); // 生成 itk、vtk 数据
    void CorrectDeviation(const double deviation[3]); // 修正指针位置
};


void NDIPosture::Generate(const ToolData &tool_data) {
    toolHandle = tool_data.transform.toolHandle;
    q0 = tool_data.transform.q0;
    qx = tool_data.transform.qx;
    qy = tool_data.transform.qy;
    qz = tool_data.transform.qz;
    tx = tool_data.transform.tx;
    ty = tool_data.transform.ty;
    tz = tool_data.transform.tz;
}

void NDIPosture::GenerateMatrix() {
    vtkQuaterniond quaterniond;
    quaterniond.Set(q0, qx, qy, qz);
    double matix3x3[3][3];
    quaterniond.ToMatrix3x3(matix3x3);
    for(quint32 i = 0; i < 3; i++) {
        for(quint32 j = 0; j < 3; j++) {
            itk_ucs_(i, j) = matix3x3[i][j];
            vtk_ucs_->SetElement(static_cast<int>(i), static_cast<int>(j), matix3x3[i][j]);
        }
    }
    for(quint32 i = 0; i < 3; i++) {
        itk_ucs_(3, i) = 0;
        vtk_ucs_->SetElement(3, static_cast<int>(i), 0);
    }
    itk_ucs_(0, 3) = tx;
    itk_ucs_(1, 3) = ty;
    itk_ucs_(2, 3) = tz;
    vtk_ucs_->SetElement(0, 3, tx);
    vtk_ucs_->SetElement(1, 3, ty);
    vtk_ucs_->SetElement(2, 3, tz);
    itk_ucs_(3, 3) = 1;
    vtk_ucs_->SetElement(3, 3, 1);
}

void NDIPosture::CorrectDeviation(const double deviation[3]) {
    vtkNew<vtkTransform> translation;
    translation->SetMatrix(vtk_ucs_);
    double *out = translation->TransformDoublePoint(deviation);
    tx = out[0];
    ty = out[1];
    tz = out[2];
    vtk_ucs_->SetElement(0, 3, tx);
    vtk_ucs_->SetElement(1, 3, ty);
    vtk_ucs_->SetElement(2, 3, tz);
    itk_ucs_(0, 3) = tx;
    itk_ucs_(1, 3) = ty;
    itk_ucs_(2, 3) = tz;
}
```







