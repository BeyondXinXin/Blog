

<p align="center">
    <img src="https://img-blog.csdnimg.cn/20200723202619960.png" alt="Logo"/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen.svg">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS%20%7C%20iOS%20%7C%20Android%20%7C%20MCU-brightgreen.svg">
  <img src="https://img.shields.io/badge/architecture-Qt%20%7C%20Gooogle%20c++-blue.svg">
  <img src="https://img.shields.io/badge/license-BSD%202%20Clause-blue.svg">
</p>




# 1 什么是 QuickEvent?
- ✂️ 仅600行C++代码
- 🔣 支持多语言,采用 UTF-8 编码
- ⚡ 使用**QuickEvent**设计复杂功能可以让开发者，更加专注与自己模块或功能点的开发
- 💉 利用**QT**的元对象属性，实现控制类的自动实例化
- 🔨 高内聚，低耦合，不仅让协同开发变得简单，也让重构变的非常轻松；
- 🐋 生产级别代码clone即用，提供参考Demo
- ⚙️️ 跨平台
  | platform | Support | 
  | --- | --- | 
  | Windos VS-2017 | &emsp;√ | 
  | Linux Gcc6 | &emsp;√ | 
  | Mac Gcc6 | &emsp;√ | 


# 2 为何使用 QuickEvent?
  | 1 | 界面与控制逻辑完全分离 | 
  | --- | --- | 
  | **2** | **事件管理** | 
  | **3** | **线程管理** | 
  | **4** | **控制类装填** | 


# 3 如何使用 QuickEvent?

- QuickEvent使用: 在你的**Cmake**工程中添加**QuickEvent**库
- QuickEvent开发: 您可以获得源码，并在任何平台（Windows/Linux/Mac）上开发它

## 1. &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;QuickEvent开发    
1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request



## 2. &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; QuickEvent使用    

## 3. 3.1 发布和订阅

#### 3.1.1. 3.1.1.关联QuickEvent

&emsp;&emsp;引入**QUICK_EVENT**宏让你的自己定义的类具有**发布和订阅**事件的能力；  
&emsp;&emsp;**QuickWork、QuickScript**默认已经引入QUICK_EVENT。  
```cpp
// 使用QUICK_EVENT宏
class Dialog : public QDialog {
    Q_OBJECT
    QUICK_EVENT(QDialog)
  public:
    explicit Dialog(QWidget *parent = nullptr);
    ...
};

// 继承自QuickWork
class UserWork : public QuickWork {
    Q_OBJECT
  public:
    Q_INVOKABLE explicit UserWork(QObject *parent = nullptr);
    ...
};
```
* 注:**QObject**及其子类才能通过**QUICK_EVENT**宏引入发布订阅；

#### 3.1.2. 3.1.2.订阅消息
&emsp;&emsp;**QuickApplication**提供了**subscibeEvent**方法用来订阅一个消息。 
&emsp;&emsp;**QUICK_SUBSCIBE**宏可以实现便捷订阅。 
```cpp
// 订阅show_time消息
Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog) {
    ui->setupUi(this);
    QuickApplication::subscibeEvent(this, "show_time");
    ...
}

// QUICK_SUBSCIBE便捷订阅事件
SessionManager::SessionManager(QuickWork *parent) :
    QuickWork(parent) {
    QUICK_SUBSCIBE("Manager_LoginType")
    QUICK_SUBSCIBE("Widget_SessionType")
    this->Initial();
}
```
&emsp;&emsp;**QUICK_SUBSCIBE**定义：
```cpp
#define QUICK_SUBSCIBE_OBJ(obj,name)\
    QuickApplication::subscibeEvent(obj, name);
#define QUICK_SUBSCIBE(name)\
    QuickApplication::subscibeEvent(this, name);
#define QUICK_SUBSCIBE_H(name,lev)\
    QuickApplication::subscibeEvent(this, name,lev);
#define QUICK_SUBSCIBE_L(name,lev)\
    QuickApplication::subscibeEvent(this, name,100+lev);
```



