&emsp;&emsp;这个问题面试被问烂了，关于这个介绍很多了。看十遍不如自己写一遍

[原文链接](https://www.runoob.com/cplusplus/cpp-tutorial.html)

---


# C++ const 关键字作用

* 面向过程
1. 修饰局部/全局变量  
&emsp;&emsp;修饰的值只能使用，无法修改。修饰时必须初始化；
2. 修饰指针  
&emsp;&emsp;`const`在`*`左边（左定值）：修饰指针指向内容，内容不能变指针可以变。
&emsp;&emsp;`const`在`*`右边（右定向）：修饰指针本身，指针不能变内容可以变。
&emsp;&emsp;`const`在`*`两边：修饰指针和内容，指针内容都不能变。
3. 修饰函数参数  
&emsp;&emsp;传递变量：传入值无法修改
&emsp;&emsp;传递引用：引用方式传递参数且传入值不能改
&emsp;&emsp;传递指针：左定值有定向
4. 修饰函数返回值  
&emsp;&emsp;内置类型：`const`无效。
&emsp;&emsp;自定义类型：返回值只能使用无法修改。

---

* 面向对象
1. 修饰类的成员函数  
&emsp;&emsp;`const` 修饰的成员函数内不能修改类的成员变量。除非变量用`mutable`修饰。

---


```cpp
#include <iostream>
using namespace std;

int main() {
    // const 修饰变量
    {
        const int a = 7; // 必须初始化给值
    }
    // const 修饰指针变量
    {
        int tmp;
        // const 在 * 左边 修饰内容。内容不能变，指针可以变
        const int *a;
        int const *b;
        // const 在 * 右边 修饰指针。内容可以变，指针不可以
        int *const c = &tmp; // 必须初始化给值
        // const 在 * 两恻 修饰指针和内容。内容不能变、指针不能变
        const int *const d = &tmp;// 必须初始化给值
    }
    // cosnt 修饰函数参数
    {
        // 常引用，a的值不能改变（效率高）
        std::function <void (int)> Fun = [](const int &a) {
            std::cout << a << std::endl;
        };
        // 左定值：指针可以变，值不能变
        std::function <void (int *)> Fun1 = []( const int *a) {
            a = nullptr;
            // *a = 0; //错误
        };
        // 右定向：指针不能变，值可以
        std::function <void (int *)> Fun2 = []( int *const a) {
            // a = 0;//错误
            *a = 0;
        };
    }
    return 0;
}

// const 修饰函数返回值
// 返回内置类型，const 无效
const int Test() {// 会有警告
    return 1;
}

// 返回自定义类型，返回值无法修改和赋值
template<typename T>
const T Test() {
    T t;
    return t;
}

// const 修饰类的成员函数
class T {
  public:
    // 没有 const 即使什么都不做，编译器也会认为修改成员变量
    void NoChange() {
    }
    void Change() {
        a++;
        b++;
    }
    // 加上const 则强制无法修改成员变量，除非有mutable修饰
    void MutableChange() const {
        // a++;  // 编译报错，无法修改变量a
        b++;
    }
  private:
    int a;
    mutable int b;
};
```


