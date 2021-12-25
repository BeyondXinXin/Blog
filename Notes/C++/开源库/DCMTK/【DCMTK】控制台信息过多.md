&emsp;&emsp;

---

# DCMTK 调用时控制台信息过多

&emsp;&emsp;`dcmtk`集成了很多功能，虽然是个库，同时本身也提供了很多可执行程序（bulid/bin下）。
&emsp;&emsp;`dcmtk`提供的现成程序都支持本地日志生成（使用的`log4cplus`），在作为库调用时也有大量调试信息输出，集成进自己软件后不需要那么多默认的调试信息，修改办法。


```cpp
    /** set up the logging and enable it
     *  @param level the verbosity that you want
     */
    static void configure(OFLogger::LogLevel level = OFLogger::WARN_LOG_LEVEL);
```

&emsp;&emsp;如果不设置的话默认是`LogLevel::INFO_LOG_LEVEL`，各种烦。

|   LogLevel::    |       这些是可以提供给isEnabledFor（）的日志级别       |
| --------------- | ------------------------------------------------- |
| TRACE_LOG_LEVEL | trace：输出更多关于内部应用程序状态的细节，一种“详细调试” |
| DEBUG_LOG_LEVEL | 调试：对调试应用程序最有用的细粒度信息事件               |
| INFO_LOG_LEVEL  | 信息：在粗粒度级别突出显示应用程序进度的信息性消息        |
| WARN_LOG_LEVEL  | 警告：潜在的有害情况                                 |
| ERROR_LOG_LEVEL | 错误：可能仍允许应用程序继续运行的事件                  |
| FATAL_LOG_LEVEL | 致命：可能导致应用程序中止的非常严重的错误事件            |
| OFF_LOG_LEVEL   | 内部：完全关闭日志记录                                |





实际使用：

```cpp
    emit Signal_ImageLoadBegin();
    OFLog::configure(OFLogger::WARN_LOG_LEVEL);// 关闭IFNO
    foreach (const QString &p, unloaded_files) {
        QApplication::processEvents();
        Slot_ImagePathReady(p);
    }
    OFLog::configure(OFLogger::INFO_LOG_LEVEL);// 打开INFO
    emit Signal_ImageLoadFinished();
```