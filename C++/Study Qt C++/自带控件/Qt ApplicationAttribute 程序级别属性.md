
&emsp;&emsp; **Qt** 不是开发语言，没有所谓的谁厉害。对于**Qt**本身来说老鸟跟新手区别只是谁遇到的问题更多。当然衡量**Qter**的水平主要还是看c++的水平。



---

# Qt ApplicationAttribute/WidgetAttribute 程序级别属性


&emsp;&emsp;今天测试时候换了一批新的电脑。linux/mac都正常，就win下显示有些问题。检查后发现，新装的win系统总是默认缩放150%，高清屏显示也是自带200%缩放。这个缩放会造成显示的一些问题。

```cpp
    QApplication::setAttribute(Qt::AA_EnableHighDpiScaling);
```

&emsp;&emsp;同样150%缩放模式时：使用和不使用的区别。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210226220426611.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210226220430325.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



&emsp;&emsp;**Qt**已经封装好了很多的**Attribute**。分别针对本窗口（**WidgetAttribute**）和全局窗口（**ApplicationAttribute**），比如上边提到的支持高清屏。各种**Attribute**各项属性是如何实现的，除非特别感兴趣，否则估计很少去深入研究。还是实战一点知道有这么个东西，可以查找比较靠谱。

&emsp;&emsp;官网说明再这里 [https://doc.qt.io/qt-6/qt.html#details](https://doc.qt.io/qt-6/qt.html#details)。

## enum Qt::ApplicationAttribute   指定**应用程序**范围功能的行为的属性。


&emsp;&emsp;相关函数有两个`setAttribute`用来设置属性，`testAttribute`用来读取是否设置。
```cpp
// class QCoreApplication
static void setAttribute(Qt::ApplicationAttribute attribute, bool on = true);
static bool testAttribute(Qt::ApplicationAttribute attribute);
```

&emsp;&emsp;属性（qt-6的doc）：
> 不同版本 **Attribute** 会有新增和弃用。有空简单试一遍当前版本**Attribute**的作用，再遇到类似问题知道解决办法。qt6文档里去掉了很多**Attribute**比如**AA_EnableHighDpiScaling**。是因为直接支持了吗？打算6.2出来后再去研究Qt6。

* Qt::AA_DontShowIconsInMenus = 2
&emsp;&emsp;下拉菜单是否显示最左侧的图标，默认显示，开启后则不显示。

* Qt::AA_DontShowShortcutsInContextMenus = 28
&emsp;&emsp;下拉菜单是否显快捷键提示，默认显示，开启后则不显示。

* Qt::AA_NativeWindows = 3
&emsp;&emsp;所有控件均视为window，所有widget对角点均变成屏幕左上角和现在看到的右下角（会有大量不可见的空白），严重影像刷新效率。而且原来的自定义窗口，拖拽等等均因为起点的改变全部失效。
&emsp;&emsp;[https://blog.csdn.net/u011352234/article/details/53838452](https://blog.csdn.net/u011352234/article/details/53838452)

* Qt::AA_DontCreateNativeWidgetSiblings = 4
&emsp;&emsp;这个要跟**Qt::WA_NativeWindow（Qt::WidgetAttribute）**配合起来使用，测试到**Qt::WA_NativeWindow**时再详细说明。大致就是给一个Widget设置了**Qt::WA_NativeWindow**后**Widget**的同级（它**parent**的其他**children**）保持原状。

* Qt::AA_PluginApplication = AA_MacPluginApplication = 5
&emsp;&emsp;指示Qt用于编写插件。关闭一些无用的属性，只对Mac有效。实际关闭那些没去看具体怎么实现的。

* Qt::AA_DontUseNativeMenuBar = 6
&emsp;&emsp;指定菜单栏是否应在支持它的平台上用作本机菜单栏（mac和linux）。win设置此属性无效。设置之后顶部菜单栏将使用系统自带的。
&emsp;&emsp;[https://blog.csdn.net/hitzsf/article/details/113617050](https://blog.csdn.net/hitzsf/article/details/113617050)

* Qt::AA_MacDontSwapCtrlAndMeta = 7
&emsp;&emsp;Mac的设置没有去测试 。
&emsp;&emsp;[https://www.kancloud.cn/apachecn/pyqt4-doc-zh/1947160](https://www.kancloud.cn/apachecn/pyqt4-doc-zh/1947160) ： 在Mac OS X在默认情况下， Qt的交换控制和Meta （命令）键（即，当控制被按下时， Qt的发送梅塔，每当元被按下控制被发送） 。当此属性为True， Qt会不会做翻转。 QKeySequence.StandardShortcuts也将相应地翻动（即，QKeySequence.Copy将命令+ C在键盘上，无论设置的值，虽然什么是输出QKeySequence.toString （QKeySequence.PortableText）会有所不同） 。


* Qt::AA_Use96Dpi = 8
&emsp;&emsp;假设屏幕的分辨率为96 DPI，而不是使用操作系统提供的分辨率。不管那个屏幕，字体实际渲染出来的大小一致。实测开启这个后窗口内的文字大小不随系统缩放改变而改变。

* Qt::AA_SynthesizeTouchForUnhandledMouseEvents = 11
&emsp;&emsp;应用程序不接受的所有鼠标事件将转换为触摸事件。没有做过触摸屏，也没办法测试。
&emsp;&emsp;[https://blog.csdn.net/nicai_xiaoqinxi/article/details/102673560](https://blog.csdn.net/nicai_xiaoqinxi/article/details/102673560)
* Qt::AA_SynthesizeMouseForUnhandledTouchEvents = 12
&emsp;&emsp;应用程序不接受的所有触摸事件将转换为鼠标左键事件。默认情况下，此属性处于启用状态。没有做过触摸屏，也没办法测试。
&emsp;&emsp;[https://blog.csdn.net/nicai_xiaoqinxi/article/details/102673560](https://blog.csdn.net/nicai_xiaoqinxi/article/details/102673560)

* Qt::AA_ForceRasterWidgets = 14
&emsp;&emsp;使顶级小部件使用纯光栅曲面，并且不支持非本机基于GL的子小部件。测试了下开启后如果程序用到 glwidget会显示一片空白，如果没用到则正常。

* Qt::AA_UseDesktopOpenGL = 15
&emsp;&emsp;强制使用桌面OpenGL。
* Qt::AA_UseOpenGLES = 16
&emsp;&emsp;在使用动态加载OpenGL实现的平台上强制使用OpenGL ES 2.0或更高版本。
* Qt::AA_UseSoftwareOpenGL = 17
&emsp;&emsp;强制在使用动态加载OpenGL实现的平台上使用基于软件的OpenGL实现。
* Qt::AA_ShareOpenGLContexts = 18
&emsp;&emsp;这允许在属于不同顶级窗口的QOpenGLWidget实例之间共享OpenGL资源。默认开启

&emsp;&emsp;性能排名  **DesktopOpenGL** > **OpenGLES** > **Soft**。默认情况下使用**DesktopOpenGL**。
&emsp;&emsp;**OpenGLES**和**Soft**一般只有在虚拟机上用（渲染效率慢，也会增加开销）。这个也解决了我之前遇到的一个bug，就是vtk写的程序，在虚拟机上测试各种黑屏。因为虚拟机没有**DesktopOpenGL**，只有**SoftOpenGL**。需要改了后才能再虚拟机上测试（打包前记得取消）。

&emsp;&emsp;[https://www.cnblogs.com/slcode/p/e745b120173372ffb74582d6de78f0d2.html](https://www.cnblogs.com/slcode/p/e745b120173372ffb74582d6de78f0d2.html)

* Qt::AA_SetPalette = 19
```cpp
qDebug() << QGuiApplication::testAttribute(Qt::AA_SetPalette);
```
&emsp;&emsp;判断有没有设置过`Palette`，默认是false，`qApp->palette()`会返回系统主题。
&emsp;&emsp;如果设置过`qApp->setPalette(const QPalette &);`则 `testAttribute(Qt::AA_SetPalette)`会返回真，`qApp->palette()`会返回设置的主题。


* Qt::AA_UseStyleSheetPropagationInWidgetStyles = 22
&emsp;&emsp;这个就是关于样式表的继承问题，默认情况下一个控件的样式表是使用最后一次的`setStyleSheet`，如果开启这个设置，每个控件会找父子关系最近的样式表跟`setStyleSheet`顺序无关。
[https://blog.csdn.net/weixin_30878361/article/details/101329858](https://blog.csdn.net/weixin_30878361/article/details/101329858)

* Qt::AA_DontUseNativeDialogs = 23
&emsp;&emsp;系统有内置对话框（比如打开文件），`Qt`也自己实现了所平台的系统对话框（如果不自己改的话贼丑）。默认情况下使用系统对话框，当找不到系统对话框时（比如打包时系统版本不一样、调了第三方测窗口句柄）会调内置对话框。如果设置了`AA_DontUseNativeDialogs`后，所有对话框会直接用`Qt`内置的。

* Qt::AA_SynthesizeMouseForUnhandledTabletEvents = 24
&emsp;&emsp;应用程序不接受的所有平板电脑事件将转换为鼠标事件。没有做过触摸屏，也没办法测试。

* Qt::AA_CompressHighFrequencyEvents = 25
&emsp;&emsp;只对触摸屏有效，没有用过。每次传入一批操作而不是一个操作。

* Qt::AA_CompressTabletEvents = 29
&emsp;&emsp;只对触摸屏有效，没有用过。看说明大概是**AA_CompressHighFrequencyEvents**每次发送一批操作，**AA_CompressTabletEvents**允许每次接受一批操作。

* Qt::AA_DontCheckOpenGLContextThreadAffinity = 26
&emsp;&emsp;还没用过QOpenGLContext。

* Qt::AA_DisableShaderDiskCache = 27
&emsp;&emsp;禁用磁盘上着色器程序二进制文件的缓存。默认情况下，Qt Quick、QPainter的OpenGL后端以及使用QOpenGLShaderProgram及其addCacheableShaderFromSource重载之一的任何应用程序都将在支持glProgramBinary（）的系统上的共享或每进程缓存存储位置使用基于磁盘的程序二进制缓存。
&emsp;&emsp;目前还没遇到过这种情况。
[https://ask.csdn.net/questions/1585299](https://ask.csdn.net/questions/1585299)



* Qt::AA_DisableSessionManager = 31
&emsp;&emsp;5.14新增的，没试过。禁用QSessionManager。

* Qt::AA_DisableNativeVirtualKeyboard = 9
&emsp;&emsp;5.15新增的，没试过。设置此属性后，当文本输入小部件在没有物理键盘的系统上获得焦点时，本机屏幕虚拟键盘将不会自动显示。


## enum Qt::WidgetAttribute   指定**Widget**属性。

```cpp
    void setAttribute(Qt::WidgetAttribute, bool on = true);
    inline bool testAttribute(Qt::WidgetAttribute) const;
```
&emsp;&emsp;相关函数有两个`setAttribute`用来设置属性，`testAttribute`用来读取是否设置。

> 这个有100多个，没事时候看几个，慢慢完善

* Qt::WA_AcceptDrops = 78
&emsp;&emsp;
* Qt::WA_AlwaysShowToolTips = 84
&emsp;&emsp;
* Qt::WA_CustomWhatsThis = 47
&emsp;&emsp;
* Qt::WA_DeleteOnClose = 55
&emsp;&emsp;
* Qt::WA_Disabled = 0
&emsp;&emsp;
* Qt::WA_DontShowOnScreen = 103
&emsp;&emsp;
* Qt::WA_ForceDisabled = 32
&emsp;&emsp;
* Qt::WA_ForceUpdatesDisabled = 59
&emsp;&emsp;
* Qt::WA_Hover = 74
&emsp;&emsp;
* Qt::WA_InputMethodEnabled = 14
&emsp;&emsp;
* Qt::WA_KeyboardFocusChange = 77
&emsp;&emsp;
* Qt::WA_KeyCompression = 33
&emsp;&emsp;
* Qt::WA_LayoutOnEntireRect = 48
&emsp;&emsp;
* Qt::WA_LayoutUsesWidgetRect = 92
&emsp;&emsp;
* Qt::WA_MacOpaqueSizeGrip = 85
&emsp;&emsp;
* Qt::WA_MacShowFocusRect = 88
&emsp;&emsp;
* Qt::WA_MacNormalSize = 89
&emsp;&emsp;
* Qt::WA_MacSmallSize = 90
&emsp;&emsp;
* Qt::WA_MacMiniSize = 91
&emsp;&emsp;
* Qt::WA_Mapped = 11
&emsp;&emsp;
* Qt::WA_MouseNoMask = 71
&emsp;&emsp;
* Qt::WA_MouseTracking = 2
&emsp;&emsp;
* Qt::WA_Moved = 43
&emsp;&emsp;
* Qt::WA_NoChildEventsForParent = 58
&emsp;&emsp;
* Qt::WA_NoChildEventsFromChildren = 39
&emsp;&emsp;
* Qt::WA_NoMouseReplay = 54
&emsp;&emsp;
* Qt::WA_NoMousePropagation = 73
&emsp;&emsp;
* Qt::WA_TransparentForMouseEvents = 51
&emsp;&emsp;
* Qt::WA_NoSystemBackground = 9
&emsp;&emsp;
* Qt::WA_OpaquePaintEvent = 4
&emsp;&emsp;
* Qt::WA_OutsideWSRange = 49
&emsp;&emsp;
* Qt::WA_PaintOnScreen = 8
&emsp;&emsp;
* Qt::WA_PaintUnclipped = 52
&emsp;&emsp;
* Qt::WA_PendingMoveEvent = 34
&emsp;&emsp;
* Qt::WA_PendingResizeEvent = 35
&emsp;&emsp;
* Qt::WA_QuitOnClose = 76
&emsp;&emsp;
* Qt::WA_Resized = 42
&emsp;&emsp;
* Qt::WA_RightToLeft = 56
&emsp;&emsp;
* Qt::WA_SetCursor = 38
&emsp;&emsp;
* Qt::WA_SetFont = 37
&emsp;&emsp;
* Qt::WA_SetPalette = 36
&emsp;&emsp;
* Qt::WA_SetStyle = 86
&emsp;&emsp;
* Qt::WA_ShowModal = 70
&emsp;&emsp;
* Qt::WA_StaticContents = 5
&emsp;&emsp;
* Qt::WA_StyleSheet = 97
&emsp;&emsp;
* Qt::WA_StyleSheetTarget = 131
&emsp;&emsp;
* Qt::WA_TabletTracking = 129
&emsp;&emsp;
* Qt::WA_TranslucentBackground = 120
&emsp;&emsp;
* Qt::WA_UnderMouse = 1
&emsp;&emsp;
* Qt::WA_WindowModified = 41
&emsp;&emsp;
* Qt::WA_WindowPropagation = 80
&emsp;&emsp;
* Qt::WA_MacAlwaysShowToolWindow = 96
&emsp;&emsp;
* Qt::WA_SetLocale = 87
&emsp;&emsp;
* Qt::WA_StyledBackground = 93
&emsp;&emsp;
* Qt::WA_ShowWithoutActivating = 98
&emsp;&emsp;
* Qt::WA_NativeWindow = 100
&emsp;&emsp;
* Qt::WA_DontCreateNativeAncestors = 101
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeDesktop = 104
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeDock = 105
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeToolBar = 106
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeMenu = 107
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeUtility = 108
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeSplash = 109
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeDialog = 110
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeDropDownMenu = 111
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypePopupMenu = 112
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeToolTip = 113
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeNotification = 114
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeCombo = 115
&emsp;&emsp;
* Qt::WA_X11NetWmWindowTypeDND = 116
&emsp;&emsp;
* Qt::WA_AcceptTouchEvents = 121
&emsp;&emsp;
* Qt::WA_TouchPadAcceptSingleTouchEvents = 123
&emsp;&emsp;
* Qt::WA_X11DoNotAcceptFocus = 126
&emsp;&emsp;
* Qt::WA_AlwaysStackOnTop = 128
&emsp;&emsp;
* Qt::WA_ContentsMarginsRespectsSafeArea = 130
&emsp;&emsp;