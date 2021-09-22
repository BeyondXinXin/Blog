&emsp;&emsp;没事看看代码，打发下时间

```cpp
#ifndef QOPENCVPROCESSING_H
#define QOPENCVPROCESSING_H

/**
 * qt封装
 * opencv 常用函数 输入输出参数转为qimage
 */

// 01 Frame includes
#include "stable.h"

// OPENCV includes
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/opencv.hpp"
#include <opencv2/core/core.hpp>

class QOpencvProcessing {
  public:
    QOpencvProcessing();
    ~QOpencvProcessing();
    static QOpencvProcessing *Instance();
    // 图像转换
    QImage cvMat2QImage(const cv::Mat &mat);// Mat 改成 QImage
    cv::Mat QImage2cvMat(QImage image);// QImage 改成 Mat
    QImage splitBGR(QImage src, int color);	// 提取RGB分量
    QImage splitColor(QImage src, cv::String model, int color);// 提取分量
    // 图像几何变换
    void Resize(QImage &src, int length, int width);// 改变大小
    void Enlarge_Reduce(QImage &src, int times);// 缩放
    void Rotate(QImage &src, int angle);// 旋转
    void Rotate_fixed(QImage &src, int angle);// 旋转90，180，270
    void Flip(QImage &src, int flipcode);// 镜像
    void Lean(QImage &src, int x, int y);// 倾斜
    // 图像增强
    QImage Normalized(QImage src, int kernel_length);// 简单滤波
    QImage Gaussian(QImage src, int kernel_length);	// 高斯滤波
    QImage Median(QImage src, int kernel_length);// 中值滤波
    QImage Sobel(QImage src, int kernel_length);// sobel边缘检测
    QImage Laplacian(QImage src, int kernel_length);// laplacian边缘检测
    QImage Canny(QImage src, int kernel_length, int lowThreshold);// canny边缘检测
    QImage HoughLine(
        QImage src, int threshold, double minLineLength, double maxLineGap);// 线检测
    QImage HoughCircle(QImage src, int minRadius, int maxRadius);// 圆检测
    // 灰度变化
    QImage Bin(QImage src, int threshold);
    QImage Graylevel(QImage src);
    QImage Reverse(QImage src);								// 图像反转
    QImage Linear(QImage src, int alpha, int beta);			// 线性变换
    QImage Gamma(QImage src, int gamma);					// 伽马变换(指数变换)
    QImage Log(QImage src, int c);							// 对数变换
    QImage Histeq(QImage src);								// 直方图均衡化
    void BinToGraylevel(cv::Mat &image);
    bool IsBin(cv::Mat &image);
    // 图像腐蚀
    QImage Erode(QImage src, int elem, int kernel, int times);// 腐蚀
    QImage Dilate(QImage src, int elem, int kernel, int times);// 膨胀
    QImage Open(QImage src, int elem, int kernel, int times);// 开运算
    QImage Close(QImage src, int elem, int kernel, int times);// 闭运算
    QImage Grad(QImage src, int elem, int kernel);// 形态学梯度
    QImage Tophat(QImage src, int elem, int kernel);// 顶帽操作
    QImage Blackhat(QImage src, int elem, int kernel);// 黑帽操作
  private:
    static QScopedPointer<QOpencvProcessing> self;
};
#endif // QOPENCVPROCESSING_H
```

