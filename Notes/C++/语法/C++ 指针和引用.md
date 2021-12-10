&emsp;&emsp;最近几个周末约了去面试，很多被问烂了的基础问题竟然回答的一塌糊涂。这里记录下，希望以后别再忘了。内容摘抄自菜鸟教程，和一些个人看法。
[   菜鸟教程：C++ 教程   ](https://www.runoob.com/cplusplus/cpp-tutorial.html)
&emsp;&emsp;


---

# C++ 指针和引用

@[TOC](C++ 指针和引用)


## 1. 指针和引用的区别
&emsp;&emsp;很多情况直接替换就可以。

* 不存在空引用。 指针不用
* 引用只能连接到一块内存，无法修改。指针不用
* 引用创建后必须初始化。指针不用
* 自增自减时引用是值，指针是地址。  

> 结论：如果可以都用引用。引用来替代指针，会使 C++ 程序更容易阅读和维护。引用效率也会更高。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210117225151819.png)



## 2. 指针

> 指针是一个变量，其值为另一个变量的地址。

1. 定义一个指针变量
2. 把变量地址赋值给指针
3. 访问指针变量中可用地址的值。


## 3. 引用
> 给一个已经定义好的变量去个别名。

```cpp
int main() {
    int a = 10;
    int &b = a;
    int &c = b;
    std::cout << "a:  " << &a << "  " << a << std::endl;
    std::cout << "b:  " << &b << "  " << b << std::endl;
    c = 100;
    std::cout << "a:  " << &a << "  " << a << std::endl;
    std::cout << "b:  " << &b << "  " << b << std::endl;
    std::cout << "c:  " << &c << "  " << c << std::endl;
}
```

```
a:  0000002106D8FD80  10
b:  0000002106D8FD80  10
a:  0000002106D8FD80  100
b:  0000002106D8FD80  100
c:  0000002106D8FD80  100
```
## 4. 引用&&指针 作为参数

&emsp;&emsp;指针和引用作为参数传入函数一样，都是：隐式的返回传递值

```cpp
void Quote(int &x) {
    std::cout << "x:  " << &x << "  " << x << std::endl;
    x++;
    std::cout << "x:  " << &x << "  " << x << std::endl;
}

void Pointer(int *x) {
    std::cout << "x:  " << &x << "  " << x << "  " << *x << std::endl;
    x[0]++;
    std::cout << "x:  " << &x << "  " << x << "  " << *x << std::endl;
    x++;
    std::cout << "x:  " << &x << "  " << x << "  " << *x << std::endl;
}

void Normal(int x) {
    std::cout << "x:  " << &x << "  " << x << std::endl;
    x++;
    std::cout << "x:  " << &x << "  " << x << std::endl;
}

int main() {
    int a = 10;
    std::cout << "a:  " << &a << "  " << a << std::endl;
    std::cout << "Quote-----------" << std::endl;
    Quote(a);
    std::cout << "a:  " << &a << "  " << a << std::endl;
    std::cout << "Pointer-----------" << std::endl;
    Pointer(&a);
    std::cout << "a:  " << &a << "  " << a << std::endl;
    std::cout << "Normal-----------" << std::endl;
    Normal(a);
    std::cout << "a:  " << &a << "  " << a << std::endl;
}
```

```
a:  000000B7B8CFF8B0  10
Quote-----------
x:  000000B7B8CFF8B0  10
x:  000000B7B8CFF8B0  11
a:  000000B7B8CFF8B0  11
Pointer-----------
x:  000000B7B8CFF8B8  000000B7B8CFF8B0  11
x:  000000B7B8CFF8B8  000000B7B8CFF8B0  12
x:  000000B7B8CFF8B8  000000B7B8CFF8B4  0
a:  000000B7B8CFF8B0  12
Normal-----------
x:  000000B7B8CFF8B8  12
x:  000000B7B8CFF8B8  13
a:  000000B7B8CFF8B0  12
```

> 结论：建议使用引用，看着舒服，而且效率高一些。

&emsp;&emsp;翻译成汇编后，指针传递比参数多一个创建变量。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210117225207397.png)

```
        1_17!Quote [f:\studyc\1-17\main.cpp @ 13]:
0x7ff7534f2a60                   mov     qword ptr [rsp+8],rcx
0x7ff7534f2a65  <+    5>         push    rdi
0x7ff7534f2a66  <+    6>         mov     rax,qword ptr [rsp+10h]
0x7ff7534f2a6b  <+   11>         mov     eax,dword ptr [rax]
0x7ff7534f2a6d  <+   13>         inc     eax
0x7ff7534f2a6f  <+   15>         mov     rcx,qword ptr [rsp+10h]
0x7ff7534f2a74  <+   20>         mov     dword ptr [rcx],eax
0x7ff7534f2a76  <+   22>         pop     rdi
0x7ff7534f2a77  <+   23>         ret

        1_17!Pointer [f:\studyc\1-17\main.cpp @ 17]:
0x7ff7534f2a80  <+   32>         mov     qword ptr [rsp+8],rcx
0x7ff7534f2a85  <+   37>         push    rdi
0x7ff7534f2a86  <+   38>         mov     eax,4
0x7ff7534f2a8b  <+   43>         imul    rax,rax,0
0x7ff7534f2a8f  <+   47>         mov     rcx,qword ptr [rsp+10h]
0x7ff7534f2a94  <+   52>         mov     eax,dword ptr [rcx+rax]
0x7ff7534f2a97  <+   55>         inc     eax
0x7ff7534f2a99  <+   57>         mov     ecx,4
0x7ff7534f2a9e  <+   62>         imul    rcx,rcx,0
0x7ff7534f2aa2  <+   66>         mov     rdx,qword ptr [rsp+10h]
0x7ff7534f2aa7  <+   71>         mov     dword ptr [rdx+rcx],eax
0x7ff7534f2aaa  <+   74>         pop     rdi
```

### 4.1. 常引用
```cpp
    int a;
    const int &ra=a;
    ra=1; //错误
    a=1; //正确
```
&emsp;&emsp;常引用无法修改变量本身的值。使用引用作为参数传入效率高

> 引用型参数应该在能被定义为const的情况下，尽量定义为const。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210117225221664.png)


## 5. 把引用&&指针 作为返回值

&emsp;&emsp;通过使用引用来替代指针，会使 C++ 程序更容易阅读和维护。返回指针的话可以表示指针的数组名。

```cpp
int value[] = {0, 1, 2, 3};

int *GetPointerValue(int i) {
    return &value[i];
}

int *GetPointersValue() {
    int *r = new int[4];
    for (int i = 0; i < 4; i++) {
        r[i] = value[i];
    }
    return r;
}

int &GetQuoteValue(int i) {
    return value[i];
}

int main() {
    std::cout << value[0] << std::endl;
    *GetPointerValue(0) = -1;
    std::cout << value[0] << std::endl;
    GetQuoteValue(0) = -2;
    std::cout << value[0] << std::endl;
    int *r = GetPointersValue();
    std::cout << r[0] << " " << r[1] << " " << r[2] << std::endl;
}
```

```
0
-1
-2
-2 1 2
```


> 引用返回局部变量不合法的，下边能编译通过，而且测试运行正常，但是如果b所在内存给其他再次使用过，那程序就炸了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210117225231290.png)



## 6. 引用&&指针 实现多态
&emsp;&emsp;这俩也没啥大区别。

```cpp
class A {
};
class B: public A {
};

int main() {
    B a;
    A *aa = new B;
    A &aaa = a;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210117225238463.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/202101172252452.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



