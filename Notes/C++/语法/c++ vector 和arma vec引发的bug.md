# c++ vector 和arma vec引发的bug



## 问题描述：

&emsp;&emsp;算法组同学给的源码，自己集成进软件后简单测试了下没有问题。到生产环节被测试人员打回：软件体膜计算结果时好时坏，10次里有两三次错误，并且有四种错误结果。

---


## 问题分析
&emsp;&emsp;`BUG`特点：随机性、发生概率比较小、每次错误后结果都不一致、开发人员自己单元测试正常。
> 这种情况一般是**越界**或者**返回局部变量的引用**。

---

## 排查步骤
1. `DEBUG`模式下**越界**会直接抛出异常，**返回局部变量的引用**会有编译器警告。测试后均未出现。
2. 再试一下打断的挨个看，结果加了断点后直接不发生错误情况......
3. 手动加临时文件输出配合日志输出所有矩阵。（尺寸512 X 512 X 60，只靠日志不好排查）
4. 最终确认发生了越界。

> 插曲：计算其中一个矩阵的时候有三处越界，怪不得发现第一处后还错。

---

## 原因分析：
* `stl`的迭代器返回的是 **第一个元素** 和 **最后一个元素+1** 的地址

```cpp
// std::vector<double> bottomVec;
// double sumBottom(0.0);

sumBottom = sumBottom - 0.5 * (bottomVec.at(0) + * (bottomVec.end()));
// ==>>
sumBottom = sumBottom - 0.5 * (bottomVec.at(0) + * (bottomVec.end()-1));
```
 * `armadillo` 矩阵/向量：没有下标检查

```cpp
// arma::vec k_M;
// double CBV = 0.0;
CBV = CBV - k_M.at(0) * 0.5 - k_M.at(k_M.size()) * 0.5;
// ==>>
CBV = CBV - k_M.at(0) * 0.5 - k_M.at(k_M.size()-1) * 0.5;
```






---

## 解决方案：

 &emsp;&emsp;跟算法组同学说下，让对方以后注意。