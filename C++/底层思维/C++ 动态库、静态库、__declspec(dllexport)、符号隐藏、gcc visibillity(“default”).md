# C++ 动态库、静态库、__declspec(dllexport)、符号隐藏、gcc visibility ("default")


记录几个之前存在疑惑的地方。


---

### Q1：为什么我选择 生成/使用 动态库，依旧会 产生/加载 .lib？

* 动态库：.dll/.so
* 静态库：.lib/.a
* 链接：把库函数跟可执行程序绑定（绑定时间不同，分为静态、动态链接）

不管链接，都要给可执行程序添加导入库。静态库的导入库就存在他本身、动态库的导入库存在*.lib（这个lib并不是静态库）
所以程序封装给别人用，需要提供：

1. 头文件
2. 静态链接： .lib（静态库）
2. 动态链接： .dll（动态库） + .lib（导入库）

静态库和导入库名字相同，大小差异很多。导入库只有函数的符号，静态库有具体实现。

---

### Q2：增加了头文件和库文件，依旧提示找不到符号/声明/定义？

库文件中的函数并非全部导出，不同编译器会有不同效果。
* gcc、mingw会导出所有的函数到动态库
* msvc默认不会导出任何函数到动态库

所以使用msvc时候会出现，明明把文件和库都加载了却依旧找不到实现的符号。

---

### Q3：为什么动态库会隐藏函数/类？

可以想象到的是：
* 输出库符号受限提高程序的模块性，并隐藏实现细节
* 动态库的符号越少，启动和运行越快
* 导出所有符号会增加内存

还没实际试过，抽空研究一下补上。


---

### Q4：_declspec是个啥？

* MSVC ： 微软的 c++ 编译器（还有很多其他的编译器，比如mingw、gcc）
* 拓展修饰 ：不同的编译器对c++增加了标准语法外的魔法糖
* __declspec ：拓展修饰符
* _declspec(dllexport) ：在DLL源文件中声明要输出的C++类、函数以及数据。MSVC 增加的魔法糖
* _declspec(dllimport) ：在外部程序声明由DLL输出的C++类、函数以及数据。MSVC 增加的魔法糖


---


### Q5：MSVC 如何封装动态库？

第二个问题说了，msvc动态库不会导出任何函数，那msvc应该怎么用？

* 封装：

类/函数在库内部使用：不做任何操作
类/函数在库外部给别人用：使用_declspec(dllexport)修饰类/函数


* 使用：

使用库内部的函数/类：声明的头文件使用_declspec(dllimport)修饰类/函数

---

### Q6：cmake和头文件如何写？

只有msvc才有动态库封装部分接口给外部使用，其他的比如gcc会封装所有的函数给外部使用。
封装使用_declspec(dllexport)修饰函数/类、调用使用_declspec(dllimport)修饰函数/类

那其实问题就变成了用什么修饰函数/类的问题

```cpp
// 动态库封装的cmakelist.txt
if(WIN32)
    if(MSVC)
        add_definitions(-DUSE_SHARED)
    else()
        add_definitions(-DNO_MSVC)
    endif()
endif()
```

```cpp
// 静态库封装的cmakelist.txt
if(WIN32)
    if(MSVC)
        add_definitions(-DUSE_STATIC)
    else()
        add_definitions(-DNO_MSVC)
    endif()
endif()
```

```cpp
// 可执行程序的cmakelist.txt
// 啥也不用写
```

```cpp
// Q_DECL_EXPORT 和 Q_DECL_IMPORT 是Qt封装好的，跟直接用__declspec(***)一样
#define Q_DECL_EXPORT __declspec(dllexport)
#define Q_DECL_IMPORT __declspec(dllimport)
```

```cpp

#ifdef _WIN32
    #if defined(USE_SHARED)
        #define REGDLL_API Q_DECL_EXPORT
    #elif defined(USE_STATIC)
        #define REGDLL_API
    #elif defined(NO_MSVC)
        #define REGDLL_API
    #else
        #define REGDLL_API Q_DECL_IMPORT
    #endif
#else
    #define REGDLL_API __attribute__ ((visibility ("default")))
#endif


namespace RegFuncs {
    // 类被 REGDLL_API 修饰。所有的函数都可以载外部调用
    class REGDLL_API PubRegFuncs {
      public:
        static void LoadMarkerData(const QString &fileName);
    };

    // 被 REGDLL_API 修饰的函数才可以载外部调用
    class MarkerRegistration {
      public:
        REGDLL_API static bool GetCoefficient(std::string filePath);
    };
}
```





---


### Q7：其他编译器如何实现封装部分函数？

GCC 4.0以后，提供visibility属性，可以应用到函数、变量、模板以及C++类。


```cpp
#ifdef __GNUC__ >= 4
    #ifdef FBC_EXPORT
        #define FBC_API_PUBLIC __attribute__((visibility ("default")))
        #define FBC_API_LOCAL __attribute__((visibility("hidden")))
    #else
        #define FBC_API_PUBLIC
        #define FBC_API_LOCAL
    #endif
#else
    #error "------ requires gcc version >= 4.0 ------"
#endif

```


---




### Q8：静态库__declspec()使用？

使用（MSVC）

* 封装静态库：可以用 __declspec(dllexport) 修饰，不过没啥用
* 使用静态库：不能用 __declspec(dllimport) 修饰，因为找不到动态库
* 建议：静态库的代码 dllexport、dllimport 都不要用




---

### Q9：静态库隐藏符号功能？

gcc 可以直接 -fvisibility=hidden
MSVC该怎么操作？没找到合适的办法

每天cpp文件是一个编译单元，单元有三个符号：

* 自己用的
* 给外部用的
* 依赖外部的

编译阶段：只要声明就可以
链接阶段：链接器就是把这些符号相互链接，少了那个都会链接失败。



---



### Q10：静态库加载动态库后使用、动态库加载静态库后使用？


* 静态库 <-- 静态库
MSVC只需链接静态库，gcc需要链接两个静态库

* 静态库 <-- 动态库
动态库依旧被动态调用
MSVC只需链接静态库，gcc需要链接静态和动态库
如果你写的静态库引入其他库，还是改成动态库吧。

* 动态库 <-- 静态库
MSVC、gcc 只需链接动态库
试了下可行，限制挺多

* 动态库 <-- 动态库
MSVC、gcc 只需链接动态库


> 静态库没有链接这个步骤，静态库如果用了其他静态库或者动态库需要手动链接
动态库有链接步骤，链接静态库则把静态库全部放进来，链接动态库则只放入符号再程序启动时候链接。
动态库可以由多个程序共享, 节省内存，易于升级。静态库外部依赖少, 更易于部署。



---

目前个人理解是这样，有错误请指正。



