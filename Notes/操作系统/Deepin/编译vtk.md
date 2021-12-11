# Deepin 使用教程：编译vtk

我这里安装vtk8.12 和 vtk8.20，8.20主要是新增加了vtkopenglnavitewidget，有时候需要用到这个。
学习资源  
vtk官网
[https://vtk.org/](https://vtk.org/) 
Vtk官方案例 
[https://lorensen.github.io/VTKExamples/site/Cxx/](https://lorensen.github.io/VTKExamples/site/Cxx/)
阿兵-AI医疗 csdn博客 
[https://blog.csdn.net/webzhuce?utm_source=feed](https://blog.csdn.net/webzhuce?utm_source=feed)

先下载源码，
官网提供8.20的安装包（[https://vtk.org/download/](https://vtk.org/download/)）
Git上可以下载历史版本
[https://github.com/Kitware/VTK/releases](https://github.com/Kitware/VTK/releases)
慢的话我个人的镜像（两个版本源码我改过一点点，建议自己去git上下载）
链接: [https://pan.baidu.com/s/1nTwXl-WuuHseIJuURuGZhg](https://pan.baidu.com/s/1nTwXl-WuuHseIJuURuGZhg)  密码: dm47
链接: [https://pan.baidu.com/s/1bDT6kDrnj7USYu_Klxz8Fg](https://pan.baidu.com/s/1bDT6kDrnj7USYu_Klxz8Fg)  密码: drku

解压完成，在目录里新建bulid

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E7%BC%96%E8%AF%91vtk.md/522073610211503.png)

进入bulid 执行 

> cmake-gui ..

第一次Configuring勾选  qt相关

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E7%BC%96%E8%AF%91vtk.md/18083710223593.png)

 取消勾选 test
 
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E7%BC%96%E8%AF%91vtk.md/99473710228632.png)

  第二次选择qt_dir   cmake路径
  这是我的
/home/yx/Qt5.11.3/5.11.3/gcc_64/lib/cmake/Qt5
Configuring done
Generating done
之后，在bulid目录  

> make -j12

*如果成功就成功了，如果没成功提示少什么库装什么库（google一下缺少的lib，前三个肯定有安装命令行）*

**有些教程make 后让安装  sudo make install ，这个看个人使用环境了，我就不安装，因为我要用多个版本，相互交叉编译，安装了反而麻烦。何况我程序就是用cmake写的，所以我这里不install，如果你用qmake搭建程序，可以安装 运行install就可以，其实就是吧.h和.o .a放到系统变量里**


两个版本安装方式一样，注意8.20我用带一个mode_vtkDICOM模块，源码需要改一下，路径见下图第六行改一下，要不然找不到
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E7%BC%96%E8%AF%91vtk.md/211013710229927.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E7%BC%96%E8%AF%91vtk.md/295113710230929.png)

