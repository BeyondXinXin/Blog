# QT、Opencv使用心得
Qt在可视化和界面开发方面拥有很强大的功能和便捷性，opencv是一个强大的开源图像处理库，大家常常需要两者结合起来用。
本文介绍个人开发使用方式，大家可以参考下。
@[TOC](Qt、Opencv联合开发)
## qt安装
官网下载直接安装就可以，我直接用的vs2015座编译和调试器。安装后可以把bin加到系统path里。
## opencv安装
我用的3.46，opencv官网有提供exe直接安装，或者可以下载源码自己编译，编译没有什需要注意的选中“WITH_OPENGL”、“WITH_QT”，将“WITH_IPP”取消。“ENABLE_PRECOMPILED_HEADERS”取消。安装后可以把bin加到系统path里。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807111606495.png)
路径按照自己安装位置

## qt配置opencv环境
qt和opencv环境都搭建好后，我们联合开发。
为了便于以后利用，我们把opencv配置单独写进api里。
首先一路默认新建一个qt widgets application 程序
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802152721410.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019080215281123.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
建好后，选中.pro文件，右键在资源管理器打开，可以看到生成文件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190802152827818.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
在这个文件夹下我们新建文件夹Qt_OPENCV文件夹，方便以后移植。
在Qt_OPENCV文件夹里新建两个.txt文件，我们手写pri文件和头文件。（个人认为pri是qmake为了便于整理代码用的，和直接放入pro一模一样）
![在这里插入图片描述](https://img-blog.csdnimg.cn/201908071118490.png)
重命名为 qt_halcon.pri 和 QT_Halcon
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807111926268.png)
用记事本打开这两个文件分别写入

```javascript
//qt_opencv.pri
INCLUDEPATH+=E:/opencv346/build/include/opencv
INCLUDEPATH+=E:/opencv346/build/include/opencv2
INCLUDEPATH+=E:/opencv346/build/include

CONFIG(debug, debug|release):{
LIBS+=-LE:/opencv346/build/x64/vc14/lib\
-lopencv_world346d
}else:CONFIG(release, debug|release):{
LIBS+=-LE:/opencv346/build/x64/vc14/lib\
-lopencv_world346
}

HEADERS += \
    $$PWD/qt_opencv.h

SOURCES += \
    $$PWD/qt_opencv.cpp
```

**需要注意 cv命名空间经常和其他冲突，所以不建议在qt环境下开头都加 /using namespace cv**
```javascript
//QT_Opencv
#ifndef QT_QTOPENCV_MODULE_H
#define QT_QTOPENCV_MODULE_H
#include qt_opencv.h
#endif
```
qt_opencv.pri就是引用halcon的头文件和lib文件
**具体路径要根据自己安装来定**
QT_Opencv就是为了方便我们其他文件调用Opencv的头文件
qt_opencv.h下文提供

