# Deepin 使用教程：编译armadillo

源码下载
http://arma.sourceforge.net/download.html
我的镜像
链接: [https://pan.baidu.com/s/1cYHJgXTVSWFD8IpS7LN6lg](https://pan.baidu.com/s/1cYHJgXTVSWFD8IpS7LN6lg)  密码: msg3

这个麻烦点，必须先安装几个库，这几个一般新电脑都没有

> Ubuntu&Debian:  cmake, libopenblas-dev, liblapack-dev, libarpack2-dev,libsuperlu-dev。

前2个还比较大，各100M，务必使用[国内镜像源](https://blog.csdn.net/a15005784320/article/details/103083392)，几秒搞定，默认的就哭吧

> sudo apt install libopenblas-dev    
>  sudo apt install liblapack-dev   
> sudo apt install libarpack2-dev 
> sudo apt install libsuperlu-dev

解压完成，在目录里新建bulid
进入bulid 执行 

> cmake-gui ..

Configuring done
Generating done
之后，在bulid目录  

> make -j12
> sudo make install 


**如果成功就成功了，如果没成功提示少什么库装什么库（google一下缺少的lib，前三个肯定有安装命令行）**
这里安装是因为，没有什么会跟armadillo交叉编译的，版本什么的也不用换