#### 3.1.3. 3.1.3.发布消息
&emsp;&emsp;**QuickApplication**提供了**publishEvent**方法用来发布一个消息。
&emsp;&emsp;**QUICK_PUBLISH1**宏可以实现便捷发布事件。

```cpp
// 发布show_time消息
TestWork::TestWork(QObject *parent) : QuickWork(parent) {
    QTimer::singleShot(2000, this, []() {
        auto time = QDateTime::currentDateTime();
        QuickApplication::publishEvent("show_time", Qt::AutoConnection, time);
    });
}

// QUICK_PUBLISH便捷发布消息
void RightControlManager::Slot_WidgetRightControlType(const qint32 &type) {
    switch (type) {
        case RightControlWidget::Remodel: {
                QUICK_PUBLISH1("Manager_RightControlType", qint32(RightControlWidget::Remodel))
                break;
            }
        default:
            break;
    }
}
```

&emsp;&emsp;**publishEvent**定义：

```cpp
template<class ...Args>
static void publishEvent(QByteArray eventName, Qt::ConnectionType type, Args &&... args) {
    ...
}
```

&emsp;&emsp;**QUICK_PUBLISH**定义：

- 自&emsp;动&emsp;模式发布 &emsp;**QUICK_PUBLISHX**，X表示发布参数数量
- 同步触发模式发布 &emsp;**QUICK_Direct_PUBLISHX**，X表示发布参数数量
- 异步触发模式发布 &emsp;**QUICK_Queued_PUBLISHX**，X表示发布参数数量
- 异步等待模式发布 &emsp;**QUICK_BlockingQueued_PUBLISHX**，X表示发布参数数量

```cpp
#define QUICK_PUBLISH1(name,arg1)\
    QuickApplication::publishEvent(name,Qt::AutoConnection, arg1);
#define QUICK_PUBLISH2(name,arg1,arg2)\
    QuickApplication::publishEvent(name,Qt::AutoConnection, arg1,arg2);
#define QUICK_PUBLISH3(name,arg1,arg2,arg3)\
    QuickApplication::publishEvent(name,Qt::AutoConnection, arg1,arg2,arg3);
#define QUICK_PUBLISH4(name,arg1,arg2,arg3,arg4)\
    QuickApplication::publishEvent(name,Qt::AutoConnection, arg1,arg2,arg3,arg4);

#define QUICK_Direct_PUBLISH1(name,arg1)\
    QuickApplication::publishEvent(name,Qt::DirectConnection, arg1);
#define QUICK_Direct_PUBLISH2(name,arg1,arg2)\
    QuickApplication::publishEvent(name,Qt::DirectConnection, arg1,arg2);
#define QUICK_Direct_PUBLISH3(name,arg1,arg2,arg3)\
    QuickApplication::publishEvent(name,Qt::DirectConnection, arg1,arg2,arg3);

#define QUICK_Queued_PUBLISH1(name,arg1)\
    QuickApplication::publishEvent(name,Qt::QueuedConnection, arg1);
#define QUICK_Queued_PUBLISH2(name,arg1,arg2)\
    QuickApplication::publishEvent(name,Qt::QueuedConnection, arg1,arg2);
#define QUICK_Queued_PUBLISH3(name,arg1,arg2,arg3)\
    QuickApplication::publishEvent(name,Qt::QueuedConnection, arg1,arg2,arg3);

#define QUICK_BlockingQueued_PUBLISH1(name,arg1)\
    QuickApplication::publishEvent(name,Qt::BlockingQueuedConnection, arg1);
#define QUICK_BlockingQueued_PUBLISH2(name,arg1,arg2)\
    QuickApplication::publishEvent(name,Qt::BlockingQueuedConnection, arg1,arg2);
#define QUICK_BlockingQueued_PUBLISH3(name,arg1,arg2,arg3)\
    QuickApplication::publishEvent(name,Qt::BlockingQueuedConnection, arg1,arg2,arg3);
```

* 注:使用Qt::AutoConnection，发布消息时，跨线程处于采用异步触发。   

#### 3.1.4. 3.1.4.接受并处理消息
&emsp;&emsp;引入发布和订阅功能的类通过实现event_ + 消息名称的槽函数即可接受并处理publishEvent推送消息