建立好模板后我们需要调用，打开我们的pro文件，文件最后添加
```javascript
// untitleda.pro文件添加
INCLUDEPATH     += $$PWD/Qt_OPENCV
include         ($$PWD/Qt_OPENCV/qt_opencv.pri)
#过程文件存放位置
MOC_DIR         = temp/moc  #指定moc命令将含Q_OBJECT的头文件转换成标准.h文件的存放目录
RCC_DIR         = temp/rcc  #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
UI_DIR          = temp/ui   #指定rcc命令将.qrc文件转换成qrc_*.h文件的存放目录
OBJECTS_DIR     = temp/obj  #指定目标文件(obj)的存放目录
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807112423485.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
添加后，选中.pro文件，右键qmake，可以看到添加完成。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807112446362.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
此时，这个程序的halcon环境就配置完成，这个Qt_OPENCV文件夹就可以作为我们的模板，以后需要用到opencv，直接把这个文件夹复制进去就好。



## mat  qimage互转    
**qt_opencv.h下Yx_opencv_ImgChange类**
```javascript
class Yx_opencv_ImgChange;
// 图像转换
class Yx_opencv_ImgChange
{
public:
    Yx_opencv_ImgChange();
    ~Yx_opencv_ImgChange();
    QImage cvMat2QImage(const Mat& mat);     // Mat 改成 QImage
    Mat QImage2cvMat(QImage image);			// QImage 改成 Mat
    QImage splitBGR(QImage src, int color);			// 提取RGB分量
    QImage splitColor(QImage src, String model, int color);		// 提取分量
};
```

```javascript
QImage Yx_opencv_ImgChange::cvMat2QImage(const Mat& mat)    // Mat 改成 QImage
{
    if (mat.type() == CV_8UC1)					// 单通道
    {
        QImage image(mat.cols, mat.rows, QImage::Format_Indexed8);
        image.setColorCount(256);				// 灰度级数256
        for (int i = 0; i < 256; i++)
        {
            image.setColor(i, qRgb(i, i, i));
        }
        uchar *pSrc = mat.data;					// 复制mat数据
        for (int row = 0; row < mat.rows; row++)
        {
            uchar *pDest = image.scanLine(row);
            memcpy(pDest, pSrc, mat.cols);
            pSrc += mat.step;
        }
        return image;
    }

    else if (mat.type() == CV_8UC3)				// 3通道
    {
        const uchar *pSrc = (const uchar*)mat.data;			// 复制像素
        QImage image(pSrc, mat.cols, mat.rows, (int)mat.step, QImage::Format_RGB888);	// R, G, B 对应 0,1,2
        return image.rgbSwapped();				// rgbSwapped是为了显示效果色彩好一些。
    }
    else if (mat.type() == CV_8UC4)
    {
        const uchar *pSrc = (const uchar*)mat.data;			// 复制像素
            // Create QImage with same dimensions as input Mat
        QImage image(pSrc,mat.cols, mat.rows, (int)mat.step, QImage::Format_ARGB32);		// B,G,R,A 对应 0,1,2,3
        return image.copy();
    }
    else
    {
        return QImage();
    }
}

Mat Yx_opencv_ImgChange::QImage2cvMat(QImage image)			// QImage改成Mat
{
    Mat mat;
    switch (image.format())
    {
    case QImage::Format_ARGB32:
    case QImage::Format_RGB32:
    case QImage::Format_ARGB32_Premultiplied:
        mat = Mat(image.height(), image.width(), CV_8UC4, (void*)image.constBits(), image.bytesPerLine());
        break;
    case QImage::Format_RGB888:
        mat = Mat(image.height(), image.width(), CV_8UC3, (void*)image.constBits(), image.bytesPerLine());
        cv::cvtColor(mat, mat, CV_BGR2RGB);
        break;
    case QImage::Format_Indexed8:
        mat = Mat(image.height(), image.width(), CV_8UC1, (void*)image.constBits(), image.bytesPerLine());
        break;
    }
    return mat;
}

QImage Yx_opencv_ImgChange::splitBGR(QImage src, int color)			// 提取RGB分量
{
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    if (srcImg.channels() == 1)
    {
        QMessageBox message(QMessageBox::Information, QString::fromLocal8Bit("提示"), QString::fromLocal8Bit("该图像为灰度图像。"));
        message.exec();
        return src;
    }
    else
    {
        vector<Mat> m;
        split(srcImg, m);
        vector<Mat>Rchannels, Gchannels, Bchannels;
        split(srcImg, Rchannels);
        split(srcImg, Gchannels);
        split(srcImg, Bchannels);
        Rchannels[1] = 0;	Rchannels[2] = 0;
        Gchannels[0] = 0;	Gchannels[2] = 0;
        Bchannels[0] = 0;	Bchannels[1] = 0;
        merge(Rchannels, m[0]);
        merge(Gchannels, m[1]);
        merge(Bchannels, m[2]);

        dstImg = m[color];		// 分别对应B、G、R
        QImage dst = cvMat2QImage(dstImg);
        return dst;
    }
}

