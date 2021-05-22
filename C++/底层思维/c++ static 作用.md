&emsp;&emsp;这个问题面试被问烂了，关于这个介绍很多了。看十遍不如自己写一遍

[原文链接](https://www.runoob.com/cplusplus/cpp-tutorial.html)

---

# c++ static 作用

### 1.1. 面向过程
* 全局变量和全局函数  
&emsp;&emsp;修饰前全局可见，修饰后只在当前文件可见。
> 同一个文件，用到相同的变量可以在开头声明下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210121225628145.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


* 修饰局部变量  
&emsp;&emsp;这个值只第一次初始化，然后保留。以后每次再进入这个函数时候值依然留着。
> 可以作为一个标志，或者递增使用  

![](https://img-blog.csdnimg.cn/20210121225635242.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


![](https://img-blog.csdnimg.cn/20210121225640692.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



### 1.2. 面向对象 


* 修饰类的成员变量
&emsp;&emsp;这个类的所有对象共用这个成员变量。静态成员变量。
> 加锁、单例等，同一类不同实例需要共享数据时使用



* 修饰类的成员函数
&emsp;&emsp;这个成员函数不需要实例化就可以调用。这个函数也只能访问类内的静态成员变量。

> 写一些全局通用函数时用



---
&emsp;&emsp;`static`修饰的全局变量初始值默认为0。








