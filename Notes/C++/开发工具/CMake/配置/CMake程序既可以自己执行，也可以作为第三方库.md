
&emsp;&emsp;下边有两个工程，第二个工程**KissDicomViewer**既可以自己执行，也可以作为库（动态）链接到第一个工程使用。



![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003145237450.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003145145283.png#pic_center)

&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;如果有跟我类似的需求，可以这样试下
### 1. 拆分入口函数
- src 里是源码
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003150150787.png#pic_center)
- apps 里是几个入口函数
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003150236874.png#pic_center)
- bin 是生成的库
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003150246711.png#pic_center)


### 2. 2.静态+动态编译链接库

```cpp
# Output directory
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_DEBUG
    ${PROJECT_SOURCE_DIR}/bin/Debug)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_DEBUG
    ${PROJECT_SOURCE_DIR}/bin/Debug)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_DEBUG
    ${PROJECT_SOURCE_DIR}/bin/Debug)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE
    ${PROJECT_SOURCE_DIR}/bin/Release)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY_RELEASE
    ${PROJECT_SOURCE_DIR}/bin/Release)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY_RELEASE
    ${PROJECT_SOURCE_DIR}/bin/Release)

```

```cpp
cmake_minimum_required(VERSION 3.5)

project(KissDicomViewer VERSION "0.0.0.0")

configure_file(
    "${PROJECT_SOURCE_DIR}/KissDicomViewConfig.h.in"
    "${PROJECT_SOURCE_DIR}/Global/KissDicomViewConfig.h"
    )

file(GLOB_RECURSE SOURCES "*.cpp" "*.cxx" "*.cc")
file(GLOB_RECURSE RESOURCES "*.qrc")
file(GLOB_RECURSE HEADERS "*.h")
file(GLOB_RECURSE FORMS *.ui)

set(SRCS ${SOURCES} ${HEADERS} ${RESOURCES} ${FORMS})
set(KissDicomViewer_Resource_DIR ${RESOURCES} CACHE PATH "mailiu Resource")

add_library(KissDicomViewer_sharde SHARED ${SRCS})
add_library(KissDicomViewer_static STATIC ${SRCS})

target_link_libraries(
    KissDicomViewer_sharde
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent
    ${DCMTK_LIBRARIES}
    )

target_link_libraries(
    KissDicomViewer_static
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    Qt5::Sql
    Qt5::Xml
    Qt5::Network
    Qt5::Concurrent
    ${DCMTK_LIBRARIES}
    )
```


### 3. 3.绑定入口函数和库，生成可执行文件

```cpp
macro(DCMTK_ADD_EXECUTABLE PROGRAM)
    include_directories(${KissDicomViewer_INCLUDE_DIRS})
    add_executable(${PROGRAM} ${PROGRAM}.cpp  ${KissDicomViewer_Resource_DIR})
    target_link_libraries(${PROGRAM} KissDicomViewer_sharde)
endmacro()

foreach(SUBDIR studyexplorer dicomviewer logviewer)
  DCMTK_ADD_EXECUTABLE(${SUBDIR})
endforeach()
```


### 4. 4.生成  xxxxConfig.cmake 文件

```cpp
# LOCAL FILES
set(INCLUDE_DIRS ${PROJECT_SOURCE_DIR}/src)
set(KissDicomViewer_INCLUDE_DIRS "${INCLUDE_DIRS}")
set(KissDicomViewer_LIB_DIR      "${PROJECT_SOURCE_DIR}/bin/Release")
set(KissDicomViewer_CMAKE_DIR    "${PROJECT_BINARY_DIR}")

# Set Config
message(STATUS "Generating '${PROJECT_BINARY_DIR}/KissProjectConfig.cmake'")
configure_file(${PROJECT_SOURCE_DIR}/cmake/KissDicomViewerConfig.cmake.in
  "${PROJECT_BINARY_DIR}/KissDicomViewerConfig.cmake" @ONLY)
```

### 5. 5.打开第二个工程，链接Config.cmake

```cpp
find_package(KissDicomViewer REQUIRED)
include_directories(${KissDicomViewer_INCLUDE_DIRS})

target_link_libraries(
    ${PROJECT_NAME}
    ${KissDicomViewer_SHARDE_LIBRARIES})
```

### 6. 6.第二个工程调用
