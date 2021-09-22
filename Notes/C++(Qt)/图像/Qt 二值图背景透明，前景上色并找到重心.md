# Qt 二值图背景透明，前景上色并找到重心


@[TOC](Qt 二值图背景透明，前景上色并找到重心)

# 需求
&emsp;&emsp;把二值图前景换成任意颜色，背景透明，并提取重心。有很多方法可以实现，需求如果跟我一样可以参考下。

# 效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201016084554747.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201016084609793.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201016084643111.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201016084706528.png#pic_center)
# 剔除背景
&emsp;&emsp;**QImage**图片转换成**Format_Indexed8**类型，可以获取图片的ColorTable。让后把ColorTable的背景色换成自定义的。

```cpp
static QImage ConvertImageToTransparent(
       QImage image,
       const QRgb &rgb_show = QColor(255, 0, 0).rgb(),
       const QRgb &rgb_bg = QColor(0, 0, 0, 0).rgba());
QImage AspectsLabel::ConvertImageToTransparent(
    QImage image, const QRgb &rgb_show, const QRgb &rgb_bg) {
    QPoint ponit = QPoint(0, 0);
    image = image.convertToFormat(QImage::Format_Indexed8);
    if(image.valid(ponit)) {
        QRgb rgb = image.pixel(ponit);
        QVector<QRgb> rgbVector = image.colorTable();
        for (int i = 0; i < rgbVector.size(); ++i) {
            if(rgbVector.at(i) == rgb ) {
                image.setColor(i, rgb_bg);
            } else {
                image.setColor(i, rgb_show);
            }
        }
    }
    return image ;
}
```
# 获取图片重心
&emsp;&emsp;QImage没有现成的函数，除非自己遍历像素计算。干脆用opencv吧

```cpp
static void GravityCenter(QString name, QPointF &center, const qint32 &length);
void AspectsLabel::GravityCenter(QString name, QPointF &center, const qint32 &length) {
    using namespace cv;
    Mat src = imread(name.toLocal8Bit().data(), 0);
    threshold(src, src, 0, 255, THRESH_OTSU);
    vector<vector<Point>>contours;
    vector<Vec4i>hierarchy;
    findContours(src, contours, hierarchy, RETR_TREE, CHAIN_APPROX_SIMPLE, Point());
    if (contours.size() == 1) {
        Mat tmp(contours.at(0));
        Moments moment = moments(tmp, false);
        center.setX(cvRound(moment.m10 / moment.m00) - 5);
        center.setY(cvRound(moment.m01 / moment.m00) + length);
    }
}
```
# 图片叠加
&emsp;&emsp;用QPainter一直画就行了

```cpp
    painter->save();
    qint32 length_blank = abs(width() - height()) / 2;
    qint32 length_pic = this->width() > this->height() ? this->height() : this->width();
    QString pixpath_center = Global::cur_session_.GetFileName(SessionRecord::Asp_Result) +
                             Global::asplist_.at(FileName::Asp_ResultImgs);
    QImage pix =
        QImage(pixpath_center + QString("/%1_src.png").arg(cur_id_));
    QRect pix_rect;
    pix_rect = this->width() > this->height() ?
               QRect(length_blank, 0, length_pic, length_pic) :
               QRect(0, length_blank, length_pic, length_pic);
    painter->drawPixmap(pix_rect, QPixmap::fromImage(pix));
    //
    if(Source == style_) {
        painter->restore();
        return;
    }
    QList<RegionType> region;
    if(this->cur_id_ >= 16 && this->cur_id_ <= 18) {
        region << nuclear_;
    } else if(this->cur_id_ >= 19 && this->cur_id_ <= 21) {
        region << nuclear_up_;
    }
    //
    foreach (auto var, region) {
        QString name = pixpath_center + filelist_region_.at(var).arg(cur_id_);
        QPointF center;
        QRgb rgb_show;
        if(show_tran_) {
            rgb_show = QColor("#" + rgb_list_.at(var)).rgba();
        } else {
            rgb_show = QColor("#80" + rgb_list_.at(var)).rgba();
        }
        pix = ConvertImageToTransparent(QImage(name + "L.png"), rgb_show);
        GravityCenter((name + "L.png"), center, length_blank);
        painter->drawPixmap(pix_rect, QPixmap::fromImage(pix));
        pix = ConvertImageToTransparent(QImage(name + "R.png"), rgb_show);
        GravityCenter((name + "R.png"), center, length_blank);
        painter->drawPixmap(pix_rect, QPixmap::fromImage(pix));
    }
    foreach (auto var, region) {
        QString name = pixpath_center + filelist_region_.at(var).arg(cur_id_);
        QPointF center;
        QString title = "";
        QMap<QString, QVariant> result_map;
        QFont font;
        painter->setPen(Qt::white);
        font.setPointSize(18);
        painter->setFont(font);
        if(show_tag_) {
            title = title_list_.at(var);
        }
        if(show_value_) {
            QString xml_path =
                Global::cur_session_.GetFileName(SessionRecord::Asp_Result) +
                Global::asplist_.at(FileName::Asp_ResultXml);
            XmlUtil::ReadOpencvXml(xml_path, result_map); // 读取文件
        }
        GravityCenter((name + "L.png"), center, length_blank);
        if(show_value_) {
            title = result_map[
                        QString("_%1%2L").arg(cur_id_).arg(title_list_.at(var))].toString();
        }
        painter->drawText(center * length_pic / 512, title);
        GravityCenter((name + "R.png"), center, length_blank);
        if(show_value_) {
            title = result_map[
                        QString("_%1%2R").arg(cur_id_).arg(title_list_.at(var))].toString();
        }
        painter->drawText(center * length_pic / 512, title);
    }
    //
    QFont font;
    painter->setPen(Qt::green);
    font.setPointSize(14);
    painter->setFont(font);
    if(this->cur_id_ >= 16 && this->cur_id_ <= 18) {
        painter->drawText(tagging_weight,
                          this->height() - tagging_height - tagging_interval * 4,
                          QString("核团层面   (%1)").arg(cur_id_));
        painter->drawText(tagging_weight,
                          this->height() - tagging_height - tagging_interval * 3,
                          QString("I:岛叶"));
        painter->drawText(tagging_weight,
                          this->height() - tagging_height - tagging_interval * 2,
                          QString("L:豆状核"));
        painter->drawText(tagging_weight,
                          this->height() - tagging_height - tagging_interval * 1,
                          QString("C:尾状核"));
        painter->drawText(tagging_weight, this->height() - 60 - 25 * 0,
                          QString("IC:内囊后肢"));
    } else if(this->cur_id_ >= 19 && this->cur_id_ <= 21) {
        painter->drawText(tagging_weight,
                          this->height() - tagging_height,
                          QString("核团以上大脑皮层   (%1)").arg(cur_id_));
    }
    painter->restore();
```
