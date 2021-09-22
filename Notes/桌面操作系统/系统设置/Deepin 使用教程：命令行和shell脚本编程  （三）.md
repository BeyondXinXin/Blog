# Deepin 使用教程：命令行和shell脚本编程  （三）

&emsp;&emsp;以前都是在win下开发，搬到linux下还是一直喜欢点点点，感觉有必要系统学写下shell编程了，买了两本书跟着一步一步学习下。书是 **Linux命令行与shell脚本编程大全** 和 **鸟哥的私房菜**，以下内容主要是从书里摘抄，在deepin下测试写的。

[Deepin 使用教程：命令行和shell脚本编程（一）](https://blog.csdn.net/a15005784320/article/details/103392759)
[Deepin 使用教程：命令行和shell脚本编程（二）](https://blog.csdn.net/a15005784320/article/details/104591335)

@[TOC](Deepin 使用教程：命令行和shell脚本编程（三）)

# 6 环境变量
## 6.1 什么是环境变量
&emsp;&emsp;shell 使用环境变量来储存有关shell的工作环境信息。可以在内存中储存数据，程序或shell可以方便的访问他们。这是存储持久数据的一种简便方法。环境变量分为

 - 局部变量
 - 全局变量
 
**全局环境变量**
&emsp;&emsp;全局环境变量对于所有的shell/子shell/程序都是可见的。deepin在你开始bash会话的时候就设置了很多全局变量，基本上全是大写的。env/printenv 可以看去全局变量。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307105404225.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;这里边信息很多，如果只想看某一个的话
printenv  XXXX
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307105549820.png)
&emsp;&emsp;echo也可以，全局变量引用的时候需要加一个$
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307105650716.png)


**局部环境变量**

局部环境变量只能在定义他们的进程中可见。怎么设置见下一节

## 6.2 设置用户定义变量
### 6.2.1 局部用户定义变量
&emsp;&emsp;启动了shell 或者 shell脚本，就可以创建在这个shell进程内可见的局部变量了。
&emsp;&emsp;= 可以直接赋值，设置局部变量
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307110814202.png)
&emsp;&emsp;每次定义直接用=就可以 使用前边加$。如果需要空格等特殊字符 单引号括起来。
&emsp;&emsp;赋值时候不能使用空格。
&emsp;&emsp;在子shell创建的局部变量，当子shell退出后，局部变量就没有了。
### 6.2.1 全局用户定义变量
&emsp;&emsp;就是先创建局部环境变量，在使用export导出到全局环境变量
比如
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307110545766.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
## 6.3 删除环境变量
&emsp;&emsp;unset 就是删除命令。（在子shell删除全局变量，父shell还可以用）

## 6.4 设置path环境变量
&emsp;&emsp;当你在shell执行外部命令时，shell必须搜索系统来找到对应程序。PATH环境变量定义了用来进行命令和程序查找的目录。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307112447986.png)
&emsp;&emsp;使用： 分割。但是很多时候程序放置可执行程序没有在PATH包含的路径，如果不用绝对路径的话shell找不到。会报错
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307112727567.png)
&emsp;&emsp;解决办法一般是保证PATH环境变量包含了所有存放应用程序的目录。PATH路径可以直接在后面添加，无需从头修改。

```bash
PATH=$PATH:.   #把当前目录加载到全局变量
```
上述办法如果重启就失效了。永久有效放在下一节

## 6.5 定位系统环境变量
&emsp;&emsp;当你登录deepin的时候，bash shell 会作为登录shell启动。启动时候从文件里读取命令
&emsp;&emsp;$HMOE/.bashrc   #用户配置


&emsp;&emsp;其实deepin启动时候有很多配置文件，但是一般不建议修改，需要我们了解这个配置到底是做什么再尝试修改。刚开始如果我们要添加环境变量通过export的方式就可以，跟软件、显示等就加进$HMOE/.bashrc 里。
比如我安装了halcon ，那么我就在$HMOE/.bashrc 最下方添加halcon的路径。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307114513352.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;如果目前非要改的话，最好新建.sh文件，让后添加进系统，不要改原来的。具体方法在/etc/init.d  下新建.sh文件
添加需要的脚本后，添加进启动项（尽可能往后，下边例子22）举例

```bash
sudo vim /etc/init.d/kill_ideapad_laptop.sh
```

```bash
#! /bin/sh
### BEGIN INIT INFO
# Provides:          XXX
# Required-Start:    $syslog $remote_fs
# Required-Stop:     $syslog $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: start XXX
# Description:       start XXX
### END INIT INFO

echo '1'|sudo -S modprobe -r ideapad_laptop

exit 0
```
```bash
sudo update-rc.d kill_ideapad_laptop.sh defaults 22
```
deepin 的开机关机脚本都在这里
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307115201519.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
## 6.6 数组变量
&emsp;&emsp;把变量当做数组来使用

```bash
test=(/test1 /test2 /test3)
echo $test
echo ${test[*]}
echo ${test[2]}
unset $test
echo $test
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307121015717.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
未完待续…

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)
