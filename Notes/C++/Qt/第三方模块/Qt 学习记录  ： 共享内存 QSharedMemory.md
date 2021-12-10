# Qt 学习记录  ： 共享内存 QSharedMemory

&emsp;&emsp;最近遇到一个bug，程序在windos下和linux下效果不同。找了下是因为OS本身设计就不一样。
- Windos的共享内存在所有引用的进程的关闭时（包括闪退）自动清空。
- Linux的共享内存在所有引用的进程的关闭时（不包括闪退）自动清空。

[原文：https://doc.qt.io/qt-5.15/qsharedmemory.html#details](https://doc.qt.io/qt-5.15/qsharedmemory.html#details)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210106174959410.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_7)
&emsp;&emsp;既然遇到了问题，直接记录下**QSharedMemory**的使用方法，方便自己查找。
&emsp;&emsp;看Documentation以及自己测试后的理解，如果错误请指正。


---

@[TOC](Qt 学习记录  ： 共享内存 QSharedMemory)

&emsp;&emsp;
&emsp;&emsp;
&emsp;&emsp;
## 介绍
&emsp;&emsp;共享内存指：多个进程/线程访问同一段内存或文件。
&emsp;&emsp;共享的内存需要明确两点：内存的位置、内存的大小。
&emsp;&emsp;**QSharedMemory**针对多线程/进程间实现共享内存的访问。针对单线程/进程提供锁定内存以实现独占的办法。

位置：
1. **QSharedMemory**帮我们封装了共享内存的相关方法。**nativeKey**和**Key**去标识这段内存，两个都是唯一标识。
2. **QSharedMemory**为每一段需要共享的内存设置一个唯一名称：**nativeKey**（默认情况下使用**QSharedMemory**的Key加密得到，我们只需要设置**QSharedMemory**的**key**即可）。
3. **QSharedMemory**提供了对应的锁：**lock**与**unlock**，但是如果**nativeKey**是自定义的而非由**Key**加密得到。则需要自己负责实现对这块内存的保护，**lock**与**unlock**将无效。
4. 如果两个进程都是由**Qt**编写的，直接用**key**即可。如果另一个进程是其他框架写的则需要自定义**nativeKey**以及相关保护。

大小：
1. **QSharedMemory**使用前需要先创建。创建时必须制定这块内存的大小以及使用方式。
2. 大小是**int**类型，表示缓存区里数据的大小（常常跟**QBuffer**一起使用）
3. 使用方式有两种 **ReadWrite**（默认） **ReadOnly**


## 常用函数

- 初始化
```cpp
// key和nativeKey默认为空
QSharedMemory(QObject *parent = nullptr);
QSharedMemory(const QString &key, QObject *parent = nullptr);
```

- 设置/获取 标识符
```cpp
// 构造时或者使用setKey确定了key后会自动生成nativeKey
// 如果使用setNativeKey，不用自动生成的，QSharedMemorykey的key和lock将会直接无效
void setKey(const QString &key);
QString key() const;
void setNativeKey(const QString &key);
QString nativeKey() const;
```

- 附加/分离  读取数据需要 attach，写数据不需要 attach
```cpp
detach后shared指向null，只要nativeKey存在可以接着create
bool attach(AccessMode mode = ReadWrite);
bool isAttached() const;
bool detach();
```

- 设置/获取 内存数据
```cpp
int size() const;
void *data();
const void* constData() const;
const void *data() const;
```

- 加锁解锁
```cpp
bool lock();
bool unlock();
```

- attach/detach 详细错误原因
```cpp
SharedMemoryError error() const;
QString errorString() const;
```

## 使用

1. 设置**Key**

```cpp
// 只要设置了Key后，会自动生成nativeKey，让后通知系统
QSharedMemory* shared = new QSharedMemory(”name“, this);
QSharedMemory* shared = new QSharedMemory;
shared->setKey("name");
```


2. 向内存中添加数据

```cpp
// 清除内存中数据
if (shared->isAttached()) {
    shared->detach();
    // detach后shared指向null，只要nativeKey存在可以接着create
}
// 创建内存
int size = 100;
if (shared->create(size)) {
    return true;
}
// 加锁写入数据
shared.lock();
char *to = (char *)shared.data();
const char *from = buffer.data().data();
memcpy(to, from, qMin(shared.size(), size));
shared.unlock();
```

3. 从内存中读取数据

```cpp
// 读取数据需要 attach，写数据不需要 attach
if (!shared.attach()) {
    return;
}
// 加锁读取数据
shared.lock();
buffer.setData((char *)shared.constData(), shared.size());
shared.unlock();
shared.detach();
```


4. 拓展
**QSharedMemory** 使用的时候基本都是：搭配**QSystemSemaphore**防止并发，共享量小的话用**char**，大一点的用**QBuffer**



## 完整案例

官方案例，把图片换成**QBuffer**通过**QSharedMemory**共享
[https://doc.qt.io/qt-5.15/qtcore-ipc-sharedmemory-example.html](https://doc.qt.io/qt-5.15/qtcore-ipc-sharedmemory-example.html)


