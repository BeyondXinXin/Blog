&emsp;&emsp;题目很简单，但是每次看到这个问题都有别样的感觉。
&emsp;&emsp;讲真的，这个题是我19年7月刚准备转行做开发时去大华面试的一道题。那套题都是基础知识，可是我是完全小白，当时那张卷子写的真的是一言难尽，最后灰溜溜的走了。
&emsp;&emsp;那天花了俩小时从余杭跑到滨江，让后笔试做的稀里糊涂，连见面试官资格都没有。当天下午在滨江还约了另一个小公司的面试，上午做成那个样子，出来后下午没打算再去。回公司路上告诉自己再试一次吧，下午如果还是这个结果直接放弃转行吧，老老实实做机械设计吧。万幸，下午去的小公司没有笔试，面试官是搞算法的，`c++`也不咋会基本没问。我一个面试`Qt`开发的竟然问有限元分析、模型网格什么的问题，也没有特别深（本科机械也大概知道是个啥，能回答下）。然后当天竟然给了`offer`，虽然工资不高不过差不多翻了一倍（机械工资太低了）。
&emsp;&emsp;拿`offer`后，还有一个月才入职（上一份工作交接），拼命恶补知识。即时过了一年，现在水平也依然不咋地，反正能保证任务和需求按时完成就行。

---

# C++ 面试 手写回调函数


## 1. 函数指针

```cpp
using Fp = void (*)(const QString &str);

// 回调函数
void CallBack1(const QString &str) {
    qDebug() << "CallBack1" << str;
}
void CallBack2(const QString &str) {
    qDebug() << "CallBack2" << str;
}
// 调用函数
void Call(const QString &str, Fp fp) {
    fp(str);
}

int main() {
    Call("Hello", CallBack1);
    Call("word", CallBack2);
    return 0;
}
```
## 2. 结构体封装

```cpp
using Fp = std::function<void (const QString &str)>;
void CallBack1(const QString &str) {
    qDebug() << "CallBack1" << str;
}
void CallBack2(const QString &str) {
    qDebug() << "CallBack2" << str;
}
struct CallStruct {
    CallStruct (Fp call): callback(call) {}
    void SetCB(Fp call) {
        this->callback = call;
    }
    Fp callback;
};
int main() {
    {
        CallStruct struct_call(CallBack1);
        struct_call.callback("Hello");
        struct_call.SetCB(CallBack2);
        struct_call.callback("word");
    }
    return 0;
}
```

## 3. std::function

### 3.1. 普通函数
```cpp
using Fp2 = std::function <void(const QString &)>;

void CallBack1(const QString &str) {
    qDebug() << "CallBack1" << str;
}
void CallBack2(const QString &str) {
    qDebug() << "CallBack2" << str;
}

int main() {
    Fp2 fp = &CallBack1;
    fp("hello");
    fp = &CallBack2;
    fp("word");
    return 0;
}
```
### 3.2. 类成员函数

> 静态成员函数跟普通函数一样，否则用`bind`

```cpp
using Fp2 = std::function <void(const QString &)>;
class CallTest {
  public:
    CallTest () {}
  public:
    void CallBack1(const QString &str) {
        qDebug() << "CallTest::CallBack1" << str;
    }
    static void CallBack2(const QString &str) {
        qDebug() << "CallTest::CallBack2" << str;
    }
};

int main() {
    CallTest call_class;
    //
    Fp2 fp;
    fp = std::bind(&CallTest::CallBack1, &call_class, std::placeholders::_1);
    fp("hello");
    fp = &CallTest::CallBack2;
    fp("word");
    return 0;
}

```



---



# 完整的

```cpp
using Fp = std::function<void (const QString &str)>;
void CallBack1(const QString &str) {
    qDebug() << "CallBack1" << str;
}
void CallBack2(const QString &str) {
    qDebug() << "CallBack2" << str;
}
void Call(const QString &str, Fp fp) {
    fp(str);
}
struct CallStruct {
    CallStruct (Fp call): callback(call) {}
    void SetCB(Fp call) {
        this->callback = call;
    }
    Fp callback;
};

class ClassCall {
  public:
    void CallBack1(const QString &str) {
        qDebug() << "ClassCall::CallBack1" << str;
    }
    static void CallBack2(const QString &str) {
        qDebug() << "ClassCall::CallBack2" << str;
    }
};
int main() {
    {
        Call("Hello", CallBack1);
        Call("word", CallBack2);
    }
    {
        CallStruct struct_call(CallBack1);
        struct_call.callback("Hello");
        struct_call.SetCB(CallBack2);
        struct_call.callback("word");
    }
    {
        Fp fp;
        fp = &CallBack1;
        fp("Hello");
        fp = &CallBack2;
        fp("word");
    }
    {
        Fp fp;
        ClassCall class_call;
        fp = std::bind(&ClassCall::CallBack1, &class_call, std::placeholders::_1);
        fp("Hello");
        fp = &ClassCall::CallBack2;
        fp("word");
    }
    return 0;
}
```






> 话说回来，还是信号槽香










