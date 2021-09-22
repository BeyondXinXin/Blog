&emsp;&emsp;面试被问道具体名词解释，知道啥意思，表述不清。难受。

---

@[TOC](C++ 多态和析构虚函数)


# C++ 多态和析构虚函数

注意：
> 1.一个类如果使用了虚函数，请把他的析构函数也改为虚函数。
2.保证至少有一个虚函数不是内联实现的。



## 1. 多态含义
&emsp;&emsp;多态，字面上看多态就是多种形态。类存在继承关系且多种层次时，会用到多态。多态具体指：调用成员函数时，根据当前的类型执行不同的函数。（动态调用，程序跑起来后才知道调用什么）  
&emsp;&emsp;如果一个语言无法实现多态，只能算是“基于对象的程序设计语言”而非“面向对象的程序设计语言”。
&emsp;&emsp;多态诞生目的：降低程序运行效率，提高开发人员效率。


## 2. 如何实现多态-虚函数


&emsp;&emsp;在类中使用`virtual`关键字修饰函数。

```cpp
class A {
  public:
    virtual void Execute() {
        cout << "A::Execute" << endl;
    }
};
class B : public A {
  public:
    virtual void Execute() {
        cout << "B::Execute" << endl;
    }
};

int main() {
    A  a;
    B b;
    A *pa = &a;
    B *pb = &b;
    pa->Execute();
    pa = pb;
    pa->Execute();
    return 0;
}
```





## 3. 纯虚函数
&emsp;&emsp;需要在基类中定义虚函数，以便派生时更好使用。但是基类有没什么好写的，就可以使用纯虚函数。

```cpp
  virtual void Execute() = 0;
```

## 4. 析构函数

&emsp;&emsp;正常逻辑是 `delete`应该调用类本身的析构函数，而不是基类的虚函数。如果析构函数不用虚函数的话，会有各种BUG。
* 引用计数，因为调用错了析构函数导致`delete`后计数错误  
* 类内动态分配的内存，调用错误的析构函数就内存泄露了


&emsp;&emsp;c++ 派生类会自动调用基类的析构函数。

> 一个类如果使用了虚函数，请把他的析构函数也改为虚函数。

## 5. 虚函数必须在外部实现

> 保证有一个虚函数不是内联实现的就行了。

&emsp;&emsp;析构虚函数如果定义在内部，会发生警告
```cpp
class A {
  public:
    virtual ~A(){}
    virtual void Execute() {
        cout << "A::Execute" << endl;
    }
};
```

```cpp
 warning: 'A' has no out-of-line virtual method definitions; 
its vtable will be emitted in every translation unit
```
&emsp;&emsp;定义在外部则正常。  

```cpp
class A {
  public:
    virtual ~A();
    virtual void Execute() {
        cout << "A::Execute" << endl;
    }
};
A::~A() {}
```
&emsp;&emsp;原因就设计到虚函数是如何实现的了，定义了虚函数编译器会自动生成虚函数表，用来对应虚函数。如果虚函数所有方法是内联的，编译器不知道在那个cpp文件中生成虚函数表，他会在所有用到这个类的cpp中搞一个副本并链接。增大了.o文件。


## 6. 构造函数不能是虚函数
&emsp;&emsp;从使用角度来说：构造函数是在创建对象时自动调用的，不可能通过父类的指针或者引用去调用。具体实现看下文。


## 7. 虚函数实现原理

#### 7.1.1. 虚函数类的构造
&emsp;&emsp;类的实例化就是给每一个实例在内存中分配一块地址。空类的大小是0，实例化时编译器会给一个字节。

```cpp
class A {
  public:
    virtual ~A();
};
A::~A() {}

class AA {
  public:
    ~AA() {}
};
int main() {
    std::cout << sizeof(A) << ", " << sizeof(AA) << std::endl;
    // 结果 8, 1 （gcc 64）
}
```
&emsp;&emsp;看到如果类中有虚函数，多8个字节（gcc 64）。任何有虚函数的类，都会多一个地址的大小，存放虚函数表的位置。为了高效，这个放地址的位置在这个类的存储空间最前面。


&emsp;&emsp;每一个有虚函数的类都有一个虚函数表，这个类的所有对象都放着这个表的指针。
> 编译器自动添加到构造函数中的，所以构造函数不能使虚函数

&emsp;&emsp;程序编译时候会给每个有虚函数的类生成一个虚函数表放在.o里，程序运行后拷贝到内存里。


```cpp
class A {
  public:
    int i;
    virtual ~A();
};
A::~A() {}
```

![](https://img-blog.csdnimg.cn/20210119194436962.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20210119194442684.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

图片来源 [https://www.cnblogs.com/phpandmysql/p/10853354.html](https://www.cnblogs.com/phpandmysql/p/10853354.html)

#### 7.1.2. 虚函数类的调用

1. 取a指针指向的地址的前8个字节，如果a指向的是类A这个地址指向位置就是类A的虚函数表，如果a指向的是类B这个地址指向的位置就是类B的虚函数。  
2. 在虚函数表里找到要调用函数的地址。  
3. 调用函数。  

```cpp
class A {
  public:
    virtual ~A();
    virtual void fun() {
        std::cout << "A::fun" << std::endl;
    }
};
A::~A() {}

class B: public A {
  public:
    virtual ~B();
    virtual void fun() {
        std::cout << "B::fun" << std::endl;
    }
};
B::~B() {}

int main() {
    A *a;
    B b;
    a = new A;
    a->fun();
    a = &b;
    a->fun();
    a = new A;
    a->fun();
    return 0;
}

/* 结果
A::fun
B::fun
A::fun
*/
```

---
参考
[https://www.zhihu.com/question/425173545/answer/1520796610](https://www.zhihu.com/question/425173545/answer/1520796610)


单继承时：

&emsp;&emsp;如何知道a指向的是类A还是类B？
* 每个虚函数在虚函数表中有个索引
* 虚函数调用被编译器改成了：`(*p->vptr[x])(p)`。（其中`p`是`this`，`x`是这个虚函数在虚函数表中位置）

&emsp;&emsp;这样就可以做到在程序运行是，调用那个函数取决于`vptr[x]`具体指向哪里。

![](https://img-blog.csdnimg.cn/20210119194452323.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


![](https://img-blog.csdnimg.cn/20210119194458625.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


图片来源 [https://www.cnblogs.com/phpandmysql/p/10853354.html](https://www.cnblogs.com/phpandmysql/p/10853354.html)


&emsp;&emsp;可以看到有继承关系的所有虚函数的x都是一样的。


---
多继承时：