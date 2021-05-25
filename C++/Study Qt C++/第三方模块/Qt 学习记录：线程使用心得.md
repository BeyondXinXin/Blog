# Qt 学习记录：线程使用心得

&emsp;&emsp;c++ 创建线程有很多办法和轮子，Qt也提供几种。过一段时间不用就会淡忘，然后去找别人的分享。干脆自己记录下。
&emsp;&emsp;看Documentation以及其他人分享的教程加上自己日常使用的理解，如果错误请指正。

---


## 线程创建办法：
#### 1  继承QThread，重写run函数：类中只有run在线程中，其他所有都在主线程中可以直接操作界面。

- 好处：创建单线程使用最多。一个类可以同时实现交互+线程跑算法，可以省去很多数据传输。
- 坏处：官方不建议用。一定要注意，**ui**操作和渲染只能在主线程（不能再**run**函数里），不放在**run**的耗时操作全部是主线程完成。

&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：线程使用-继承QThread，重写run函数]()

#### 2  继承QObject，使用moveToThread：类中所有数据均在线程中。

- 好处：官方推荐的使用办法，适合用于单线程。
- 坏处：如果线程很多的话创建和删除开销很大。

&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：线程使用-继承QObject，使用moveToThread]()

#### 3  QthreadPool+QRunnable：提供了一个全局信号池（也可以局部，但是一般不用），如果需要大量线程时候可以用到，QThread创建和回收会占大量资源。

- 好处：这个方法是**Qt**线程池的低级办法，可以用来造自定义的轮子。
- 坏处：除非现有轮子不够用否则基本不用。直接用**QtConcurrent**的**run**好了。**QRunnable**不继承自**qobject**，没信号和槽。**QtConcurrent**就是用**QthreadPool**+**QRunnable**实现的。

&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：线程使用-QthreadPool+QRunnable]()


#### 4 QtConcurrent：局部信号池，贼方便。QFuture可以看进度和找错误。

- 好处：创建多线程使用最多。提供三类接口：**Map**用线程池实现批量修改原数据、**filter**用线程池实现批量过滤原数据、**run**用来把函数放到线程里（也可以直接丢到**QthreadPool**的全局线程池里）。
- 坏处：所有**std::function**输入有严格要求，如果函数已经写好需要加**std::bind**。

&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：线程使用-QtConcurrent]()






## 多线程安全办法

#### QtConcurrent多线程安全
&emsp;&emsp;输入输出有严格要求，基本不用考虑。(涉及到共享内存、文件修改等，我是不用QtConcurrent的)
#### QThread多线程安全
&emsp;&emsp;提供逐线程数据存储
&emsp;&emsp;&emsp;&emsp;QThreadStorage 
&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：QThread线程安全 QThreadStorage]()
&emsp;&emsp;实现wait、wake：
&emsp;&emsp;&emsp;&emsp;QMutex/QMutexLocker 加锁
&emsp;&emsp;&emsp;&emsp;QWaiteCondition 等待
&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：QThread线程安全 QMutex/QMutexLocker/QWaiteCondition]()
&emsp;&emsp; 文件访问：
&emsp;&emsp;&emsp;&emsp;QReadLocker/QWriteLocker 自动读写锁
&emsp;&emsp;&emsp;&emsp;QReadWriteLocker 读写锁
&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：QThread线程安全 ReadWriteLocker读写锁]()
&emsp;&emsp; 保证线程同步：
&emsp;&emsp;&emsp;&emsp;QSemphore 互斥信号量
&emsp;&emsp;&emsp;&emsp;[Qt 学习记录：QThread线程安全 QSemphore]()