```cpp
// 01 Frame includes
#include "qopencvprocessing.h"
#include "quihelper.h"

using namespace cv;
using namespace std;

QScopedPointer<QOpencvProcessing> QOpencvProcessing::self;
QOpencvProcessing *QOpencvProcessing::Instance() {
    if (self.isNull()) {
        QMutex mutex;
        QMutexLocker locker(&mutex);
        if (self.isNull()) {
            self.reset(new QOpencvProcessing);
        }
    }
    return self.data();
}
QOpencvProcessing::QOpencvProcessing() {

}

QOpencvProcessing::~QOpencvProcessing() {
}

// 图像转换

QImage QOpencvProcessing::cvMat2QImage(const Mat &mat) {  // Mat 改成 QImage
    if (mat.type() == CV_8UC1) {				// 单通道
        QImage image(mat.cols, mat.rows, QImage::Format_Indexed8);
        image.setColorCount(256);				// 灰度级数256
        for (int i = 0; i < 256; i++) {
            image.setColor(i, qRgb(i, i, i));
        }
        uchar *pSrc = mat.data;					// 复制mat数据
        for (int row = 0; row < mat.rows; row++) {
            uchar *pDest = image.scanLine(row);
            memcpy(pDest, pSrc, static_cast<unsigned long>(mat.cols));
            pSrc += static_cast<long>(mat.step);
        }
        return image;
    } else if (mat.type() == CV_8UC3) {			// 3通道
        const uchar *pSrc = const_cast<const uchar *>(mat.data);			// 复制像素
        QImage image(pSrc, mat.cols, mat.rows,
                     static_cast<int>(mat.step), QImage::Format_RGB888);
        // R, G, B 对应 0,1,2
        return image.rgbSwapped();				// rgbSwapped是为了显示效果色彩好一些。
    } else if (mat.type() == CV_8UC4) {
        const uchar *pSrc = const_cast<const uchar *>(mat.data);			// 复制像素
        // Create QImage with same dimensions as input Mat
        QImage image(pSrc, mat.cols, mat.rows,
                     static_cast<int>(mat.step), QImage::Format_ARGB32);
        // B,G,R,A 对应 0,1,2,3
        return image.copy();
    } else {
        return QImage();
    }
}

Mat QOpencvProcessing::QImage2cvMat(QImage image) {		// QImage改成Mat
    Mat mat;
    switch (image.format()) {
        case QImage::Format_ARGB32:
        case QImage::Format_RGB32:
        case QImage::Format_ARGB32_Premultiplied:
            mat = Mat(image.height(), image.width(), CV_8UC4,
                      (void *)image.constBits(), static_cast<unsigned long>(
                          image.bytesPerLine()));
            break;
        case QImage::Format_RGB888:
            mat = Mat(image.height(), image.width(), CV_8UC3,
                      (void *)image.constBits(), static_cast<unsigned long>(
                          image.bytesPerLine()));
            cv::cvtColor(mat, mat, CV_BGR2RGB);
            break;
        case QImage::Format_Indexed8:
        case QImage::Format_Grayscale8:
            mat = Mat(image.height(), image.width(), CV_8UC1,
                      (void *)image.constBits(), static_cast<unsigned long>(
                          image.bytesPerLine()));
            break;
    }
    return mat;
}

QImage QOpencvProcessing::splitBGR(QImage src, int color) {		// 提取RGB分量
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    if (srcImg.channels() == 1) {
        QMessageBox message(QMessageBox::Information,
                            QString::fromLocal8Bit("提示"),
                            QString::fromLocal8Bit("该图像为灰度图像。"));
        message.exec();
        return src;
    } else {
        vector<Mat> m;
        split(srcImg, m);
        vector<Mat>Rchannels, Gchannels, Bchannels;
        split(srcImg, Rchannels);
        split(srcImg, Gchannels);
        split(srcImg, Bchannels);
        Rchannels[1] = 0;
        Rchannels[2] = 0;
        Gchannels[0] = 0;
        Gchannels[2] = 0;
        Bchannels[0] = 0;
        Bchannels[1] = 0;
        merge(Rchannels, m[0]);
        merge(Gchannels, m[1]);
        merge(Bchannels, m[2]);

        dstImg = m[static_cast<unsigned long>(color)];		// 分别对应B、G、R
        QImage dst = cvMat2QImage(dstImg);
        return dst;
    }
}

QImage QOpencvProcessing::splitColor(
    QImage src, String model, int color) {	// 提取分量
    if (model == "RGB") {
        Mat srcImg, dstImg;
        srcImg = QImage2cvMat(src);
        if (srcImg.channels() == 1) {
            QMessageBox message(QMessageBox::Information,
                                QString::fromLocal8Bit("提示"),
                                QString::fromLocal8Bit("该图像为灰度图像。"));
            message.exec();
            return src;
        } else {
            vector<Mat> m;
            split(srcImg, m);
            vector<Mat>Rchannels, Gchannels, Bchannels;
            split(srcImg, Rchannels);
            split(srcImg, Gchannels);
            split(srcImg, Bchannels);
            Rchannels[1] = 0;
            Rchannels[2] = 0;
            Gchannels[0] = 0;
            Gchannels[2] = 0;
            Bchannels[0] = 0;
            Bchannels[1] = 0;
            merge(Rchannels, m[0]);
            merge(Gchannels, m[1]);
            merge(Bchannels, m[2]);
            dstImg = m[static_cast<unsigned long>(color)];		// 分别对应B、G、R
            QImage dst = cvMat2QImage(dstImg);
            return dst;
        }
    } else {
        Mat img = QImage2cvMat(src);
        Mat img_rgb, img_hsv, img_hls, img_yuv, img_dst;
        if (img.channels() == 1) {
            QUIHelper::ShowMessageBoxError("该图像为灰度图像。");
            return src;
        } else {
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
            if (model == "RGB") {
                img_dst = vecRGB[static_cast<unsigned long>(color)];
            } else if (model == "HSV") {
                img_dst = vecHsv[static_cast<unsigned long>(color)];
            } else if (model == "HLS") {
                img_dst = vecHls[static_cast<unsigned long>(color)];
            } else if (model == "YUV") {
                img_dst = vecYuv[static_cast<unsigned long>(color)];
            } else {
                img_dst = img;
            }
            QImage dst = cvMat2QImage(img_dst);
            return dst;
        }
    }
}


// 图像几何变换

void QOpencvProcessing::Resize(QImage &src, int length, int width) {
    // 改变大小
    Mat matSrc, matDst;
    matSrc = QImage2cvMat(src);
    resize(matSrc, matDst, Size(length, width), 0, 0, CV_INTER_LINEAR);// 线性插值
    src = cvMat2QImage(matDst);
}

void QOpencvProcessing::Enlarge_Reduce(QImage &src, int times) {
    // 缩放
    Mat matSrc, matDst;
    matSrc = QImage2cvMat(src);
    if (times > 0) {
        resize(matSrc, matDst, Size(matSrc.cols * abs(times + 1),
                                    matSrc.rows * abs(times + 1))
               , 0, 0, INTER_LINEAR);
        src = cvMat2QImage(matDst);
        return ;
    } else if (times < 0) {
        resize(matSrc, matDst, Size(matSrc.cols / abs(times - 1),
                                    matSrc.rows / abs(times - 1))
               , 0, 0, INTER_AREA);
        src = cvMat2QImage(matDst);
        return ;
    } else {
        return ;
    }
}

void QOpencvProcessing::Rotate(QImage &src, int angle) {
    // 旋转
    Mat matSrc, matDst, M;
    matSrc = QImage2cvMat(src);
    cv::Point2f center(matSrc.cols / 2, matSrc.rows / 2);
    cv::Mat rot = cv::getRotationMatrix2D(center, angle, 1);
    cv::Rect bbox = cv::RotatedRect(center, matSrc.size(), angle).boundingRect();
    ;
    rot.at<double>(0, 2) += bbox.width / 2.0 - static_cast<double>(center.x);
    rot.at<double>(1, 2) += bbox.height / 2.0 - static_cast<double>(center.y);

    cv::warpAffine(matSrc, matDst, rot, bbox.size());
    src = cvMat2QImage(matDst);
    return ;
}

void QOpencvProcessing::Rotate_fixed(QImage &src, int angle) {
    // 旋转90，180，270
    Mat matSrc, matDst, M;
    matSrc = QImage2cvMat(src);
    M = getRotationMatrix2D(Point2i(matSrc.cols / 2, matSrc.rows / 2), angle, 1);
    warpAffine(matSrc, matDst, M, Size(matSrc.cols, matSrc.rows));
    src = cvMat2QImage(matDst);
    return ;
}

void QOpencvProcessing::Flip(QImage &src, int flipcode) {
    // 镜像
    Mat matSrc, matDst;
    matSrc = QImage2cvMat(src);
    flip(matSrc, matDst, flipcode);
    // flipCode==0 垂直翻转（沿X轴翻转）,flipCode>0 水平翻转（沿Y轴翻转）
    // flipCode<0 水平垂直翻转（先沿X轴翻转，再沿Y轴翻转，等价于旋转180°）
    src = cvMat2QImage(matDst);
    return ;
}

void QOpencvProcessing::Lean(QImage &src, int x, int y) {
    // 倾斜
    Mat matSrc, matTmp, matDst;
    matSrc = QImage2cvMat(src);
    matTmp = Mat::zeros(matSrc.rows, matSrc.cols, matSrc.type());

    Mat map_x, map_y;
    Point2f src_point[3], tmp_point[3], x_point[3], y_point[3];
    double angleX = x / 180.0 * CV_PI ;
    double angleY = y / 180.0 * CV_PI;

    src_point[0] = Point2f(0, 0);
    src_point[1] = Point2f(matSrc.cols, 0);
    src_point[2] = Point2f(0, matSrc.rows);

    x_point[0] = Point2f(static_cast<float>(matSrc.rows) *
                         static_cast<float>(tan(angleX)), 0);
    x_point[1] = Point2f(static_cast<int>(matSrc.cols + matSrc.rows * tan(angleX)), 0);
    x_point[2] = Point2f(0, matSrc.rows);

    map_x = getAffineTransform(src_point, x_point);
    warpAffine(matSrc, matTmp, map_x,
               Size(static_cast<int>(matSrc.cols + matSrc.rows * tan(angleX)),
                    matSrc.rows));

    tmp_point[0] = Point2f(0, 0);
    tmp_point[1] = Point2f(matTmp.cols, 0);
    tmp_point[2] = Point2f(0, matTmp.rows);

    y_point[0] = Point2f(0, 0);
    y_point[1] = Point2f(matTmp.cols, static_cast<float>(matTmp.cols * tan(angleY)));
    y_point[2] = Point2f(0, matTmp.rows);

    map_y = getAffineTransform(tmp_point, y_point);
    warpAffine(matTmp, matDst, map_y,
               Size(matTmp.cols, static_cast<int>
                    (matTmp.rows + matTmp.cols * tan(angleY))));

    src = cvMat2QImage(matDst);
    return ;
}


// 图像增强
QImage QOpencvProcessing::Normalized(QImage src, int kernel_length) {
    // 简单滤波
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    blur(srcImg, dstImg, Size(kernel_length, kernel_length), Point(-1, -1));
    return cvMat2QImage(dstImg);
}

QImage QOpencvProcessing::Gaussian(QImage src, int kernel_length) {
    // 高斯滤波
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    GaussianBlur(srcImg, dstImg, Size(kernel_length, kernel_length), 0, 0);
    return cvMat2QImage(dstImg);
}

QImage QOpencvProcessing::Median(QImage src, int kernel_length) {
    // 中值滤波
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    medianBlur(srcImg, dstImg, kernel_length);
    return cvMat2QImage(dstImg);
}

QImage QOpencvProcessing::HoughLine(
    QImage src, int threshold, double minLineLength, double maxLineGap) {
    // 线检测
    Mat srcImg, dstImg, cdstPImg;
    srcImg = QImage2cvMat(src);

    cv::Canny(srcImg, dstImg, 50, 200, 3);             // Canny算子边缘检测
    if (srcImg.channels() != 1) {
        cvtColor(dstImg, cdstPImg, COLOR_GRAY2BGR);    // 转换灰度图像
    } else {
        cdstPImg = srcImg;
    }

    vector<Vec4i> linesP;
    HoughLinesP(dstImg, linesP, 1, CV_PI / 180, threshold, minLineLength, maxLineGap);
    // 50,50,10
    for (size_t i = 0; i < linesP.size(); i++) {
        Vec4i l = linesP[i];
        line(cdstPImg, Point(l[0], l[1]),
             Point(l[2], l[3]), Scalar(0, 0, 255), 1, LINE_AA);
    }
    return cvMat2QImage(cdstPImg);

}

QImage QOpencvProcessing::HoughCircle(QImage src, int minRadius, int maxRadius) {
    // 圆检测
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat gray;
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, gray, COLOR_BGR2GRAY);
    } else {
        gray = srcImg;
    }
    medianBlur(gray, gray, 5);              // 中值滤波，滤除噪声，避免错误检测

    vector<Vec3f> circles;
    HoughCircles(gray, circles, HOUGH_GRADIENT, 1,
                 gray.rows / 16, 100, 30, minRadius, maxRadius);
    // Hough圆检测,100, 30, 1, 30
    dstImg = srcImg.clone();

    for (size_t i = 0; i < circles.size(); i++) {
        Vec3i c = circles[i];
        Point center = Point(c[0], c[1]);
        circle(dstImg, center, 1, Scalar(0, 100, 100), 3, LINE_AA);
        // 画圆
        int radius = c[2];
        circle(dstImg, center, radius, Scalar(255, 0, 255), 3, LINE_AA);
    }

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Sobel(QImage src, int kernel_length) {
    // sobel
    Mat srcImg, dstImg, src_gray;
    srcImg = QImage2cvMat(src);

    GaussianBlur(srcImg, srcImg, Size(3, 3), 0, 0, BORDER_DEFAULT);     // 高斯模糊
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);    // 转换灰度图像
    } else {
        src_gray = srcImg;
    }

    Mat grad_x, grad_y, abs_grad_x, abs_grad_y;

    cv::Sobel(src_gray, grad_x, CV_16S, 1, 0, kernel_length, 1, 0, BORDER_DEFAULT);
    cv::Sobel(src_gray, grad_y, CV_16S, 0, 1, kernel_length, 1, 0, BORDER_DEFAULT);

    convertScaleAbs(grad_x, abs_grad_x);            // 缩放，计算绝对值，并将结果转换为8位
    convertScaleAbs(grad_y, abs_grad_y);

    addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, dstImg);

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Laplacian(QImage src, int kernel_length) {
    // laplacian
    Mat srcImg, dstImg, src_gray;
    srcImg = QImage2cvMat(src);

    GaussianBlur(srcImg, srcImg, Size(3, 3), 0, 0, BORDER_DEFAULT);       // 高斯模糊

    if (srcImg.channels() != 1) {
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);    // 转换灰度图像
    } else {
        src_gray = srcImg;
    }

    Mat abs_dst;                                                    // 拉普拉斯二阶导数
    cv::Laplacian(src_gray, dstImg, CV_16S, kernel_length, 1, 0, BORDER_DEFAULT);

    convertScaleAbs(dstImg, dstImg);                                  // 绝对值8位
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Canny(QImage src, int kernel_length, int lowThreshold) {
    // canny
    Mat srcImg, dstImg, src_gray, detected_edges;
    srcImg = QImage2cvMat(src);

    dstImg.create(srcImg.size(), srcImg.type());
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, src_gray, COLOR_BGR2GRAY);    // 转换灰度图像
    } else {
        src_gray = srcImg;
    }
    blur(src_gray, detected_edges, Size(3, 3));
    // 平均滤波平滑
    cv::Canny(detected_edges, detected_edges, lowThreshold,
              lowThreshold * 3, kernel_length);
    dstImg = Scalar::all(0);
    srcImg.copyTo(dstImg, detected_edges);

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

bool QOpencvProcessing::IsBin(Mat &image) {
    int w = image.cols;
    int h = image.rows;
    for (int row = 0; row < h; row++) {
        uchar *uc_pixel = image.data + static_cast<unsigned long>(row) * image.step;
        for (int col = 0; col < w; col++) {
            if ((uc_pixel[0] >= 20) && (uc_pixel[0] <= 235)) {
                qDebug() << uc_pixel[0];
                return false;
            }
            uc_pixel += 3;
        }
    }
    return true;
}

void QOpencvProcessing::BinToGraylevel(Mat &image) {
    int w = image.cols;
    int h = image.rows;
    for (int row = 0; row < h; row++) {
        uchar *uc_pixel = image.data +  static_cast<unsigned long>(row) * image.step;
        for (int col = 0; col < w; col++) {
            if (uc_pixel[0] <= 20) {
                uc_pixel[0] = 50;
            }
            if (uc_pixel[0] >= 235) {
                uc_pixel[0] = 150;
            }
            uc_pixel += 1;
        }
    }
}

// 灰度变化

QImage QOpencvProcessing::Bin(QImage src, int threshold) {		// 二值化
    Mat srcImg, dstImg, grayImg;
    srcImg = QImage2cvMat(src);
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    } else {
        dstImg = srcImg.clone();
    }
    cv::threshold(grayImg, dstImg, threshold, 255, THRESH_BINARY);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Graylevel(QImage src) {				// 灰度图像
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    dstImg.create(srcImg.size(), srcImg.type());
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, dstImg, CV_BGR2GRAY);
    } else {
        dstImg = srcImg.clone();
    }
    if (IsBin(dstImg)) {
        BinToGraylevel(dstImg);
    }
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Reverse(QImage src) {
    // 图像反转
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    bitwise_xor(srcImg, Scalar(255), dstImg);
    // 异或
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Linear(QImage src, int alpha, int beta) {
    // 线性变换
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    srcImg.convertTo(dstImg, -1, alpha / 100.0, beta - 100);
    // matDst = alpha * matTmp + beta
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Gamma(QImage src, int gamma) {
    // 伽马变换(指数变换)
    if (gamma < 0) {
        return src;
    }

    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);

    Mat lookUpTable(1, 256, CV_8U);
    // 查找表
    uchar *p = lookUpTable.ptr();
    for (int i = 0; i < 256; ++i) {
        p[i] = saturate_cast<uchar>(pow(i / 255.0, gamma / 100.0) * 255.0);
        // pow()是幂次运算
    }

    LUT(srcImg, lookUpTable, dstImg);
    // LUT

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Log(QImage src, int c) {
    // 对数变换
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);

    Mat lookUpTable(1, 256, CV_8U);
    // 查找表
    uchar *p = lookUpTable.ptr();
    for (int i = 0; i < 256; ++i) {
        p[i] = saturate_cast<uchar>((c / 100.0) * log(1 + i / 255.0) * 255.0);
        // pow()是幂次运算
    }

    LUT(srcImg, lookUpTable, dstImg);
    // LUT

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Histeq(QImage src) {
    // 直方图均衡化
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);

    if (srcImg.channels() != 1) {
        cvtColor(srcImg, srcImg, CV_BGR2GRAY);
    } else {
        dstImg = srcImg.clone();
    }
    equalizeHist(srcImg, dstImg);
    // 直方图均衡化

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

// 图像腐蚀

QImage QOpencvProcessing::Erode(QImage src, int elem, int kernel, int times) {
    // 腐蚀
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    int erosion_type = 0;

    if (elem == 0) {
        erosion_type = MORPH_RECT;
    } else if (elem == 1) {
        erosion_type = MORPH_CROSS;
    } else if (elem == 2) {
        erosion_type = MORPH_ELLIPSE;
    }

    Mat element = getStructuringElement(
                      erosion_type, Size(2 * kernel + 3, 2 * kernel + 3),
                      Point(kernel + 1, kernel + 1));
    erode(srcImg, dstImg, element, Point(-1, -1), times);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Dilate(QImage src, int elem, int kernel, int times) {
    // 膨胀
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    int dilation_type = 0;
    if (elem == 0) {
        dilation_type = MORPH_RECT;
    } else if (elem == 1) {
        dilation_type = MORPH_CROSS;
    } else if (elem == 2) {
        dilation_type = MORPH_ELLIPSE;
    }
    Mat element = getStructuringElement(dilation_type,
                                        Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));
    dilate(srcImg, dstImg, element, Point(-1, -1), times);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Open(QImage src, int elem, int kernel, int times) {
    // 开运算
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat element = getStructuringElement(elem, Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));
    morphologyEx(srcImg, dstImg, MORPH_OPEN, element, Point(-1, -1), times);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Close(QImage src, int elem, int kernel, int times) {
    // 闭运算
    Mat srcImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat element = getStructuringElement(elem, Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));
    morphologyEx(srcImg, dstImg, MORPH_CLOSE, element, Point(-1, -1), times);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Grad(QImage src, int elem, int kernel) {
    // 形态学梯度
    Mat srcImg, grayImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat element = getStructuringElement(elem, Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));

    if (srcImg.channels() != 1) {
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    } else {
        grayImg = srcImg.clone();
    }
    morphologyEx(grayImg, dstImg, MORPH_GRADIENT, element);

    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Tophat(QImage src, int elem, int kernel) {
    // 顶帽操作
    Mat srcImg, grayImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat element = getStructuringElement(elem, Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    } else {
        grayImg = srcImg.clone();
    }

    morphologyEx(grayImg, dstImg, MORPH_TOPHAT, element);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}

QImage QOpencvProcessing::Blackhat(QImage src, int elem, int kernel) {
    // 黑帽操作
    Mat srcImg, grayImg, dstImg;
    srcImg = QImage2cvMat(src);
    Mat element = getStructuringElement(elem, Size(2 * kernel + 3, 2 * kernel + 3),
                                        Point(kernel + 1, kernel + 1));
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    } else {
        grayImg = srcImg.clone();
    }
    morphologyEx(grayImg, dstImg, MORPH_BLACKHAT, element);
    QImage dst = cvMat2QImage(dstImg);
    return dst;
}


```
