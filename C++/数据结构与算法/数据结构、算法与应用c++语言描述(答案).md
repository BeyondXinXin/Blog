# 数据结构、算法与应用c++语言描述(答案)

[https://www.cise.ufl.edu/~sahni/dsaac/view.htm](https://www.cise.ufl.edu/~sahni/dsaac/view.htm)


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/xxx.73rdv3efz500.png)

&emsp;&emsp;本身不是计算机专业的，属于那种自学半路出家的，最近刚开始看这本书，不知道为什么作者放的答案只有一半，正好重新学习下c++，慢慢做吧。下边自己写的没有答案的部分，有错误请指正。

**chapter 1&emsp;&emsp;02**

```cpp
template <typename T>
qint32 count(const QList<T> &list, const T &value) {
    qint32 sum = 0;
    foreach (auto var, list) {
        if(var == value) {
            sum++;
        }
    }
    return sum;
}
int main() {
    QList<qint32> list_int = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0};
    std::cout << "list_int Count is " << count(list_int, 0) << std::endl;
    QList<QString> list_str = {"a", "b", "c", "c", "c"};
    QString str = "c";
    std::cout << "list_str Count is " << count(list_str, str) << std::endl;
    return 0;
}
```

**chapter 1&emsp;&emsp;04**
```cpp
template <typename T>
bool inner_product(const QList<T> &list_a, const QList<T> &list_b, T &result) {
    if(list_a.size() != list_b.size()) {
        qWarning() << "list_a.size() != list_b.size()";
        return 0;
    }
    QList<T> list_result;
    T theSum = 0;
    for (qint32 i = 0; i < list_a.size() ; ++i) {
        list_result << list_a.at(i)*list_b.at(i);
    }
    result = accumulate(list_result.begin(), list_result.end(), theSum);
    return 1;
}

int main() {
    QList<qint32> list_a = {1, 2, 3}, list_b = {1, 2, 3};
    QList<double> list_c = {1.1, 2.0, 3.0}, list_d = {1.0, 2.0, 3.0};
    qint32 result_ab = 0;
    double result_cd = 0.0;
    if(inner_product(list_a, list_b, result_ab)) {
        qDebug() << "result_ab inner_product" << result_ab;
    }
    if(inner_product(list_c, list_d, result_cd)) {
        qDebug() << "result_cd inner_product" << result_cd;
    }
    return 0;
}

```
**chapter 1&emsp;&emsp;06**
```cpp
template <typename T>
bool is_sorted(const QList<T> &list, qint32 n = -1) {
    if(n < 0) {
        n = list.size();
    }
    for (qint32 i = 0; i < n - 1; i++)
        if (list[i] > list[i + 1]) {
            return 0;
        }
    return 1;
}

int main() {
    QList<qint32> list_int = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0};
    qDebug() << is_sorted(list_int);
    qDebug() << is_sorted(list_int, 10);
    list_int[3] = 0;
    qDebug() << is_sorted(list_int, 10);
    return 0;
}

```
**chapter 1&emsp;&emsp;08**
&emsp;&emsp;具有相同的签名，但是这玩意根本就编译不过啊。两个函数仅仅只有函数返回值不同，那么系统是无法区分这两个函数的，此时编译器会提示语法错误。

**chapter 1&emsp;&emsp;10**
&emsp;&emsp;这个就是判断让后修改下跑出异常就可以。

**chapter 1&emsp;&emsp;12**
```cpp
template <class T>
bool make2dArray(T ** &x, int numberOfRows, int rowSize[]) {
    try {
        x = new T * [numberOfRows];
        for (int i = 0; i < numberOfRows; i++) {
            x[i] = new int [rowSize[i]];
        }
        return true;
    } catch (std::bad_alloc) {
        return false;
    }
}

int main() {
    int **a;
    int rowSize[2];
    rowSize[0] = 2;
    rowSize[1] = 3;
    make2dArray(a, 2, rowSize);
    a[0][0] = 1;
    a[0][1] = 2;
    a[1][0] = 3;
    a[1][1] = 4;
    a[1][2] = 5;
    cout << a[0][0] << ' ' << a[0][1] << endl;
    cout << a[0][0] << ' ' << a[1][1] << ' ' << a[1][2] << endl;
    return 0;
}

```
