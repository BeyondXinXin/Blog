```cpp
    /*!
     * \brief 求重心
     * points  输入点。第一个list为几张图片、第二个list位每张图片多少点、第三个list为每个点实际坐标
     * gravity 输出每张图片的重心
     */
void MatUtil::GetImageCenterOfGravity(
    const QList<QList<QList<double> > > points, QList<QList<double>> &gravity) {
    gravity.clear();
    for(qint32 i = 0; i < points.count(); ++i) {
        double x_tmp = 0.0, y_tmp = 0.0;
        QList<double> gravity_tmp;
        for(qint32 j = 0; j < points[i].count() - 1; ++j) {
            x_tmp += points[i][j][0];
            y_tmp += points[i][j][1];
        }
        x_tmp /= points[i].count();
        y_tmp /= points[i].count();
        gravity_tmp << ( x_tmp - 352.0) * 0.01 << (y_tmp - 352.0) * 0.01 << 0;
        gravity << gravity_tmp;
    }
}
```
