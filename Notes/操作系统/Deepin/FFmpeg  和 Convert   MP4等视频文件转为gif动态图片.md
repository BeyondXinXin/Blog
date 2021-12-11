# Deepin 使用教程：FFmpeg  和 Convert   MP4等视频文件转为gif动态图片

@[TOC](MP4等视频文件转为gif动态图片)

# MP4等视频文件转为gif动态图片
**ImageMagick图片处理是一套功能强大、稳定而且免费的工具集和开发包。**

**FFmpeg是一套可以用来记录、转换数字音频、视频，并能将其转化为流的开源计算机程序。**

利用**FFmpeg**可以实现视频转为gif、视频每一帧转为图片。如果我们需要把MP4文件转为gif文件，有下面几种方式：

 1. 直接利用**FFmpeg**转gif（效果不是很好，没法增删帧，每帧不能修改）

```bash
ffmpeg -y -i /home/yc/Desktop/01.mp4 1.gif
-i #输入文件
-y #是否覆盖 不加的话会询问
```

```bash
ffmpeg -ss 0  -r 15 -t 60 -y -i /home/yc/Desktop/01.mp4 -vf fps=15,scale=270:-1 1.gif
-y #是否覆盖 不加的话会询问
-ss #起始时间（单位毫秒），不加默认0
-s #起始时间（单位秒），不加默认0
-r #每秒几帧，默认25
-t #截取总时间 默认到视频结束
-i #输入文件
-vf #缩放比例 默认不缩放
```


 2. 利用**FFmpeg**批量导出每一帧图片，自己修改图片、删减图片。利用 **ImageMagick(convert)** 把图片拼接成gif


 3. 利用 **ImageMagick(convert)** 把视频转为gif
 


```bash
convert '/home/yc/Desktop/01.mp4' -layers Optimize 1.gif
-layers #转换图层 Optimize默认优化

convert '/home/yc/Desktop/01.mp4' -fuzz 50% -layers Optimize 1.gif
-fuzz #压缩图像质量
```


**三种方式   质量   2>3>1  速度  1>3>2**

---
#  FFmpeg安装

```bash
sudo apt install ffmpeg
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307163722444.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
# FFmpeg简单使用

```bash
# 通用参数
-i 设定输入流 
-f 设定输出格式 
-ss 开始时间 
#视频参数
-b 设定视频流量(码率)，默认为200Kbit/s 
-r 设定帧速率，默认为25 
-s 设定画面的宽与高 
-aspect 设定画面的比例 
-vn 不处理视频 
-vcodec 设定视频编解码器，未设定时则使用与输入流相同的编解码器 
#音频参数
-ar 设定采样率 
-ac 设定声音的Channel数 
-acodec 设定声音编解码器，未设定时则使用与输入流相同的编解码器 
-an 不处理音频
```

```bash
#视频格式转换
ffmpeg -i input.avi output.mp4
ffmpeg -i input.mp4 output.ts
```
```bash
#提取音频
ffmpeg -i tmp_in.mp4 -acodec copy -vn output.aac
ffmpeg -i tmp_in.mp4 -acodec aac -vn output.aac
#(-vn 不处理视频 )
```

```bash
# 提取视频
ffmpeg -i input.mp4 -vcodec copy -an output.mp4
#(-an 不处理音频 )
```

```bash
#视频剪切
ffmpeg -ss 00:00:15 -t 00:00:05 -i input.mp4 -vcodec copy -acodec copy output.mp4
#-ss表示开始切割的时间，-t表示要切多少。上面就是从开始，切5秒钟出来。
```

```bash
#将输入的1920x1080缩小到960x540输出
ffmpeg -i input.mp4 -vf scale=960:540 output.mp4
# 如果540不写，写成-1，即scale=960:-1, 那也是可以的，ffmpeg会通知缩放滤镜在输出时保持原始的宽高比。
```

# convert安装

```bash
sudo apt install ImageMagick
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307163833315.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

# convert简单使用

```bash
#转换图片格式，支持JPG, BMP, PCX, GIF, PNG, TIFF, XPM和XWD等类型
convert xxx.jpg xxx.png   #讲jpeg转换为png文件
```

```bash
#改变图像大小
convert -resize 1024x768 xxx.jpg  xxx1.jpg  #将图像的像素改为1024*768(注意1024与768之间是小写字母x)
convert -sample 50%x50% xxx.jpg  xxx1.jpg #将图像缩小为原来的50%*50%
```
```bash
#旋转图像
convert -rotate 270 sky.jpg sky-final.jpg      #将图像顺时针旋转270度 

```

```bash
#为图像加上文字
convert -fill black -pointsize 60 -font helvetica -draw 'text 10,80 "hello world ! " ' 
#xxx.jpg xxx1.jpg在图像的10,80位置用60磅全黑Helvetica字体上写hello world！
```
```bash
#批量文件格式转换
mogrify -path newdir -format png *.jpg  
#这个命令将当前文件目录下的所有jpg文件转换为png格式，并将其存放在newdir目录下，如果不指定path参数则生成的png图像保存在当前目录下
```


&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;

