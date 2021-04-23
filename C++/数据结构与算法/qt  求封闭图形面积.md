把封闭图形差分成一个个三角形，依次求每个三角形面积。最后一组记得是两个三角形

```cpp
    /*!
     * \brief 求封闭图形面积
     * points  输入点。第一个list为几张图片、第二个list位每张图片多少点、第三个list为每个点实际坐标
     * areas   输出每个图片面积
     */
void MatUtil::GetCircleArea(
    const QList<QList<QList<double>>> points, QList<double> &areas) {
    areas.clear();
    for(qint32 i = 0; i < points.count(); ++i) {
        double area = 0.0;
        for(qint32 j = 0; j < points[i].count() - 1; ++j) {
            double x1 = points[i][j][0];
            double y1 = points[i][j][1];
            double x2 = points[i][j + 1][0];
            double y2 = points[i][j + 1][1];
            double x3 = 352.0;
            double y3 = 352.0;
            area +=
                0.01 * 0.01 *
                abs(0.5 * (x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2));
        }
        double x1 = points[i][0][0];
        double y1 = points[i][0][1];
        double x2 = points[i][points[i].count() - 1][0];
        double y2 = points[i][points[i].count() - 1][1];
        double x3 = 352.0;
        double y3 = 352.0;
        area +=
            0.01 * 0.01 *
            abs(0.5 * (x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2));
        areas << area;
    }
}
```
