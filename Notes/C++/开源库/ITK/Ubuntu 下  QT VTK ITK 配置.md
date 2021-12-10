之前写过一片windos下的itk vtk编译
https://blog.csdn.net/a15005784320/article/details/98477606
最近工作都换到linux了，这里提供下ubuntu下如何编译itk和vtk

安装qt
我装的5.11.3和5.13.0
最新版5.13贼坑，designer加了新特性，5.13编译过后低版本跑步起来需要重新编译   
跟windos下一样，官网下载安装包，点点点就可以了，如果打不开可以就sudo chmod +x  "qt安装包名字"
安装完了记得安装gcc
打开测试线hello word

安装cmake
版本最好高一些以后，我装的3.15和3.12两个


安装vtk（先vtk在itk
git上下载源码    我用的8.1.2  和8.2
解压后在文件夹下新建bulid目录
cmake-gui ../
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190828135938894.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
搜索model里有一个qt一个qtopengl  选上这两个
example和test不要选择
如果真需要案例的话，直接去git上对应案例的源码
congigure 和generate确认
控制台重新输入make开始编译就可以了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190828140226838.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
这里是我编译完成的，第一次肯错，错很多。
会提示缺少lib，直接把错误信息谷歌搜索，前三条以内就会有安装lib的命令，控制台运行下，重新make，让后再报错，再来一次就可以了。（编译过三次，每次都是少不同的lib，这玩意当时没记录，谷歌一艘就有这个lib安装命令行）make完成后就可以了
网上很多人让大家需要install 反正我没用，平时跑程序一般我也只在relese下跑，debug一次好久想想就烦躁




itk安装
我git上下载的4.8.0和4.13
itk和vtk一毛一样
就是要勾选一个  itkxtk  搜索vtk就拿一个
让后不要test和example，有需要自己去git上单独下载，你要是选择了，国内下载等哭你

让后itk一般不会出现过缺少lib，我在不同电脑编译过三次，itk没有提示少过东西
