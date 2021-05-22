# ITK VTK DCMTK 一次编译后给其他电脑使用


## 需求

原来（ubuntu、deepin）开发的时候，每台电脑自己分别编译下需要用的第三方库。使用熟练后，第三方库的版本、模块基本不会再经常修改了。最近计划windos下把库打包，以后换电脑就不用每次编译了。边摸索边记录下过程。


## 编译步骤

###  1 明确的自己相关设置

1. 确认编译器和其版本   （MinGW  MSVC  Ninja） （Make）
2. 确认Qt的版本
3. 确认VTK 、ITK、DCMTK 的版本
4. 确认第三方库使用了那些模块
5. 区分Debug 和 Release 给lib和dll加什么后缀


####  1.1 确认版本

我需要用到两套，一套工作需要，一套在家学习。

CMake 选择 3.14

工作版本：
* VS2015
* Qt 5.9.7
* ITK 4.12.2
* VTK 8.1.2
* DCMTK 3.6.5

学习版本
* VS2017
* Qt 5.15.2
* ITK 4.13.3
* VTK 9.0.1
* DCMTK 3.6.5

#### 1.2 确认模块

* VTK-9.0.1
VTK_GROUP_ENABLE_Qt &emsp;&emsp;ON
VTK_MODULE_ENABLE_VTK_GUISupportQt &emsp;&emsp;ON
VTK_MODULE_ENABLE_VTK_GUISupportQtSQL &emsp;&emsp;ON
VTK_MODULE_ENABLE_VTK_RenderingQt &emsp;&emsp;ON
VTK_MODULE_ENABLE_VTK_ViewsQt &emsp;&emsp;ON
Qt5_DIR C:/Qt/5.15.2/msvc2015_64/lib/cmake/

* ITK-4.13.3
INSTALL_GTEST &emsp;&emsp;OFF
BULID_TESTING &emsp;&emsp;OFF
Module_ITKVtkGlue &emsp;&emsp;ON
VTK_DIR &emsp;&emsp;D:/lib/VTK-9.1.0/bulid

* DCMTK-3.6.5
DCMTK_ENABLE_STL_STRING &emsp;&emsp;ON
BULID_SHARED_LIBS &emsp;&emsp;ON
BULID_WITH_PNG &emsp;&emsp;ON

#### 1.3 确认后缀

* CMAKE_DEBUG_POSTFIX &emsp;&emsp; _d
* CMAKE_RELEASE_POSTFIX &emsp;&emsp;  _r


###  2 安装 cmake vs  qt

建议去官网下载。这几个是我之前下载好的坚果云分享。

Qt 5.9.7 https://www.jianguoyun.com/p/DZHLuwQQ54WSCRjk9O4D (访问密码 : 7uve8k)
Qt 5.15.2(需要在线安装) https://www.jianguoyun.com/p/DZc7fZMQ54WSCRjn9O4D (访问密码 : 9yr62b)
vs2017  https://www.jianguoyun.com/p/DfsPXfsQ54WSCRjq9O4D (访问密码 : 8bdknh)
vs2015  https://www.jianguoyun.com/p/DfsPXfsQ54WSCRjq9O4D (访问密码 : 8bdknh)
调试器（winsdksetup）https://www.jianguoyun.com/p/Da1oOOkQ54WSCRjz9O4D (访问密码 : elshp0)
CMAKE3.14 https://www.jianguoyun.com/p/DdPe2NYQ54WSCRj49O4D (访问密码 : 6ywh2n)


###  3 下载源码 

建议去github上拉。这几个是我之前下载好的坚果云分享

DCMTK 365 https://www.jianguoyun.com/p/DU440uEQ54WSCRiH9e4D 
VTK 812 https://www.jianguoyun.com/p/DQgmfxoQ54WSCRiI9e4D 
VTK 820 https://www.jianguoyun.com/p/DaLJrOMQ54WSCRiJ9e4D 
VTK 900 https://www.jianguoyun.com/p/DYA6EFkQ54WSCRiK9e4D 
VTK 901 https://www.jianguoyun.com/p/DdlqZ44Q54WSCRit9e4D 
ITK 412 https://www.jianguoyun.com/p/DSaqwqkQ54WSCRir9e4D 
ITK 413 https://www.jianguoyun.com/p/Db61vj4Q54WSCRis9e4D 

### 4 生成工程

