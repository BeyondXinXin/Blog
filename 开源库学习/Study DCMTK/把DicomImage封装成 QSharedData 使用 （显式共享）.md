


@[TOC](把DicomImage封装成 QSharedData 使用 （显式共享）)

---
&emsp;&emsp;尽量保证不出现内存泄露，先使用 **QSharedData** 和 **QExplicitlySharedDataPointer**等都开发完成一起检查。

---
## 1. 1 简单了解DICOM 协议
&emsp;&emsp;需要先简单了解一下 **DICOM** 协议


&emsp;&emsp;**DICOM** 协议中 **Patient Root** 查询/检索信息模型建立在一个四等级的分层基础之上

- **PATIENT**  （病人）
- **STUDY**  （检查）   
- **SERIES**    （序列）
- **IMAGE** （影像）


├── **PATIENT**  （病人）
│ │ └── **STUDY**  （检查）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ │ │ │ │ └── **IMAGE** （影像）
│ │ └── **STUDY**  （检查）
│ │ │ │ └── **SERIES**    （序列）
│ │ │ │ │ │ └── **IMAGE** （影像）

ps:   **Study Root**查询/检索信息模型与**Patient Root**查询/检索信息模型是相同的除了它的最高等级是检查等级之外。

&emsp;&emsp;还有一个比较重要 

- **SOP** （**DICOM**应用都提供了哪些服务)

&emsp;&emsp;简单概括就是，每一位病人可以做多次检查，每次检查有多个序列，每个序列有多张影像，每张影像可以有多层或者一层。
&emsp;&emsp;每个影像可以提供不同的**dicom**服务。

---
## 2. 2 DicomImage 常用功能
### 2.1. 2.1 DicomImage 转 QPixmap

```cpp

static bool GetPixmap(const QString &dicomFile, QPixmap &pixmap);
static bool Dcm2BmpHelper(DicomImage &dcm_image_, QPixmap &pixmap, const qint32 frame = 0);
    
//---------------------------------------------------------------
void FreeBuffer(void *pBuf) {
    delete pBuf;
}

//---------------------------------------------------------------
bool ImageInstanceData::GetPixmap(const QString &dicomFile, QPixmap &pixmap) {
    ImageInstanceData image(dicomFile);
    return image.GetPixmap(pixmap);
}

//---------------------------------------------------------------
bool ImageInstanceData::Dcm2BmpHelper(
    DicomImage &dcmImage, QPixmap &pixmap, const qint32 frame) {
    qint32 w = static_cast<qint32>(dcmImage.getWidth());
    qint32 h = static_cast<qint32>(dcmImage.getHeight());
    void *pDIB = nullptr;
    qint32 size;
    if(dcmImage.getFrameCount() > 1) {
        quint64 tmp = static_cast<quint64>(frame);
        size = static_cast<qint32>(dcmImage.createWindowsDIB(pDIB, 0, tmp, 32, 0, 1));
    } else {
        size = static_cast<qint32>(dcmImage.createWindowsDIB(pDIB, 0, 0, 32, 0, 1));
    }
    if (size == w * h * 4) {
        QImage image( static_cast<uchar *>(pDIB), w, h,
                      QImage::Format_RGB32, FreeBuffer, pDIB);
        pixmap = QPixmap::fromImage(image);
        return !pixmap.isNull();
    }
    return false;
}
```

### 2.2. 2.2 DicomImage 剪裁

```cpp
//---------------------------------------------------------------
DicomImage *ImageInstanceData::CreateClippedImage(
    const QRect &rect, int angle, bool hflip, bool vflip, bool inverted) {
    DicomImage *image = dcm_image_;
    if (!image) {
        return image;
    }
    int ret = 1;
    double min, max;
    image->getMinMaxValues(min, max);
    double pvalue = image->getPhotometricInterpretation() ==
                    EPI_Monochrome1 ? max : min;
    DicomImage *newImage =
        image->createClippedImage(
            static_cast<long>( rect.left()),
            static_cast<long>( rect.top()),
            static_cast<unsigned long>( rect.width()),
            static_cast<unsigned long>( rect.height()),
            static_cast<unsigned short>( pvalue));
    if (newImage) {
        if (ret && angle) {
            ret = newImage->rotateImage(angle % 360);
        }
        if (ret && hflip) {
            ret = newImage->flipImage(1, 0);
        }
        if (ret && vflip) {
            ret = newImage->flipImage(0, 1);
        }
        if (ret && inverted) {
            ret = newImage->setPolarity(EPP_Reverse);
        }
        if (!ret) {
            delete newImage;
            newImage = nullptr;
        }
    }
    return newImage;
}
```
### 2.3. 2.3 DcmFileFormat 获取 标签信息

