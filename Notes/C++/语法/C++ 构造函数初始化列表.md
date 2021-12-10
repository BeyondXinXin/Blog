&emsp;&emsp;这个问题面试被问烂了，关于这个介绍很多了。看十遍不如自己写一遍

[c语言中文网：C++构造函数初始化列表](http://c.biancheng.net/view/2223.html)

---

# C++ 构造函数初始化列表


> 初始化列表并没有效率上的优势，仅为了书写方便


> 初始化列表的顺序只跟声明顺序相关，使用初始化列表时请根据声明顺序初始化！！！

```cpp
class T {
  public:
    T (): b_(10), a_(b_) {
        std::cout << a_ << "," << b_ << endl;
    }
    T (const int t ): b_(t), a_(b_) {
        std::cout << a_ << "," << b_ << endl;
    }
  private:
    int a_;
    int b_;
};

int main() {
    T t, t1(100);
    return 0;
}

/*
 结果
-858993460,10
-858993460,100
*/
```

