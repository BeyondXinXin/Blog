# Ubuntu 使用个人记录

@[TOC](Ubuntu 使用个人记录)

来公司一周，一眼望去不是linux就是mac，自己这个win都不好意思打开了。
之前用过一段时间的ubuntu，当时是机械专业，先抛开没有各种画图软件，ubuntu对于小白来说经常出问题，让后随便百度一下，复制几行代码就解决了，关键是记不住啊下次还这样咋办，过几天都不记得出过这个问题了，让后我果断把他扔了。
这次没办法，必须换了要不然就自己用windos跟同事对接太麻烦了，为了解决这个出问题记不住的尴尬，我这在这篇blog里记录我所有从网上复制来的命令行，以便自己将来查找问题。

要是每个搜索的问题都单独写一个博客实在太水了，那样我一天能写n个了，还是记录在一起好了

**每天更新自己白天遇到的问题和复制的解决办法**
**只记录自己解决问题的办法，为啥这样子，或者其他有什么参数我不知道！！！！**

---

##  01      rdesktop   远程操作windos  （类似于win里的mastsc
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
## 02        shall文件直接打开
控制台写的命令，如何转换成一个文件双击自动启动，打开记事本，我用的notepadqq，输入自己的shell命令，保存成***.sh文件，让后右键属性---权限，向下边这样就可以
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817123015188.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
如果还是打不开的话，随意打开一个文件夹，左上角选择首选项。可执行文本设置为运行就可以了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817123118332.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


这样就可以双击打开了

---
##  03     截图-像微信一样直接复制到粘贴板
ubuntu像windos一样自带截图软件screenshot
控制台输入
 ```shell
gnome-screenshot -h  
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817123536504.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
可以自己挑选想用的，-ac就是微信的功能了，键盘添加快捷键

> gnome-screenshot  -ac

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817123633175.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

---
##  04      配置内存使用
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
##  05     TAB快速编写、补全
今天才知道控制台按下tab可以自动补全。尴尬

---
##  06     控制台复制粘贴 鼠标中键
一直很烦，在控制台复制粘贴需要shift+ctrl+c+v
偶然发现，原来ubuntu下鼠标中键可以直接复制当前光标选中文本，贼舒服


