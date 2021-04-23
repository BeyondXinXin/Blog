

---
191015 补充 第一次编译cuda版本的，一定要注意  gcc版本  nvcc版本 cuda版本 错了就哭吧

---
190914  补充 在别人电脑上有装了两次，出现了新的问题，补充在最下边遇到的问题

---


花了整整两天才把libtorch在 ubuntu+qt上配置好
趁着刚编译完自己记录下
主要参考步骤
[https://github.com/pytorch/pytorch](https://github.com/pytorch/pytorch)
我发现stack overflow真是个好东西,基本上所有错误都有答案

使用有两种方式,我都是在qt上使用,只介绍qt使用方法

 - 1 下载编译好的直接使用(跟我现有开源库各种冲突 反正和opencv和itk不能同时用
 - 2 下载源码自己编译

---

 - 1首先说第一种方式

如果单纯使用libtorch  超容易官方提供好编译后的版本
跟自己的对应起来下载直接用
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902185338450.png)
qt使用方法
cmake里

```javascript
find_package(Torch REQUIRED)
include_directories(  ${TORCH_INCLUDE_DIRS} )
target_link_libraries(
    ${PROJECT_NAME}
    "${TORCH_LIBRARIES}"
    )	
```
TORCH_DIR写
/下载目录/share/cmake/Torch
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
我需要opencv ,搜索opencv mode里有个use opencv 勾选上,
让后设置opencv地址(据说不支持opencv4以上版本,我用的3.16
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

差不多cmake错了10几处
一个一个排查最后发现原因主要两处
1 需要安装  Anaconda   本来不想装,一直用自己原来下载的,发现无论如何装不好
2 下载源码后务必
   git submodule update --init --recursive
然而这玩意很慢很慢,一共就300M左右,(加上400M左右的源码)我一共下载了快四个小时

下载过程中分模块下载,会经常卡主,让后一段时间没有反应,就是留一个.git文件在对应模块文件夹里(third_party这个文件夹下边很多子文件夹里),卡主一段时间后git调到下一个模块下载,让后安装时候就会报错.

关键如果再重复  git submodule update --init --recursive 下载,会直接下载失败.让后我就错在这里了,cmake错误日志一个一个看下去发现全是这里的错误.

> 解决办法

挨个浏览third_party文件下每个子文件夹,把里边只有一个.git的删除掉,让后重新
git submodule update --init --recursive
让后又下载失败,但是数量少了,接着再重复删.git重新
git submodule update --init --recursive
直到每一个文件夹下边都有东西
没办法,网不好
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902192926589.png)
 3.   
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

**解决办法**   conda install pyyaml

4.  conda无法使用

vim ~/.bashrc
最后添加  export PATH=~/anaconda3/bin:$PATH
source ~/.bashrc

5. 
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

**解决办法**   
安装最新的Cmake版本。
然后从pytorch目录中删除“ build”文件夹，然后再次运行“ python setup.py install”。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191004120204720.png)