```cpp
private slots:
    void event_show_time(const QDateTime &time);
...
void Dialog::event_show_time(const QDateTime &time) {
    box->setText(time.toString());
    box->show();
}
```
* 注:需要函数参数列表匹配一致


#### 3.1.5. 3.1.5.取消订阅
&emsp;&emsp;**QuickApplication**提供了**UnsubscribeEvent**方法用来取消订阅消息。
&emsp;&emsp;**QUICK_DESTRUCT**宏可以实现便捷取消订阅。

&emsp;&emsp;**UnsubscribeEvent**定义：
```cpp
bool QuickApplication::UnsubscribeEvent(QObject *listener, QByteArray eventName) {
    QWriteLocker loker(&s_lock);
    bool result = false;
    if(s_quick_event_pool.contains(eventName)) {
        QMap<qint32, QObject *> tmplist = s_quick_event_pool[eventName];
        tmplist.remove(tmplist.key(listener));
        s_quick_event_pool.insert(eventName, tmplist);
        result = true;
    }
    if(s_quick_event_pool_high.contains(eventName)) {
        QMap<qint32, QObject *> tmplist = s_quick_event_pool[eventName];
        tmplist.remove(tmplist.key(listener));
        s_quick_event_pool.insert(eventName, tmplist);
        result = true;
    }
    if(s_quick_event_pool_low.contains(eventName)) {
        QMap<qint32, QObject *> tmplist = s_quick_event_pool[eventName];
        tmplist.remove(tmplist.key(listener));
        s_quick_event_pool.insert(eventName, tmplist);
        result = true;
    }
    return result;
}

bool QuickApplication::UnsubscribeEvent(QObject *listener) {
    QWriteLocker loker(&s_lock);
    foreach (auto var, s_quick_event_pool.keys()) {
        s_quick_event_pool[var].remove(s_quick_event_pool[var].key(listener));
    }
    foreach (auto var, s_quick_event_pool_low.keys()) {
        s_quick_event_pool[var].remove(s_quick_event_pool[var].key(listener));
    }
    foreach (auto var, s_quick_event_pool_high.keys()) {
        s_quick_event_pool[var].remove(s_quick_event_pool[var].key(listener));
    }
    return true;
}
```

&emsp;&emsp;**QUICK_DESTRUCT**定义：

```cpp
#define QUICK_DESTRUCT \
    QuickApplication::UnsubscribeEvent(this);\
```

#### 3.1.6. 3.1.6.订阅优先级

&emsp;&emsp;默认情况下跟Qt的信号槽一样，根据订阅顺序依次接受并处理消息。**QuickEvent**把订阅者分为三类，高级别、默认、低级别。当发布消息后，所有订阅者按照高级订阅、默认订阅、低级订阅的顺序依次执行。其中高级订阅和低级订阅分别有自己的顺序，默认订阅则无序。

```cpp
  static QMap < QByteArray, QMap<qint32, QObject *> > s_quick_event_pool_high;
  static QMap < QByteArray, QMap<qint32, QObject *> > s_quick_event_pool;
  static QMap < QByteArray, QMap<qint32, QObject *> > s_quick_event_pool_low;
```
#### 3.1.7. 3.1.7.发布订阅类型
&emsp;&emsp;**QuickEvent**发布订阅支持四种模式。  
&emsp;&emsp;请注意，使用**QuickEvent**时往往不清楚对方详细代码，使用阻塞发布请务必小心，防止死锁！
```cpp
  ConnectionType::AutoConnection,
  // 自动模式发布,
  // 订阅者者和发布者在同一个线程使用同步调用。
  // 订阅者和发布者不在一个线程采用异步调用。
  // 调用时按照顺序执行 QuickApplication::methodIndex调用
  ConnectionType::DirectConnection,  同步触发模式发布
  // 把本线程所有订阅者打包到一个列队依次顺序执行
  ConnectionType::QueuedConnection,  异步触发模式发布
  // 把每个线程单独打包成列队，每个线程内依次执行   QApplication::postEvent
  ConnectionType::BlockingQueuedConnection,  异步等待模式发布
  // 把所有线程所有订阅者按照订阅顺序打包，依次调用
  // QuickApplication::methodIndex调用
```



