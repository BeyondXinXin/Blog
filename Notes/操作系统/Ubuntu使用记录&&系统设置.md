# Ubuntu使用记录&&系统设置

来公司一周，一眼望去不是linux就是mac，自己这个win都不好意思打开了。
之前用过一段时间的ubuntu，当时是机械专业，先抛开没有各种画图软件，ubuntu对于小白来说经常出问题，让后随便百度一下，复制几行代码就解决了，关键是记不住啊下次还这样咋办，过几天都不记得出过这个问题了，让后我果断把他扔了。
这次没办法，必须换了要不然就自己用windos跟同事对接太麻烦了，为了解决这个出问题记不住的尴尬，我这在这篇blog里记录我所有从网上复制来的命令行，以便自己将来查找问题。

要是每个搜索的问题都单独写一个博客实在太水了，那样我一天能写n个了，还是记录在一起好了

**每天更新自己白天遇到的问题和复制的解决办法，只记录自己解决问题的办法，为啥这样子，或者其他有什么参数我不知道！！！！**


---


## 1 shell 统计文件夹大小排序  du -sh sort -nr  G、M、K无效 

```bash
du -sh *
du -sh * | sort -nr
for i in $(ls -l |grep '^d' |du -s * |sort -nr|awk '{print $2}');do du -sh $i;done
```

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/200731221223154.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/287121221216039.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/374091221216648.png =800x)

## 2 加密的方式在本地主机和远程主机之间复制文件

使用命令  **scp**

加密的方式在本地主机和远程主机之间复制文件

scp命令 用于在Linux下进行远程拷贝文件的命令，和它类似的命令有cp，不过cp只是在本机进行拷贝不能跨服务器，而且scp传输是加密的。可能会稍微影响一下速度。当你服务器硬盘变为只读read only system时，用scp可以帮你把文件移出来。另外，scp还非常不占资源，不会提高多少系统负荷，在这一点上，rsync就远远不及它了。虽然 rsync比scp会快一点，但当小文件众多的情况下，rsync会导致硬盘I/O非常高，而scp基本不影响系统正常使用。

```bash
#上传本地目录到远程机器指定目录
scp -P 95 Anaconda3-2020.02-Linux-x86_64.sh root@118.25.63.144:home/yx/
```

```bash
#从远处复制文件到本地目录
scp -P 95 root@118.25.63.144:/opt/soft/nginx-0.5.38.tar.gz /opt/soft/
```

```bash
#语法
#scp(选项)(参数)
#选项
#-1： 使用ssh协议版本1；
#-2： 使用ssh协议版本2；
#-4： 使用ipv4；
#-6： 使用ipv6；
#-B： 以批处理模式运行；
#-C： 使用压缩；
#-F： 指定ssh配置文件；
#-i： identity_file 从指定文件中读取传输时使用的密钥文件（例如亚马逊云pem），此参数直接传递给ssh；
#-l： 指定宽带限制；
#-o： 指定使用的ssh选项；
#-P： 指定远程主机的端口号；
#-p： 保留文件的最后修改时间，最后访问时间和权限模式；
#-q： 不显示复制进度；
#-r： 以递归方式复制。
```



## 3 Ubuntu  ssh 链接

```bash
sudo apt install openssh-client #本地主机运行此条，实际上通常是默认安装client端程序的
sudo apt install openssh-server #服务器运行此条命令安装
```

```bash
sudo /etc/init.d/ssh start #服务器启动ssh-server服务
sudo /etc/init.d/ssh stop #server停止ssh服务
sudo /etc/init.d/ssh restart #server重启ssh服务
```

```bash
ifconfig #查询ip地址，在返回信息中找到自己的ip地址
```

```bash
ssh dell@192.168.30.6
# 如果需要调用图形界面程序
ssh -X dell@192.168.30.6
```

```bash
Ctrl+D   #退出
```

## 4 ubuntu 下  virtualbox 启动时Kernel driver not installed (rc=-1908) 错误

之前好好地，换了个电脑总是出现这个问题，百度各种方法，挨个试了一遍感觉就是装了一大堆乱七八糟也没啥用。

找了一圈原因很简单，主板bios开着安全启动，关闭了就行
bios里找**secure Boot Enable**  把他关了，应该就可以了。

## 5 Ubuntu 控制台前多了个   base


忘记自己装了什么,发现自己控制台前突然多了个  base怎么也去不掉

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/195451321243603.png =800x)

去掉的话输入 

> conda config --set auto_activate_base False 

让后重启,启用的话  True就可以了

作用是    命令行的Jupyter命令会是否生效