#### 4.1 解压源码后再目录创建 bulid 目录
![\[\]](https://img-blog.csdnimg.cn/20210418171315227.png)



#### 4.2 进入bulid 目录 。在地址栏输入 cmake-gui ..

![\[\]](https://img-blog.csdnimg.cn/20210418171319683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


或者手动，打开cmkae-gui 复制路径
![\[\]](https://img-blog.csdnimg.cn/20210418171324778.png)


#### 4.3 根据第一步的配置，设置相关的属性

![\[\]](https://img-blog.csdnimg.cn/20210418171334457.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



![\[\]](https://img-blog.csdnimg.cn/20210418171338177.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


![\[\]](https://img-blog.csdnimg.cn/20210418171344677.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



![\[\]](https://img-blog.csdnimg.cn/20210418171350378.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



#### 4.4 打开vs编译（mingw的话可以用qt creator打开编译）

![\[\]](https://img-blog.csdnimg.cn/20210418171356442.png)


![\[\]](https://img-blog.csdnimg.cn/20210418171401899.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


#### 4.5 安装 （vs必须用管理员身份打开）


![\[\]](https://img-blog.csdnimg.cn/20210418171407937.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




#### 4.6 重复 4.1 -4.5 编译 VTK 和 ITK 
注意，ITk要使用glue。所以必须先编译好vtk后再编译itk。我这里vtk的版本命名名错了，应该是9.0.1

![\[\]](https://img-blog.csdnimg.cn/20210418171413263.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




### 5 打包安装文件
如果之前cmake使用默认安装路径，且管理员身份打开的vs。则这三个库均安装在了本地 
Program Files（x86）

![\[\]](https://img-blog.csdnimg.cn/20210418171419684.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


#### 5.1 确认安装文件

目录说明
* bin：dll
* cmake：cmake设置
* etc：默认配置文件
* include：头文件
* lib：lib
* share：版权说明

![\[\]](https://img-blog.csdnimg.cn/20210418171427972.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



可以进去确认下后缀是否分开了

![\[\]](https://img-blog.csdnimg.cn/20210418171435241.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



#### 5.2 合并安装文件
本地新建一个 ThirdParty 文件夹，把刚才编译好的库（vtk itk dcmtk）全部复制到这里。

![\[\]](https://img-blog.csdnimg.cn/20210418171441475.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


#### 5.3 拷贝pdb文件
c盘的安装文件夹里没有pdb文件，在ThirdParty里新建一个pdb文件。让后拷贝这三个库的pdb文件进来。
pdb文件都在源码目录里的bulid/bin/debug

![\[\]](https://img-blog.csdnimg.cn/20210418171447143.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



#### 5.4 压缩ThirdParty文件夹，就可以拷贝到其他电脑使用了



## 使用方法

1. 使用编译后库的电脑上 Qt 版本 和 VS 版本 必须跟编译电脑保持一致。
比如：开头提到的  VS2015+Qt 5.9.7 和 VS2017+Qt 5.15.2。编译电脑上我就分别编译了两次。

2. 再需要使用编译后库的工程内增加 PREFIX_PATH 和 MODULE_PATH

```cpp
list(APPEND CMAKE_PREFIX_PATH "D:/lib/ThirdParty")
list(APPEND CMAKE_MODULE_PATH "D:/lib/ThirdParty/cmake")
if(MSVC)
    set(Qt5_DIR  "C:/Qt/5.15.2/msvc2015_64/lib/cmake/Qt5")
endif()
```

3. 使用 find_package 即可找到 ThirdParty 里的库

```cpp
set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 11)
set(BUILD_SHARED_LIBS "" ON)

set(CMAKE_CXX_FLAGS_RELEASE "/MD /O2 /Ob2 /DNDEBUG")
set(CMAKE_CXX_FLAGS_DEBUG "/MDd /Zi /Ob0 /Od /RTC1")

find_package(Qt5
    REQUIRED COMPONENTS Core Gui Widgets Network Concurrent Sql)
add_definitions(-DQT_MESSAGELOGCONTEXT)
find_package(DCMTK REQUIRED ${DCMTK_FIND_PACKAGE_STATEGY})
include_directories(${DCMTK_INCLUDE_DIRS})
find_package(QUAZIP REQUIRED)
include_directories(${QUAZIP_USE_FILE})
find_package(VTK REQUIRED)
include(${VTK_USE_FILE})
find_package(ITK REQUIRED)
include(${ITK_USE_FILE})
```

4. 使用 target_link_libraries 连接

```cpp
target_link_libraries(
    Test
    ${DCMTK_LIBRARIES}
    ${VTK_LIBRARIES}
    ${ITK_LIBRARIES}
    ${QUAZIP_LIBRARIES}
    )
```


## 编译后文件下载

每个人需要的模块不一样，最好自己编译下，也方便改。

如果用的版本跟我一样的话可以用我编译完的：
* Qt-5.15.2 （msvc2015 64） 下：VTK-9.0.1 + ITK-4.13.3 + DCMTK-3.6.5 + QuiZip ：
https://www.jianguoyun.com/p/DXdnHkMQ54WSCRim9u4D 

* Qt-5.15.2 （msvc2017 64） 下：VTK-8.2.0 + ITK-4.12.2 + DCMTK-3.6.5 + QuiZip ：

* Qt-5.9.7 （msvc2015 64） 下：VTK-8.1.2 + ITK-4.12.2 + DCMTK-3.6.5 + QuiZip ：



---

Study VTK 
[https://github.com/BeyondXinXin/Blog-OpenLibrary/projects/1](https://github.com/BeyondXinXin/Blog-OpenLibrary/projects/1)