## 4. 3.2 控制类装填

&emsp;&emsp;Quick Event代码模型提供两个控制类： **QuickWork、QuickScript**

#### 4.1.1. 3.2.1 QuickScript及其子类：
&emsp;&emsp;继承自QThread的脚本基类，使用方式 

&emsp;&emsp;**初始化：**
1. 实例化
2. 指定渲染窗口ui（如果有）
3. 绑定QThread::finished()

&emsp;&emsp;**执行执行：**
1. 开启渲染窗口交互
2. 交互完成传入脚本计算数据、参数
3. 执行计算脚本
4. 开启渲染窗口交互
5. 关闭渲染窗口交互

&emsp;&emsp;**结束：**
1. deleteLater();  


&emsp;&emsp;**注意：**
1. 整个类仅Execute()位于新线程内，其余（渲染窗口交互）所有均位于父线程。
2. 提供 Wait、Wake接口，可以在计算脚本中穿插交互
3. 提供SignalProgressIn信号用来打印脚本计算进度



#### 4.1.2. 3.2.2 QuickWork及其子类：
&emsp;&emsp;允许被反射，通过**QUICK_AUT**宏和**QuickController**，可以实现控制类的自动实例化。
&emsp;&emsp;**QuickController**类用来实现反射，其内部统一自动实例化**QuickWork**及其子类。**QuickWork**的线程归属可以通过 **move_type**来决定被反射后移动大到线程的位置。
```cpp
MainThread = 0, //反射在主线程中且不移动，start函数不能为死循环否者QT事件循环也将被卡死；
WorkThread,     //反射在工作线程中，区别与主线程；
NewThread       //反射在新的线程中，会被每个反射出对象创建一个新的线程；
```
&emsp;&emsp;**QUICK_AUTO**宏作用
1. 向QT元对象系统注册自己类型
2. 在mian方法之前将自己类名注册到需要反射类列表中，QuickController对象创建后会反射出所有已注册的类，并做线程归属处理

&emsp;&emsp;**QUICK_AUTO**定义：

```cpp
#define QUICK_AUTO(ClassName)\
    Q_DECLARE_METATYPE(ClassName *) \
    static int ClassId##ClassName = qRegisterMetaType<ClassName *>();\
    static void *ThisPtr##ClassName = QuickController::NewInstance(#ClassName);

#define QUICK_AUTO_H(ClassName,value)\
    Q_DECLARE_METATYPE(ClassName *) \
    static int ClassId##ClassName = qRegisterMetaType<ClassName *>();\
    static void *ThisPtr##ClassName = QuickController::NewInstance(\
                                      #ClassName,QuickController::High,value);

#define QUICK_AUTO_L(ClassName,value)\
    Q_DECLARE_METATYPE(ClassName *) \
    static int ClassId##ClassName = qRegisterMetaType<ClassName *>();\
    static void *ThisPtr##ClassName = QuickController::NewInstance(\
                                      #ClassName,QuickController::Low,value);

```

&emsp;&emsp;**QuickController**反射**QuickWork**及其子类顺序类似订阅顺序，分为三个级别。高优先级、默认、低优先级。先反射高优先级类、默认优先级类、低优先级类。其中默认优先级里的类无序，高优先级、低优先级里类有序。

> &emsp;&emsp;原理：C/C++无法在main之前执行复杂的操作，通过在.h文件中定义static变量且通过函数方式赋值，可以main之前执行一段代码，利用static在类外修饰变量表示该变量仅对于文件内部可见的原理，不会产生编译错误；[当然对C++11支持良好编译器可以使用constexpr]但是这个操作可能被执行多次，所以反射类列表使用了Set容器防止重复插入；


