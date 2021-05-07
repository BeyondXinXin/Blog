# VTK 多线程框架 vtkMultiThreader




## vtk 如何实现多线程

有很多线程库的轮子，比如std::thread。对于多线程这块，vtk只提供两个方案 pthreads（POSIX Threads）和 win32api。默认使用pthreads，如果找到本机带win32的话，则先使用win32api。相关选项：

* VTK_USE_WIN32_THREADS
* VTK_USE_PTHREADS

> 原因没找到，可能觉得c++11不是那里都有吧 [c11-stdthreads-vs-posix-threads](https://stackoverflow.com/questions/13134186/c11-stdthreads-vs-posix-threads)

关于使用那个，vtk在编译时候自动判断，如果非要改的话：

* vtk8： CMake/vtkThreads.cmake
* vtk9：Common/Core/CMakeLists.cmake

vtk 线程相关的几个类：

* vtkSimpleMutexLock：用来根据编译选项使用不同轮子实现锁。（不继承自vtkObject）
* vtkMutexLock：继承vtkObject封装了一下vtkSimpleMutexLock
* vtkMultiThreader：创建线程、多线程设置










