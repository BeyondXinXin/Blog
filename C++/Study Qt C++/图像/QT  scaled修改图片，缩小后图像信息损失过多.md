# QT  scaled修改图片，缩小后图像信息损失过多

以前一直用opencv做图像处理相关的，今天要写一个截图后缩放的小需求，因为工程没有opencv，我直接用的scaled，谁知道缩放后保存的效果这么差，一搜索发现qt自带低通滤波来缩放图片，这里记录下


> QPixmap QPixmap::scaled( 
> const QSize &size, 
> Qt::AspectRatioMode
> aspectRatioMode = Qt::IgnoreAspectRatio, 
>  Qt::TransformationMode
> transformMode = Qt::FastTransformation) const

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822092853647.png)
使用aspectRatioMode和transformMode指定的宽高比和变换模式将像素图缩放到给定大小。
如果aspectRatioMode是Qt :: IgnoreAspectRatio，则pixmap按比例缩放。
如果aspectRatioMode是Qt :: KeepAspectRatio，则pixmap将缩放为内部大小尽可能大的矩形，从而保留纵横比。
如果aspectRatioMode是Qt :: KeepAspectRatioByExpanding，则像素图缩放为尽可能小的外部尺寸的矩形，保留纵横比。
如果给定大小为空，则此函数返回空像素图。

> enum Qt::TransformationMode

该枚举类型定义图像变换（例如，缩放）是否应该是平滑的。
Qt::FastTransformation                           转换快速执行，没有平滑。
Qt::SmoothTransformation                   使用双线性滤波来变换所得到的图像。





这三种大家可以比较一下效果

```javascript
    full_screen->copy(x, y, w, h)
    .scaled(480, 480)
    .save(file_path, "bmp");
```

```javascript
    full_screen->copy(x, y, w, h)
    .scaled(480, 480, Qt::KeepAspectRatio)
    .save(file_path, "bmp");
```
```javascript
    full_screen->copy(x, y, w, h)
    .scaled(480, 480, Qt::KeepAspectRatio, Qt::SmoothTransformation)
    .save(file_path, "bmp");
```
