项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  

---

# 仿照小蚂蚁实现 sharpen smooth Edge Emboss

&emsp;&emsp;小蚂蚁有个功能是`ImageFilters`，模仿小蚂蚁也简单实现了一下。为了方便学习以及后续调整做成插件的形式。下边展示是小蚂蚁的四种`Filters`和自己目前实现的。利用了`Qt`的`QtPlugin`，如果对前处理结果不满意直接修改插件即可。


![在这里插入图片描述](https://img-blog.csdnimg.cn/20210203214313735.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210203214320165.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



## 1 实现方法

&emsp;&emsp;图像前处理思路就是每次再界面上刷新图片时调用一个模板函数`QPixmap(const QPixmap &, QWidget *)`，实现最后渲染不同效果。


`sharpen smooth Edge Emboss`实现的话直接用的现成`API`

```cpp
QPixmap Sharpening(const QPixmap &pix, QWidget * ) {
    QImage image;
    image = pix.toImage();
    cv::Mat src = QImage2cvMat(image.convertToFormat(QImage::Format_ARGB32));
    cv::Mat dst;
    cv::Mat kern = (cv::Mat_<char>(3, 3) <<
                    0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0);
    filter2D(src, dst, src.depth(), kern);
    image = Mat2QImage(dst);
    return QPixmap::fromImage(image);
}

QPixmap Smooth(const QPixmap &pix, QWidget * ) {
    QImage image;
    image = pix.toImage();
    cv::Mat src = QImage2cvMat(image.convertToFormat(QImage::Format_ARGB32));
    cv::Mat dst;
    GaussianBlur(src, dst, cv::Size(7, 7), 0, 0);
    image = Mat2QImage(dst);
    return QPixmap::fromImage(image);
}

QPixmap Edge(const QPixmap &pix, QWidget * ) {
    QImage image;
    image = pix.toImage();
    cv::Mat src = QImage2cvMat(image.convertToFormat(QImage::Format_ARGB32));
    cv::Mat dst;
    //
    cv::Mat src_gray, detected_edges;
    dst.create(src.size(), src.type());
    dst = cv::Scalar::all(0);
    if (src.channels() != 1) {
        cvtColor(src, src_gray, cv::COLOR_BGR2GRAY);    // 转换灰度图像
    } else {
        src_gray = src;
    }
    blur(src_gray, detected_edges, cv::Size(3, 3));
    cv::Canny(detected_edges, detected_edges, 3, 3 * 3, 7);
    src.copyTo(dst, detected_edges);
    //
    image = Mat2QImage(dst);
    return QPixmap::fromImage(image);
}

QPixmap Emboss(const QPixmap &pix, QWidget * ) {
    QImage image;
    image = pix.toImage();
    cv::Mat src = QImage2cvMat(image.convertToFormat(QImage::Format_ARGB32));
    cv::Mat dst;
    cv::Mat kern = (cv::Mat_<char>(3, 3) <<
                    -2, -1, 0,
                    -1, 1, 1,
                    0, 1, 2);
    filter2D(src, dst, src.depth(), kern);
    image = Mat2QImage(dst);
    return QPixmap::fromImage(image);
}
```