QImage Yx_opencv_ImgChange::splitColor(QImage src, String model, int color)		// 提取分量
{
    Mat img = QImage2cvMat(src);
    Mat img_rgb, img_hsv, img_hls, img_yuv, img_dst;

    if (img.channels() == 1)
    {
        QUIHelper::showMessageBoxError("该图像为灰度图像。");
        return src;
    }
    else
    {
        vector <Mat> vecRGB, vecHsv, vecHls, vecYuv;
        img_hsv.create(img.rows, img.cols, CV_8UC3);
        img_hls.create(img.rows, img.cols, CV_8UC3);

        cvtColor(img, img_rgb, CV_BGR2RGB);
        cvtColor(img, img_hsv, CV_BGR2HSV);
        cvtColor(img, img_hls, CV_BGR2HLS);
        cvtColor(img, img_yuv, CV_BGR2YUV);

        split(img_rgb, vecRGB);
        split(img_hsv, vecHsv);
        split(img_hls, vecHls);
        split(img_yuv, vecYuv);

        if(model == "RGB")
            img_dst = vecRGB[color];
        else if (model == "HSV")
            img_dst = vecHsv[color];
        else if (model == "HLS")
            img_dst = vecHls[color];
        else if (model == "YUV")
            img_dst = vecYuv[color];
        else
            img_dst = img;

        QImage dst = cvMat2QImage(img_dst);
        return dst;
    }
}
```

## opencv图像改变 
**qt_opencv.h下Yx_opencv_Enhance类**

```javascript
// 图像改变
class Yx_opencv_Enhance
{
public:
    Yx_opencv_Enhance();
    ~Yx_opencv_Enhance();
    QImage Normalized(QImage src, int kernel_length);								// 简单滤波
    QImage Gaussian(QImage src, int kernel_length);								// 高斯滤波
    QImage Median(QImage src, int kernel_length);									// 中值滤波
    QImage Sobel(QImage src, int kernel_length);							// sobel边缘检测
    QImage Laplacian(QImage src, int kernel_length);						// laplacian边缘检测
    QImage Canny(QImage src, int kernel_length, int lowThreshold);			// canny边缘检测
    QImage HoughLine(QImage src, int threshold, double minLineLength, double maxLineGap);			// 线检测
    QImage HoughCircle(QImage src, int minRadius, int maxRadius);		// 圆检测

private:
    Yx_opencv_ImgChange *imgchangeClass;
};
```
```javascript
Yx_opencv_Enhance::Yx_opencv_Enhance()
{
    imgchangeClass = new Yx_opencv_ImgChange;
}

Yx_opencv_Enhance::~Yx_opencv_Enhance()
{
}

QImage Yx_opencv_Enhance::Normalized(QImage src,int kernel_length)								// 简单滤波
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    blur(srcImg, dstImg, Size(kernel_length, kernel_length), Point(-1, -1));
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::Gaussian(QImage src, int kernel_length)									// 高斯滤波
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    GaussianBlur(srcImg, dstImg, Size(kernel_length, kernel_length), 0, 0);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::Median(QImage src, int kernel_length)									// 中值滤波
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    medianBlur(srcImg, dstImg, kernel_length);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::HoughLine(QImage src, int threshold, double minLineLength, double maxLineGap)			// 线检测
{
    Mat srcImg, dstImg, cdstPImg;
    srcImg = imgchangeClass->QImage2cvMat(src);

    cv::Canny(srcImg, dstImg, 50, 200, 3);                // Canny算子边缘检测
    if (srcImg.channels() != 1)
        cvtColor(dstImg, cdstPImg, COLOR_GRAY2BGR);        // 转换灰度图像
    else
        cdstPImg = srcImg;

    vector<Vec4i> linesP;
    HoughLinesP(dstImg, linesP, 1, CV_PI / 180, threshold, minLineLength, maxLineGap);// 50,50,10
    for (size_t i = 0; i < linesP.size(); i++)
    {
        Vec4i l = linesP[i];
        line(cdstPImg, Point(l[0], l[1]), Point(l[2], l[3]), Scalar(0, 0, 255), 1, LINE_AA);
    }

    QImage dst = imgchangeClass->cvMat2QImage(cdstPImg);
    return dst;

}

