# Deepin 使用教程：命令行和shell脚本编程（一）


&emsp;&emsp;以前都是在win下开发，搬到linux下还是一直喜欢点点点，感觉有必要系统学写下shell编程了。
正好接着上个月搬家到deepin，买了两本书跟着一步一步学习下。

&emsp;&emsp;书是 Linux命令行与shell脚本编程大全 和 鸟哥的私房菜


@[TOC](Deepin 使用教程：命令行和shell脚本编程 （一）)

[Deepin 使用教程：命令行和shell脚本编程（二）](https://blog.csdn.net/a15005784320/article/details/104591335)
[Deepin 使用教程：命令行和shell脚本编程（三）](https://blog.csdn.net/a15005784320/article/details/104710728)


# 1 初识Deepin

&emsp;&emsp;deepin是一个完整的linux发行版本

主要包含了四个部分
1. linux内核
2. GUN工具
3. 图形化桌面环境
4. 应用软件
# 2 Deepin访问 CLI/命令行

CLI：借助由shell所提供的文本命令界面。
## 2.1 通过控制台终端访问CLI

deepin启动后会默认创建
图形界面（1个）      进入快捷键  Ctrl+Alt+F1 
虚拟控制台（5个）    进入快捷键  Ctrl+Alt+F2-F6 
虚拟控制台第一行最后会有一个tty2-tty6告诉你进入的是第几个虚拟控制台
login：输入用户id
password：输入密码
登录成功就进入CLI了
当然了，这个黑屏眼睛看久了很难受，反色一下不错
虚拟控制台不好截图，我用图形化终端演示下效果，自己在控制台终端试一下，发现比大黑屏好多了
```bash
setterm -inverssecreen on
#setterm -inverssecreen off
```




![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204192420495.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204192441832.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
## 2.2 通过图形化终端访问CLI

深度自带的图形化终端叫做  深度终端
打开他快捷键  trl+Alt+T
基本操作 查看快捷键 trl+Alt+？

深度自己专门做的花里胡哨的操作
1） 雷神模式  快捷键alt+f2 退出就是再按一次
2） 内置几十种配色方案
3） 增加远程管理一套，链接和记录ssh方便很多
4） 支持自定命令行命令

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204193736745.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
# 3 Deepin 基本的bash shell 指令

## 3.1 启动shell

shell（命令语言解释器） 是 使用者和linux内核之间的接口程序
bash是shell的一种，deepin默认使用的就是GUN bash shell
如何查看当前使用的是哪一种shell
```bash
echo $SHELL
#echo 显示文字 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204194708168.png#pic_center)
GUN bash shell 提供交互访问，他是作为普通程序运行的，一般用户登录终端启动，默认使用那种shell，在 /etc/passwd
每个条目七个字段，最后一个就是指定shell程序（deepin默认bash，没事别改）
```bash
cat /etc/passwd
#cat 打印文件
```
第一行root 指控制台的shell
最后一行yc 指我登陆后的shell
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204195737506.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
## 3.2 shell 提示符
这玩意自己可以随便改，后面介绍如何更改。
这个主要功能是，告诉你本行是shell的如何、显示系统和用户信息

> (base) yc@yc-PC:~$

输入完命令需要按回车才会执行

## 3.3 bash 手册

其实工作和日常使用中，如果熟悉查找手册，比百度快多了。
```bash
man bash
#man 打印手册 q返回  enter下一行
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204200620562.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
## 3.4 浏览文件系统

### 3.4.1 文件目录
跟win不同的是，linux不适用盘符（c、d、e），linux把文件存在单个目录结构中（虚拟目录）。
虚拟目录只包含一个基础目录
linxu会在根目录创建一些特殊目录，我们称为挂载点
下边列出我觉得比较有用的（还有很多我没打感觉自己永远用不到

目录     | 用途
-------- | -----
/  | 根目录，一般不在这存储文件
/bin  | 二进制目录，放用户级的GUN工具
/boot  | 启动目录
/dev   | 设备目录
/etc   |系统配置目录
/home   | 用户目录
/lib | 库目录，放系统和应用程序的库文件
/sys | 系统目录，硬件信息
/tmp | 临时文件目录
/usr | 用户二进制目录，自己安装的软件
/var | 可变目录，经常变化的目录

在登录深度终端后并获得shell CLI 提示符后，回话从主目录（特殊目录，后边介绍）开始。
切换目录，可以用图形界面切换或者使用 cd 进行跳转
```bash
cd 
```
### 3.4.2 遍历目录
```bash
cd destiation
# cd 目录跳转
# 没有参数回到主目录
# 一个参数 跳转值该参数路径
```

&emsp;&emsp;这里有个概念就是  绝对路径 和 相对路径
绝对路径  以 / 起头，指明虚拟文系统的根目录 比如 /tmp 绝对路径的临时文件目录。cd 可以使用绝对路径跳转到任意地方
相对路径  不以 / 起头，指相对于当前目录的目录  .表示当前目录   ..表示当前目录的父级目录

shell 提示符明确指示当前目录  有～代表当前目录就是主目录，如果没有～那就是当前目录的绝对路径
```bash
(base) yc@yc-PC:~$ cd /home
(base) yc@yc-PC:/home$ 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191204203105682.png#pic_center)


## 3.5 文件和目录列表

```bash
ls
```
ls 基本形式会显示当前目录下的文件和目录（按字母排序
-F 文件和路径按颜色区分（深度终端支持彩色，因此-F 参数加不加无所谓
-a 显示隐藏文件
-R 显示子目录（最好别在根目录加，会很长
-l 列表形式显示

如果目录下有很多文件，ls会很长。他自带一个过滤器，决定显示那些文件/路径。
“?” 代表一个字符
“*” 代表多个字符
“[]” 中括号代表字符匹配 [ai]指字母范围a-i  [!a]不要字母a

## 3.6 处理文件
### 3.6.1 创建文件
```bash
touch test.txt
# touch 创建新的空文件
```
### 3.6.2 复制文件
```bash
cp source destination
# cp 复制文件 sourch 原始文件  destination 新文件
cp -i source destination
# 新文件判断当前是否存在，有一个询问。如果新文件已经存在，且没有确认，则不覆盖
# 文件使用绝对路径和相对路径都可以
```
### 3.6.3 链接文件
如果两个地方都需要使用一个文件，linux可以创建一个链接
链接文件分为符号链接和应链接
ln 创建链接，默认创建硬链接  

### 3.6.4 重命名文件

&emsp;&emsp;mv命令 用来对文件或目录重新命名，或者将文件从一个目录移到另一个目录中。source表示源文件或目录，target表示目标文件或目录。如果将一个文件移到一个已经存在的目标文件中，则目标文件的内容将被覆盖。

1. 将目录/usr/men中的所有文件移到当前目录（用.表示）中：
```bash
mv /usr/men/* .
```
2. 移动文件
```bash
mv file_1.txt /home/office/
```
3. 移动多个文件
```bash
mv file_2.txt file_3.txt file_4.txt /home/office/
mv *.txt /home/office/
```
4. 移动目录
```bash
mv directory_1/ /home/office/
```

5. 重命名文件或目录
```bash
mv file_1.txt file_2.txt # 将文件file_1.txt改名为file_2.txt
```
6. 打印移动信息
```bash
mv -v *.txt /home/office
```
7. 提示是否覆盖文件
```bash
mv -v *.txt /home/office
```
8. 源文件比目标文件新时才执行更新
```bash
mv -uv *.txt /home/office
```
9. 不要覆盖任何已存在的文件
```bash
mv -vn *.txt /home/office
```
10. 复制时创建备份
```bash
mv -bv *.txt /home/office
```
11. 无条件覆盖已经存在的文件
```bash
mv -f *.txt /home/office
```

## 3.7 创建、删除目录

```bash
mkdir /usr/test #创建目录
```
```bash
mkdir -p /usr/test/test/test #创建目录且补全父目录
```
```bash
rmdir www #删除目录
```
```bash
rmdir -p a/b/c #如果删除 c目录后 b目录为空则b也删除
```
## 3.8 查看文件内容

**查看全部文件**
cat  文件显示出来，非常方便
more 每次，部分显示文件。类似于安装包
less more的升级版，有更多功能
**查看部分文件**
tail 尾部10行
head 头部10行


---
未完待续........

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)