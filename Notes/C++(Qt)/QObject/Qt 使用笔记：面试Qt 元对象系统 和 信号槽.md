# Qt 使用笔记：面试Qt 元对象系统 和 信号槽

&emsp;&emsp;就职于一个小的桌面软件开发公司。业务拓展，最近需要招几个小伙伴，让我这个半吊子去面试。我干脆直接搞份简历去规模差不多的其他公司面试看看别人问些什么。元对象系统 和 信号槽是问的最多的。针对问题自己记录下，有错误请指正。
&emsp;&emsp;参考：
[QT学习——Qt信号与槽实现原理](https://blog.csdn.net/perfectguyipeng/article/details/78082360)
[Qt信号槽-原理分析](https://www.cnblogs.com/swarmbees/p/10816139.html)

---

@[TOC](Qt 使用笔记：面试Qt开发元对象系统 和 信号槽)
&emsp;&emsp;
&emsp;&emsp;


#### Qt元对象系统
&emsp;&emsp;Qt作为一个软件开发框架，搞了一套魔法糖便于UI开发。引入了元对象系统，提供了：对象树、信号槽、动态属性这三个功能，极大的加快ui开发。
- **对象树** 解决问题 ：无需考虑回收、可以随时获取父类和子类并操作。
- **动态属性** 解决问题 ：配合样式表和事件过滤器，对于UI开发实在是爽。
- **信号槽** 解决问题 ：松散耦合+类型安全。观察者模式，调用函数指针。

&emsp;&emsp;元对象系统和MOC预处理器是为了在c++内引入反射机制。
&emsp;&emsp;反射（内省）机制：程序运行时，对于任何一个类，能够知道有哪些方法和属性；对于任何一个对象，能够随时调用方法和属性。动态获取对象信息和调用对象方法的功能称为反射机制。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210109150141746.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;


#### 信号槽解 实现方式
- 声明：信号和槽
&emsp;&emsp;信号和槽是一回事就是回调函数（无论那种链接）。信号自己声明，moc帮你实现；槽自己声明自己实现或者lambda。除此之外完全一样。
- 声明：moc做了什么
&emsp;&emsp;moc构建回调的开头和结尾
&emsp;&emsp;回调过程`QOjbect`宏中实现
&emsp;&emsp;`signals`和`slots`宏帮助区分信号和槽
- 声明：自定义数据类型
&emsp;&emsp;信号槽只能传递`MetaType`，`qRegisterMetaType`注册一下。

- 链接：connect  
&emsp;&emsp;把发送、信号、接收、槽四者绑定，存到发射者内部，供后续执行信号时查找。信号槽链接方式5种：

链接方式 | 描述
-------- | -----
自动  | 同线程同步，跨线程异步。调用槽函数（回调）
直连  | 同线程同步。调用槽函数（回调）
队列  | 跨线程异步。调用槽函数（回调）
阻塞队列  | 跨线程同步。调用槽函数（回调）
唯一 |防止重复链接，前四种是互斥的，这个跟前几个任意组合

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210109151502544.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)


- 触发：发送信号 
&emsp;&emsp;发射者内部获取信号对应的`QObjectConnectionListVector`，执行一系列回调函数。跨线程的话就是抛出`QMetaCallEvent`把这个函数丢到队列里，放入Qt本身的事件循环中。


![在这里插入图片描述](https://img-blog.csdnimg.cn/20210109152221150.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)


---
