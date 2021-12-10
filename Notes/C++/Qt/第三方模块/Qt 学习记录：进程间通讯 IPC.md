# Qt 学习记录：进程间通讯 IPC

---

&emsp;&emsp;进程间通信（IPC-Interprocess communication），目的是为了协调不同的进程。
&emsp;&emsp;每个IPC方法均有自己的优点和局限性，一般一个程序只使用一种IPC方法。

IPC目的：
- 跨进程传输数据（A打开数据传给B、C）
- 跨进程共享数据（A改了数据，B、C可以立刻知道）
- 跨进程通信（进程监听）
- 进程控制（可以在进程外暂停进程）


Qt下 IPC方法：
- TCP/IP。Qt Network封装好了直接调用即可
- [QSharedMemory。共享内存](https://beondxin.blog.csdn.net/article/details/112287242)
- QDBUS。跨进程的信号槽，目前还没用过
- QProcess。Qt程序作为父进程，打开其他子进程，类似system
- QDesktopServices。Qt程序作为父进程，打开系统桌面服务比如图片浏览器
- Session Management。目前还没用过