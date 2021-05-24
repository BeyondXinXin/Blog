# qt  计算两个点的距离、求三点的曲率半径和曲率、求中心线曲率最大的系列点

有个需求是寻找中心线上曲率最大的一系列点，这里记录下
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191123121046598.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191123121140713.png#pic_center)
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
