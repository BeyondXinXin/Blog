&emsp;&emsp;

---

# opencv 转 QImage

&emsp;&emsp;办法可能不是最优的，性能自己可以接受。

## 判断图片类型
1. 图片本身类型是`Float`，直接转换成`uchar`
2. 图片本身类型是`schar`，直接转换成`uchar`

## 判断图片通道
1. 单通道
&emsp;&emsp;构造一个跟图片尺寸一样，类型`Format_Indexed8`的图片。把像素索引改成0-255。`QImagescanLine`依次获取一列首地址，`memcpy`内存拷贝每次拷贝图片一列值。  
&emsp;&emsp;
&emsp;&emsp;
2. 三通道
&emsp;&emsp;`QImage`有一个构造函数，传入图片`data`首地址、长、宽、`step`、类型`Format_RGB888`，调用`rgbSwapped`。  
&emsp;&emsp;
&emsp;&emsp;
3. 四通道
&emsp;&emsp;`QImage`有一个构造函数，传入图片`data`首地址、长、宽、`step`、类型`Format_ARGB32`。  

## 具体代码




```cpp
    QImage OpencvUtil::Mat2QImage(const cv::Mat &mat) {
        if (mat.type() == CV_8UC1) {
            QImage image(mat.cols, mat.rows, QImage::Format_Indexed8);
            image.setColorCount(256);
            for (int i = 0; i < 256; i++) {
                image.setColor(i, qRgb(i, i, i));
            }
            uchar *pSrc = mat.data;
            for (int row = 0; row < mat.rows; row++) {
                uchar *pDest = image.scanLine(row);
                memcpy(pDest, pSrc, static_cast<quint32>(mat.cols) );
                pSrc += static_cast<quint32>(mat.step);
            }
            return image;
        } else if (mat.type() == CV_8UC3) {
            const uchar *pSrc = const_cast<const uchar *>(mat.data);
            QImage image(pSrc, mat.cols, mat.rows,
                         static_cast<qint32>(mat.step), QImage::Format_RGB888);
            return image.rgbSwapped();
        } else if (mat.type() == CV_8UC4) {
            const uchar *pSrc = const_cast<const uchar *>(mat.data);
            QImage image(pSrc, mat.cols, mat.rows,
                         static_cast<qint32>(mat.step), QImage::Format_ARGB32);
            return image.copy();
        } else if (mat.type() == 22) {
            cv::Mat src;
            mat.convertTo(src, CV_8UC3);
            const uchar *pSrc = const_cast<const uchar *>(src.data);
            QImage image(pSrc, src.cols, src.rows,
                         static_cast<qint32>(src.step), QImage::Format_RGB888);
            return image.rgbSwapped();
        } else {
            return QImage();
        }
    }
```