# c++ explict关键字使用

> 应该尽量不要使用转换，尽量使用显式转换来代替隐式转换。

---

# c++ explict关键字使用

&emsp;&emsp;转换就是一个类型转换成另一个类型：
- 隐式转换，系统跟据程序的需要而自动转换
```cpp
    int a = 10, b = 10;
    double c = 10.0;
    std::cout << a + b + c << std::endl;
```
- 显式转换，强制转换，是自己主动让这个类型转换成别的类型

```cpp
    int a = 10, b = 10;
    double c = 10.0;
    std::cout << static_cast<int>(a + b + c) << std::endl;
```



**当一个类的构造函数只有一个参数时，或除了第一个参数外其余参数都有默认值时，此类支持隐式转换：**

```cpp
class Demo {
  public:
    Demo() {
        this->data1_ = -999.9;
        this->data2_ = -999.9;
    }
    Demo(double data1) {
        this->data1_ = data1;
        this->data2_ = -999.9;
    }
    Demo(double data1, double data2) {
        this->data1_ = data1;
        this->data2_ = data2;
    }
    inline double GetData1() {
        return this-> data1_;
    }
    inline double GetData2() {
        return this-> data2_;
    }
  private:
    double data1_, data2_;
};

int main() {
    Demo test1;
    test1 = 10.0;
    std::cout << test1.GetData1() << "   " << test1.GetData2() << std::endl;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210114193548119.png)


&emsp;&emsp;但是如果不希望类支持隐式转换，需要给构造函数添加`explict`关键字：
```cpp
    explicit Demo(double data1) {
        this->data1_ = data1;
        this->data2_ = -999.9;
    }
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210114193555941.png)