* 注:1. 继承自**QuickWork**后可以覆盖**QuickWork::start**函数，**start**函数一定会在被移动到的线程中调用；
* 注:2. 高优先级、低优先级如果插入重复顺序会打印重复信息，让后只反射其中一个；
```cpp
----------------- QuickController OrderLow cover:----------------- 
cover key: 25 
cover name: "TestWork" "UserWork" 
----------------------------------
```

## 3.3 QuickEvent 初始化

&emsp;&emsp;只使用**QuickEvent**的发布订阅功能无需初始化。**QuickEvent**的控制类反射与生存周期管理**QuickController**需要在main函数中初始化。
&emsp;&emsp; **QUICK_INSTALL()** 宏和 **QUICK_INSTALL_DETAILED()** 宏均可实现初始化，**QUICK_INSTALL_DETAILED()** 增加了打印 **QuickEvent** 更详细的相关信息，比如版本信息、详细发布订阅列队等，方便调试使用。

```cpp
#include "dialog.h"
#include <QuickEvent>
#include <QFile>
int main(int argc, char **argv) {
    QApplication a(argc, argv);
    QUICK_INSTALL()// QUICK_INSTALL  QUICK_INSTALL_DETAILED
    QUICK_SETSTYLE("../../Examples/resource/Style/gray_style.qss")
    Dialog dialog;
    dialog.show();
    return a.exec();
}
```
## 5. 3.4 QuickEvent 所有宏介绍

**QuickEvent**宏     | 说明
-|-
**QUICK_AUTO(ClassName)**  | 向QT元对象系统注册自己类型、实例化本身（默认优先级）
**QUICK_AUTO_H(ClassName,value)**  | 向QT元对象系统注册自己类型、实例化本身（高优先级）
**QUICK_AUTO_L(ClassName,value)**  | 向QT元对象系统注册自己类型、实例化本身（低优先级）
**QUICK_EVENT(PARENTANME)**  | 使类本身支持发布订阅功能
-|-
**QUICK_DESTRUCT**  | 取消自身的所有订阅
-|-
**QUICK_SUBSCIBE_OBJ(obj,name)**  | 便捷订阅，订阅者、订阅名称（订阅者可以是自己内部变量）
**QUICK_SUBSCIBE(name)**  | 向自身便捷订阅
**QUICK_SUBSCIBE_H(name,lev)**  | 向自身便捷高级订阅，lev表示高级订阅中的排序，重复则顶掉之前
**QUICK_SUBSCIBE_L(name,lev)**  | 向自身便捷低级订阅，lev表示低级订阅中的排序，重复则顶掉之前
-|-
**QUICK_PUBLISH1(name,arg1)**  | 默认模式发布，1个参数
**QUICK_PUBLISH2(name,arg1,arg2)**  | 默认模式发布，2个参数
**QUICK_PUBLISH3(name,arg1,arg2,arg3)**  | 默认模式发布，3个参数
**QUICK_PUBLISH4(name,arg1,arg2,arg3,arg4)**  | 默认模式发布，4个参数
**QUICK_Direct_PUBLISH1(name,arg1)**  | 同步模式发布，1个参数
**QUICK_Direct_PUBLISH2(name,arg1,arg2)**  | 同步模式发布，2个参数
**QUICK_Direct_PUBLISH3(name,arg1,arg2,arg3)**  | 同步模式发布，3个参数
**QUICK_Queued_PUBLISH1(name,arg1)**  | 异步模式发布，1个参数
**QUICK_Queued_PUBLISH2(name,arg1,arg2)**  | 异步模式发布，2个参数
**QUICK_Queued_PUBLISH3(name,arg1,arg2,arg3)**  | 异步模式发布，3个参数
**QUICK_BlockingQueued_PUBLISH1(name,arg1)**  | 异步等待模式发布，1个参数
**QUICK_BlockingQueued_PUBLISH2(name,arg1,arg2)**  | 异步等待模式发布，2个参数
**QUICK_BlockingQueued_PUBLISH3(name,arg1,arg2,arg3)**  | 异步等待模式发布，3个参数
-|-
**QUICK_GETSET(name,type)**  | 变量快速读写接口
**QUICK_INITIAL_VAR(name,type)**  | 变量快速定义、读写接口
**QUICK_GETSET_Object(name,type)**  | 指针快速读写接口
-|-
**QUICK_INSTALL()**  | QuickController初始化
**QUICK_INSTALL_DETAILED()**  | QuickController初始化，打印详细信息
**QUICK_SETSTYLE(name)**  | 样式表初始化










