[代码上传至gitee](https://gitee.com/yaoxin001/QT_Libtorch)
ssh   git@gitee.com:yaoxin001/QT_Libtorch.git

---
这两天做了qt下利用libtorch对模型进行训练.整理下方便自己今后使用

1. 利用opencv 读取单张png 输入torch 结果保存文png(cpu)
2. 利用vkt 批量读取pngs 依次输入torch 结果转化为stl三维模型(gpu)
3. 利用itk批量读取dcm 依次输入torch 结果转化为stl三维模型(gpu)
---

**libtorch知识点**
 - libtorch多线程并行运算
 - libtorch使用多gpu
 - libtorch  显存到内存转换


**其余知识点**
 - 利用vtk批量读取png图片
 - 利用vtk三维重建
 - 利用opencv中值滤波
 - itk批量读取dcm
 - vtk获取模型间隔
 - itk获取病人信息



gpu使用和程序运行状况，可以看到显存利用了40G
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191019200847823.png)
libtorch 就是把pytorch 搬到了c++端，方便算法实现商业化。基本操作流程就是
python训练好模型，导出.pt模型
c++程序  读取图片，传入libtorch 根据上一步的模型进行预测
训练结果导出成图片或其他信息用于显示

读取pt模型
```cpp
    torch::DeviceType device_type;
    device_type = torch::kCUDA;
    torch::jit::script::Module module0 =
            torch::jit::load("/home/xxxx/文档/QT_work/xxxx/bin/xxxx.pt");
    torch::Device device0(device_type, static_cast<short>(
                              this_lv_struct_.gpu));
    module0.to(device0);
     torch::cuda::is_available();
```

opencv图片标准化
```cpp
    cv::Mat img;
    img.create(512, 512, CV_32FC1);
    for (int nr = 0; nr < 512; nr++) {
                float *outData = img.ptr<float>(nr);
                for (int mc = 0; mc < 512 ; mc++) {
                    float *pixel = static_cast<float * >
                            (this_lv_struct_.imagedata->GetScalarPointer(
                                 mc, nr, this_lv_struct_.begin_dcm + dcm * 5 + i));
                    outData[mc] = *pixel;
                }
            }
```

模型训练
```cpp
 at::Tensor tensor_image = torch::from_blob(img.data,
            { 1, 512, 512, 1 }, options);
            tensor_image = tensor_image.permute({ 0, 3, 1, 2 }).to(device0);
            pred[i] = module0.forward({tensor_image}).toTensor()[0][0];
```

导出图片
这里最傻，为什么这么多at::Tensor就是为了减少从显存到内存的次数，和增加每次交换数据量
这里肯定有更好的办法，我没找到，谁知道非常感谢可以告诉我
```cpp
for (int i = 0; i < 5; i++) {
            at::Tensor pred_00 = pred[i];
            for (int w = 0; w < 512; ++w) {
                at::Tensor pred_000 = pred_00[w];
                for (int jj = 0; jj < 512; jj++) {
                    at::Tensor pred_0000 = pred_000[jj];
                    this_lv_struct_.testshortarr[
                            512 * w + jj + i * 262144 +
                            dcm * 262144 * 5 + this_lv_struct_.begin_array]
                            = 255 * (*(pred_0000.data<float>()) > 0.5);
                }
            }
        }
```

数组转stl模型
```cpp
 qDebug() << "模型生成中...";
        vtkNew<vtkMarchingCubes> marchingcubes ;
        vtkNew<vtkSmoothPolyDataFilter> smoothfilter;
        vtkNew<vtkSTLWriter> vtk_writer_stl;
        vtkNew<vtkImageData>reader_data;
        vtkDoubleArray *tempimarr2 = vtkDoubleArray::New();
        vtkNew<vtkImageCast> imagedata;
        vtkNew<vtkMassProperties> massProperties;
        tempimarr2->SetVoidArray(testshortarr, datasize, 1);
        reader_data ->SetDimensions(512, 512, num);
        reader_data->SetSpacing(Spacing[0] * 100, Spacing[1] * 100, Spacing[2] * 100);
        reader_data->GetPointData()->SetScalars(tempimarr2);
        reader_data->Modified();
        imagedata->SetInputData(reader_data);
        imagedata->SetOutputScalarTypeToFloat();
        marchingcubes->SetInputConnection(imagedata->GetOutputPort());
        marchingcubes->SetValue(0, 1);
        massProperties->SetInputConnection(marchingcubes->GetOutputPort());
        massProperties->Update();
        qDebug() << "耗时" << time.elapsed() / 1000.0 << "s" ;
        qDebug() << QString("体积 %1 立方厘米").arg(massProperties->GetVolume() / 1000000000, 0, 'f', 2);
        qDebug() << "tmp.stl 文件保存在输入目录";
        qDebug() << "----------------end----------------";
        vtk_writer_stl->SetInputConnection(marchingcubes->GetOutputPort());
        vtk_writer_stl->SetFileName(QString(filepath + "/tmp.stl").toLocal8Bit().data());
        vtk_writer_stl->Write();
        qApp->exit();
```

