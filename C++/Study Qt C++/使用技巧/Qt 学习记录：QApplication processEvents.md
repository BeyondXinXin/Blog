# Qt 学习记录：QApplication processEvents

摘自[https://gitee.com/feiyangqingyun/qtkaifajingyan](%E6%91%98%E8%87%AA%20%20https://gitee.com/feiyangqingyun/qtkaifajingyan)

&emsp;&emsp;主线程打开过多文件的时候为了防止界面卡死，可以使用**QApplication::processEvents**。


```cpp
foreach (const QString &p, unloaded_files) {
    QApplication::processEvents();
    Slot_ImagePathReady(p);
}
```