```cpp
//---------------------------------------------------------------
QString ImageInstanceData::GetTagKeyValue(const DcmTagKey &key) const {
    OFString val;
    if (dcmff_ && dcmff_->getDataset()) {
        dcmff_->getDataset()->findAndGetOFString(key, val);
    }
    return QString::fromLocal8Bit(val.c_str());
}

```
### 2.4. 2.4 DcmFileFormat 获取 常用标签/图片

```cpp
//---------------------------------------------------------------
void ImageInstanceData::InitImage() {
    DJDecoderRegistration::registerCodecs();
    DcmDataset *dset;
    OFCondition result;
    if (dcmff_ && (dset = dcmff_->getDataset())) {
        dcmff_->loadAllDataIntoMemory();
        dset->chooseRepresentation(EXS_LittleEndianExplicit, nullptr);
        const char *val = nullptr;
        result = dset->findAndGetString(DCM_StudyInstanceUID, val);
        study_uid_ = QString::fromLocal8Bit(val);
        result = dset->findAndGetString(DCM_SeriesInstanceUID, val);
        series_uid_ = QString::fromLocal8Bit(val);
        result = dset->findAndGetString(DCM_SOPInstanceUID, val);
        image_uid_ = QString::fromLocal8Bit(val);
        result = dset->findAndGetString(DCM_SOPClassUID, val);
        class_uid_ = QString::fromLocal8Bit(val);
        result = dset->findAndGetFloat64(DCM_PixelSpacing, pixel_y_, 0);
        result = dset->findAndGetFloat64(DCM_PixelSpacing, pixel_x_, 1);
        result = dset->findAndGetFloat64(DCM_WindowWidth, win_width_);
        result = dset->findAndGetFloat64(DCM_WindowCenter, win_center_);
        def_center_ = win_center_;
        def_width_ = win_width_;
        dcm_image_ = new DicomImage(dset, dset->getOriginalXfer());
        if (dcm_image_->getStatus() == EIS_Normal) {
            if (win_width_ < 1) {
                dcm_image_->setRoiWindow(0, 0, dcm_image_->getWidth(), dcm_image_->getHeight());
                dcm_image_->getWindow(win_center_, win_width_);
                def_center_ = win_center_;
                def_width_ = win_width_;
            }
        } else {
            delete dcm_image_;
            dcm_image_ = nullptr;
        }
    }
}

```




### 2.5. 2.5 DicomImage 获取像素信息

```cpp
//---------------------------------------------------------------
double ImageInstanceData::GetPixelValue(long x, long y) const {
    DicomImage *image = dcm_image_;
    if (image) {
        const DiPixel *pixel = image->getInterData();
        if (pixel && (x < static_cast<long>(image->getWidth())) && (x >= 0)
                && (y < static_cast<long>(image->getHeight())) && (y >= 0)) {
            EP_Representation r = pixel->getRepresentation();
            switch (r) {
                case EPR_Sint8:
                    return *((char *)(pixel->getData()) +
                             (y * image->getWidth() + x));
                case EPR_Uint8:
                    return *((uchar *)(pixel->getData()) +
                             (y * image->getWidth() + x));
                case EPR_Sint16:
                    return *((short *)(pixel->getData()) +
                             (y * image->getWidth() + x));
                case EPR_Uint16:
                    return *((ushort *)(pixel->getData()) +
                             (y * image->getWidth() + x));
                case EPR_Sint32:
                    return *((int *)(pixel->getData()) +
                             (y * image->getWidth() + x));
                case EPR_Uint32:
                    return *((uint *)(pixel->getData()) +
                             (y * image->getWidth() + x));
            }
        }
    }
    return 0;
}
```


---
## 3. 3 ImageInstanceData 封装

&emsp;&emsp;我这里把每张影像（**dcmtk**库中是**DicomImage**）封装成一个**QSharedData**。预留接口方便Qt框架显示、调用。

注意：每张影像尺寸是三维的 比如 
- 512 X 512 X 1  表示这个影像只有一帧
- 512 X 512 X 250 表示这个影像有很多帧

&emsp;&emsp;自定义的**QSharedData**影像包含数据：

```cpp
	// Patient uid 不需要，最后显示按照 STUDY 分类
    QString study_uid_;// STUDY uid
    QString series_uid_;// SERIES uid
    QString image_uid_;// IMAGE uid
    QString class_uid_;// SOP uid
    double pixel_x_;// x方向间距
    double pixel_y_;// y方向间距
    double def_center_;// 窗位窗宽
    double def_width_;// 窗位窗宽
    double win_width_;// 窗位窗宽
    double win_center_;// 窗位窗宽
    DcmFileFormat *dcmff_;// dcm 文件
    DicomImage *dcm_image_;// 图片
    QString image_file_;// 文件名   
```



