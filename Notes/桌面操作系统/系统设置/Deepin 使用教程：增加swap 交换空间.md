# Deepin 使用教程：增加swap 交换空间

内存16g基本够用，但有些程序跑起来还是会出现内存不足。只能增大交换空间了
# 0. 什么是swap/交换空间
&emsp;&emsp;Swap分区（也称交换分区）是硬盘上的一个区域，被指定为操作系统可以临时存储数据的地方，这些数据不能再保存在RAM中。 基本上，这使您能够增加服务器在工作“内存”中保留的信息量，但有一些注意事项，主要是当RAM中没有足够的空间容纳正在使用的应用程序数据时，将使用硬盘驱动器上的交换空间。

&emsp;&emsp;写入磁盘的信息将比保存在RAM中的信息慢得多，但是操作系统更愿意将应用程序数据保存在内存中，并使用交换旧数据。 总的来说，当系统的RAM耗尽时，将交换空间作为回落空间可能是一个很好的安全网，可防止非SSD存储系统出现内存不足的情况。


 
# 1.检查系统当前是否存在交换空间
&emsp;&emsp;系统可以有多个交换文件，但一般有一个就可以了

```bash
sudo swapon --show #查询当前是否存在交换空间
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191130125804822.png#pic_center)
&emsp;&emsp;如果没有输出，表示装系统时候没有分swap。

```bash
free -h -t -s 1
# free 查看内存占用
	# -h humanble,易读的
	# -t 显示合计信息
	# -s 刷新间隔
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191130130302829.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
# 2.查询硬盘驱动器分区上的可用空间

```bash
df -h 
# df 显示有关每个文件所在的文件系统或默认情况下所有文件系统的信息。
	#-h humanble,易读的
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191130132504391.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;挂载点表示我们的磁盘，这里可以看到我的剩余控件还很大。

# 3. 创建交换文件

```bash
mkdir swapfile
cd swapfile/
sudo dd if=/dev/zero of=swap bs=1024 count=32000000 # 创建文件
sudo mkswap -f swap # 把生成的文件转换成 swap 文件
# 结果
			#Setting up swapspace version 1, size = 1999996 KiB 
			#no label, UUID=fee9ab21-9efb-47c9-80f4-57e48142dd69
#-------------------------------------------------------------------------
# dd 复制文件，根据操作数进行转换和格式化。
	# if =输入文件（或设备名称）
	# of =输出文件（或设备名称）
	# bs = bytes 同时设置读/写缓冲区的字节数（等于设置ibs和obs）。
		# ibs = bytes 一次读取bytes字节，即读入缓冲区的字节数。
		# obs = bytes 一次写入bytes字节，即写入缓冲区的字节数。
	# count=blocks 只拷贝输入的blocks块。
# mkswap 设置交换区(swap area)

```
# 4.swap激活文件

```bash
sudo swapon swap
# swapon 用于激活Linux系统中交换空间，Linux系统的内存管理必须使用交换区来建立虚拟内存。
# swapoff 用于关闭系统交换区(swap area)。
```

# 5.永久保持（不建议，swap就是临时救急，没必要一直这么大。况且用ssd做swap会坏的比较快

```bash
sudo vim /etc/fstab
# fstab是用来存放文件系统的静态信息的文件
# 6个字段
# <file system> 要挂载的分区或存储设备
# <dir>  挂载的目录位置
# <type> 挂载分区的文件系统类型，比如：ext3、ext4、xfs、swap
# <options> 挂载使用的参数有哪些。举例如下：
# <dump>  dump 工具通过它决定何时作备份. dump 会检查其内容，并用数字来决定是否对这个文件系统进行备份。 
	# 允许的数字是 0 和 1 。0 表示忽略， 1 则进行备份。大部分的用户是没有安装 dump 的 ，对他们而言 <dump> 应设为 0。
# <pass> fsck 读取 <pass> 的数值来决定需要检查的文件系统的检查顺序。允许的数字是0, 1, 和2。 
	# 根目录应当获得最高的优先权 1, 其它所有需要被检查的设备设置为 2. 0 表示设备不会被 fsck 所检查。
```
在文件最后加上
> /home/yc/swapfile/swap swap swap defaults 0 0

# 6. [Deepin 使用教程：调整缓存压力设置](https://blog.csdn.net/a15005784320/article/details/103220825)



---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)