&emsp;&emsp;这个问题面试被问烂了，关于这个介绍很多了。看十遍不如自己写一遍

---

# C++ new和malloc的区别（转载）

原文地址  
* [https://blog.csdn.net/nyist_zxp/article/details/80810742](https://blog.csdn.net/nyist_zxp/article/details/80810742)  
* [https://www.zhihu.com/question/281940376/answer/914142481](https://www.zhihu.com/question/281940376/answer/914142481)  

&emsp;&emsp;c++有堆内存和栈内存之分。本来全部都是堆内存，栈内存的出现：花一点点cpu的时间，极大缩短开发时间和实现内存自动管理。

&emsp;&emsp;`new`和`malloc`都是分配在堆内存上，完成手动申请和手动释放。两者主要区别：

&emsp;&emsp;要不是面试问，谁会管他们俩属性什么的区别啊。。。。。。

1. 属性  
`new`是关键字（编译器支持），`malloc`是库函数（头文件支持）。
2. 参数  
`new`无需指定大小，`malloc`需要指定大小。
3. 返回类型  
`new`返回类型是对象指针，`malloc`
4. 对于自定义的类  
`new`会调用构造和析构函数，`malloc`不会调用构造和析构函数
5. 分配失败
`new`会抛出异常，`malloc`返回空
6. 内存泄露  
两者都能检测到，`new`可以检查到哪一行，`malloc`不行。