QImage Yx_opencv_Enhance::HoughCircle(QImage src, int minRadius, int maxRadius)		// 圆检测
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);

    Mat gray;
    if (srcImg.channels() != 1)
        cvtColor(srcImg, gray, COLOR_BGR2GRAY);
    else
        gray = srcImg;
    medianBlur(gray, gray, 5);              // 中值滤波，滤除噪声，避免错误检测

    vector<Vec3f> circles;
    HoughCircles(gray, circles, HOUGH_GRADIENT, 1, gray.rows / 16, 100, 30, minRadius, maxRadius); // Hough圆检测,100, 30, 1, 30
    dstImg = srcImg.clone();

    for (size_t i = 0; i < circles.size(); i++)
    {
        Vec3i c = circles[i];
        Point center = Point(c[0], c[1]);
        circle(dstImg, center, 1, Scalar(0, 100, 100), 3, LINE_AA);                    // 画圆
        int radius = c[2];
        circle(dstImg, center, radius, Scalar(255, 0, 255), 3, LINE_AA);
    }

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::Sobel(QImage src, int kernel_length)							// sobel
{
    Mat srcImg, dstImg, src_gray;
    srcImg = imgchangeClass->QImage2cvMat(src);

    GaussianBlur(srcImg, srcImg, Size(3, 3), 0, 0, BORDER_DEFAULT);     // 高斯模糊
    if (srcImg.channels() != 1)
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);                        // 转换灰度图像
    else
        src_gray = srcImg;

    Mat grad_x, grad_y, abs_grad_x, abs_grad_y;

    cv::Sobel(src_gray, grad_x, CV_16S, 1, 0, kernel_length, 1, 0, BORDER_DEFAULT);
    cv::Sobel(src_gray, grad_y, CV_16S, 0, 1, kernel_length, 1, 0, BORDER_DEFAULT);

    convertScaleAbs(grad_x, abs_grad_x);            // 缩放，计算绝对值，并将结果转换为8位
    convertScaleAbs(grad_y, abs_grad_y);

    addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dstImg);

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::Laplacian(QImage src, int kernel_length)						// laplacian
{
    Mat srcImg, dstImg, src_gray;
    srcImg = imgchangeClass->QImage2cvMat(src);

    GaussianBlur(srcImg, srcImg, Size(3, 3), 0, 0, BORDER_DEFAULT);       // 高斯模糊

    if (srcImg.channels() != 1)
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);                        // 转换灰度图像
    else
        src_gray = srcImg;

    Mat abs_dst;                                                    // 拉普拉斯二阶导数
    cv::Laplacian(src_gray, dstImg, CV_16S, kernel_length, 1, 0, BORDER_DEFAULT);

    convertScaleAbs(dstImg, dstImg);                                  // 绝对值8位
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Enhance::Canny(QImage src, int kernel_length ,int lowThreshold)							// canny
{
    Mat srcImg, dstImg, src_gray, detected_edges;
    srcImg = imgchangeClass->QImage2cvMat(src);

    dstImg.create(srcImg.size(), srcImg.type());
    if (srcImg.channels() != 1)
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);                        // 转换灰度图像
    else
        src_gray = srcImg;
    blur(src_gray, detected_edges, Size(3, 3));     // 平均滤波平滑
    cv::Canny(detected_edges, detected_edges, lowThreshold, lowThreshold * 3, kernel_length);
    dstImg = Scalar::all(0);
    srcImg.copyTo(dstImg, detected_edges);

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

```

## opencv图像几何变换 
**qt_opencv.h下Yx_opencv_Enhance类**
```javascript
// 图像几何变换
class Yx_opencv_Geom
{
public:
    Yx_opencv_Geom();
    ~Yx_opencv_Geom();
    QImage Resize(QImage src, int length, int width);
    QImage Enlarge_Reduce(QImage src, int times);
    QImage Rotate(QImage src, int angle);
    QImage Rotate_fixed(QImage src, int angle);
    QImage Flip(QImage src, int flipcode);
    QImage Lean(QImage src, int x, int y);
private:
    Yx_opencv_ImgChange *imgchangeClass;			// 大小类

};
```
```javascript
Yx_opencv_Geom::Yx_opencv_Geom()
{
    imgchangeClass = new Yx_opencv_ImgChange;
}

