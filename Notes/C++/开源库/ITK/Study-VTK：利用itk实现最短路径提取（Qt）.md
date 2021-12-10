![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827112717371.gif)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827112725617.gif)

有一个寻找最短路径的需求
搜索后发现这篇文章  
Fast Marching Minimal Path Extraction in ITK 
https://www.insight-journal.org/browse/publication/213
开源的作者08年写的，2019这个项目在git上还有更新。
作者使用了    梯度下降和正阶梯度下降。详细思路可以去git上下载pdf，有具体讲解
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827105532948.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
**我下文用的图像处理opencv、qt、itk都用了，不建议这样，最好只用一个。我是为了图快速完成，之前写过现成的就直接复制过来了。随后我会都改成只用qt的**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827105852934.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019082710592220.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827105949587.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019082711000070.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


作者给出案例使用的是  mhd（zraw）图，我们肯定需要png/bmp传入了。修改如下：
第一步      图片如果是彩色的做一个灰度变换、图片如果是二值图，把他拉到灰度

```javascript
QImage OpencvImgChange::cvMat2QImage(const Mat &mat) {  // Mat 改成 QImage
    if (mat.type() == CV_8UC1) {				// 单通道
        QImage image(mat.cols, mat.rows, QImage::Format_Indexed8);
        image.setColorCount(256);				// 灰度级数256
        for (int i = 0; i < 256; i++) {
            image.setColor(i, qRgb(i, i, i));
        }
        uchar *pSrc = mat.data;					// 复制mat数据
        for (int row = 0; row < mat.rows; row++) {
            uchar *pDest = image.scanLine(row);
            memcpy(pDest, pSrc, mat.cols);
            pSrc += mat.step;
        }
        return image;
    }

    else if (mat.type() == CV_8UC3) {			// 3通道
        const uchar *pSrc = (const uchar *)mat.data;			// 复制像素
        QImage image(pSrc, mat.cols, mat.rows, (int)mat.step, QImage::Format_RGB888);	// R, G, B 对应 0,1,2
        return image.rgbSwapped();				// rgbSwapped是为了显示效果色彩好一些。
    } else if (mat.type() == CV_8UC4) {
        const uchar *pSrc = (const uchar *)mat.data;			// 复制像素
        // Create QImage with same dimensions as input Mat
        QImage image(pSrc, mat.cols, mat.rows, (int)mat.step, QImage::Format_ARGB32);		// B,G,R,A 对应 0,1,2,3
        return image.copy();
    } else {
        return QImage();
    }
}

Mat OpencvImgChange::QImage2cvMat(QImage image) {		// QImage改成Mat
    Mat mat;
    switch (image.format()) {
    case QImage::Format_ARGB32:
    case QImage::Format_RGB32:
    case QImage::Format_ARGB32_Premultiplied:
        mat = Mat(image.height(), image.width(), CV_8UC4, (void *)image.constBits(), image.bytesPerLine());
        break;
    case QImage::Format_RGB888:
        mat = Mat(image.height(), image.width(), CV_8UC3, (void *)image.constBits(), image.bytesPerLine());
        cv::cvtColor(mat, mat, CV_BGR2RGB);
        break;
    case QImage::Format_Indexed8:
    case QImage::Format_Grayscale8:
        mat = Mat(image.height(), image.width(), CV_8UC1, (void *)image.constBits(), image.bytesPerLine());
        break;
    }
    return mat;
}
QImage OpencvGray::Graylevel(QImage src) {				// 灰度图像
    Mat srcImg, dstImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    dstImg.create(srcImg.size(), srcImg.type());
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, dstImg, CV_BGR2GRAY);
    } else {
        dstImg = srcImg.clone();
    }
    if (IsBin(dstImg)) {
        BinToGraylevel(dstImg);
    }
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}
oid OpencvGray::BinToGraylevel(Mat &image) {
    int w = image.cols;
    int h = image.rows;
    for (int row = 0; row < h; row++) {
        uchar *uc_pixel = image.data + row * image.step;
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


QImage OpencvGray::Bin(QImage src, int threshold) {		// 二值化
    Mat srcImg, dstImg, grayImg;
    srcImg = imgchangeClass->QImage2cvMat(src);
    if (srcImg.channels() != 1) {
        cvtColor(srcImg, grayImg, CV_BGR2GRAY);
    } else {
        dstImg = srcImg.clone();
    }
    cv::threshold(grayImg, dstImg, threshold, 255, THRESH_BINARY);
    QImage dst = imgchangeClass->cvMat2QImage(dstImg);
    return dst;
}
```


