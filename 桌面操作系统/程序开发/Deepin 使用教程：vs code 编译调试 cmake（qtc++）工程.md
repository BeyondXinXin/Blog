# Deepin 使用教程：vs code 编译调试 cmake（qtc++）工程

Deepin 使用教程：vs code 编译调试 cmake（qt/c++）工程
其实code可以通过c_cpp_properties.json 和 tasks.json负责编译事情，这种方式对于临时测试的小工程比较方便，但是当文件结构比较复杂，还是选用cmake比较合适。

@[TOC](Deepin 使用教程：vs code 编译调试 cmake（qt/c++）工程） 



## 1.安装cmake插件  
**CMake Tools** 和 **cmake**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110135758461.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

## 2.打开一个由cmake配置的项目工程
我这里以我原来写的 **openBrowser** 为例子
 [https://gitee.com/yaoxin001/openBrowser](https://gitee.com/yaoxin001/openBrowser)
 这是刚从gitee上拉取的一个文件结构
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110140044183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
打开  **vs code**，以此  文件-打开文件夹-选择下载目录
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110140207409.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
## 3.编译cmake工程
点击  **cmake：debug**，选择**release**（debug也可以）

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110140459931.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110140534601.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

会默认在工程目录下新建一个**bulid**文件，里边是cmake的路径   
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110140812274.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

bulid/CMakeCache.txt  这个新建的文件夹就是我们配置的路径。可以看到我的报错了，提示系统变量里找不到VTK（一般开源库我只编译，没有ianstall过，所以基本什么都找不到），则我需要在CMakeCache.txt 里添加vtk的路径。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110141008893.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
在bulid/CMakeCache.txt找到对应参数，让后填入自己路径
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110141157865.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110141314418.png#pic_center)

同样的，我这里用到了itk、opencv、cgal等，依次添加目录。


## 4.修改qt环境
我电脑里装了**anaconda3**，找到的**qt**环境肯定是 **anaconda3/lib/cmake/Qt5XXX**
我用了qt大概11个模块，需要把路径换成自己qt的路径，因为我vtk编译时候是跟自己安装的qt5.11一起编译的，如果这里选anaconda3下的qt cmakefile 肯定出问题。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110142005933.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110142112461.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110143419185.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

## 5.再次编译
如果你第一步安装了**cmake**    其实左侧就是编译目录可以查看。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110142214905.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110142313303.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110142408558.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

自己写的工程，只要注意环境，基本很顺利，就跟在qt下构建cmake工程类似。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110143616326.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

## 6.vscode调试程序
编译完成后就会发现文件目录下已经生成可执行程序了。如果需要在vscode是使用qdg调试程序，还需要接着配置，进入调试（ctrl shift d）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110143917978.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110143944290.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

此时运行会提示错误，在程序根目录新建了一个隐藏文件.vscode   打开里边的/launch.json。
修改program 的value为自己程序设置目录
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200110144101132.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200113154208330.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


![在这里插入图片描述](https://img-blog.csdnimg.cn/20200113154107137.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

## 7.有时候会出现编程成功无法调试，那是settings.json设置的只编译不调试运行
这个是我个人喜欢的settings.json，加了astyle调整代码规范
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200113154635655.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)