Yx_opencv_Geom::~Yx_opencv_Geom()
{
}

QImage Yx_opencv_Geom::Resize(QImage src, int length, int width)		// 改变大小
{
    Mat matSrc, matDst;
    matSrc = imgchangeClass->QImage2cvMat(src);
    resize(matSrc, matDst, Size(length, width), 0, 0, INTER_LINEAR);// 线性插值
    QImage dst = imgchangeClass->cvMat2QImage(matDst);
    return dst;
}

QImage Yx_opencv_Geom::Enlarge_Reduce(QImage src, int times)			// 缩放
{
    Mat matSrc, matDst;
    matSrc = imgchangeClass->QImage2cvMat(src);
    if (times > 0)
    {
        resize(matSrc, matDst, Size(matSrc.cols * abs(times+1), matSrc.rows * abs(times+1)), 0, 0, INTER_LINEAR);
        QImage dst = imgchangeClass->cvMat2QImage(matDst);
        return dst;
    }
    else if (times < 0)
    {
        resize(matSrc, matDst, Size(matSrc.cols / abs(times-1), matSrc.rows / abs(times-1)), 0, 0, INTER_AREA);
        QImage dst = imgchangeClass->cvMat2QImage(matDst);
        return dst;
    }
    else
    {
        return src;
    }
}

QImage Yx_opencv_Geom::Rotate(QImage src, int angle)							// 旋转
{
    Mat matSrc, matDst,M;
    matSrc = imgchangeClass->QImage2cvMat(src);
    cv::Point2f center(matSrc.cols / 2, matSrc.rows / 2);
    cv::Mat rot = cv::getRotationMatrix2D(center, angle, 1);
    cv::Rect bbox = cv::RotatedRect(center, matSrc.size(), angle).boundingRect();

    rot.at<double>(0, 2) += bbox.width / 2.0 - center.x;
    rot.at<double>(1, 2) += bbox.height / 2.0 - center.y;

    cv::warpAffine(matSrc, matDst, rot, bbox.size());
    QImage dst = imgchangeClass->cvMat2QImage(matDst);
    return dst;
}

QImage Yx_opencv_Geom::Rotate_fixed(QImage src, int angle)					// 旋转90，180，270
{
    Mat matSrc, matDst, M;
    matSrc = imgchangeClass->QImage2cvMat(src);
    M = getRotationMatrix2D(Point2i(matSrc.cols / 2, matSrc.rows / 2), angle, 1);
    warpAffine(matSrc, matDst, M, Size(matSrc.cols, matSrc.rows));
    QImage dst = imgchangeClass->cvMat2QImage(matDst);
    return dst;
}

QImage Yx_opencv_Geom::Flip(QImage src, int flipcode)							// 镜像
{
    Mat matSrc, matDst;
    matSrc = imgchangeClass->QImage2cvMat(src);
    flip(matSrc, matDst, flipcode);			// flipCode==0 垂直翻转（沿X轴翻转）,flipCode>0 水平翻转（沿Y轴翻转）
        // flipCode<0 水平垂直翻转（先沿X轴翻转，再沿Y轴翻转，等价于旋转180°）
    QImage dst = imgchangeClass->cvMat2QImage(matDst);
    return dst;
}

