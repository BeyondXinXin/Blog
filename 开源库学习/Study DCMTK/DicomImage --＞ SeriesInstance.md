&emsp;&emsp;上一篇介绍 Dicom影像如何再Qt下高效使用。&emsp;&emsp;[把DicomImage封装成 QSharedData 使用 （显式共享）](https://beondxin.blog.csdn.net/article/details/108680479)


---
## 1. 1 简单了解DICOM 协议
&emsp;&emsp; 提到了Dicom影像的检索模型。同一个系列可能有多张dicom影像（比如CT），我们做可视化的时候肯定需要把一系列按照高度一起显示。

├── PATIENT （病人）
│ │ └── STUDY （检查）
│ │ │ │ └── SERIES （序列）
│ │ │ │ │ │ └── IMAGE （影像 高度为未知）
│ │ │ │ └── SERIES （序列）
│ │ │ │ │ │ └── IMAGE （影像 高度为1）
│ │ │ │ │ │ └── IMAGE （影像 高度为1）
│ │ └── STUDY （检查）
│ │ │ │ └── SERIES （序列）
│ │ │ │ │ │ └── IMAGE （影像）

**DICOM** 标签中 **InstanceNumber**就表示 **IMAGE** （影像）在**SERIES** （序列）中的位置。我们需要按照 **InstanceNumber**把**DicomImage**拼接起来当成一个整体。

ps:   一个**STUDY**可能有多个**SERIES**，可视化时候按照**SERIES**分。

---
## 2. 2 DicomImage Series 类型
&emsp;&emsp; 根据协议可以知道每个**Series**中可以有单帧或多帧。
&emsp;&emsp; 多帧时 每帧影像尺寸高度是1
&emsp;&emsp; 单帧时 每帧影像尺寸高度未知


- 单帧模式高度代表当前时间 !
- 多帧模式高度代表空间位置 !


```cpp
    enum  SeriesPattern {
        Empty_Frame,  //
        Single_Frame, // 单帧
        Multi_Frame,  // 多帧
    };
```
&emsp;&emsp; 涉及到Series，2D可视化肯定会有方向


&emsp;&emsp;（多帧模式下）区分平面
&emsp;&emsp;（单帧模式下）只有XY平面显示模式，另外两个平面表示**时间密度曲线**，与其相关打算作为插件用opencv做，所以这里封装的Series其余两个平面均指多帧模式。
```cpp
    enum ViewType {
    VT_XYPlane,
    VT_XZPlane,
    VT_YZPlane,
	};
```


---
## 3. 3 DicomImage Series 常用功能

### 3.1. 3.1 DicomImage Series 上一帧、下一帧、当前帧、层高
&emsp;&emsp;显示 **XY** 平面时：

- 单帧时**Series**层高是这帧影像层高。
- 多帧时**Series**层高是帧数。

&emsp;&emsp;同理显示 **XZ、YZ** 平面是：帧数就是 影像 y轴尺寸、x轴尺寸。



### 3.2. 3.2 DicomImage Series 获取像素
&emsp;&emsp;（多帧模式下）区分平面
&emsp;&emsp;（单帧模式下）只有XY平面显示模式

```cpp
double SeriesInstance::GetPixelValue(long x, long y, ViewType type) const {
    if (!image_map_.isEmpty()) {
        switch (type) {
            case VT_XYPlane:
                ImageInstance *image;
                switch (m_pattern_) {
                    case Single_Frame: {
                            image = image_map_.values().at(0);
                            break;
                        }
                    case Multi_Frame: {
                            image = image_map_.values().at(cur_xy_frame_);
                            break;
                        }
                    default: {
                            return 0;
                        }
                }
                return image->GetPixelValue(x, y);
            case VT_XZPlane:
                if (y >= 0 && y < image_map_.values().size()) {
                    return image_map_.values().at(y)->GetPixelValue(x, cur_xz_frame_);
                }
                break;
            case VT_YZPlane:
                if (y >= 0 && y < image_map_.values().size()) {
                    return image_map_.values().at(y)->GetPixelValue(cur_yz_frame_, x);
                }
                break;
        }
    }
    return 0;
}
```

### 3.3. 3.3 DicomImage Series 获取间隔
&emsp;&emsp;（多帧模式下）区分平面
&emsp;&emsp;（单帧模式下）只有XY平面显示模式

```cpp
bool SeriesInstance::GetPixSpacing(double &spacingX, double &spacingY, ViewType type) const {
    double sx, sy, sz;
    if (image_map_.isEmpty()) {
        return false;
    }
    if (!image_map_.first()->GetPixSpacing(sx, sy)) {
        return false;
    }
    sz = image_map_.first()->GetTagKeyValue(DCM_SliceThickness).toDouble();
    switch (type) {
        case VT_XYPlane:
            spacingX = sx;
            spacingY = sy;
            break;
        case VT_XZPlane:
            if (sz <= 0) {
                return false;
            }
            spacingX = sx;
            spacingY = sz;
            break;
        case VT_YZPlane:
            if (sz <= 0) {
                return false;
            }
            spacingX = sy;
            spacingY = sz;
            break;
    }
    return true;
}
```

### 3.4. 3.4 DicomImage Series 获取图片
&emsp;&emsp;（多帧模式下）区分平面
&emsp;&emsp;（单帧模式下）只有XY平面显示模式

```cpp
bool SeriesInstance::GetPixmap(QPixmap &pixmap, ViewType type) {
    if (image_map_.isEmpty()) {
        return false;
    }
    ImageInstance *image;
    const short **volume;
    ulong w, h, s, rh;
    switch (type) {
        case VT_XYPlane:
            switch (m_pattern_) {
                case Single_Frame: {
                        image = image_map_.values().at(0);
                        break;
                    }
                case Multi_Frame: {
                        image = image_map_.values().at(cur_xy_frame_);
                        break;
                    }
                default: {
                        return false;
                    }
            }
            if (win_width_ < 1) {
                win_width_ = 1;
            }
            image->SetWindow(win_center_, win_width_);
            image->GetPolarity(m_pola_);
            return image->GetPixmap(pixmap, cur_xy_frame_);
        case VT_XZPlane:
            if (GetSeriesVolume(volume, w, h, s)) {
                double center = win_center_;
                double width = win_width_;
                double factor = 255 / width;
                double lower = center - width / 2;
                QImage srcImage(w, s, QImage::Format_Indexed8);
                QVector<QRgb> grayTable;
                for(int i = 0; i < 256; i++) {
                    grayTable.push_back(qRgb(i, i, i));
                }
                srcImage.setColorTable(grayTable);
                for (int i = 0; i < s; i++) {
                    const short *ptr = volume[i];
                    int idx = cur_xz_frame_ * h;
                    for (int j = 0; j < w; j++) {
                        short val = ptr[j * w + cur_xz_frame_];
                        if (val > lower + width) {
                            srcImage.setPixel(j, i, 255);
                        } else if (val > lower) {
                            qint32 value = (val - lower) * factor;
                            srcImage.setPixel(j, i, value);
                        } else {
                            srcImage.setPixel(j, i, 0);
                        }
                    }
                }
                pixmap = QPixmap::fromImage(srcImage);
                return true;
            }
            break;
        case VT_YZPlane:
            if (GetSeriesVolume(volume, w, h, s)) {
                double center = win_center_;
                double width = win_width_;
                double factor = 255 / width;
                double lower = center - width / 2;
                QImage srcImage(w, s, QImage::Format_Indexed8);
                QVector<QRgb> grayTable;
                for(int i = 0; i < 256; i++) {
                    grayTable.push_back(qRgb(i, i, i));
                }
                srcImage.setColorTable(grayTable);
                for (int i = 0; i < s; i++) {
                    const short *ptr = volume[i];
                    int idx = cur_yz_frame_ * h;
                    for (int j = 0; j < w; j++) {
                        short val = ptr[idx + j];
                        if (val > lower + width) {
                            srcImage.setPixel(j, i, 255);
                        } else if (val > lower) {
                            qint32 value = (val - lower) * factor;
                            srcImage.setPixel(j, i, value);
                        } else {
                            srcImage.setPixel(j, i, 0);
                        }
                    }
                }
                pixmap = QPixmap::fromImage(srcImage);
                return true;
            }
            break;
    }
    return false;
}
```

---
## 4. 4 DicomImage Series 封装
&emsp;&emsp;大部分跟**ImageInstance**一样。


```cpp
#ifndef SERIESINSTANCE_H
#define SERIESINSTANCE_H

#include <QObject>
#include <QMap>
#include "dcmtk/dcmimgle/diutils.h"
#include "../Global/structs.h"

class DicomImage;
class ImageInstance;
class DcmTagKey;

class SeriesInstance: public QObject {
    Q_OBJECT
  public:
    enum  SeriesPattern {
        Empty_Frame,  //
        Single_Frame, // 单帧
        Multi_Frame,  // 多帧
    };

  public:
    explicit SeriesInstance(const QString &seriesUID,
                            QObject *parent = nullptr);
    ~SeriesInstance();
    bool InsertImage(ImageInstance *image);
    bool RemoveImage(const QString &imgFile);
    bool IsEmpty() const;
    bool HasImage(const QString &file);
    QString GetTagKeyValue(const DcmTagKey &key, const ViewType &type = VT_XYPlane) const;
    qint32 GetFrameCount(ViewType type = VT_XYPlane) const;
    const short **GetSeriesVolume(const short** &volume,
                                  ulong &width, ulong &height, ulong &slice);
    const ushort **GetRawVolume(const ushort** &volume,
                                ulong &width, ulong &height, ulong &slice);
    ImageInstance *GetCurrImageInstance(ViewType type) const;
    bool GetPixmap(QPixmap &pixmap, ViewType type);
    void NextFrame(ViewType type);
    void PrevFrame(ViewType type);
    void GotoFrame(int index, ViewType type);
    int GetCurIndex(ViewType type);
    void SetWindow(const double &center, const double &width);
    void GetWindow(double &center, double &width) const;
    void SetWindowDelta(const double &dCenter, const double &dWidth);
    void SetRoiWindow(const QRectF &rect);
    void SetDefaultWindow();
    void SetFullDynamic();

    void SetPolarity(EP_Polarity polarity);
    EP_Polarity GetPolarity() const;
    double GetPixelValue(long x, long y, ViewType type) const;
    bool GetPixSpacing(double &spacingX, double &spacingY, ViewType type) const;
    void DelVolBuffer();

  Q_SIGNALS:
    void Signal_AboutToDelete();

  private:
    SeriesInstance(const SeriesInstance &);
    SeriesInstance &operator= (const SeriesInstance &);

  private:
    QString series_uid_;
    int cur_xy_frame_;
    int cur_xz_frame_;
    int cur_yz_frame_;
    ulong img_width_;
    ulong img_height_;
    double win_center_;
    double win_width_;
    double def_center_;
    double def_width_;
    EP_Polarity m_pola_;
    const short **vol_ptr_;
    ulong vol_slice_;
    const ushort **raw_ptr_;
    ulong raw_slice_;
    QMap<int, ImageInstance *> image_map_;
    SeriesPattern m_pattern_;
};

#endif // SERIESINSTANCE_H

```
