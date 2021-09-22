

&emsp;&emsp;有一些比较小的第三方库或者自己封装的常用库，把他们加进自己工程会造成比较繁琐，而且代码格式/规范跟现有软件不一样看着很别扭。要是把他们完全封装成.so或者lib，说不定什么时候还会需要修改。这时候就很需要搞一个第三方的引用库。

&emsp;&emsp;这里用qt很常用的两个类做例子 **QCustomPlot**和**QuaZIP**。一个属于完整的外部工程，一个可以算作自己构建的外部项目。这两个如果直接加到自己项目里，会使项目变复杂而且那俩玩意规范跟自己写的肯定不一样。感觉把他们放到第三方库是最合适的选择。


&emsp;&emsp;[**QCustomPlot**是一个小型的Qt画图标类，支持绘制静态曲线、动态曲线、多重坐标曲线，柱状图，蜡烛图等。只需要在项目中加入头文件qcustomplot.h和qcustomplot.cpp文件，然后使一个widget提升为**QCustomPlot**类，即可使用。](https://www.qcustomplot.com/)

&emsp;&emsp;[**QuaZIP**是Gilles Vollant的ZIP / UNZIP软件包（又名Minizip）的C ++包装程序，它使用了Trolltech的Qt库。如果您需要使用QIODevice API将文件写入ZIP存档或从其中读取文件，则QuaZIP正是您需要的工具。](https://github.com/stachenov/quazip)

&emsp;&emsp;如果觉得下边这个工程有用的话，下载：[http://118.25.63.144/temporary/3rdparty_test.zip](http://118.25.63.144/temporary/3rdparty_test.zip)


### 1. 默认创建一个cmake工程
&emsp;&emsp;一路默认创建就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423182910639.png)
###  2. cmake增加qt支持

&emsp;&emsp;按照下边修改cmake。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423183152764.png)

```cpp
cmake_minimum_required(VERSION 3.1)

project(untitled)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 14)
option(BUILD_SHARED_LIBS "" OFF)

find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Xml Network Concurrent)
find_package(Qt5LinguistTools)


add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent)
```
###  3. 引入自己创建的外部项目，比如QCustomPlot
&emsp;&emsp;工程目录新建一个文件夹 3rdparty 用来存放第三方库或者自己写的外部项目。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423183348905.png)
&emsp;&emsp; 修改两个CMakeList.txt
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423183704708.png)

```cpp
if( WIN32 )
    add_definitions( -DUNICODE )
endif()
add_library( qcustomplot STATIC
    src/qcustomplot.cpp
    src/qcustomplot.h)
set_target_properties( qcustomplot PROPERTIES AUTOMOC TRUE )
target_link_libraries( qcustomplot Qt5::Widgets Qt5::Network )

```

```cpp
cmake_minimum_required(VERSION 3.1)

project(untitled)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 14)
option(BUILD_SHARED_LIBS "" OFF)

find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Xml Network Concurrent)
find_package(Qt5LinguistTools)

add_subdirectory(3rdparty/qcustomplot)
include_directories(3rdparty/qcustomplot/src)


add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent)

target_link_libraries(# 封装到项目中第三方库 lib文件
    ${PROJECT_NAME}
    qcustomplot)
```


###  4. 引入完整的第三方工程，比如 QuaZIP
&emsp;&emsp;下载完整的第三方库，并放进自己工程下的3rdparty。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423184222398.png#pic_center)
&emsp;&emsp;修改cmake。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200423184959564.png)


```cpp
cmake_minimum_required(VERSION 3.1)

project(untitled)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 14)
option(BUILD_SHARED_LIBS "" OFF)

find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Xml Network Concurrent)
find_package(Qt5LinguistTools)

add_subdirectory(3rdparty/qcustomplot)
include_directories(3rdparty/qcustomplot/src)

if(WIN32)
    add_subdirectory(3rdparty/quazip-0.8.1-win)
    include_directories(3rdparty/quazip-0.8.1-win/quazip)
else()
    add_subdirectory(3rdparty/quazip-0.8.1)
    include_directories(3rdparty/quazip-0.8.1/quazip)
endif()

add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent)

target_link_libraries(
    ${PROJECT_NAME}
    qcustomplot
    quazip)
```


---

本案例代码：
[https://gitee.com/yaoxin001/WorkDemo](https://gitee.com/yaoxin001/WorkDemo)

个人博客首页
[http://118.25.63.144/](http://118.25.63.144/)


