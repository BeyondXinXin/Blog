# QT指定的字体不存在


QWindowsMultiFontEngine::loadEngine: CreateFontFromLOGFONT failed for "****": error 0x88985002 : 指示指定的字体不存在。

今天qt编程突然遇到这个问题，没有***字体。


有些图形字体在电脑上显示不了，可以选择安装字体，或者直接换用其他字体。


windos下查看已安装字体
打开Win10的字体安装文件夹，可以双击打开这台电脑-->打开C盘-->打开Windows-->打开Fonts；也可先打开计算机，在计算机地址栏上直接拷贝“C:\Windows\Fonts”路径，回车打开Win10字体文件夹。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813172935891.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

windos下安装新字体
网上下载  ***字体.tff文件，直接安装。

windos下从其他电脑拷贝字体，直接把其他电脑Fonts下字体文件复制到你的电脑打开，	可以看到演示，右上角可以直接安装
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813173125202.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)








