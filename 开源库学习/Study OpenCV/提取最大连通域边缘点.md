

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191218155420741.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




```cpp
void MatUtil::GetPostiveField(
    QString imagename, vtkPolyData *edgePoly, double spacing) {
    double area = 0;
    quint64 index = 0;
    cv::Mat input = cv::imread(imagename.toLocal8Bit().data(), CV_8UC1);
    cv::Mat contour = cv::Mat::ones(input.rows, input.cols, CV_8UC1);
    GaussianBlur(input, input, cv::Size(7, 7), 0, 0);
    cv::threshold(input, input, 100, 255, cv::THRESH_BINARY);
    // bitwise_not(inputImage, inputImage); // ai结果如果带边框，需要图像反转剔除边框
    std::vector<std::vector<cv::Point>> contours;
    findContours(input, contours, cv::RETR_CCOMP, cv::CHAIN_APPROX_SIMPLE );
    for( quint32 i = 0; i < contours.size(); i++ ) {
        index = (contourArea(contours[i]) > area) ? i : index;
        area = (contourArea(contours[i]) > area) ? contourArea(contours[i]) : area;
    }
    drawContours(contour, contours,
                 static_cast<qint32>(index), cv::Scalar(255), 0 );
    // cv::imwrite(imagename.toLocal8Bit().data(), contour);
    vtkNew<vtkPoints> points;
    vtkNew<vtkPolyData> polyPoint;
    for (qint32 i = 0; i < contour.rows; i++) {
        for (qint32 j = 0; j < contour.cols; j++) {
            qint32 index = i * contour.cols + j;
            //像素值
            qint32 data = contour.data[index];
            if (data == 255) {
                points->InsertNextPoint((contour.rows / 2 - i)*spacing,
                                        (j - contour.cols / 2)*spacing, 0);
            }
        }
    }
    polyPoint->SetPoints(points);
    edgePoly->DeepCopy(polyPoint);
}
```