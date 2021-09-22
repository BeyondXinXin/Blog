cmake常用指令很少
1. cmake_minimum_required(VERSION 
major.minor[.patch[.tweak]] 
[FATAL_ERROR])

指定构建工程时所需要的版本要求。
* **VERSION**必须关键字 指最低要求
* **major.minor[.patch[.tweak]]**   可选关键字 指定使用哪一个版本
* **FATAL_ERROR** 可选关键字，如果版本不对应提示什么错误


2. project(< PROJECT-NAME > [< language-name >...])
    project(< PROJECT-NAME >
        [VERSION <major>[.<minor>[.<patch>[.<tweak>]]]]
        [DESCRIPTION <project-description-string>]
        [HOMEPAGE_URL <url-string>]
        [LANGUAGES <language-name>...])

指的就是项目名称、支持语言（默认c/c++）、版本号。使用这个命令隐含两个变量 
PROJECT_BINARY_DIR
PROJECT_SOURCE_DIR

3. find_package(<PackageName>
 [version] 
[EXACT] 
[QUIET] 
[REQUIRED]  [components...]]
[OPTIONAL_COMPONENTS components...]
[NO_POLICY_SCOPE])  mode模式

用来搜索并加载外部工程
* version 可选参数 版本兼容
* EXACT 可选参数 版本必须对应
* REQUIRED 务必找到

4. include(<file|module> [OPTIONAL] [RESULT_VARIABLE <VAR>] [NO_POLICY_SCOPE])

载入并运行来自于文件或模块的CMake代码
include(${VTK_USE_FILE})   就是包含UserVTK.cmake文件

5. add_executable(< name> [WIN32] [MACOSX_BUNDLE]

生成一个name的可执行文件，相关源文件后边用空格隔开

6. target_link_libraries(<target> [item1] [item2] [...]
                      [[debug|optimized|general] <item>] ...)

生成可执行文件需要链接那些文件   target 必须和第五步生成的name一样





---
最下边给出我常用的cmake模板，小白可以跟我一样当成模板每次自己修改用
我就qt  添加常用模块  network  Core  Gui  Xml等
引用开源库opencv3     和itk4		



其实qmake挺好的，就是引用开源库只能像vs一样添加一堆lib，还有各种路径
如果开源库直接用cmake编译的，那个qt也用cmake其实会很爽比如qt+itk 我这里给家比较感受下
第一个cmake下qt里调用itk
第二个qmake下qt里调用itk
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019082814152175.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190828141532620.png)



```javascript
cmake_minimum_required(VERSION 3.10.2)
project(MinimalPathExtractionExamples)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR}/bin)


find_package(OpenCV REQUIRED)
include_directories(  ${OpenCV_INCLUDE_DIRS} )
find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Xml )
find_package(Qt5LinguistTools)
find_package(Qt5Network)
find_package(ITK REQUIRED
    COMPONENTS MinimalPathExtraction
    ITKIOImageBase
    ITKImageFunction
    ITKOptimizers
    ITKPath
    ITKIOMeta
    ITKIOPNG
    ITKIOJPEG
    )

include(${ITK_USE_FILE})
option(BUILD_SHARED_LIBS "" OFF)

set(Resources
    Resources/qss.qrc
    Resources/app.h
    Resources/app.cpp
    Resources/stable.h
    Resources/main.qrc
    Resources/qt_opencv.h
    Resources/qt_opencv.cpp）
set(farm
    farm/mainwindow.h
    farm/ mainwindow.cpp
    farm/ mainwindow.ui）



add_executable(
    ${PROJECT_NAME}
   ${Business}
   ${farm}
    main.cpp  
    )

target_link_libraries(
    ${PROJECT_NAME}
    ${ITK_LIBRARIES}
    )
target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network)
target_link_libraries(
    ${PROJECT_NAME}
    ${OpenCV_LIBS}
    "opencv_core"
    "opencv_highgui"
    "opencv_imgcodecs"
    "opencv_imgproc"
    "dl")
```
