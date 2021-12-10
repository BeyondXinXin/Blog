# Study-VTK：QVTKWidget、QVTKOpenGLWidget、QVTKOpenGLNativeWidget、QVTKWidget2 区别

&emsp;&emsp;网上很多案例使用qt+vtk的时候用QVTKWidget、QVTKWidget2、QVTKOpenGLWidget、QVTKOpenGLNativeWidget，比较懵逼。


&emsp;&emsp; 更正 ：**包含QVTKOpenGLWidget的VTK的第一个版本是VTK 8.0.0！！！**

---

@[TOC](QVTKWidget、QVTKOpenGLWidget、QVTKOpenGLNativeWidget、QVTKWidget2 区别)


### 这几个widget怎么使用
每个widget都提供了不同的功能以及不同的API，但是widget的创建以及使用基本一样。
&emsp;&emsp;&emsp;&emsp;1）实例化widget
&emsp;&emsp;&emsp;&emsp;2）指定渲染窗口交互器
&emsp;&emsp;&emsp;&emsp;3）创建回调函数（qt里就直接绑定信号和槽）
&emsp;&emsp;&emsp;&emsp;4）创建模型，并与widget关联
&emsp;&emsp;&emsp;&emsp;5）激活widget
&emsp;&emsp;&emsp;&emsp;6）反激活widget

### 这几个widget的关系
&emsp;&emsp;这里梳理下他们的关系（仅是个人理解）。
类     | 使用介绍
-------- | :-----
QVTKWidget  |用来在Qt的QWidget中显示 vtkRenderWindow
QVTKWidget2  | 用来在Qt的QGLWidget中显示 vtkRenderWindow
QVTKOpenGLWidget  | 用来在Qt的QWidget中显示 vtkRenderWindow
QVTKOpenGLNativeWidget  | 用来在Qt的QOpenGLWidget中显示 vtkGenericOpenGLRenderWindow



&emsp;&emsp;QGLWidget、QOpenGLWidget类均继承自QWidget用于渲染OpenGL图形。
&emsp;&emsp;&emsp;&emsp;QVTKWidget2比QVTKWidget渲染快、效果好，使用基本一样。
&emsp;&emsp;&emsp;&emsp;QVTKOpenGLNativeWidget比QVTKOpenGLWidget渲染快、效果好，使用基本一样。
&emsp;&emsp;&emsp;&emsp;QVTKOpenGLWidget比QVTKWidget渲染快、效果好，使用基本一样。
&emsp;&emsp;&emsp;&emsp;QVTKOpenGLNativeWidget比QVTKWidget2渲染快、效果好，使用基本一样。


&emsp;&emsp;版本分割线一：Qt版本
&emsp;&emsp;&emsp;&emsp;Qt5.4以后版本官方建议使用QOpenGLWidget，但QGLWidget保留了下来。
&emsp;&emsp;&emsp;&emsp;Qt5.4以前版本请使用QGLWidget。
&emsp;&emsp;这导致vtkWidget这边应该这样使用：
&emsp;&emsp;&emsp;&emsp;Qt5.4以后版本使用QVTKOpenGLWidget/QVTKOpenGLWidget。
&emsp;&emsp;&emsp;&emsp;Qt5.4以前版本请使用QVTKWidget2/QVTKWidget。

&emsp;&emsp;版本分割线二：Vtk版本
&emsp;&emsp;&emsp;&emsp;vtk 8.1.X及以前     没有QVTKOpenGLNativeWidget
&emsp;&emsp;&emsp;&emsp;vtk 8.2.X                增加QVTKOpenGLNativeWidget


### 到底应该用那个widget
&emsp;&emsp;放弃使用QVTKWidget。
&emsp;&emsp;包含QVTKOpenGLWidget的VTK的第一个版本是VTK 8.0.0！
&emsp;&emsp;如果你是Qt5.4以前，请使用QVTKWidget2。
&emsp;&emsp;如果你是Qt5.4以后，vtk8.1X及以前  请使用QVTKOpenGLWidget。
&emsp;&emsp;如果你是Qt5.4以后，vtk8.2X  请使用QVTKOpenGLNativeWidget。

比如你有QVTKWidget的程序，直接替换成QVTKWidget2（根据版本定），以此向后类推。


### 为什么自己用时候还要保留vtk8.1X
&emsp;&emsp;为什么自己用时候还要保留vtk8.1X，因为vmtk官方说明仅支持vtk8.1X及以前，vtk8.2X不确定。虽然vtk8.2X+vmtk可以使用，但可能有隐藏bug。


### 如果找不到QVTKOpenGLWidget/QVTKOpenGLNativeWidget
&emsp;&emsp;cmake注意下
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314112923250.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
### Qt Design里拖动widget
&emsp;&emsp;官方仅提供QVTKWidget，需要手动放到qt design下的plugin里。个人建议放弃在Design里拖动吧，直接拖动QWidget继承一下吧，非要搞也是自己去封装自定义控件。

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;&emsp;**以上仅个人理解！！！有误请指正。**

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)