# 4 版本更新说明

### 1.1. 更新2.0.0版本

1. 通过引入变参模板使得事件响应函数(event_ + 消息名称)的定义更加自由;  
2. 发布订阅支持了:    
&emsp;&emsp;同步触发[DirectConnection]；  
&emsp;&emsp;异步触发[QueuedConnection]；  
&emsp;&emsp;异步触发等待[BlockingQueuedConnection]；  

##### 1.1.1.1. 存在问题：

- 1.事件发布后如何确定调用触发函数匹配仍然不够完美;  

&emsp;&emsp;问题在于QT元对象系统对于方法参数类型的摘要(QMetaMethod::parameterTypes)和C++的typeid()差距过大。目前只匹配外部类型，对于模板无法处理，所以不建议重载参数个数相同的事件响应函数。比如：

```cpp
void event_show_time(const QDateTime &time, QList<int> list);
void event_show_time(const QDateTime &time, QList<QString> list);
```
##### 1.1.1.2. 注意
1. 跨线程的事件发布传递参数需要使用QT已知的类型
2. 同使用QT的**QMetaObject::QMetaCallEvent**一样**QuickEvent**在处理跨线程异步触发时也会在堆中创建变量的副本；
3. 消息订阅者可能是多个，使用**QSharedPointer::QVariant**共享这块内存；所以传入参数会被转换成**QVariant**类型。
4. 未知类型在编译时就会报错;
5. 对于同步触发和异步触发等待，则支持任意类型参数；
---
### 1.2. 更新2.0.2版本

1. QuickEvent使用cmake来组织工程了，添加编译动态库版本，参考CMakeLists.txt；
```cpp
#true编译生成动态库; false编译生成静态库；
set(quickevent_BUILD_SHARED_LIBS false)
#ON编译示例 OFF不编译示例
set(quickevent_BUILD_EXAMPLES ON)
```
2. 解决继承动自导出类后反射崩溃问题，以下摘自QT源码:qmetatype.h；
```cpp
 static int qt_metatype_id()
    {
        static QBasicAtomicInt metatype_id = Q_BASIC_ATOMIC_INITIALIZER(0);
        if (const int id = metatype_id.loadAcquire())
            return id;
		//继承自dll导出类的对象T模板类型无法识别，需要Q_DECLARE_METATYPE前置声明
        const char * const cName = T::staticMetaObject.className();
		...
    }
```
---
### 1.3. 更新3.0.0版本
1. 文件结构重新整理，便于快速整合到现有工程；
2. 增加若干宏，使调用**QuickEvnet**发布订阅时代码更加整洁；
3. 取消QuickApplication构造析构函数，剔除对原有Qt框架的侵入性
4. 增加QuickEventConfig.h.in文件控制版本
5. 增加QuickScript
6. 优化QuickController初始化
7. QuickWork内部变量增加setter/getter
8. 整理了下cmkae的example调用逻辑，方便后期增加案例
---
### 1.4. 更新3.0.1版本
1. 增加若干案例
2. 修复反射NewThread实例时，析构失败错误
3. 优化详细打印
4. 增加QuickController 增加排序注册

---


### 1.5. 3.X.X 版本计划
1. 增加多个案例，展示**QuickEvnet**所有接口使用方式
2. 修复3.0.0更新后引入的bug




# 5 Examples介绍
### 1.1. Example1：完整功能展示

