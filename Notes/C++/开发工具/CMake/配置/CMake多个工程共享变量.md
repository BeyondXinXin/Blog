&emsp;&emsp;**cmake** 定义变量一般使用**set**，但是一般用法变量只能从父目录传递到子目录，无法反向或者统计目录共同使用。比如：
```cpp
set(OpenCV_DIR  "D:/lib/opencv-3.4.9/bulid")
```
&emsp;&emsp;这时需要把变量写到cache（缓存变量）里才可以，比如：
```cpp
set(Resource
    ${PROJECT_SOURCE_DIR}/resource/resource.qrc
    ${PROJECT_SOURCE_DIR}/resource/style.qrc)
set(Resource_Path ${Resource} CACHE PATH "mailiu Resource")
```