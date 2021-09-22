# Deepin 使用教程：安装cmake

官网下载
[https://cmake.org/download/](https://cmake.org/download/)
我个人镜像
链接: [https://pan.baidu.com/s/13l5K4D4FNNrSwwq3IijM0Q](https://pan.baidu.com/s/13l5K4D4FNNrSwwq3IijM0Q)  密码: 6077

我是安装的3.12（deepin apt安装的好像是3.09的，我装过一次，有段代码quazip里的，死活编译不过去，版本升级了就好了）

解压 移动就好了

> tar zxvf cmake-3.12.2-Linux-x86_64.tar.gz （这个命令在下载目录执行，其实就是解压到当前目录）
> sudo mv cmake-3.12.2-Linux-x86_64 /opt/cmake-3.12.2
> （这个命令在解压后目录执行，其实就是移动到系统运行环境） cd（回到根目录） sudo ln -sf
> /opt/cmake-3.12.2/bin/*  /usr/bin/（这个命令在根目录执行）

测试

> cmake-gui
> 
> cmake --version


这里提一嘴
x : 从 tar 包中把文件提取出来
z : 表示 tar 包是被 gzip 压缩过的，所以解压时需要用 gunzip 解压
v : 显示详细信息
f xxx.tar.gz : 指定被处理的文件是 xxx.tar.gz

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)