## 6 rdesktop   远程操作windos  （类似于win里的mastsc
使用rdesktop
```shell
#检测rdesktop是否安装
rdesktop
```
没安装的话会提示没有命令，安装的话会提示帮助信息；我的系统是自带就安装好了，没有安装的话sudo apt-get install 
```shell
#安装rdesktop
sudo apt-get install rdesktop
```
登录
```shell
#登录rdesktop
rdesktop  -a 16 -u Administrator -p  ******  118.25.63.144 
#Administrator是自己远程访问电脑的用户名
#******是自己远程访问电脑的密码
```
坑

 1. 我的密码里有个 ！，这玩意不能够直接输入，需要括号引起来,都是英文的
 ```shell
  "!"  
```

 2. 远程操作不能全屏，不能改垂直方向分辨率，横向可以用-g设置
---

## 7 shall文件直接打开
控制台写的命令，如何转换成一个文件双击自动启动，打开记事本，我用的notepadqq，输入自己的shell命令，保存成***.sh文件，让后右键属性---权限，向下边这样就可以

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/127603210216918.png =800x)

如果还是打不开的话，随意打开一个文件夹，左上角选择首选项。可执行文本设置为运行就可以了

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/207343210239358.png =800x)


这样就可以双击打开了

---

## 8 截图-像微信一样直接复制到粘贴板
ubuntu像windos一样自带截图软件screenshot
控制台输入

```shell
gnome-screenshot -h
```

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/316593210234494.png =800x)

可以自己挑选想用的，-ac就是微信的功能了，键盘添加快捷键

> gnome-screenshot  -ac

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/418893210228040.png =800x)

---
## 9 配置内存使用
http://blog.itpub.net/29371470/viewspace-1250975（本节内容转自此篇文章）
ubuntu 图形程序经常卡主，搜了下原因可能是过多使用磁盘而不是物理内存。
swappiness的值的大小对如何使用swap分区是有着很大的联系的。swappiness=0的时候表示最大限度使用物理内存，然后才是swap空间，swappiness＝100的时候表示积极的使用swap分区，并且把内存上的数据及时的搬运到swap空间里面。linux的基本默认设置为60，具体如下：

cat /proc/sys/vm/swappiness
#60
也就是说，你的内存在使用到100-60=40%的时候，就开始出现有交换分区的使用。大家知道，内存的速度会比磁盘快很多，这样子会加大系统IO，同时造的成大量页的换进换出，严重影响系统的性能，所以我们在操作系统层面，要尽可能使用内存，对该参数进行调整。

临时调整的方法如下，我们调成10：

sysctl vm.swappiness=10
#vm.swappiness=10
cat /proc/sys/vm/swappiness
#10
这只是临时调整的方法，重启后会回到默认设置的.

要想永久调整的话，需要在/etc/sysctl.conf修改，加上：

sudo vim /etc/sysctl.conf
加上


kernel.shmall = 4294967296 #这一个可以不用设置
vm.swappiness = 10
 生效

sudo sysctl -p
这样便完成修改设置！



---
## 10 TAB快速编写、补全
今天才知道控制台按下tab可以自动补全。尴尬

---
## 11 控制台复制粘贴 鼠标中键
一直很烦，在控制台复制粘贴需要shift+ctrl+c+v
偶然发现，原来ubuntu下鼠标中键可以直接复制当前光标选中文本，贼舒服


# Linux 下Appimage 压缩解压命令


参考  [https://github.com/AppImage/AppImageKit](https://github.com/AppImage/AppImageKit)



## 1 需求  

公司有几款产品打包成`appimage`的形式，现场测试时有时需要替换其中几个库（比如加密狗、图片等），就需要解压文件然后在压缩。本来认为需要每次打包后无法修改。翻了下官方介绍才发现，`appimage`支持直接压缩和解压。

## 2 打包好的 Appimage 解压

> `--appimage-extract` extracts the contents from the embedded filesystem image, then exits. This is useful if you are using an AppImage on a system on which FUSE is not available

> `--appimage extract`    从嵌入的文件系统映像中提取内容，然后退出。如果您在FUSE不可用的系统上使用AppImage，这将非常有用

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95%26%26%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/165764210211366.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95%26%26%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/261694210211505.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95%26%26%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/337034210223595.png =800x)


## 3 打包好的 Appimage 解压修改后在压缩

`linuxdeployqt`  可以用来给可执行程序复制引用库、制作**AppRun**、快捷方式并压缩。

> `appimagetool` 则可以直接压缩  “已经打包好的`appimage`解压后的文件夹（上一步解压的文件夹）”。

请注意使用`appimagetool`压缩时，只检验文件夹内是否存在快捷方式和**AppRun**，至于需要连接的库不再验证，如果自己解压后手动删除了引用库会造成新压缩后文件无法使用。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95%26%26%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/422104210228634.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/ubuntu%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95%26%26%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE.md/498134210229929.png =800x)



使用环境可能没有`appimagetool`，需要自己提前下载/编译好拷贝到压缩的电脑。



- 如果联网的话可以直接下载
```bash
wget "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-aarch64.AppImage"
```
- 或者提前下载源码自己编译下



