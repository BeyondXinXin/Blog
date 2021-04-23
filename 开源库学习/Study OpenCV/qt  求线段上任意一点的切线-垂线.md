![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830155355916.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830160541264.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

有一个线段
任意点（黄色）向前后各拓展4个像素
得到9*9的图像，取最前最后两个点（x1，y1）（x2，y2）
rad = atan2(y2 - y1, x2 - x1);可以求得该线倾斜角
y2 - y1/x2 - x1  可以求得该点处的斜率
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830160055285.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
倾斜角+90  -90  就是两个方向上的垂线
计算过程如下	

```javascript
 // 光栅化路径
        for (unsigned int i = 0; i < pathFilter->GetNumberOfOutputs(); i++) {
            PathType::Pointer path = pathFilter->GetOutput(i);
            // 检查路径有效
            if (path->GetVertexList()->Size() == 0) {
                std::cout << "WARNING: Path " << (i + 1) <<
                          " contains no points!" << std::endl;
                continue;
            }

            if (find_point) {
                qreal x1, x2, y1, y2, x, y;
                qreal rad01, rad02, rad;
                QMap <int, QMap< int, QPointF>> tmp_map;
                QMap<int, QPointF> tmp_point;
                const PathType::VertexListType *vertexList = path->GetVertexList();
                for (unsigned int i = 4; i < vertexList->Size() - 4; i = i + 4) {
                    x1 = vertexList->GetElement(i - 4)[0];
                    y1 = vertexList->GetElement(i - 4)[1];
                    x2 = vertexList->GetElement(i + 4)[0];
                    y2 = vertexList->GetElement(i + 4)[1];
                    x = vertexList->GetElement(i)[0];
                    y = vertexList->GetElement(i)[1];
                    rad = atan2(y2 - y1, x2 - x1);
                    rad01 = rad + 1.57;
                    rad02 = rad - 1.57;
                    for (int j = 1; j <= 15; j++) {
                        tmp_point[1] = QPointF(x + j * cos(rad01),
                                               y + j * sin(rad01));
                        tmp_point[2] = QPointF(x + j * cos(rad02),
                                               y + j * sin(rad02));
                        tmp_map[j] = tmp_point;
                    }
                    tmp_point[0] = QPointF(x, y);
                    tmp_map[0] = tmp_point;
                    point_list << tmp_map;
                }
            }
            // 迭代路径并转换为图像
            PathIteratorType it(output, path);
            for (it.GoToBegin(); !it.IsAtEnd(); ++it) {
                it.Set(itk::NumericTraits<CharType>::max());
            }
        }
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830160451158.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
画点和图片叠加就简单很多了	


```javascript
QPainter painter(&tmp_img_path);
QPen mypen;
mypen.setWidth(1);
mypen.setColor(Qt::blue);
QPen mypen1;
mypen1.setWidth(1);
mypen1.setColor(Qt::green);
painter.setPen(mypen);
painter.drawPoint(point_list.at(var)[i][1]);
painter.setPen(mypen1);
painter.drawPoint(point_list.at(var)[i][2]);
```

```javascript
QImage tmp_img_path = QImage("tmp/tmppng.png");
ConvertImageToTransparent(tmp_img_path);
CreateImageWithOverlay(img_background_, tmp_img_path);
```

```javascript
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



![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830155327640.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830155550474.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)![在这里插入图片描述](https://img-blog.csdnimg.cn/20190830155517674.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
