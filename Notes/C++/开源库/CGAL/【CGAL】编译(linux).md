# 【CGAL】编译(linux)


官方说明  [https://www.cgal.org/download.html](https://www.cgal.org/download.html)

源码/安装包下载   [https://github.com/CGAL/cgal/releases](https://github.com/CGAL/cgal/releases)

我的镜像   [https://pan.baidu.com/s/1o46NVDF-5faGFv5jZm44yg](https://pan.baidu.com/s/1o46NVDF-5faGFv5jZm44yg)  密码: 83re


## 1 供编译好的库，直接安装

**Debian or Linux Mint 下安装**

> sudo apt-get install libcgal-dev
> apt-get install libcgal-demo

**ArchLinux 下安装**
> sudo pacman -S cgal 

**卸载**
> sudo apt-get remove  libcgal-dev
>  sudo apt-get remove  libcgal-demo

## 2 自己编译

自己编译的话下载这个(其他版本一样

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E7%BC%96%E8%AF%91(linux).md/320681013236760.png =500x)

我编译大概一分钟，一次成功,什么错误都没出现。我的环境：
> ubuntu18.04、qt5.11.2、gcc7

我原来特别烦开源库自己编译,总是各种错误.编译好多次各种不同的之后发现,其实cmake出错很好办,configure过程中错误的话就是配置错误,make过程中错误就是缺少库,去日志里看下少什么库,谷歌搜索下前五条一定有如何安装

make成功后要不要install,看你怎么用.我工程都是直接用cmake写的,所以不用安装了,编译好就行了

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E7%BC%96%E8%AF%91(linux).md/404691113238857.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E7%BC%96%E8%AF%91(linux).md/477521113243875.png =800x)


## 3 安装错误及解决办法

用新电脑重新编译发现还是有错误的，缺少各种库，有个很方便的办法，直接安装官方提供编译好的的库，让后自己编译源码，让后卸载官方提供库。如果不按这个顺序直接编译，反正就是少各种第三方库

1. 错误1

>Could NOT find GMP (missing: GMP_LIBRARIES GMP_INCLUDE_DIR) 
CMake Error at cmake/modules/CGAL_SetupDependencies.cmake:66 (message):
  CGAL requires GMP to be found
Call Stack (most recent call first):
  CMakeLists.txt:673 (include)

**解决办法**

安装GMP  
sudo apt-get install m4   先安装m4  
https://gmplib.org/ [官网下载](https://gmplib.org/)  
https://gmplib.org/manual/Installing-GMP.html [官方安装教程](https://gmplib.org/manual/Installing-GMP.html)  


```bash
./configure --enable-cxx
make
make check
sudo make install
```

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E7%BC%96%E8%AF%91(linux).md/177061313243970.png =600x)

2.  错误2

>Could NOT find MPFR (missing: MPFR_LIBRARIES MPFR_INCLUDE_DIR) 
CMake Error at cmake/modules/CGAL_SetupDependencies.cmake:66 (message):
  CGAL requires MPFR to be found
Call Stack (most recent call first):
  CMakeLists.txt:673 (include)
  
**解决办法**

git clone https://github.com/qnzhou/PyMesh.git
cd PyMesh
git submodule update --init
cd $PYMESH_PATH/third_party
mkdir build
cd build
cmake ..
make
make install






