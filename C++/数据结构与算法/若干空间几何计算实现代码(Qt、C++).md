# 若干空间几何计算实现代码(Qt、C++)



## 1 已知空间两个向量，求与其垂直第三个向量

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


## 2 求封闭图形面积

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

## 3 计算两个点的距离

有个需求是寻找中心线上曲率最大的一系列点，这里记录下  


```cpp
// 求dot距离
   double distance(const QList<double> a, const QList<double> b) { //求两点间距离
        double dis;//两点间距离
        double x, y, z;
        x = a[0] - b[0];
        y = a[1] - b[1];
        z = a[2] - b[2];
        dis = sqrt((x * x + y * y + z * z));
        return dis;
    }
```

```cpp
/**
 * @brief GetDotDistance 求两点距离
 * @param p
 * @param x
 * @return
 */
double GetDotDistance(const double p[3], const double x[3]) {
    return   sqrt((p[0] - x[0]) * (p[0] - x[0]) +
                  (p[1] - x[1]) * (p[1] - x[1]) +
                  (p[2] - x[2]) * (p[2] - x[2]));
}
```



## 4 求三点的曲率半径和曲率、求中心线曲率最大的系列点


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/xxx.jkfe43lyfjk.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/xxx.7huh38scwls0.png)

```cpp
// 求dot曲率
    double DotCurvature(const QList<double> dot1,
                        const QList<double> dot2,
                        const QList<double> dot3) {
        double cur;//求得的曲率
        double radius;//曲率半径
        double dis1, dis2, dis3; //距离
        dis1 = distance(dot1, dot2);
        dis2 = distance(dot1, dot3);
        dis3 = distance(dot2, dot3);
        radius = sqrt((dis1 + dis2 - dis3) * (dis1 - dis2 + dis3) *
                      (dis2 + dis3 - dis1) * (dis1 + dis2 + dis3)) / (dis1 * dis2 * dis3);
        cur = 1 / radius;
        return cur;
    }
```


```cpp
// 选择contour_points曲率最大点
    void Geometry(QList<QList<double>> contour_points,
                  QList<QList<double>> &out_points,
                  QList<qint32> &number) {
        number << 0 << contour_points.count();
        contour_points[0][4] = 0.0;
        contour_points[contour_points.count() - 1][4] = 0.0;
        QList<double> dot;
        QList<qint32> tmp_number;
        for(qint32 i = 30; i < contour_points.count() - 30; ++i) {
            double tmp = DotCurvature(contour_points.at(i + 1),
                                      contour_points.at(i ),
                                      contour_points.at(i + 2));
            contour_points[i + 1][4] = tmp;
            dot << tmp;
            tmp_number << i + 1;
        }
        DotCurvatureSort(dot, tmp_number);
        number << tmp_number.at(0);
        qSort(number.begin(), number.end());
        dot.clear();
        tmp_number.clear();
        qint32 result = 1;
        qint32 result_compare = 0;
        while ( result_compare != result) {
            result_compare = result;
            qint32 size = number.count() - 1;
            for(qint32 i = 0; i < size; ++i) {
                if(number.at(i + 1) - number.at(i) > 60) {
                    result ++;
                    for(qint32 j = number.at(i) + 30; j < number.at(i + 1) - 30; ++j) {
                        dot << contour_points[j][4];
                        tmp_number << j;
                    }
                    DotCurvatureSort(dot, tmp_number);
                    number << tmp_number.at(0);
                    dot.clear();
                    tmp_number.clear();
                }

            }

            qSort(number.begin(), number.end());
        }
        for(qint32 i = 0; i < number.size() - 1; ++i) {
            out_points << contour_points.at(number.at(i));
        }
        out_points << contour_points.at( contour_points.size() - 1);
    }
```

```cpp
// 对dot排序，number为序列号
    void DotCurvatureSort(QList<double> dot, QList<qint32> &number) {
        double t;
        qint32 i, j, t1;
        qint32 length = dot.count();
        for(j = 0; j < length; j++)
            for(i = 0; i < length - 1 - j; i++)
                if(dot[i] < dot[i + 1]) {
                    t = dot[i];
                    dot[i] = dot[i + 1];
                    dot[i + 1] = t;
                    t1 = number[i];
                    number[i] = number[i + 1];
                    number[i + 1] = t1;
                }
    }


```




