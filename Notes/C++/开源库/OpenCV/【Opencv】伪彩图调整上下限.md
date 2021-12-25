&emsp;&emsp;需求： 需要生成几张伪彩图，equalizeHist/normalize 的话会破坏计算完的数据。于是只用threshold阈值调整，但是阈值不好确定，需要临时调整阈值确定上下限。
&emsp;&emsp;难度不大，有跟我一样需求的可以方便快速实现。



![在这里插入图片描述](https://img-blog.csdnimg.cn/20200810165809101.gif#pic_center)
### 声明

```cpp
  private:
    class AdjustmentPseudocolor {
      public:
        static void Initialization(QString name);
      private:
        static void Process();
        static void Callback_NumChange(int, void *) {
            Process();
        }
    };
```

### 调用

```cpp
 AdjustmentPseudocolor::Initialization(path);
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200810165921356.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



### 实现

```cpp
static QString obj_name_ = "";
static qint32 cbv_x_ = 0;
static qint32 cbv_s_ = 10;
static qint32 cbf_x_ = 5;
static qint32 cbf_s_ = 85;
static qint32 mtt_x_ = 2;
static qint32 mtt_s_ = 8;

void ScriptCtpSVD::AdjustmentPseudocolor::Initialization(
    QString name) {
    obj_name_ = name;
    Process();
    createTrackbar("下(0-20)",
                   (obj_name_ + "cbv").toLocal8Bit().data(),
                   &cbv_x_, 20, Callback_NumChange);
    createTrackbar("上(0-110)",
                   (obj_name_ + "cbv").toLocal8Bit().data(),
                   &cbv_s_, 110, Callback_NumChange);
    createTrackbar("下(0-20)",
                   (obj_name_ + "cbf").toLocal8Bit().data(),
                   &cbf_x_, 20, Callback_NumChange);
    createTrackbar("上(0-110)",
                   (obj_name_ + "cbf").toLocal8Bit().data(),
                   &cbf_s_, 110, Callback_NumChange);
    createTrackbar("下(0-20)",
                   (obj_name_ + "mtt").toLocal8Bit().data(),
                   &mtt_x_, 20, Callback_NumChange);
    createTrackbar("上(0-110)",
                   (obj_name_ + "mtt").toLocal8Bit().data(),
                   &mtt_s_, 110, Callback_NumChange);
    while(char(waitKey(1)) != 'q') {}
}

void ScriptCtpSVD::AdjustmentPseudocolor::Process() {
    if(obj_name_.isEmpty()) {
        return;
    }
    Mat  CBV_tmp, CBF_tmp, MTT_tmp;
    FileStorage cv_xml_read("Adjust.xml", FileStorage::READ);
    cv_xml_read["cbv"] >> CBV_tmp;
    cv_xml_read["cbf"] >> CBF_tmp;
    cv_xml_read["mtt"] >> MTT_tmp;
    cv_xml_read.release();
    //
    threshold(CBV_tmp, CBV_tmp, cbv_s_, cbv_s_, CV_THRESH_TRUNC);
    threshold(CBV_tmp, CBV_tmp, cbv_x_, cbf_x_, CV_THRESH_TOZERO);
    threshold(CBF_tmp, CBF_tmp, cbf_s_, cbf_s_, CV_THRESH_TRUNC);
    threshold(CBF_tmp, CBF_tmp, cbf_x_, cbf_x_, CV_THRESH_TOZERO);
    threshold(MTT_tmp, MTT_tmp, mtt_s_, mtt_s_, CV_THRESH_TRUNC);
    threshold(MTT_tmp, MTT_tmp, mtt_x_, mtt_x_, CV_THRESH_TOZERO);
    qDebug() << cbv_x_ << cbv_s_ << cbf_x_ << cbf_s_ << mtt_x_ << mtt_s_;
    cv::Mat CBV_tmp0, CBF_tmp0, MTT_tmp0;
    cv::Mat CBV_clour, CBF_clour, MTT_clour;
    //
    normalize(CBV_tmp, CBV_tmp0, 0, 255, cv::NORM_MINMAX);
    CBV_tmp0.convertTo(CBV_tmp0, CV_8UC1);
    applyColorMap(CBV_tmp0, CBV_clour, COLORMAP_JET);
    normalize(CBF_tmp, CBF_tmp0, 0, 255, cv::NORM_MINMAX);
    CBF_tmp0.convertTo(CBF_tmp0, CV_8UC1);
    applyColorMap(CBF_tmp0, CBF_clour, COLORMAP_JET);
    normalize(MTT_tmp, MTT_tmp0, 0, 255, cv::NORM_MINMAX);
    MTT_tmp0.convertTo(MTT_tmp0, CV_8UC1);
    applyColorMap(MTT_tmp0, MTT_clour, COLORMAP_JET);
    //
    for(int i = 0; i < CBV_clour.rows; i++) {
        for(int j = 0; j < CBV_clour.cols; j++) {
            if(CBV_clour.at<Vec3b>(i, j)[0] == 128 &&
                    CBV_clour.at<Vec3b>(i, j)[1] == 0 &&
                    CBV_clour.at<Vec3b>(i, j)[2] == 0) {
                CBV_clour.at<Vec3b>(i, j)[0] = 0;
            }
            if(CBF_clour.at<Vec3b>(i, j)[0] == 128 &&
                    CBF_clour.at<Vec3b>(i, j)[1] == 0 &&
                    CBF_clour.at<Vec3b>(i, j)[2] == 0) {
                CBF_clour.at<Vec3b>(i, j)[0] = 0;
            }
            if(MTT_clour.at<Vec3b>(i, j)[0] == 0 &&
                    MTT_clour.at<Vec3b>(i, j)[1] == 0 &&
                    MTT_clour.at<Vec3b>(i, j)[2] == 128) {
                MTT_clour.at<Vec3b>(i, j)[2] = 0;
            }
        }
    }
    //
    cv::Mat jet = cv::imread("colorscale_jet.jpg");
    Mat imageROI;
    imageROI = CBV_clour(Rect(10, 128, jet.cols, jet.rows));
    addWeighted(imageROI, 0.0, jet, 1.0, 0., imageROI);
    imageROI = CBF_clour(Rect(10, 128, jet.cols, jet.rows));
    addWeighted(imageROI, 0.0, jet, 1.0, 0., imageROI);
    imageROI = MTT_clour(Rect(10, 128, jet.cols, jet.rows));
    addWeighted(imageROI, 0.0, jet, 1.0, 0., imageROI);
    qint32 sing_num = 6;
    for(qint32 i = 0; i < sing_num; i++) {
        cv::Point2f pos;
        pos.x = 45;
        pos.y = 128 + 256 - i * 256 / (sing_num - 1);
        double num = cbv_x_ + i * (cbv_s_ - cbv_x_) / (sing_num - 1.0);
        cv::putText(CBV_clour, QString::number(num).toLocal8Bit().data(), pos,
                    cv::FONT_HERSHEY_SIMPLEX, 0.45, CV_RGB(255, 230, 0));
        num = cbf_x_ + i * (cbf_s_ - cbf_x_) /  (sing_num - 1.0);
        cv::putText(CBF_clour, QString::number(num).toLocal8Bit().data(), pos,
                    cv::FONT_HERSHEY_SIMPLEX, 0.45, CV_RGB(255, 230, 0));
        num = mtt_x_ + i * (mtt_s_ - mtt_x_) /  (sing_num - 1.0);
        cv::putText(MTT_clour, QString::number(num).toLocal8Bit().data(), pos,
                    cv::FONT_HERSHEY_SIMPLEX, 0.45, CV_RGB(255, 230, 0));
    }
    //
    imshow((obj_name_ + "cbv").toLocal8Bit().data(), CBV_clour);
    imshow((obj_name_ + "cbf").toLocal8Bit().data(), CBF_clour);
    imshow((obj_name_ + "mtt").toLocal8Bit().data(), MTT_clour);
}
```
