```cpp
    /*!
     * \brief 求垂直与两向量的第三个向量
     */
void MatUtil::GetVerticalVector(const QList<double> coordinate_z,
                                const QList<double> coordinate_x,
                                QList<double> &coordinate_y) {
    coordinate_y[0] = coordinate_x[1] * coordinate_z[2] -
                      coordinate_x[2] * coordinate_z[1];
    coordinate_y[1] = coordinate_x[2] * coordinate_z[0] -
                      coordinate_x[0] * coordinate_z[2];
    coordinate_y[2] = coordinate_x[0] * coordinate_z[1] -
                      coordinate_x[1] * coordinate_z[0];
}
```