## 5 求图像重心


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

## 6 已知x、z求y轴向量


```cpp
/**
 * @brief GetVerticalVector 已知x、z求y轴向量
 * @param coordinate_z z轴向量
 * @param coordinate_x x轴向量
 * @param coordinate_y y轴向量
 */
void GetVerticalVector(
                       const QList<double> coordinate_z,
                       const QList<double> coordinate_x,
                       QList<double> &coordinate_y) {
    coordinate_y[0] = coordinate_x[1] * coordinate_z[2] - coordinate_x[2] * coordinate_z[1];
    coordinate_y[1] = coordinate_x[2] * coordinate_z[0] - coordinate_x[0] * coordinate_z[2];
    coordinate_y[2] = coordinate_x[0] * coordinate_z[1] - coordinate_x[1] * coordinate_z[0];
}
```


## 7 获取两点组成的单位向量

```cpp
/**
 * @brief GetTwoPointUnitVector 获取两点组成的单位向量
 * @param point_1
 * @param point_2
 * @param unit_vctor
 */
void GetTwoPointUnitVector(const QList<double> &point_1,
                           const QList<double> &point_2,
                           QList<double> &unit_vctor) {
    QList<double> vctor;
    vctor << point_2.at(0) - point_1.at(0)
          << point_2.at(1) - point_1.at(1)
          << point_2.at(2) - point_1.at(2);
    double distance = vctor.at(0) * vctor.at(0) +
                      vctor.at(1) * vctor.at(1) +
                      vctor.at(2) * vctor.at(2);
    distance = sqrt(distance);
    unit_vctor.clear();
    unit_vctor << vctor.at(0) / distance;
    unit_vctor << vctor.at(1) / distance;
    unit_vctor << vctor.at(2) / distance;
}
```






## 8 求点在新坐标系下位置

[图形学1-三维坐标系间的变换矩阵推导](https://blog.csdn.net/jc_laoshu/article/details/69657579)   

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/xxx.7huh38scwls0.png)

```cpp
/**
 * @brief AffineTransformation 空间坐标系变换
 * @param coordinate_x
 * @param coordinate_y
 * @param coordinate_z
 * @param center
 * @param point
 * @param outpoint
 */
void AffineTransformation(
    const QList<double> coordinate_x,
    const QList<double> coordinate_y,
    const QList<double> coordinate_z,
    const QList<double> center,
    const QList<double> point,
    QList<double> &outpoint) {
    outpoint << (point.at(0) - center.at(0)) * coordinate_x.at(0)
             + (point.at(1) - center.at(1)) * coordinate_x.at(1)
             + (point.at(2) - center.at(2)) * coordinate_x.at(2) ;
    outpoint << (point.at(0) - center.at(0)) * coordinate_y.at(0)
             + (point.at(1) - center.at(1)) * coordinate_y.at(1)
             + (point.at(2) - center.at(2)) * coordinate_y.at(2);
    outpoint << (point.at(0) - center.at(0)) * coordinate_z.at(0)
             + (point.at(1) - center.at(1)) * coordinate_z.at(1)
             + (point.at(2) - center.at(2)) * coordinate_z.at(2);
}
```


## 9 求点到直线距离（两点式）

```cpp
/**
 * @brief ScriptCtpSVD::DistanceFromPointToLine
 * 点到直线距离
 * @return
 */
double ScriptCtpSVD::DistanceFromPointToLine(
    const double &x0, const double &y0,
    const double &x1, const double &y1,
    const double &x2, const double &y2) {
    double d = (fabs((y2 - y1) * x0 + (x1 - x2) * y0 + ((x2 * y1) - (x1 * y2)))) /
               (sqrt(pow(y2 - y1, 2) + pow(x1 - x2, 2)));
    return d;
}
```


