# qt  图像组合  图像变灰度  图像透明

图像处理一般都是在opencv/vtk/itk/halcon里做的,qt用来显示
偶尔有很简单图像操作小需求,调用第三方库很麻烦,我这里记录下自己每次有需要临时写的
单纯qt对像素的操作简单的图像处理



## 只用qt实现彩色变灰度

```javascript
for (int i = 0; i < srcImage.width(); i++)
    {
        for (int j= 0; j < srcImage.height(); j++)
        {
            QRgb color = srcImage.pixel(i, j);
            int gray = qGray(color);
            srcImage.setPixel(i, j, qRgba(gray, gray, gray, qAlpha(color)));
        }
    }
```

## 只用qt实现图像透明	

```javascript
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
```

## 只用qt实现图像拼接	

```javascript
    QImage imageWithOverlay = QImage(overlayImage.size(),
                                     QImage::Format_ARGB32_Premultiplied);
    QPainter painter(&imageWithOverlay);
    painter.fillRect(overlayImage.rect(), Qt::transparent);
    painter.drawImage(0, 0, baseImage);
    painter.drawImage(0, 0, overlayImage);
    painter.end();
    overlayImage = imageWithOverlay;
```

## 只用qt实现差值缩放图片

```javascript
full_screen->copy(x, y, w, h)
    .scaled(480, 480, Qt::KeepAspectRatio, Qt::SmoothTransformation)
    .save(file_path, "bmp");
```
