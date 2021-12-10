# Deepin 使用教程：rdesktop 远程操作windos （类似于win里的mastsc

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
rdesktop  -a 16 -u Administrator -p  xinxin  118.25.63.144 
#Administrator是自己远程访问电脑的用户名
#******是自己远程访问电脑的密码
```
坑

 1. 我的密码里有个 ！，这玩意不能够直接输入，需要括号引起来,都是英文的

```bash
  "!"  
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019112401231552.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
 2. 远程操作不能全屏，不能改垂直方向分辨率，横向可以用-g设置




