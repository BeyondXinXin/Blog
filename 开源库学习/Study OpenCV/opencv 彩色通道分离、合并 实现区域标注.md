&emsp;&emsp;需求： 在ct图上贴出病变区域
&emsp;&emsp;没什么技术含量，方便有需要的快速cv 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200813173550484.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)


```cpp
/**
 * @brief GenerateRendering
 * @param srcImage 输入 背景图
 * @param IC 输入 核心梗死区图像
 * @param IP 输入 梗死区图像
 * @param rending 生成最终渲染结果
 * @return 是否成功计算完成
 */
bool  GenerateRendering(const Mat &srcImage, const Mat &IC, const Mat &IP, Mat &rending) {
    if(CV_8UC3  != srcImage.type() ||
            CV_8UC1  != IC.type() ||
            CV_8UC1  != IP.type()) {
        qDebug() << "GenerateRendering type error";
        return false;
    }
    Mat mask1, mask2;
    cv::cvtColor(IC, mask1, COLOR_GRAY2RGB);
    cv::cvtColor(IP, mask2, COLOR_GRAY2RGB);
    std::vector<cv::Mat> channels1, channels2, channels3;
    split(mask1, channels1);
    split(mask2, channels2);
    split(srcImage, channels3);
    {
        // Fake
        cv::bitwise_and(channels1[1], channels2[2], channels1[1]);
    }
    channels3[1] += channels1[1] * 0.5;
    channels3[2] += channels2[2] * 0.5;
    merge(channels3, rending);
    return true;
}
```

