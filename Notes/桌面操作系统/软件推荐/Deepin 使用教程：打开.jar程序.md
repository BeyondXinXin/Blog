# Deepin 使用教程：打开.jar程序
&emsp;&emsp;deepin借助openjdk可以打开.jar程序。deepin或默认安装openjdk的，很多ide安装时候也会默认安装openjdk。先查看本机有没有openjdk。

### 一、安装openjdk
比如我的电脑没有安装，sudo安装下就可以
```bash
(base) yc@yc-PC:~$ java -version
bash: java: 未找到命令
```

```bash
(base) yc@yc-PC:~$ sudo apt install openjdk-8-jre
(base) yc@yc-PC:~$ java -version
openjdk version "1.8.0_181"
OpenJDK Runtime Environment (build 1.8.0_181-8u181-b13-2~deb9u1-b13)
OpenJDK 64-Bit Server VM (build 25.181-b13, mixed mode)
```
### 二、制作启动快捷方式

```bash
(base) yc@yc-PC:~$ which java
/usr/bin/java
(base) yc@yc-PC:~$ 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314131859318.png)
先记住java的路径。

在系统  /usr/share/applications 目录下新建一个文本文档，重命名位java.desktop
把命令改成自己路径   `Exec=/usr/bin/java -jar %f`  /usr/bin/java改为刚才which的路径（应该是跟我一样的）

```bash
[Desktop Entry]
Name=java
Comment=jar run.
Exec=/usr/bin/java -jar %f
Terminal=false
Type=Application
Icon=openjdk-8
Categories=Development;
MimeType=application/java-archive,application/x-java-archive,application/x-jar
```
保存后，会发现多了一个图标。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314132146612.png#pic_center)

这时候打开自己需要的.jar文件，右键其他程序打开
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314131325713.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314131334808.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)