QImage Yx_opencv_Geom::Lean(QImage src, int x, int y)						// 倾斜
{
    Mat matSrc, matTmp, matDst;
    matSrc = imgchangeClass->QImage2cvMat(src);
    matTmp = Mat::zeros(matSrc.rows, matSrc.cols, matSrc.type());

    Mat map_x, map_y;
    Point2f src_point[3], tmp_point[3], x_point[3], y_point[3];
    double angleX = x / 180.0 * CV_PI ;
    double angleY = y / 180.0 * CV_PI;

    src_point[0] = Point2f(0, 0);
    src_point[1] = Point2f(matSrc.cols, 0);
    src_point[2] = Point2f(0, matSrc.rows);

    x_point[0] = Point2f(matSrc.rows * tan(angleX), 0);
    x_point[1] = Point2f(matSrc.cols + matSrc.rows * tan(angleX), 0);
    x_point[2] = Point2f(0, matSrc.rows);

    map_x = getAffineTransform(src_point, x_point);
    warpAffine(matSrc, matTmp, map_x, Size(matSrc.cols + matSrc.rows * tan(angleX), matSrc.rows));

    tmp_point[0] = Point2f(0, 0);
    tmp_point[1] = Point2f(matTmp.cols, 0);
    tmp_point[2] = Point2f(0, matTmp.rows);

    y_point[0] = Point2f(0, 0);
    y_point[1] = Point2f(matTmp.cols, matTmp.cols * tan(angleY));
    y_point[2] = Point2f(0, matTmp.rows);

    map_y = getAffineTransform(tmp_point, y_point);
    warpAffine(matTmp, matDst, map_y, Size(matTmp.cols, matTmp.rows + matTmp.cols * tan(angleY)));

    QImage dst = imgchangeClass->cvMat2QImage(matDst);
    return dst;
}

```
## opencv图像增强
**qt_opencv.h下Yx_opencv_Geom类**
```javascript
// 图像增强
class Yx_opencv_Gray
{
public:
    Yx_opencv_Gray();
    ~Yx_opencv_Gray();

    QImage Bin(QImage src, int threshold);
    QImage Graylevel(QImage src);
    QImage Reverse(QImage src);								// 图像反转
    QImage Linear(QImage src, int alpha, int beta);			// 线性变换
    QImage Gamma(QImage src, int gamma);					// 伽马变换(指数变换)
    QImage Log(QImage src, int c);							// 对数变换
    QImage Histeq(QImage src);								// 直方图均衡化

private:
    Yx_opencv_ImgChange *imgchangeClass;
};
```
```javascript

Yx_opencv_Gray::Yx_opencv_Gray()
{
    imgchangeClass = new Yx_opencv_ImgChange;
}

Yx_opencv_Gray::~Yx_opencv_Gray()
{
}

QImage Yx_opencv_Gray::Bin(QImage src, int threshold)			// 二值化
{
    Mat srcImg, dstImg,grayImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    if(srcImg.channels()!=1)
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    else
        dstImg = srcImg.clone();
    cv::threshold(grayImg, dstImg, threshold, 255, THRESH_BINARY);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Gray::Graylevel(QImage src)					// 灰度图像
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    dstImg.create(srcImg.size(), srcImg.type());
    if (srcImg.channels() != 1)
        cvtColor(srcImg, dstImg, CV_BGR2GRAY);
    else
        dstImg = srcImg.clone();
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Gray::Reverse(QImage src)								// 图像反转
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    bitwise_xor(srcImg, Scalar(255), dstImg);					// 异或
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}


QImage Yx_opencv_Gray::Linear(QImage src, int alpha, int beta)		// 线性变换
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    srcImg.convertTo(dstImg, -1, alpha/100.0, beta-100);		// matDst = alpha * matTmp + beta
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Gray::Gamma(QImage src, int gamma)				// 伽马变换(指数变换)
{
    if (gamma < 0)
        return src;

    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);

    Mat lookUpTable(1, 256, CV_8U);                                    // 查找表
    uchar* p = lookUpTable.ptr();
    for (int i = 0; i < 256; ++i)
        p[i] = saturate_cast<uchar>(pow(i / 255.0, gamma/100.0)*255.0);      // pow()是幂次运算

    LUT(srcImg, lookUpTable, dstImg);                                   // LUT

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Gray::Log(QImage src, int c)			// 对数变换
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);

    Mat lookUpTable(1, 256, CV_8U);                                    // 查找表
    uchar* p = lookUpTable.ptr();
    for (int i = 0; i < 256; ++i)
        p[i] = saturate_cast<uchar>((c/100.0)*log(1 + i / 255.0)*255.0);      // pow()是幂次运算

    LUT(srcImg, lookUpTable, dstImg);                                   // LUT

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Gray::Histeq(QImage src)								// 直方图均衡化
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);

    if (srcImg.channels() != 1)
        cvtColor(srcImg, srcImg, CV_BGR2GRAY);
    else
        dstImg = srcImg.clone();
    equalizeHist(srcImg, dstImg);                 // 直方图均衡化

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

