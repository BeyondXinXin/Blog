
@[TOC](CGAL学习记录)

# 前言
原先使用vtk有些小地方不是很理想,老大让研究下表面细分换成CGAL效果怎么样
以前从来没有接触过计算机图形这快,算了其实以前啥都没接触过自学了大半年qt,两个月vtk
这次学习新的开源库,记录下自己学习过程

每天看多少就自己记录多少,持续更新ing...



# CGAL 介绍
CGAL开放源代码项目的目标是以C ++库的形式轻松访问有效且可靠的几何算法。
计算几何算法库提供了三角剖分，Voronoi图，多边形，单元复合体和多面体，曲线的排列，网格生成，几何处理，凸包算法等仅举几例。
所有这些数据结构和算法都对诸如点和线段之类的几何对象进行操作，并对它们执行几何测试。
这些对象和谓词在CGAL内核中重新组合。
支持库提供几何对象生成器和空间排序功能，以及矩阵搜索框架和线性和二次程序的求解器。它还提供了与第三方软件（如GUI库Qt，Geomview和Boost Graph库）的接口。

主要学习教程  [https://doc.cgal.org/latest/Manual/index.html](https://doc.cgal.org/latest/Manual/index.html)

# CGAL Linux安装
开源库嘛,全平台支持.
官方说明  [https://www.cgal.org/download.html](https://www.cgal.org/download.html)
源码/安装包下载  [https://github.com/CGAL/cgal/releases](https://github.com/CGAL/cgal/releases)
我的镜像
链接: [https://pan.baidu.com/s/1o46NVDF-5faGFv5jZm44yg](https://pan.baidu.com/s/1o46NVDF-5faGFv5jZm44yg)  密码: 83re

安装方式分为两种   
1. 全平台均提供编译好的库     直接安装即可

我用的ubuntu   先只介绍linux下安装,windos随后用到时候再补上

> **Debian or Linux Mint 下安装**
> sudo apt-get install libcgal-dev
> apt-get install libcgal-demo
**ArchLinux 下安装**
> sudo pacman -S cgal 
**卸载**
> sudo apt-get remove  libcgal-dev
>  sudo apt-get remove  libcgal-demo

2. 自己编译

自己编译的话下载这个(其他版本一样
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925191903520.png)
我编译大概一分钟
一次成功,什么错误都没出现
我的环境  
ubuntu18.04
qt5.11.2(没有没关系的,设置里设为off)
gcc7

我原来特别烦开源库自己编译,总是各种错误.编译好多次各种不同的之后发现,其实cmake出错很好办,
	configure过程中错误的话就是配置错误
	make过程中错误就是缺少库,去日志里看下少什么库,谷歌搜索下前五条一定有如何安装

make成功后要不要install,看你怎么用.
我工程都是直接用cmake写的,所以不用安装了,编译好就行了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925094701447.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925094606418.png)

# CGAL Windos安装
[Windos 下安装使用 cgal](https://beondxin.blog.csdn.net/article/details/105901270)

# CGAL 安装错误及解决办法
用新电脑重新编译发现还是有错误的，缺少各种库，有个很方便的办法，直接安装官方提供编译好的的库，让后自己编译源码，让后卸载官方提供库。如果不按这个顺序直接编译，反正就是少各种第三方库

1. 错误1
Could NOT find GMP (missing: GMP_LIBRARIES GMP_INCLUDE_DIR) 
CMake Error at cmake/modules/CGAL_SetupDependencies.cmake:66 (message):
  CGAL requires GMP to be found
Call Stack (most recent call first):
  CMakeLists.txt:673 (include)
**解决办法**

安装GMP呗
sudo apt-get install m4   先安装m4
 https://gmplib.org/[官网下载](https://gmplib.org/)
https://gmplib.org/manual/Installing-GMP.html[官方安装教程](https://gmplib.org/manual/Installing-GMP.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191004123431879.png)
./configure --enable-cxx
make
make check
sudo make install

2.  错误2
Could NOT find MPFR (missing: MPFR_LIBRARIES MPFR_INCLUDE_DIR) 
CMake Error at cmake/modules/CGAL_SetupDependencies.cmake:66 (message):
  CGAL requires MPFR to be found
Call Stack (most recent call first):
  CMakeLists.txt:673 (include)
**解决办法**
git clone https://github.com/qnzhou/PyMesh.git
cd PyMesh
git submodule update --init
cd $PYMESH_PATH/third_party
mkdir build
cd build
cmake ..
make
make install





# CGAL   安装后测试
用qt的话搞这种跨平台的很方便,直接新建纯c++项目,用cmake管理不要用qmake
跑一下这段测试程序(官方案例第一个,为了方便理解我中文注释了下


如果用qmake或者windos下用vs的话(上一步需要install),配置下includes 路径和lib路径
qmake这样添加
INCLUDEPATH+=XXXX     .h路径
CONFIG(debug, debug|release):{
LIBS+=-LXXXXX    lib路径
-lxxxxd\
-lxxxxd
}else:CONFIG(release, debug|release):{
LIBS+=-LXXXXX    lib路径
-lxxxx\
-lxxxx
}
vs的话直接属性配置,添加路径就可以了


还是cmake最方便
```javascript
cmake_minimum_required(VERSION 3.1.0)
project(cgalc)

find_package(CGAL REQUIRED)
include(${CGAL_USE_FILE})

add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(${PROJECT_NAME} ${CGAL_LIBS})
```

```javascript
#include <iostream>
#include <CGAL/Simple_cartesian.h>

typedef CGAL::Simple_cartesian<double> Kernel;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Segment_2 Segment_2;

int main() {
    Point_2 p(1, 1), q(10, 10), m(5, 9);
    Segment_2 s(p, q);



    std::cout << "p位置:" << p << std::endl;
    std::cout << "q位置:" << q.x() << " " << q.y() << std::endl;
    std::cout << "m位置:" << m << std::endl;

    std::cout << "---------计算欧几里德距离的平方----------- " << std::endl;
    std::cout << "平方距离(p,q) = "
              << CGAL::squared_distance(p, q) << std::endl;

    std::cout << "---------计算欧几里德距离的平方----------- " << std::endl;
    std::cout << "平方距离(线段(p,q), m) = "
              << CGAL::squared_distance(s, m) << std::endl;

    std::cout << "---------判断共线----------- " << std::endl;
    std::cout << "p, q, m ";
    switch (CGAL::orientation(p, q, m)) {
    case CGAL::COLLINEAR:
        std::cout << "共线\n";
        break;
    case CGAL::LEFT_TURN:
        std::cout << "左侧\n";
        break;
    case CGAL::RIGHT_TURN:
        std::cout << "右侧\n";
        break;
    }

    std::cout << "---------计算中点----------- " << std::endl;
    std::cout << " 中点(p,q) = " << CGAL::midpoint(p, q) << std::endl;
    return 0;
}
```
输出结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925105739694.png)


# CGAL   I/O读写 Functions
很坑,这么多年一个计算机图像库,三维竟然只支持off读写
而且还是那种四个点的小立方体,不是三角形的
搞得用起来很麻烦,off数据格式和常规的stl转off写在后边

为啥选择外部数据保存成off文件,cgal读取 处理  在写出off 让后其他库再打开这种贼二的方式,而不直接从内存换数据,因为cgal这玩意三维数据的cell竟然只有四点的立方体(今天刚接触,案例找了半天,表面模型数据结构,点索引我竟然只找到这一种四点确定的,随后找到了我再换成直接内存读写的)


> Functions
>  template<class PolyhedronTraits_3 > bool 	read_off
> (std::istream &in, Polyhedron_3< PolyhedronTraits_3 > &P)  
> template<class PolyhedronTraits_3 > std::istream & 	operator>>
> (std::istream &in, Polyhedron_3< PolyhedronTraits_3 > &P)  
> template<class PolyhedronTraits_3 > bool 	write_off (std::ostream
> &out, Polyhedron_3< PolyhedronTraits_3 > &P)   template<class
> PolyhedronTraits_3 > std::ostream & 	operator<< (std::ostream &out,
> Polyhedron_3< PolyhedronTraits_3 > &P)

 read_off()
template<class PolyhedronTraits_3 >
bool read_off	(	std::istream & 	in,
Polyhedron_3< PolyhedronTraits_3 > & 	P 
)	
此函数从输入流中读取对象文件格式的多面体曲面，off，文件扩展名为.off，geomview[5]也理解此功能，并将其附加到多面体曲面p中。仅使用输入流中的点坐标和面来构建多面体。表面。不计算法向量和颜色属性。如果中的流不包含允许的多面体曲面，则会设置中输入流的ios：：badbit，而p保持不变。
对于off，存在ascii和二进制格式。流自动检测格式并可以读取这两种格式。

write_off()
template<class PolyhedronTraits_3 >
bool write_off	(	std::ostream & 	out,
Polyhedron_3< PolyhedronTraits_3 > & 	P 
)	
此函数使用对象文件格式off将多面体曲面p写入输出流，文件扩展名为off，geomview[5]也理解此格式。输出为ascii格式。从多面体表面，只写点坐标和面。既不使用法向量也不使用颜色属性。
对于off，存在ascii和二进制格式。可以使用cgal修饰符为流选择格式，分别设置ascii_mode（）和set_binary_mode（）。修饰符set_pretty_mode（）可用于在输出中允许（一些）结构化注释。否则，输出将没有注释。默认的写入方式是不带注释的ascii。





# CGAL   OFF数据格式
这篇文章很好的介绍了数据格式,不过不知道为啥这种科普文章也可以发表
[三角网格文件OFF的格式分析及OFF到STL的转化](http://www.doc88.com/p-8495281266662.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925193411451.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925193424562.png)



# CGAL   OFF  STL相互转换
具体查看  [CGAL OFF STL相互转换](https://blog.csdn.net/a15005784320/article/details/102220530)

# CGAL  表面细化
具体查看 [CGAL 表面细化](https://blog.csdn.net/a15005784320/article/details/102220279)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006121627303.png)![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006121634983.png)
# CGAL  表面平滑
假期时候补上



# CGAL  表面补洞
[需要用到 Eigen3](https://blog.csdn.net/a15005784320/article/details/101687201)
具体查看 [CGAL 选择某一孔进行补洞](https://blog.csdn.net/a15005784320/article/details/102218223)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190929140410652.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191006121615570.png)

# CGAL  自相交检测

具体代码看 [https://blog.csdn.net/a15005784320/article/details/104043454](https://blog.csdn.net/a15005784320/article/details/104043454)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200119173854191.png#pic_center)

# CGAL 提取中心线
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200119175610514.png)
具体代码看 [CGAL 提取中心线](https://blog.csdn.net/a15005784320/article/details/104043612)