第二部 把案例接口类型转换，说白了就就是作者程序接受的是float类型并压缩后的zraw图片
我们就把png图片从char转换成float并压缩成二进制就好了（不压缩也可以，1024*1024的图片压缩和不压缩寻找路径时间差值在0.05s左右）

```
	constexpr unsigned int Dimension = 2;
	using FloatType = float  ;
	using CharType = unsigned char  ;
	using ImageFloatType = itk::Image< FloatType, Dimension >;
	using ImageCharType = itk::Image< CharType, Dimension >;
	using ReaderType = itk::ImageFileReader< ImageFloatType >;
	using WriterType = itk::ImageFileWriter< ImageCharType >;
	using PathType = itk::PolyLineParametricPath< Dimension >;
	using PathFilterType =
		itk::SpeedFunctionToPathFilter< ImageFloatType, PathType >;
	using CoordRepType = PathFilterType::CostFunctionType::CoordRepType;
	using PathIteratorType = itk::PathIterator< ImageCharType, PathType >;

//读取速度功能
        ReaderType::Pointer reader = ReaderType::New();
        reader->SetFileName(&png_name_constchar);
        reader->Update();
        ImageFloatType::Pointer speed = reader->GetOutput();
        speed->DisconnectPipeline();
        ImageFloatType::SizeType size = speed->GetLargestPossibleRegion().GetSize();
        ImageFloatType::IndexType pixelIndex;
        for (int i = 0; i < static_cast<int>(size[0]); i++) {
            for (int j = 0; j < static_cast<int>(size[1]); j++) {
                pixelIndex[0] = i;
                pixelIndex[1] = j;
                speed->SetPixel(pixelIndex,  1 - (speed->GetPixel(pixelIndex) / 255));
            }
        }
```

第三部 结果生成显示
作者在文章里指出，结果不支持输入输出，用户需要手动实现对文件的读写
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190827105232903.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
那我就把图片变成背景透明，让后叠加在背景图片上，用这两个函数

```
void MainWindow::CreateImageWithOverlay(
    const QImage &baseImage, QImage &overlayImage) {
    QImage imageWithOverlay = QImage(overlayImage.size(),
                                     QImage::Format_ARGB32_Premultiplied);
    QPainter painter(&imageWithOverlay);
    painter.fillRect(overlayImage.rect(), Qt::transparent);
    painter.drawImage(0, 0, baseImage);
    painter.drawImage(0, 0, overlayImage);
    painter.end();
    overlayImage = imageWithOverlay;
}

void MainWindow::ConvertImageToTransparent(QImage &baseImage) {
    baseImage = baseImage.convertToFormat(QImage::Format_ARGB32);
    union myrgb {
        uint rgba;
        uchar rgba_bits[4];
    };
    myrgb *mybits = (myrgb *) baseImage.bits();
    qint32 len = baseImage.width() * baseImage.height();
    while (len -- > 0) {
        mybits->rgba_bits[0] = 0;
        mybits->rgba_bits[1] = 0;
        mybits->rgba_bits[2] = (mybits->rgba == 0xFF000000) ? 0 : 255;
        mybits->rgba_bits[3] = (mybits->rgba == 0xFF000000) ? 0 : 255;
        mybits++;
    }
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019082710575964.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/201908271058235.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)