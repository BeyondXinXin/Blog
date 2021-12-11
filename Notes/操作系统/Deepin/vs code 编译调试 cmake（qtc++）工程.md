# Deepin 使用教程：vs code 编译调试 cmake（qtc++）工程

Deepin 使用教程：vs code 编译调试 cmake（qt/c++）工程
其实code可以通过c_cpp_properties.json 和 tasks.json负责编译事情，这种方式对于临时测试的小工程比较方便，但是当文件结构比较复杂，还是选用cmake比较合适。

@[TOC](Deepin 使用教程：vs code 编译调试 cmake（qt/c++）工程） 



## 1 1.安装cmake插件  
**CMake Tools** 和 **cmake**
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.61d1rizay140.png)

## 2 2.打开一个由cmake配置的项目工程
我这里以我原来写的 **openBrowser** 为例子
 [https://gitee.com/yaoxin001/openBrowser](https://gitee.com/yaoxin001/openBrowser)
 这是刚从gitee上拉取的一个文件结构

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.k6hep4byals.png)

打开  **vs code**，以此  文件-打开文件夹-选择下载目录

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.22i2rzj9q68w.png)

## 3 3.编译cmake工程
点击  **cmake：debug**，选择**release**（debug也可以）

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.4q4dmudd85k0.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.795gh7mjixc0.png)

会默认在工程目录下新建一个**bulid**文件，里边是cmake的路径   

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/459485210228155.png)

bulid/CMakeCache.txt  这个新建的文件夹就是我们配置的路径。可以看到我的报错了，提示系统变量里找不到VTK（一般开源库我只编译，没有ianstall过，所以基本什么都找不到），则我需要在CMakeCache.txt 里添加vtk的路径。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/587235210243650.png)

在bulid/CMakeCache.txt找到对应参数，让后填入自己路径

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/91345310235837.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/182335310222534.png)

同样的，我这里用到了itk、opencv、cgal等，依次添加目录。


## 4 4.修改qt环境
我电脑里装了**anaconda3**，找到的**qt**环境肯定是 **anaconda3/lib/cmake/Qt5XXX**
我用了qt大概11个模块，需要把路径换成自己qt的路径，因为我vtk编译时候是跟自己安装的qt5.11一起编译的，如果这里选anaconda3下的qt cmakefile 肯定出问题。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/278425310216748.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/362905310232749.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/437005310227329.png)

## 5 5.再次编译
如果你第一步安装了**cmake**    其实左侧就是编译目录可以查看。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/540415310213293.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/53035410234140.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/144915410227752.png)

自己写的工程，只要注意环境，基本很顺利，就跟在qt下构建cmake工程类似。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/263125410216044.png)

## 6 6.vscode调试程序
编译完成后就会发现文件目录下已经生成可执行程序了。如果需要在vscode是使用qdg调试程序，还需要接着配置，进入调试（ctrl shift d）

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/400775410242326.png)


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/569525410215850.png)

此时运行会提示错误，在程序根目录新建了一个隐藏文件.vscode   打开里边的/launch.json。
修改program 的value为自己程序设置目录
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/502395510225188.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/367695510221141.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/198435510233915.png)

## 7 7.有时候会出现编程成功无法调试，那是settings.json设置的只编译不调试运行
这个是我个人喜欢的settings.json，加了astyle调整代码规范

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/vs%20code%20%E7%BC%96%E8%AF%91%E8%B0%83%E8%AF%95%20cmake%EF%BC%88qtc%2B%2B%EF%BC%89%E5%B7%A5%E7%A8%8B.md/81255510240869.png)