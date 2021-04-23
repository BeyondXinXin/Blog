&emsp;&emsp;使用cmake管理项目有一个很舒服的地方就是对于第三方库的添加，只需要**find_package**一行命令就可以添加第三方库的各种目录版本等。如果是自己写的代码也可以支持**find_package**一键导入呢？**find_package**本质上就是找对应库的**Config.cmake**文件以及文件中的**INCLUDE_DIRS** 和 **LIB_DIR**路径。

### 1. 1.准备一个 .h.in 模板文件
- 命名：
&emsp;&emsp;**XXXXConfig.h.in**&emsp;&emsp;比如 **KissDicomViewerConfig.cmake.in**

- 包含内容：
&emsp;&emsp;**INCLUDE_DIRS**
&emsp;&emsp;**LIB_DIR**
&emsp;&emsp;**LINK_DIRECTORIES**

&emsp;&emsp;比如
```cpp
set(KissDicomViewer_INCLUDE_DIRS "@KissDicomViewer_INCLUDE_DIRS@")
set(KissDicomViewer_LIB_DIR "@KissDicomViewer_LIB_DIR@")
set(KissDicomViewer_Resource_DIR "@KissDicomViewer_Resource_DIR@")
LINK_DIRECTORIES(${KissDicomViewer_LIB_DIR})
set(KissDicomViewer_SHARDE_LIBRARIES KissDicomViewer_sharde)
set(KissDicomViewer_STATIC_LIBRARIES KissDicomViewer_static)
```
### 2. 2.自己编写的库文件增加  .cmake文件导出
&emsp;&emsp;静态库、动态库生成目录
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
&emsp;&emsp;资源文件位置
```cpp
set(SRCS ${SOURCES} ${HEADERS} ${RESOURCES} ${FORMS})
set(KissDicomViewer_Resource_DIR ${RESOURCES} CACHE PATH "mailiu Resource")
```
&emsp;&emsp;头文件、库目录 记录
```cpp
# LOCAL FILES
set(INCLUDE_DIRS ${PROJECT_SOURCE_DIR}/src)
set(KissDicomViewer_INCLUDE_DIRS "${INCLUDE_DIRS}")
set(KissDicomViewer_LIB_DIR      "${PROJECT_SOURCE_DIR}/bin/Release")
set(KissDicomViewer_CMAKE_DIR    "${PROJECT_BINARY_DIR}")
```
&emsp;&emsp;生成**Config.cmake**文件
```cpp
# Set Config
message(STATUS "Generating '${PROJECT_BINARY_DIR}/KissProjectConfig.cmake'")
configure_file(${PROJECT_SOURCE_DIR}/cmake/KissDicomViewerConfig.cmake.in
  "${PROJECT_BINARY_DIR}/KissDicomViewerConfig.cmake" @ONLY)
```
### 3. 3.新工程使用

```cpp
find_package(KissDicomViewer REQUIRED)
include_directories(${KissDicomViewer_INCLUDE_DIRS})

target_link_libraries(
    ${PROJECT_NAME}
    ${KissDicomViewer_SHARDE_LIBRARIES})
```
