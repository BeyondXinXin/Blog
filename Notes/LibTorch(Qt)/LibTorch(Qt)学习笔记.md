# LibTorch(Qt)使用笔记


## 1 qt 使用 libtorch



花了整整两天才把libtorch在 ubuntu+qt上配置好，趁着刚编译完自己记录下。
主要参考步骤 [https://github.com/pytorch/pytorch](https://github.com/pytorch/pytorch)


使用有两种方式,我都是在qt上使用,只介绍qt使用方法

 - 1 下载编译好的直接使用(跟我现有开源库各种冲突 反正和opencv和itk不能同时用
 - 2 下载源码自己编译

---

 - 1首先说第一种方式

如果单纯使用libtorch  超容易官方提供好编译后的版本跟自己的对应起来下载直接用  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902185338450.png)  
qt使用方法cmake里  

```javascript
find_package(Torch REQUIRED)
include_directories(  ${TORCH_INCLUDE_DIRS} )
target_link_libraries(
    ${PROJECT_NAME}
    "${TORCH_LIBRARIES}"
    )	
```
TORCH_DIR写  /下载目录/share/cmake/Torch  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902185616629.png)  

测试

```javascript
torch::Tensor tensor = torch::rand({2, 3});
std::cout << tensor << std::endl;
```
结果  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902185741287.png)

---

 2. 第二种编译方式


安装  Anaconda 
下载直接点点点就行,就一个选项,是否帮忙设置环境,选择是就可以
[Anaconda](https://www.anaconda.com/distribution/#download-section)
安装后输入python试一下
我这样就是正常的  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902190837203.png)  
下载源码

    git clone --recursive https://github.com/pytorch/pytorch
国内网速下载不好,时间很久

    cd pytorch
    git submodule sync
    git submodule update --init --recursive
又是很久很久
结束之后设置

    export CMAKE_PREFIX_PATH=${CONDA_PREFIX:-"$(dirname $(which conda))/../"}
    python setup.py build --cmake-only
    ccmake build  # or cmake-gui build
我需要opencv ,搜索opencv mode里有个use opencv 勾选上,让后设置opencv地址(据说不支持opencv4以上版本,我用的3.16
让后我的显卡是a卡,use cuda取消  
cudnn同样不能用  use cudnn取消  
test反正我编译什么都不选  bulid test取消  
让后congigure 和generate就可以了  

当然了,可以不用cmake-gui设置  
直接这样可以(如果用cuda就前两个设置成1

    USE_CUDA=0 USE_MKLDNN=0 BUILD_TEST=0 python setup.py install

这个很快安装好就可以了

qt调用 
cmake里

```javascript
find_package(Torch REQUIRED)
include_directories(  ${TORCH_INCLUDE_DIRS} )
target_link_libraries(
    ${PROJECT_NAME}
    "${TORCH_LIBRARIES}"
    )	
```
TORCH_DIR写  /build/lib.linux-x86_64-3.7/torch/share/cmake/Torch  目录自己生成的

    /home/yx/文档/pytorch/build/lib.linux-x86_64-3.7/torch/share/cmake/Torch



---

> 遇到的错误


1. 需要安装  Anaconda   本来不想装,一直用自己原来下载的,发现无论如何装不好


2. 下载源码后务必 
```bash
git submodule update --init --recursive
```
下载过程中分模块下载,会经常卡主,让后一段时间没有反应,就是留一个.git文件在对应模块文件夹里(third_party这个文件夹下边很多子文件夹里),卡主一段时间后git调到下一个模块下载,让后安装时候就会报错.  
关键如果再重复  git submodule update --init --recursive 下载,会直接下载失败.  
让后我就错在这里了,cmake错误日志一个一个看下去发现全是这里的错误.

> 解决办法

挨个浏览third_party文件下每个子文件夹,把里边只有一个.git的删除掉,让后重新
git submodule update --init --recursive
让后又下载失败,但是数量少了,接着再重复删.git重新
git submodule update --init --recursive

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902192926589.png)  

 3.   

 ```
 Building wheel torch-1.3.0a0+a024e1e
-- Building version 1.3.0a0+a024e1e
Traceback (most recent call last):
  File "setup.py", line 759, in <module>
    build_deps()
  File "setup.py", line 313, in build_deps
    check_pydep('yaml', 'pyyaml')
  File "setup.py", line 368, in check_pydep
    raise RuntimeError(missing_pydep.format(importname=importname, module=module))
RuntimeError: Missing build dependency: Unable to `import yaml`.
Please install it via `conda install pyyaml` or `pip install pyyaml`
 ```

**解决办法**   

```bash
conda install pyyaml
```

4.  conda无法使用

```bash
vim ~/.bashrc
# 最后添加  export PATH=~/anaconda3/bin:$PATH
source ~/.bashrc
```

5. 
```
Building wheel torch-1.3.0a0+a024e1e
-- Building version 1.3.0a0+a024e1e
cmake --build . --target install --config Release -- -j 12
No such file or directory
CMake Error: Generator: execution of make failed. Make command was: "/home/yx/anaconda3/bin/ninja" "-j" "12" "install"
Traceback (most recent call last):
  File "setup.py", line 759, in <module>
    build_deps()
  File "setup.py", line 321, in build_deps
    cmake=cmake)
  File "/home/yx/文档/pytorch/tools/build_pytorch_libs.py", line 63, in build_caffe2
    cmake.build(my_env)
  File "/home/yx/文档/pytorch/tools/setup_helpers/cmake.py", line 330, in build
    self.run(build_args, my_env)
  File "/home/yx/文档/pytorch/tools/setup_helpers/cmake.py", line 143, in run
    check_call(command, cwd=self.build_dir, env=env)
  File "/home/yx/anaconda3/lib/python3.7/subprocess.py", line 347, in check_call
    raise CalledProcessError(retcode, cmd)
subprocess.CalledProcessError: Command '['cmake', '--build', '.', '--target', 'install', '--config', 'Release', '--', '-j', '12']' returned non-zero exit status 1.
```

**解决办法**   
安装最新的Cmake版本。然后从pytorch目录中删除“ build”文件夹，然后再次运行“ python setup.py install”。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191004120204720.png)









## 2 使用libtorch模型推理


---
这两天做了qt下利用libtorch对模型进行推理.整理下方便自己今后使用

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

libtorch 就是把pytorch 搬到了c++端，方便算法实现商业化。基本操作流程就是python训练好模型，导出.pt模型c++程序  读取图片，传入libtorch 根据上一步的模型进行预测训练结果导出成图片或其他信息用于显示

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

导出图片：这里最傻，为什么这么多at::Tensor就是为了减少从显存到内存的次数，和增加每次交换数据量。这里肯定有更好的办法，我没找到，谁知道非常感谢可以告诉我
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