### 1.2. Example2：自动实例化 QuickApplication、QuickWork 排序反射展示
```cpp
----------------- QuickController Initialization:----------------- 
Lib Name: "QuickEvent" 
Lib VER: "3.0.1" 
Controlle QuickWorks: ("High0", "High1", "High2", "Disorder2", "Disorder1", "Disorder0", "Low0", "Low1", "Low2") 
----------------------------------

"High0  Initialization complete"
"High1  Initialization complete"
"High2  Initialization complete"
"Disorder2  Initialization complete"
"Disorder1  Initialization complete"
"Disorder0  Initialization complete"
"Low0  Initialization complete"
"Low1  Initialization complete"
"Low2  Initialization complete"
"High0  End of deconstruction"
"High1  End of deconstruction"
"High2  End of deconstruction"
"Disorder2  End of deconstruction"
"Disorder1  End of deconstruction"
"Disorder0  End of deconstruction"
"Low0  End of deconstruction"
"Low1  End of deconstruction"
"Low2  End of deconstruction"
```
* 注:1. Disorder反射乱序的,设计到有先后顺序需要注意



### 1.3. Example3：自动实例化 QuickApplication、QuickWork 线程归属展示
```cpp
----------------- QuickController Initialization:----------------- 
Lib Name: "QuickEvent" 
Lib VER: "3.0.1" 
Controlle QuickWorks: ("Disorder3", "Disorder2", "Disorder0", "Disorder1") 
----------------------------------

Disorder3 Initialization QThread(0x1b9428d5fa0, name = "Main Thread")
Disorder2 Initialization QThread(0x1b9428d5fa0, name = "Main Thread")
Disorder0 Initialization QThread(0x1b9428d5fa0, name = "Main Thread")
Disorder1 Initialization QThread(0x1b9428d5fa0, name = "Main Thread")
Disorder0 Run QThread(0x1b9428d5fa0, name = "Main Thread")
Disorder2 Run QThread(0x1b9428f94c0)
Disorder3 Run msleep Begin QThread(0x1b9428f9400, name = "Work Thread")
Disorder3 Run msleep End QThread(0x1b9428f9400, name = "Work Thread")
Disorder1 Run msleep Begin QThread(0x1b9428f9400, name = "Work Thread")
Disorder1 Run msleep End QThread(0x1b9428f9400, name = "Work Thread")
-------------quit-------------
"Disorder2  End of deconstruction"
"Disorder3  End of deconstruction"
"Disorder1  End of deconstruction"
"Disorder0  End of deconstruction"
```
* 注:1. WorkThread下线程类似MainThread，阻塞依次执行



### 1.4. Example4：发布订阅  跨线程发布订阅
WorkThread的start耗时操作会阻塞所有WorkThread中订阅事件
```cpp
----------------- QuickController Initialization:----------------- 
Lib Name: "QuickEvent" 
Lib VER: "3.0.1" 
Controlle QuickWorks: ("MainThreadSubscibe", "MainThreadPublish", "NewThreadPublish", "WorkThreadPublish", "NewThreadSubscibe", "WorkThreadSubscibe") 
----------------------------------

-------------Main Thread Publish-------------

----------------- publishEvent:----------------- 
Event name:  "Example4" 
Event ConnectionType: Qt::AutoConnection 
Event Args: Qt::AutoConnection 
Event Thread: QThread(0x20815dc6640, name = "Main Thread") 
----------------------------------

MainThreadSubscibe QThread(0x20815dc6640, name = "Main Thread")
NewThreadSubscibe QThread(0x20815df18b0)

-------------Work Thread Publish-------------

----------------- publishEvent:----------------- 
Event name:  "Example4" 
Event ConnectionType: Qt::AutoConnection 
Event Args: Qt::AutoConnection 
Event Thread: QThread(0x20815de8820, name = "Work Thread") 
----------------------------------

WorkThreadSubscibe QThread(0x20815de8820, name = "Work Thread")
MainThreadSubscibe QThread(0x20815dc6640, name = "Main Thread")
NewThreadSubscibe QThread(0x20815df18b0)
WorkThreadSubscibe QThread(0x20815de8820, name = "Work Thread")

-------------New Thread Publish-------------

----------------- publishEvent:----------------- 
Event name:  "Example4" 
Event ConnectionType: Qt::AutoConnection 
Event Args: Qt::AutoConnection 
Event Thread: QThread(0x20815de86c0) 
----------------------------------

MainThreadSubscibe QThread(0x20815dc6640, name = "Main Thread")
NewThreadSubscibe QThread(0x20815df18b0)
WorkThreadSubscibe QThread(0x20815de8820, name = "Work Thread")
-------------Quit-------------
```
* 注:1. WorkThread的start耗时操作会阻塞所有WorkThread中订阅事件

