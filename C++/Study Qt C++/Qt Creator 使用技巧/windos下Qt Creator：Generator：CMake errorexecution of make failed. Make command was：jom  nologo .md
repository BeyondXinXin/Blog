# windos下Qt Creator  CMake error: Generator: execution of make failed. Make command was: jom /nologo all

不喜欢系统变量里一堆路径，Qt和Qt Creator的路径均没有加在系统变量里。
windos 下 Qt Creator使用CMake管理项目时，除了编译器（msvc/mingw）外还需要构建工具。
这个错误就是找不到构建工具。

### 解决办法

很多办法都可以，我用的第二种

1. 把Qt Creator的路径增加到系统变量 C:\Qt\Qt5.9.7\Tools\QtCreator\bin
2. 拷贝Qt Creator/bin下的jom.exe到现有的系统变量里
3. 安装其他构建工具（vs2017自带Ninja）



### 分析


linux 下一般用make，基本不会找不到。win下就不一定了。
安装 QtCreator 会默认带一个jom（给nmake增加多核功能），也有其他的比如vs2017以后默认用的Ninja。
报错就是这个工具在现有的系统变量里没有
切换地方：

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/image.14pgelvk9kao.png)