```cpp
class DcmTagKey;
class DicomImage;
class DcmFileFormat;

class ImageInstanceData: public QSharedData {
  public:
    static bool GetPixmap(const QString &dicomFile, QPixmap &pixmap);
    static bool Dcm2BmpHelper(DicomImage &dcm_image_, QPixmap &pixmap, const qint32 frame = 0);
  public:
    explicit ImageInstanceData(const QString &file);
    explicit ImageInstanceData(DcmFileFormat *dff);
    ~ImageInstanceData();

    void SetWindow(const double &center, const double &width);
    void GetWindow(double &center, double &width) const;
    void SetWindowDelta(const double &dCenter, const double &dWidth);
    void SetRoiWindow(const QRectF &rect);
    void SetFullDynamic();
    void SetDefaultWindow();
    QString GetStudyUid() const;
    QString GetSeriesUid() const;
    QString GetImageUid() const;
    QString GetClassUid() const;
    QString GetImageFile() const;
    void SetPolarity(EP_Polarity polarity);
    EP_Polarity GetPolarity() const;
    bool GetPixmap(QPixmap &pixmap);
    bool GetPixmap(QPixmap &pixmap, const qint32 &frame);
    bool IsNormal() const;
    DicomImage *CreateClippedImage(const QRect &rect, int angle = 0,
                                   bool hflip = false, bool vflip = false,
                                   bool inverted = false);
    QString GetTagKeyValue(const DcmTagKey &key) const;
    double GetPixelValue(long x, long y) const;
    bool GetPixSpacing(double &spacingX, double &spacingY) const;
    bool GetImageSize(ulong &width, ulong &height) const;
    const short *GetInternalPtr() const;
    const ushort *GetRawData() const;
    const DicomImage *GetDcmImage() const;
    DcmFileFormat *GetFileFormat() const;
    bool SaveFileFormat();
    qint32 GetFrameCount() const;
  private:
    void InitImage();
  private:
    QString study_uid_;
    QString series_uid_;
    QString image_uid_;
    QString class_uid_;
    double pixel_x_;
    double pixel_y_;
    double def_center_;
    double def_width_;
    double win_width_;
    double win_center_;
    DcmFileFormat *dcmff_;
    DicomImage *dcm_image_;
    QString image_file_;
};
```

---
## 4. 4 ImageInstance 封装

&emsp;&emsp;如果直接使用 **QSharedData** 后面会很麻烦。需要再搞一个**Instance**作为程序里传递使用。利用**QExplicitlySharedDataPointer**实现显式共享。

```cpp
class DicomImage;

class ImageInstance {
  public:
    ImageInstance(const QString &file);
    ImageInstance(DcmFileFormat *dff);
    ImageInstance(const ImageInstance &image);
    void SetWindow(const double &center, const double &width);
    void GetWindow(double &center, double &width) const;
    void SetWindowDelta(const double &dCenter, const double &dWidth);
    void SetRoiWindow(const QRectF &rect);
    void SetDefaultWindow();
    void SetFullDynamic();
    void GetPolarity(EP_Polarity p);
    EP_Polarity GetPolarity() const;
    QString GetStudyUid() const;
    QString GetSeriesUid() const;
    QString GetImageUid() const;
    QString GetClassUid() const;
    QString GetImageFile() const;
    bool GetPixmap(QPixmap &pixmap);
    bool GetPixmap(QPixmap &pixmap, const qint32 &frame);
    bool IsNormal() const;
    DicomImage *CreateClippedImage(
        const QRect &rect, int angle = 0, bool hflip = false,
        bool vflip = false, bool inverted = false);
    QString GetTagKeyValue(const DcmTagKey &key) const;
    uint GetPixelValue(long x, long y) const;
    bool GetPixSpacing(double &spacingX, double &spacingY) const;
    bool GetImageSize(ulong &width, ulong &height) const;
    const short *GetInternalPtr() const;
    const ushort *GetRawData() const;
    const DicomImage *GetDcmImage() const;
    DcmFileFormat *GetFileFormat();
    bool SaveFileFormat();
    qint32 GetFrameCount() const;
    //
    static bool GetPixmap(const QString &file, QPixmap &pixmap);
    static bool Dcm2BmpHelper(DicomImage &image, QPixmap &pixmap,
                              const qint32 frame = 0);
  private:
    QExplicitlySharedDataPointer<ImageInstanceData> d_;
};

Q_DECLARE_TYPEINFO(ImageInstance, Q_MOVABLE_TYPE);
```