### 1.5. Example5：发布订阅  多种发布展示（同步、异步、异步等待、自动）
```cpp
----------------- QuickController Initialization:----------------- 
Lib Name: "QuickEvent" 
Lib VER: "3.0.1" 
Controlle QuickWorks: ("NewThreadSubscibe1", "NewThreadSubscibe2") 
----------------------------------


----------------- subscibeEvent:----------------- 
listener: NewThreadSubscibe1(0x23c34998610) 
Event name: "Example5" 
subscibe level Disorder 
Event Thread "Main Thread" 
----------------------------------


----------------- subscibeEvent:----------------- 
listener: NewThreadSubscibe2(0x23c34998950) 
Event name: "Example5" 
subscibe level Disorder 
Event Thread "Main Thread" 
----------------------------------


-------------Direct PUBLISH-------------

----------------- publishEvent:----------------- 
Event name:  "Example5" 
Event ConnectionType: Qt::DirectConnection 
Event Args: Qt::DirectConnection 
Event Thread: QThread(0x23c34976690, name = "Main Thread") 
----------------------------------

New1 Subscibe bugin QThread(0x23c34998570)
New2 Subscibe bugin QThread(0x23c349988d0)
New2 Subscibe end QThread(0x23c349988d0)
New1 Subscibe end QThread(0x23c34998570)

-------------Queued PUBLISH-------------

----------------- publishEvent:----------------- 
Event name:  "Example5" 
Event ConnectionType: Qt::QueuedConnection 
Event Args: Qt::QueuedConnection 
Event Thread: QThread(0x23c34976690, name = "Main Thread") 
----------------------------------

New1 Subscibe bugin QThread(0x23c34998570)
New2 Subscibe bugin QThread(0x23c349988d0)
New2 Subscibe end QThread(0x23c349988d0)
New1 Subscibe end QThread(0x23c34998570)

-------------Blocking Queued PUBLISH-------------

----------------- publishEvent:----------------- 
Event name:  "Example5" 
Event ConnectionType: Qt::BlockingQueuedConnection 
Event Args: Qt::BlockingQueuedConnection 
Event Thread: QThread(0x23c34976690, name = "Main Thread") 
----------------------------------

New1 Subscibe bugin QThread(0x23c34998570)
New1 Subscibe end QThread(0x23c34998570)
New2 Subscibe bugin QThread(0x23c349988d0)
New2 Subscibe end QThread(0x23c349988d0)

-------------Auto PUBLISH1-------------

----------------- publishEvent:----------------- 
Event name:  "Example5" 
Event ConnectionType: Qt::AutoConnection 
Event Args: Qt::AutoConnection 
Event Thread: QThread(0x23c34976690, name = "Main Thread") 
----------------------------------

New1 Subscibe bugin QThread(0x23c34998570)
New2 Subscibe bugin QThread(0x23c349988d0)
New2 Subscibe end QThread(0x23c349988d0)
New1 Subscibe end QThread(0x23c34998570)
-------------Quit-------------
"NewThreadSubscibe1  End of deconstruction"
"NewThreadSubscibe2  End of deconstruction"
```
* 注:1. 小心死锁，尤其跨线程阻塞同步、带QDialog等有返回值的窗口请勿使用阻塞发布


### 1.6. 。。。。持续增加中

# 6 QuickEvnet代码模型使用心得
&emsp;
&emsp;
&emsp;
&emsp;

# 7 关于作者

&emsp;**Bruce**  
 Gitee
 https://gitee.com/fmldd   
个人博客    
https://me.csdn.net/dadabruce   

&emsp;**Beyond欣**  
Gitee      
https://gitee.com/yaoxin001  
个人博客    
http://118.25.63.144    

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;


------

本文仓库  [https://gitee.com/fmldd/Quick-Event](https://gitee.com/fmldd/Quick-Event)


