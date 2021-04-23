https://blog.csdn.net/shenziheng1/article/category/7076748




```javascript
cmake_minimum_required ( VERSION  3.5)
//cmake版本

project (text)
//工程名称

add_executable(text  main.cpp)
//添加 main.cpp 	方法1
 add_executable( ${PROJECT_NAME} main.cpp)
//添加 main.cpp	方法2
set(Source
    main.cpp)
add_executable(${PROJECT_NAME}  ${Source})
//添加 main.cpp	方法3

add_library(MathFunctions mysqrt.cxx)

if(WIN32)    
elseif(UNIX)    
else()  
endif()
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG ${PROJECT_SOURCE_DIR}/bin/Debug)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR}/bin/Release)
//三个系统区分生成位置




find_package(Qt5 REQUIRED COMPONENTS Core Gui Widgets Sql Test Network)
find_package(Qt5LinguistTools)
target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql)
//引用qt相关



find_package(OpenCV REQUIRED)
include_directories(  ${OpenCV_INCLUDE_DIRS} )
target_link_libraries(
    ${PROJECT_NAME}
    ${OpenCV_LIBS}
    "opencv_core"
    "opencv_highgui"
    "opencv_imgcodecs"
    "opencv_imgproc"
    "dl")
//调用opencv














```
