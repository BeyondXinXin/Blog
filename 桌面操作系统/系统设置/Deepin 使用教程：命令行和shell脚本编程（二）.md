# Deepin 使用教程：命令行和shell脚本编程（二）

&emsp;&emsp;以前都是在win下开发，搬到linux下还是一直喜欢点点点，感觉有必要系统学写下shell编程了，买了两本书跟着一步一步学习下。书是 **Linux命令行与shell脚本编程大全** 和 **鸟哥的私房菜**，以下内容主要是从书里摘抄，在deepin下测试写的。

  书是 Linux命令行与shell脚本编程大全 和 鸟哥的私房菜

[Deepin 使用教程：命令行和shell脚本编程（一）](https://blog.csdn.net/a15005784320/article/details/103392759)

@[TOC](Deepin 使用教程：命令行和shell脚本编程 （二）)

[Deepin 使用教程：命令行和shell脚本编程（三）](https://blog.csdn.net/a15005784320/article/details/104710728)

# 4 Deepin 下更多的shell命令
&emsp;&emsp;本章主要涉及  进程的管理、磁盘信息统计、挂载新磁盘、排序数据、归档数据。
## 4.1 监测程序
&emsp;&emsp;大量的应用才能生成完整的桌面环境，deepin精美桌面的背后总是运行这大量的程序，我们需要熟练掌握管理程序的基本工具及用法。本节依次介绍
      &emsp;&emsp;&emsp;&emsp;  **1. 探查进程　ps 命令**
      &emsp;&emsp;&emsp;&emsp; **2. 实时监测进程　top 命令**
     &emsp;&emsp;&emsp;&emsp; **3. 结束进程　kill 命令**
### 4.1.1 探查进程　ps 命令
&emsp;&emsp;程序运行在系统上，称之为进程（process），一个程序就是一个单独的进程（程序内的并列多个程序叫做线程）。如果需要查看进程，就要使用ps命令，他基本上可以输出所有程序的所有信息。ps命令是最基本同时也是非常强大的进程查看命令，使用该命令可以确定有哪些进程正在运行和运行的状态、进程是否结束、进程有没有僵死、哪些进程占用了过多的资源等等，总之大部分信息都是可以通过执行该命令得到的。
&emsp;&emsp;但是！！！这玩意参数太多了，多到吓人，我们会使用常用的几种参数就可以了。

&emsp;&emsp;默认情况下，ps输出很简单。只会显示运行在当前控制台下的属于当前用户的进程。比如下边我们只运行了 bash shell（shell也是在系统中运行的程序而已），以及ps命令本身。显示进程ID（PID）、运行在那个终端（TTY）、消耗cpu的时间（TIME）。
```bash
(base) yc@yc-PC:~$ ps
  PID TTY          TIME CMD
26852 pts/0    00:00:00 bash
26889 pts/0    00:00:00 ps
(base) yc@yc-PC:~$ 
```
&emsp;&emsp;Deepin系统中，ps命令支持三中不同风格的命令行参数：
1）Unix风格的参数,前面加单破折线;
2）BSD风格的参数,前面不加破折线;
3）GNU风格的长参数,前面加双破折线。

没必要都了解，熟悉一种让后经常用这一种就可以了。

```bash
ps axo pid,comm,pcpu # 查看进程的PID、名称以及CPU 占用率
ps aux | sort -rnk 4 # 按内存资源的使用量对进程进行排序
ps aux | sort -nk 3  # 按 CPU 资源的使用量对进程进行排序
ps -A # 显示所有进程信息
ps -u root # 显示指定用户信息
ps -efL # 查看线程数
ps -e -o "%C : %p :%z : %a"|sort -k5 -nr # 查看进程并按内存使用大小排列
ps -ef # 显示所有进程信息，连同命令行
ps -ef | grep ssh # ps 与grep 常用组合用法，查找特定进程
ps -C nginx # 通过名字或命令搜索进程
ps aux --sort=-pcpu,+pmem # CPU或者内存进行排序,-降序，+升序
ps -f --forest -C nginx # 用树的风格显示进程的层次关系
ps -o pid,uname,comm -C nginx # 显示一个父进程的子进程
ps -e -o pid,uname=USERNAME,pcpu=CPU_USAGE,pmem,comm # 重定义标签
ps -e -o pid,comm,etime # 显示进程运行的时间
ps -aux | grep named # 查看named进程详细信息
ps -o command -p 91730 | sed -n 2p # 通过进程id获取服务名称
```

### 4.1.2 实时监测进程　top 命令
&emsp;&emsp;ps 命令只能显示特定时间的信息，但是程序很多时候是频繁内存交换，用ps就不方便了。top跟ps类似，但是top可以实时显示。
1）第一行显示当前时间、系统运行时间、登录用户数、系统平均负载（1分钟内、5分钟内、15分钟内，值越大负载越高）；
2）第二行显示了进程概要。task总任务数量，running、sleeping、stopped、zombie分别表示运行、休眠、停止、僵化数量。（僵化就是进程完成了，但是他的父进程无响应）；
3）第三行是cpu信息
4）第四行内存信息
5）第五话是虚拟内存信息
6）剩下的表格就是当前程序运行状态了
&emsp;&emsp;PID 进程ID
&emsp;&emsp;USER 进程属于谁的名字
&emsp;&emsp;PR 优先级
&emsp;&emsp;NI 谦让值
&emsp;&emsp;VIRT 占虚拟内存总量
&emsp;&emsp;RES 占物理内存总量
&emsp;&emsp;RES 共享内存总量
&emsp;&emsp;S 进程状态（D-sleeping（中断），R-running，S-sleeping，T-stopped，Z-zombie）
&emsp;&emsp;CPU 使用cpu时间
&emsp;&emsp;MEN 使用内存占可用内存比例
&emsp;&emsp;TIME+ 程序启动到目前为止占用cpu时间
&emsp;&emsp;COMMAND 程序名
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301144000214.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;默认情况下按照cpu进行排序。
&emsp;&emsp;退出 q；

### 4.1.3 结束进程　kill 命令
&emsp;&emsp;作为程序员，很重要技能就是知道何时以及如何结束进程。进程之间通过信号来通信。进程的信号就是预先定义好的消息，进程可以识别他并快速反应。
linxu进程信号
1 HUP 挂起
2 INT 中断
3 QUIT 结束运行
9 KILL 无条件终止
11 SEGV 段错误
15 TERM 尽可能终止
17 STOP 无条件终止
18 TSTP 暂停
19 CONT 暂停后恢复

&emsp;&emsp;kill 只能使用PID给进程发信号。（TERM信号）
&emsp;&emsp;TERM有时候不好用，这时候就需要 -s参数制定其他信号
&emsp;&emsp;比如 kill -s 1 PID（等价于 kill -s HUP PID）

&emsp;&emsp;下边意思就是，ps查看当前bash的pid，让后kill他（发送TERM信号），但是他忽略了，没有任何反应
```bash
(base) yc@yc-PC:~$ ps
  PID TTY          TIME CMD
25616 pts/0    00:00:00 bash
25709 pts/0    00:00:00 ps
(base) yc@yc-PC:~$ kill 25616
```
&emsp;&emsp;这是再输入kill -s 1，会发现控制台直接退出了，因为给他发送了挂起信号，新开一个控制台查看后台程序，发现25616id还在，但处于挂起状态
```bash
(base) yc@yc-PC:~$ kill -s 1 25616 # kill -s HUP 25616
```
&emsp;&emsp;这是再输入kill -s 9，会发现控制台直接退出了，因为给他发送了强制退出信号，新开一个控制台查看后台程序，发现25616id没了，彻底关闭了
```bash
(base) yc@yc-PC:~$ kill -s 9 25616 # kill -s KILL 25616
```
&emsp;&emsp;**killALl 命令**
&emsp;&emsp;kill只能根据PID来关闭程序，很不爽，killall可以根据进程名而不是PID来结束进程，还支持通配符。
```bash
(base) yc@yc-PC:~$ killall http*
```
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**！！！killall注意哈，如果用通配符别关了不该关闭的，造成文件损坏这种情况**

## 4.2 监测磁盘空间
&emsp;&emsp;程序员另外一个重要职责就是检测磁盘使用情况。
### 4.2.1 挂载存储媒体（u盘、移动硬盘）
&emsp;&emsp;deepin是插上存储设备后自动挂载，偶尔拔出时候未完全关闭，导致下次插入报错，需要重新挂载。Ext4格式基本上不会出现这个问题，NTFS（windos下数据），在deepin系统下偶尔会发生需要重新手动挂起的情况。
&emsp;&emsp;deepin的文件系统是，把所有的磁盘都并入一个虚拟目录下，如果使用新的存储媒体，需要把他也放进虚拟目录，这个工作就叫挂载。

&emsp;&emsp;我下边给电脑插了一个2T的移动硬盘，1TNTFS格式1TExt4格式。名两行输入mount可以看到挂载设备列表。我把它复制出来可以看到包含四个部分，媒体设备文件名、虚拟目录挂载点、文件系统类型、已挂载媒体访问状态
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301152113441.png)
```bash
/dev/sdb2 on /media/yc/linux type ext4 (rw,nosuid,nodev,relatime,data=ordered,uhelper=udisks2)
/dev/sdb1 on /media/yc/win type fuseblk (rw,nosuid,nodev,relatime,user_id=0,group_id=0,default_permissions,allow_other,blksize=4096,uhelper=udisks2)
```
挂载基本命令
mount -t type device directory
有挂载对应就是卸载
umount directory|device
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020030115255088.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
可以看到只剩下一块了，win已经没了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301152637211.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
可以看到linux也没了。

### 4.2.2 df命令查询设备剩余磁盘空间
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301152926257.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
看的比较难受，因为这玩意默认是看有多少字节块（每个1024字节大小）
df -h 用G/M来代替
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301153144644.png#pic_center)
### 4.2.3 du命令显示文件占多少磁盘
-h 按用户易读的格式输出
-c 显示一个总大小
&emsp;&emsp;这里会很长，没有可读性，没有啥意义，如果处理数据文件请看下一节
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301153451678.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

## 4.3 处理数据文件
&emsp;&emsp;当你有大量数据，很难提取到有用信息，比如上一节的du，导致系统输出过量信息。deepin系统提高一些命令工具来处理数据。这会非常方便，务必掌握。
###  4.3.1 排序数据   sort命令
默认情况下，sort会按照语言排序规则进行排序。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301154352655.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
 涉及数字的话，是否使用-n参数看你需要![在这里插入图片描述](https://img-blog.csdnimg.cn/2020030115461821.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
涉及月份（log一般月份开头）的话，使用参数-M
-b   排序忽略起始的空白   
-d   忽略特殊字符，仅考虑空白和字母
-f    忽略大小写（默认大写在前）
-r   反序排序
-k  -k pos1   或者  -k pos1，pos2  指从pos1后字符开始排序或者从pos1-pos2之间字符排序
-n  按字符串数值排序，不转换位浮点数
-t   指定一个区分键位的字符

&emsp;&emsp;kt连起来用比较常见，t确定字符分割，k判断从哪里开始
`sort -t ':' -k 3 -n /etc/passwd`，比如对密码文件可以根据用户ID进行排序（第三列）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301160323288.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;上一节的du命令的话 

```bash
du -sh *
du -sh * | sort -nr
du -sh * | sort -nr
```
&emsp;&emsp;看下对比，是不是清楚多了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301160914171.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301160605721.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;你也许会问，k、g、m怎么没有按大小来啊，如果需要的话，命令行就复杂了。含义就不解释了，接下来几章会讲到。

```bash
for i in $(ls -l |grep '^d' |du -s * |sort -nr|awk '{print $2}');do du -sh $i;done
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020030116183414.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301161847431.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

###  4.3.2 搜索数据   grep命令
&emsp;&emsp;总是需要在很多文件中找一行数据，不用手动翻看，grep是必备技能。egrep更强大，fgrep甚至支持列搜索。这个后面在学习。目前先熟悉grep。
&emsp;&emsp;`grep three test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索带three的行
&emsp;&emsp;`grep t test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索带t的行
&emsp;&emsp;`grep -v t test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索不带t的行（**-v 反向搜索**）
&emsp;&emsp;`grep -n t test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索带t的行,显示行号（**-n 输出显示行号**）
&emsp;&emsp;`grep -c t test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索带t有几行（**-c 仅输出一工有几行**）
&emsp;&emsp;`grep -e t -e f test.txt`  &emsp;&emsp;&emsp;&emsp;在txt中搜索带t或者带f的（**-e 增加筛选条件**）
&emsp;&emsp;
&emsp;&emsp;grep 支持正则表达式，详细使用放在以后正则表达是说。如果会正则的话，直接&emsp;`grep [tf] test.txt`  &emsp;用就行了。


###  4.3.2 压缩数据   
&emsp;&emsp;zip工具可以把大型文件压缩成占用更小的文件。deepin默认包含很多解压工具。
| 工具 | 文件拓展名 |描述 |
|:--------:| :-------------:| :-------------:|
|bzip2|.bz2|很少用|
|compress|.Z|最初的压缩工具，更没人用|
|bzip2|.bz2|很少用|
|gzip|.gz|GUN压缩工具，开源文件一般都用这个|
|zip|.zip|windos核心压缩工具|
&emsp;&emsp;gzip软件包是GUN的项目产物，为了替代compress。gzip使用：
**gzip 用来压缩**、**gzcat 用来浏览** 、**zunzip用来解压**
###  4.3.2 归档数据  tar命令
&emsp;&emsp;上一节说的zip能够很好的压缩数据，但是linux/deepin下最广泛的还是tar。

```bash
tar function [options]  object1 object2
```
**tar命令功能**
-A	将已有tar追加到另一个tar
-c		创建新的tar文件
-diff		检查tar和文件不同之处
-different   删除文件
-r		追加文件到已有tar（跟-A区别是，一个是追加tar一个是追加文件）
-t		列出tar文件内文件
-u		追加文件到tar（同名的话更新，-r同名的话警告）
-x		提取文件

**tar命令选项**
-c		切换到制定目录
-f		输出结果到文件/或设备
-p		输出结果重定向给bzip2
-v		处理是显示当前执行到哪里
-z		输出重定向给gzip来处理内容

举例
**tar -cvf test.tar tar_Test1/ tar_Test12/**    新建压缩文件
**tar -tf test.tar**   只浏览不解压
**tar -xvf test.tar**   解压文件
```bash
(base) yc@yc-PC:~$ cd Desktop/Test/
(base) yc@yc-PC:~/Desktop/Test$ ls -l
总用量 8
drwxr-xr-x 2 yc yc 4096 3月   1 16:42 tar_Test1
drwxr-xr-x 2 yc yc 4096 3月   1 16:42 tar_Test12
(base) yc@yc-PC:~/Desktop/Test$ tar -cvf test.tar tar_Test1/ tar_Test12/
tar_Test1/
tar_Test12/
(base) yc@yc-PC:~/Desktop/Test$ ls -l
总用量 20
drwxr-xr-x 2 yc yc  4096 3月   1 16:42 tar_Test1
drwxr-xr-x 2 yc yc  4096 3月   1 16:42 tar_Test12
-rw-r--r-- 1 yc yc 10240 3月   1 16:45 test.tar
(base) yc@yc-PC:~/Desktop/Test$ rm -rf tar_Test1*
(base) yc@yc-PC:~/Desktop/Test$ ls -l
总用量 12
-rw-r--r-- 1 yc yc 10240 3月   1 16:45 test.tar
(base) yc@yc-PC:~/Desktop/Test$ tar -tf test.tar 
tar_Test1/
tar_Test12/
(base) yc@yc-PC:~/Desktop/Test$ ls -l
总用量 12
-rw-r--r-- 1 yc yc 10240 3月   1 16:45 test.tar
(base) yc@yc-PC:~/Desktop/Test$ tar -xvf test.tar 
tar_Test1/
tar_Test12/
(base) yc@yc-PC:~/Desktop/Test$ ls -l
总用量 20
drwxr-xr-x 2 yc yc  4096 3月   1 16:42 tar_Test1
drwxr-xr-x 2 yc yc  4096 3月   1 16:42 tar_Test12
-rw-r--r-- 1 yc yc 10240 3月   1 16:45 test.tar
(base) yc@yc-PC:~/Desktop/Test$ 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301164710872.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;**之前也写过，很多下载的开源库都是.tgz（.tar.gz），比如cmake。这是gzip压缩的tar文件。可以直接用**

```bash
tar -zxvf filename.tgz打开
```





---
# 5 理解shell
&emsp;&emsp;本章主要探究shell的类型、理解shell的父/子关系、别出心裁的子shell用法、探究内建的shell命令。如果想学习shell，需要先清楚什么是CLI。shell与shell之间关系是本章重点。

## 5.1 什么是shell
&emsp;&emsp;对于图形界面，用户点击某个图标就能启动某个程序；对于命令行，用户输入某个程序的名字（可以看做一个命令）就能启动某个程序。这两者的基本过程都是类似的，都需要查找程序在硬盘上的安装位置，然后将它们加载到内存运行。换句话说，图形界面和命令行要达到的目的是一样的，都是让用户控制计算机。
&emsp;&emsp;真正能够控制计算机硬件（CPU、内存、显示器等）的只有操作系统内核（Kernel），图形界面和命令行只是架设在用户和内核之间的一座桥梁。
&emsp;&emsp;由于安全、复杂、繁琐等原因，用户不能直接接触内核（也没有必要），需要另外再开发一个程序，让用户直接使用这个程序；该程序的作用就是接收用户的操作（点击图标、输入命令），并进行简单的处理，然后再传递给内核，这样用户就能间接地使用操作系统内核了。
&emsp;&emsp;**用户界面和命令行就是这个另外开发的程序，就是这层“代理”。在Linux下，这个命令行程序叫做 Shell。Shell 是一个应用程序，它连接了用户和 Linux 内核，让用户能够更加高效、安全、低成本地使用 Linux 内核，这就是 Shell 的本质。**
&emsp;&emsp;**Shell 本身并不是内核的一部分，它只是站在内核的基础上编写的一个应用程序，它和 QQ、迅雷、Firefox 等其它软件没有什么区别。然而 Shell 也有着它的特殊性，就是开机立马启动，并呈现在用户面前；用户通过 Shell 来使用 Linux，不启动 Shell 的话，用户就没办法使用 Linux。

## 5.2 shell 的类型
&emsp;&emsp;系统启动什么样的shell取决于个人用户的ID配置。/etc/passwd 文件第七个字段列出了默认的shell类型。基本上默认shell都是bash shell。
默认的交互shell会在用户登录控制台（之前介绍的 tty ）或终端或在gui中运行仿真器时启动。下边显示的那个另外的shell  /bin/sh 是系统使用的shell，用来启动系统shell脚本。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200306131031286.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


## 5.3 shell 的父子关系
&emsp;&emsp;  **CLI**  使用文本命令进行交互的用户界面
&emsp;&emsp;每次打开深度终端时候启动的shell，是一个父shell。这个shell提供**CLI**提示符，等待命令行输入。如果在**CLI**后输入/bin/bash或其他等效bash命令时，会创建新的shell程序，这个就是子shell。
&emsp;&emsp; 生成新的子shell后，没有任何相关信息。上一章的ps可以搞清楚
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200306132259970.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;生成子shell时候只有部分父进程的环境被复制到子shell环境中，这会对变量在内的一些东西造成影像。子shell也可以创建子shell。退出子shell  exit就可以了。（使用shell脚本也可以生成子shell，这里一定要搞清楚环境的关系，我以后写。）

## 5.4 shell 内建命令
&emsp;&emsp;外部命令，在bash shell外部的命令。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307121722114.png)
&emsp;&emsp;外部命令相当于创建一个子进程，子进程的环境也需要资源来创建，外部命令还是有代价的。
&emsp;&emsp;内建命令和外部命令区别就是不需要借助外部程序文件来运行。比如 cd 、exit等命令。因为不需要衍生新的子进程，所以内建命令会更快。



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
