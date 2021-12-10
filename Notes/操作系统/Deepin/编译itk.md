# Deepin 使用教程：编译itk

Itk下载 git
[https://github.com/InsightSoftwareConsortium/ITK/releases](https://github.com/InsightSoftwareConsortium/ITK/releases)

我自己的镜像（如果我的bulid里有文件，请直接删除）
链接: [https://pan.baidu.com/s/1LZX8cpqwl23F_HTv6YNgKw](https://pan.baidu.com/s/1LZX8cpqwl23F_HTv6YNgKw)  密码: 9n2r

基本上没用过itk，编译它主要是它读取dicm比vtk好太多了，算法就用过一个mainpath。
我的版本是4.13  我编译了三次，这里就体现出来为什么我用的开源库都不安装了，同一个版本编译三次主要是交叉编译，不同程序用不同版本。其实这个方法很傻比，直接在cmake里设置不香吗？不过我试过那样每次测试编译是很慢，干脆直接编译好三次算了。
itk4.13+vtk 8.12
itk4.13+vtk 8.20
itk4.13+no vtk
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115132238229.png)
解压完成，在目录里新建bulid
进入bulid 执行

>  cmake-gui ..

需要跟vtk联合编译的勾选itkvtkglue，vtkdir选择之前编译的vtk就可以了，注意版本对应，不需要的直接跳过
取消勾选 test（itk默认编译test，vtk默认编译example，两个费事不讨好的东西，务必取消，要不然网不好增加几个小时的时间，有需要直接去官网下载案例他不香吗。）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115132306237.png)
勾选review
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115132313935.png)

Configuring done
Generating done
之后，在bulid目录  

> make -j12

**如果成功就成功了，如果没成功提示少什么库装什么库（google一下缺少的lib，前三个肯定有安装命令行）
有些教程make 后让安装  sudo make install ，这个看个人使用环境了，我就不安装，因为我要用多个版本，相互交叉编译，安装了反而麻烦。何况我程序就是用cmake写的，所以我这里不install，如果你用qmake搭建程序，可以安装 运行install就可以，其实就是吧.h和.o .a放到系统变量里**