```
## opencv图像腐蚀 
**qt_opencv.h下Yx_opencv_Gray类**
```javascript
// 图像腐蚀
class Yx_opencv_Morp
{
public:
    Yx_opencv_Morp();
    ~Yx_opencv_Morp();

    QImage Erode(QImage src, int elem,int kernel,int times,int,int);		// 腐蚀
    QImage Dilate(QImage src, int elem, int kernel, int times,int,int);		// 膨胀
    QImage Open(QImage src, int elem, int kernel, int times,int,int);		// 开运算
    QImage Close(QImage src, int elem, int kernel, int times,int,int);		// 闭运算
    QImage Grad(QImage src, int elem, int kernel,int,int,int);					// 形态学梯度
    QImage Tophat(QImage src, int elem, int kernel,int,int,int);				// 顶帽操作
    QImage Blackhat(QImage src, int elem, int kernel,int,int,int);				// 黑帽操作

private:
    Yx_opencv_ImgChange *imgchangeClass;
};
```
```javascript
Yx_opencv_Morp::Yx_opencv_Morp()
{
    imgchangeClass = new Yx_opencv_ImgChange;
}

Yx_opencv_Morp::~Yx_opencv_Morp()
{
}

QImage Yx_opencv_Morp::Erode(QImage src, int elem, int kernel, int times, int, int)		// 腐蚀
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    int erosion_type = 0;

    if (elem == 0) { erosion_type = MORPH_RECT; }
    else if (elem == 1) { erosion_type = MORPH_CROSS; }
    else if (elem == 2) { erosion_type = MORPH_ELLIPSE; }

    Mat element = getStructuringElement(erosion_type,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel+1, kernel+1));
    erode(srcImg, dstImg, element, Point(-1, -1), times);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Dilate(QImage src, int elem, int kernel, int times,int,int)		// 膨胀
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    int dilation_type = 0;
    if (elem == 0) { dilation_type = MORPH_RECT; }
    else if (elem == 1) { dilation_type = MORPH_CROSS; }
    else if (elem == 2) { dilation_type = MORPH_ELLIPSE; }
    Mat element = getStructuringElement(dilation_type, Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));
    dilate(srcImg, dstImg, element, Point(-1, -1), times);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Open(QImage src, int elem, int kernel, int times, int, int)		// 开运算
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    Mat element = getStructuringElement(elem,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));
    morphologyEx(srcImg, dstImg, MORPH_OPEN, element, Point(-1, -1), times);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Close(QImage src, int elem, int kernel, int times, int, int)		// 闭运算
{
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    Mat element = getStructuringElement(elem,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));
    morphologyEx(srcImg, dstImg, MORPH_CLOSE, element, Point(-1, -1), times);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Grad(QImage src, int elem, int kernel, int, int, int)		// 形态学梯度
{
    Mat srcImg, grayImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    Mat element = getStructuringElement(elem,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));

    if (srcImg.channels() != 1)
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    else
        grayImg = srcImg.clone();
    morphologyEx(grayImg, dstImg, MORPH_GRADIENT, element);

    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Tophat(QImage src, int elem, int kernel,int,int,int)		// 顶帽操作
{
    Mat srcImg, grayImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    Mat element = getStructuringElement(elem,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));
    if (srcImg.channels() != 1)
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    else
        grayImg = srcImg.clone();

    morphologyEx(grayImg, dstImg, MORPH_TOPHAT, element);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}

QImage Yx_opencv_Morp::Blackhat(QImage src, int elem, int kernel,int,int,int)	// 黑帽操作
{
    Mat srcImg, grayImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    Mat element = getStructuringElement(elem,Size(2 * kernel + 3, 2 * kernel + 3), Point(kernel + 1, kernel + 1));
    if (srcImg.channels() != 1)
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    else
        grayImg = srcImg.clone();
    morphologyEx(grayImg, dstImg, MORPH_BLACKHAT, element);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}


```
