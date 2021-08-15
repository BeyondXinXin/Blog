# QOpenglWidget屏幕坐标系转到vtk世界坐标系


前两天看到有人问vtk的坐标系和qt的坐标系不同，之前有用qt实现了下vtk的测量距离和测量角度，其中就用到了QOpenglWidget屏幕坐标系转到vtk世界坐标系。这边记录一下：


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.3xdpvo3t95w0.gif)



本身是非计算机专业的本科，计算机视觉更是没有了解过，只记录下自己在工作中利用vtk实现可视化的实际应用经验。

我自己大概接触到这么几个坐标系：

1 qt的屏幕坐标系（paintEvent绘制用的）二维的，原点在左上
2 vtk的display坐标系 （vtk屏幕绘制的坐标系）二维的，原点在左下（右手坐标系）
3 vtk的 normalized display坐标系 （display的归一化，用在：有多个render时屏幕分割、屏幕指示控件vtkOrientationMarkerWidget的位置）
4 vtk相机的 view坐标系 （x，y，z相对相机位置，范围 -1~1 ）
5 vtk的word坐标系 （x，y，z实际位置）
6 vtk的viewport和 normalized viewport。（就是vtk的renderer）


世界坐标、
视图坐标（计算机图形渲染坐标系）
显示坐标（显示设备上的实际屏幕坐标）



## 角度测量

这个直接测量三个点的角度就行，不需要转到vtk的坐标系下，用qt的屏幕点计算即可

```cpp

double GeneralAlgorithm::IncludedAngleLine(
  QPointF pos1, QPointF pos2, QPointF pos3, QPointF pos4)
{
    double k1 = (pos2.y() - pos1.y()) / (pos2.x() - pos1.x());
    double k2 = (pos4.y() - pos3.y()) / (pos4.x() - pos3.x());
    return atan(abs((k2 - k1) / (1 + k1 * k2))) * 57.29578;
}

```

## 距离测量


需要从**QOpenglWidget**屏幕坐标系转到vtk世界坐标系。


qt的屏幕坐标和vtk的屏幕坐标原点位置一个左上一个左下，所以y轴需要处理下 `1023 - pos1.y() `，1024是vtk窗口的大小。

vtk屏幕坐标转vtk空间坐标，如果确定是在焦平面上则直接用 **viewport**的 **WorldToDisplay**即可。
如果有偏移则需要判断是平行投影还是透视投影。

其实可以看到很多vtk自带的rep和handle都分2d和3d，区别就在于平行投影还是透视投影。
翻源码可以看出：
* 2d（平行投影）直接使用现成的**vtkCoordinate**，
* 3d（平行或透视）都是根据ActiveCamera自己判断，比如下边注释的部分


```cpp
double GeneralAlgorithm::ComputeWorldPosition(
  vtkRenderer *ren, double displayPos[], double worldPos[])
{
    double fp[4];
    ren->GetActiveCamera()->GetFocalPoint(fp);
    fp[3] = 1.0;

    ren->SetWorldPoint(fp);
    ren->WorldToDisplay();
    ren->GetDisplayPoint(fp);

    double tmp[4];
    tmp[0] = displayPos[0];
    tmp[1] = displayPos[1];
    tmp[2] = fp[2];
    ren->SetDisplayPoint(tmp);
    ren->DisplayToWorld();
    ren->GetWorldPoint(tmp);

    // 沿观察方向从焦平面“偏移”平移焦点。（我这里测量距离不需要）
    //    double Offset = 0.0;
    //    double focalPlaneNormal[3];
    //    ren->GetActiveCamera()->GetDirectionOfProjection(focalPlaneNormal);
    //    if (ren->GetActiveCamera()->GetParallelProjection()) {
    //        tmp[0] += (focalPlaneNormal[0] * Offset);
    //        tmp[1] += (focalPlaneNormal[1] * Offset);
    //        tmp[2] += (focalPlaneNormal[2] * Offset);
    //    } else {
    //        double camPos[3], viewDirection[3];
    //        ren->GetActiveCamera()->GetPosition(camPos);
    //        viewDirection[0] = tmp[0] - camPos[0];
    //        viewDirection[1] = tmp[1] - camPos[1];
    //        viewDirection[2] = tmp[2] - camPos[2];
    //        vtkMath::Normalize(viewDirection);
    //        double costheta = vtkMath::Dot(viewDirection, focalPlaneNormal)
    //          / (vtkMath::Norm(viewDirection) * vtkMath::Norm(focalPlaneNormal));
    //        if (costheta != 0.0) // 透视投影中0.0不可能
    //        {
    //            tmp[0] += (viewDirection[0] * Offset / costheta);
    //            tmp[1] += (viewDirection[1] * Offset / costheta);
    //            tmp[2] += (viewDirection[2] * Offset / costheta);
    //        }
    //    }

    worldPos[0] = tmp[0];
    worldPos[1] = tmp[1];
    worldPos[2] = tmp[2];
    return 1;
}

double GeneralAlgorithm::GetDistance(
  QPointF pos1, QPointF pos2, vtkRenderer *renderer)
{
    double p1[3], p2[3];
    double display1[2] { pos1.x(), 1023 - pos1.y() },
      display2[2] { pos2.x(), 1023 - pos2.y() };
    ComputeWorldPosition(renderer, display1, p1);
    ComputeWorldPosition(renderer, display2, p2);
    double distance = sqrt(vtkMath::Distance2BetweenPoints(p1, p2));
    return distance;
}

```









