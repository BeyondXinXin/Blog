# Deepin 使用教程：编译opencv

我觉得最无语的事情，opencv 2  3  4三个大版本，函数名称竟然不一样，唉。
我这里编译opencv 330。

Opencv下载
[https://github.com/opencv/opencv/releases](https://github.com/opencv/opencv/releases)

我的镜像
链接: [https://pan.baidu.com/s/1ZVSNQ09PzjXJ5J2Jt9Es8A](https://pan.baidu.com/s/1ZVSNQ09PzjXJ5J2Jt9Es8A)  密码: rgtj

解压完成，在目录里新建bulid
进入bulid 执行 

> cmake-gui ..

Configuring 有一步骤很慢
IPPICV: Download: ippicv_2017u2_lnx_intel64_20170418.tgz
去makefile里看看源码，其实就是去git上下了个文件，我也是醉了，Configuring 下载东西。两个办法，直接等着，没用ssr/ss 大概几分钟卡在这里，其实也不久就是看着卡主很不爽。或者去git上提前下载好，让后替换点cmake的路径。
Git地址（除非你也安装opencv 330版本，去下边这个路径下载，如果其他版本，git地址不是这个，需要去看自己的makefile文件）
这个路径
3rdparty/ippicv/ippicv.cmake

https://github.com/opencv/opencv_3rdparty/tree/ippicv/master_20170418/ippicv
把下载好的用路径替换3rdparty/ippicv/ippicv.cmake里网址就行。

当然了我反正不着急，我每次就是等一会。

Configuring done
Generating done
之后，在bulid目录  

> make -j12

**如果成功就成功了，如果没成功提示少什么库装什么库（google一下缺少的lib，前三个肯定有安装命令行）
有些教程make 后让安装  sudo make install ，这个看个人使用环境了，我就不安装，因为我要用多个版本，相互交叉编译，安装了反而麻烦。何况我程序就是用cmake写的，所以我这里不install，如果你用qmake搭建程序，可以安装 运行install就可以，其实就是吧.h和.o .a放到系统变量里**

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)