&emsp;&emsp;Qt cmake 根据不同参数编译不同程序。
&emsp;&emsp;比如我这里的例子，编译的主机是否编译libtorch、是否编译拥有gpu，分三种情况执行三种函数。就是判断一下Calculation_Method的值，对应引入不同的cpp。ventricularremodeling.h里所有函数分开两个cpp存放，ventricularremodeling.cpp放通用的函数实现，剩下那个放不通用的函数。

```bash
#USE_GPU：本地成功编译libtorch，装有gpu且配置好cuda环境
#USE_CPU：本地成功编译libtorch，利用cpu计算
#USE_FAKE：本地未编译libtorch

SET(Calculation_Method  "USE_CPU")
configure_file (
    "${PROJECT_SOURCE_DIR}/calculation_method.h.in"
    "${PROJECT_SOURCE_DIR}/calculation_method.h"
    )
include_directories(script/libtorch)
if(Calculation_Method STREQUAL "USE_GPU")
    SET(Torch_DIR "/home/yx/Documents/lib/pytorch/build/lib.linux-x86_64-3.7/torch/share/cmake/Torch"
        CACHE PATH "Torch_DIR directory override" FORCE)
    find_package(Torch REQUIRED)
    include_directories(${TORCH_INCLUDE_DIRS})
    set(libtorch
        script/libtorch/ventricularremodeling.cpp
        script/libtorch/ventricularremodeling.h
        script/libtorch/use_gpu.cpp)
elseif(Calculation_Method STREQUAL "USE_CPU")
    SET(Torch_DIR "/home/yx/Documents/lib/pytorch/build/lib.linux-x86_64-3.7/torch/share/cmake/Torch"
        CACHE PATH "Torch_DIR directory override" FORCE)
    find_package(Torch REQUIRED)
    include_directories(${TORCH_INCLUDE_DIRS})
    set(libtorch
        script/libtorch/ventricularremodeling.cpp
        script/libtorch/ventricularremodeling.h
        script/libtorch/use_cpu.cpp)
elseif(Calculation_Method STREQUAL "USE_FAKE")
    set(libtorch
        script/libtorch/ventricularremodeling.cpp
        script/libtorch/ventricularremodeling.h
        script/libtorch/use_fake.cpp)
else()
    message("Calculation_Method set err")
    return ()
endif()
```
