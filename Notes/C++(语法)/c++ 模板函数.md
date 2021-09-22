&emsp;&emsp;平时有用到itk（全是模板类和模板函数），真实使用情况就是每次copy下官方案例的代码。由于c++这块当时是自学的，模板函数`tempplate`、`typename`、`typedef`、`using`只是大概知道是个什么意思，每次看到基本就是忽略了。这次刨根问底一下吧

---


## c++ 模板编程

> 目的：能够实现非常灵活的类型安全的接口和极好的性能。同时简化代码，减少重复代码。常见的工具`std::function`，`GTest`都是借助模板实现的。

> 弊端：复杂的地方大量使用模板让人看的崩溃。


> 结论：如果你使用模板编程，你必须考虑尽可能的把复杂度最小化，并且尽量不要让模板对外暴漏。 你最好只在实现里面使用模板，然后给用户暴露的接口里面并不使用模板，这样能提高你的接口的可读性。---[https://zh-google-styleguide.readthedocs.io/](https://zh-google-styleguide.readthedocs.io/) 6.22


## c++ 模板函数



&emsp;&emsp;函数的重载使函数的调用变的简单（只需要记住一个名称就可以）。但是需要写好多声明和定义。

```cpp

int Add(const int &a, const int &b) {
    return a + b;
}
double Add(const int &a, const double &b) {
    return a + b;
}
double Add(const double &a, const int &b) {
    return a + b;
}
double Add(const double &a, const double &b) {
    return a + b;
}

int main() {
    std::cout << Add(1, 1.1) << std::endl;
}

```

&emsp;&emsp;如果重载函数仅仅是参数类型不一样（参数数量一样），使用重载函数则不利于拓展。模板函数就应用而生。


```cpp
template<typename T1, typename T2>
auto Add(const T1 &a, const T2 &b) {
    return a + b;
}

int main() {
    std::cout << Add(1, 1.1) << std::endl;
    std::cout << Add<int, double>(1, 1.1) << std::endl;
}
```
> 函数模板：只写一个函数，处理不同的数据类型。模板函数不是实际的函数，编译阶段，编译器遇到模板函数调用时，检查实际参数类型并生成对应的代码。



## 模板类
&emsp;&emsp;跟模板函数一样，也需要编写多个形式和功能都类似的类。

```cpp
template<typename T>
class TempClass: public T {
  public:
    using ClassA = typename T::a;
  private:
    ClassA a;
    inline ClassA GetA() {
        return this->a;
    }
};
```


## 模板使用 typename 和 class

&emsp;&emsp;99%情况下`template<typename T>`与`template<class T>`两者等价，一开始都用`class`。后来加了`typename`方便理解。
&emsp;&emsp;只有当`T`有子类且也需要在模板函数里使用时候`template<typename T>`。
所以建议一律都使用`typename`。












