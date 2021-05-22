&ensp;&ensp;平时有用到itk（全是模板类和模板函数），使用起来又长又晦涩。一般都是给类取个别名。


---

# c++ 给类取别名
&ensp;&ensp;c++ 11 给类取别名的方式有两个`using`和`typedef`。


```cpp
template <typename T>
void Test(T a) {
    typedef typename T::list Self;
    using Self1 = typename T::list;
    Self b;
    Self1 c;
    std::cout << a << b << std::endl;
}

```

## using
&ensp;&ensp;c++中`using`关键字有两个作用：
- 声明命名空间
```cpp
     using namespace std;
```
- 给类型区别名
```cpp
     using 别名 = 原先类型；
```

## typedef

&ensp;&ensp;跟`using`用法一样，在C++11中，鼓励用`using`，而不用`typedef`。原因：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210114193513568.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210114193517100.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



&ensp;&ensp;`using`的写法把别名和名称强制分离，中间用 = 号等起来，非常清晰。
