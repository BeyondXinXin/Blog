# Deepin 使用教程：qt程序打包  linuxdeployqt 封装 AppImage

我这里举例，用自己维护的一个小型的开软软件openBrowser ，如何实现其在linux下打包发布。
源码地址  [https://gitee.com/yaoxin001/openBrowser](https://gitee.com/yaoxin001/openBrowser)
ssh  git@gitee.com:yaoxin001/openBrowser.git

---
*注意：此方法仅向上兼容，
**deepin15 打包后   deepin15可运行   ubuntu18可运行   ubuntu16不可运行**
**ubuntu18 打包后   deepin15可运行   ubuntu18可运行   ubuntu16不可运行**
**ubuntu16 打包后   deepin15可运行   ubuntu18可运行   ubuntu16可运行***

---

@[TOC](qt程序打包)

---
# 1.相关知识科普
*自己体会和了解，不见得准确，如有发现错误请指正，如果只需要看步骤，请跳过这一节。*

qt win下打包很方便，直接用 Engima Virtual Box 把dll等文件和exe压缩到一起就可以了。
qt linux下打包，对于我这种半路出家的一直很恶心，我这里提供一种打包的方式。

## 1.1 linux安装包

linux安装包类型有很多很多种（rmvb dep rpm pkg tar gzip AppImage 源码包），每种有自己的安装方式。
大致上安装方式：直接双击 或者 直接解压看INSTALL.txt或者README。

deb包可以用deepin/ubuntu安装器安装，手动拖就行了；
flatpak可以直接下载下来用，deepin直接支持的；
snapd要在终端先安装下运行环境；
appimage下载下来加个可执行权限就能用了。
至于安装方式，真多，
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120153521393.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
当然还有pip conda等等
## 1.2 AppImage文件

这里着重介绍一下AppImage这个安装包，它有这几个好处：
1. 不需要安装，纯绿色方式
2. 几乎所有的发行版都支持使用
3. 不需要超级用户权限，给予其运行权限双击即可运行程序
4. 支持控制台使用
5. 用AppImage文件比安装一个应用程序更加简单
这应该是最适合我这种个人（小型）桌面/控制台程序的发布方式。
我理解AppImage文件只是个压缩文件，在它运行时候挂载，所有文件都在自己内部。

## 1.3 .desktop文件

这其实就是linux的桌面快捷方式文件

> [Desktop Entry] 
> Name=openBrowser 
> Comment=开源文件浏览器 
> Exec=DSA
> Icon=openBrowser 
> Terminal=false Type=Application 
> Categories=Science;
> Name[en_US]=openBrowser 
> X-AppImage-Version=

```cpp
语法解释：
关键词                         意义
[Desktop Entry]               文件头
Encoding                      编码
Name                          应用名称
Name[xx]                      不同语言的应用名称
GenericName                   描述
Comment                       注释
Exec                          执行的命令
Icon                          图标路径
Terminal                      是否使用终端
Type                          启动器类型
Categories                    应用的类型（内容相关）
说明： 
其中 Exec 常用的参数有：%f %F %u %U 
%f：单个文件名，即使选择了多个文件。如果已选择的文件不在本地文件系统中（比如说在HTTP或者FTP上），这个文件将被作为一个临时文件复制到本地，％f将指向本地临时文件； 
%F：文件列表。用于程序可以同时打开多个本地文件。每个文件以分割段的方式传递给执行程序。 
%u：单个URL。本地文件以文件URL或文件路径的方式传递。 
%U：URL列表。每个URL以分割段的方式传递给执行程序。本地文件以文件URL或文件路径的方式传递。
```

## 1.4 linuxdeployqt

> Makes Linux applications self-contained by copying in the libraries and plugins that the application uses, and optionally generates an AppImage. Can be used for Qt and other applications

通过在应用程序使用的库和插件中进行复制，使Linux应用程序自包含，并且可以选择生成AppImage。
可用于Qt和其他应用程序。傻瓜理解的话，这玩意就是一个文件压缩插件，你当成bandizip好了。

**git主页**
[https://github.com/probonopd/linuxdeployqt](https://github.com/probonopd/linuxdeployqt)

这个Linux部署工具linuxdeployqt将应用程序作为输入，并通过将应用程序使用的资源（如库、图形和插件）复制到一个包中使其独立。生成的包可以作为AppDir或AppImage分发给用户，也可以放入跨分发包中。它可以作为构建过程的一部分，用于部署用C、C++和其他编译语言编写的应用程序，这些系统与CMake、QPug和Sub等系统一样。在基于Qt的应用程序上使用时，它可以绑定运行应用程序所需的Qt的特定最小子集。

**安装**
编译源码，除非你有特殊需求（32位程序）
[https://github.com/probonopd/linuxdeployqt/blob/master/BUILDING.md](https://github.com/probonopd/linuxdeployqt/blob/master/BUILDING.md)

> sudo apt-get -y install git g++ libgl1-mesa-dev
git clone https://github.com/probonopd/linuxdeployqt.git
#Then build in Qt Creator, or use
export PATH=$(readlink -f /tmp/.mount_QtCreator-*-x86_64/*/gcc_64/bin/):$PATH
cd linuxdeployqt
qmake
make
sudo make install


如果只想为x86_64平台捆绑应用程序，
一般直接用编译好的就可以[https://github.com/probonopd/linuxdeployqt/releases](https://github.com/probonopd/linuxdeployqt/releases)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120134609469.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
就14m，如果慢的话，我的个人镜像    
链接: [https://pan.baidu.com/s/1lO4WY6-C0mCwrXjMFwig7Q](https://pan.baidu.com/s/1lO4WY6-C0mCwrXjMFwig7Q)  密码: urtr

下载完可以添加命令行执行命令，**我没添加**，直接把他丢到源码目录就可以，后续写脚本就行。

如果有需要添加系统环境的话

> chmod 777 linuxdeployqt-x86_64.AppImage
mv linuxdeployqt-x86_64.AppImage linuxdeployqt
mv linuxdeployqt /usr/local/bin
测试
linuxdelpoyqt --version


详细使用操作如下，乍一看握草，怎么跟qt契合这么完美，翻译什么的有，奥，这玩意就是用qt开发的，也只是为了给qt打包用的，当然qt打包所有选项，他都有了。

>    -always-overwrite        : 即使目标文件存在，也要复制文件。
   -appimage                : 创建AppImage（意味着-bundle non-qt libs）
   -bundle-non-qt-libs      : 同时捆绑非核心、非Qt库。
   -exclude-libs=<list>     : 应排除的库列表，用逗号分隔。
   -ignore-glob=<glob>      : 搜索库时要忽略的相对于appdir的Glob模式。
   -executable=<path>       : 让给定的可执行文件也使用部署的库
   -extra-plugins=<list>    : 应部署的额外插件列表，用逗号分隔。
   -no-copy-copyright-files : 跳过版权文件的部署。
   -no-plugins              : 跳过插件部署。
   -no-strip                :不要在二进制文件上运行“strip”。
   -no-translations         : 跳过翻译部署。
   -qmake=<path>            : 要使用的qmake可执行文件。
   -qmldir=<path>           :扫描给定路径中的QML导入。
   -show-exclude-libs       : 打印排除库列表。
   -verbose=<0-3>           : 0=无输出，1=错误/警告（默认），2=正常，3=调试。
   -updateinformation=<update string>        : 嵌入更新信息字符串；如果安装了zsyncmake，则生成zsync文件
   -version                 : 打印版本语句并退出。

一般就用  -appimage  这一个就够了。
当然，我们需要的文件结构

> └── usr
    ├── bin
    │   └── your_app
    ├── lib
    └── share
        ├── applications
        │   └── your_app.desktop
        └── icons
                    └── apps 
                        └── your_app.png

普通封装打包，了解这些就够了，如果很多定制化要求，请移步git主页

# 2软件打包，截图注意看路径
## 2.1准备工作
######  1）准备好打包的程序，qt creator内relese下编译且运行测试过。
生成文件的路径cmake里可以改
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019112014373852.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120143546308.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


###### 2）准备一个文件结构
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019112014193441.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
三个空文件夹就可以
your_app下一节放
your_app.desktop    your_app.png放在上一级就可以，见下一步
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019112014331379.png)

文件夹下增加两个文件，图标和.desktop文件，desktop文件怎么写看本文1.3 .desktop文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120143350334.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120144032868.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


###### 3）准备下载好的  linuxdeployqt-x86_64.AppImage文件
git
[https://github.com/probonopd/linuxdeployqt/releases](https://github.com/probonopd/linuxdeployqt/releases)
我的个人镜像    
链接: [https://pan.baidu.com/s/1lO4WY6-C0mCwrXjMFwig7Q](https://pan.baidu.com/s/1lO4WY6-C0mCwrXjMFwig7Q)  密码: urtr
只能打包64！！！，32的需要自己编译。（详细了解看本文1.4）
它名字太长了，把他重命名linuxdeployqt.AppImage
###### 4）把上边三个文件，放在一个文件夹下，比如我的
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019112014322073.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

## 2.2打包
新建文件 bulid_openBrowser.sh，上图4）那个文件
如果提示没有权限一律

> chmod 777 文件名

```bash
# bulid_openBrowser.sh  
#QT_PATH  qt路径 
#openBrowser_PATH  程序源码路径 
#PATH  系统路径 
export QT_PATH=/home/yc/Qt5.11.3/5.11.3/gcc_64         
export openBrowser_PATH=/home/yc/Documents/work
export PATH=$QT_PATH/bin:$PATH


#  判断是否有relese后生成的文件，如果有则删除之前打包好的文件
# -f filename 如果 filename为常规文件，则为真
if [ -f "$openBrowser_PATH/openBrowser/bin/openBrowser" ]
then
rm -rf "./openBrowser.AppImage"
cp "$openBrowser_PATH/openBrowser/bin/openBrowser" "$openBrowser_PATH/App_openBrowser/usr/bin/openBrowser"
else
echo "can not find openBrowser"
exit 0
fi

#  删除之前生打包生成文件
rm -rf "$openBrowser_PATH/App_openBrowser/AppRun"
rm -rf "$openBrowser_PATH/App_openBrowser/.DirIcon"
rm -rf "$openBrowser_PATH/App_openBrowser/usr/bin/qt.conf"
rm -rf "$openBrowser_PATH/App_openBrowser/usr/lib"
rm -rf "$openBrowser_PATH/App_openBrowser/usr/plugins"
rm -rf "$openBrowser_PATH/App_openBrowser/usr/share/doc"
rm -rf "$openBrowser_PATH/App_openBrowser/usr/translations"
mkdir "$openBrowser_PATH/App_openBrowser/usr/lib"

#  中文输入（fcitx），就是谷歌输入法里的之前移动到qt plugins里
cp "$QT_PATH/plugins/platforminputcontexts/libfcitxplatforminputcontextplugin.so" "$openBrowser_PATH/App_openBrowser/usr/lib/libfcitxplatforminputcontextplugin.so"

if [ -f "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so" ] 
then
mv "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so" "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so.bak"
fi

if [ -f "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so" ] 
then
mv "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so" "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so.bak"
fi

#  使用打包插件
./linuxdeployqt.AppImage "$openBrowser_PATH/App_openBrowser/usr/bin/openBrowser" -appimage

if [ -f "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so.bak" ] 
then
mv "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so.bak" "$QT_PATH/plugins/sqldrivers/libqsqlmysql.so"
fi

if [ -f "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so.bak" ] 
then
mv "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so.bak" "$QT_PATH/plugins/sqldrivers/libqsqlpsql.so"
fi
```

按照自己需要的更改路径，其实有用的就一句话

> ./linuxdeployqt.AppImage "$openBrowser_PATH/App_openBrowser/usr/bin/openBrowser" -appimage

其余加不加看个人
libfcitxplatforminputcontextplugin.so   解决qt creator无法输入中文
libqsqlpsql.so、libqsqlmysql.so这两个数据库用的，如果程序没有数据库，我的openBrowser（也没用），脚本里这两个相关的可以删了。这是我其他程序用到了，这里没删，总有时候会用到。


## 2.3测试
执行
> sudo '/home/yc/Documents/work/bulid_openBrowser.sh'

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120144802991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120144903734.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191120144925853.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
*注意：此方法仅向上兼容，
**deepin15 打包后   deepin15可运行   ubuntu18可运行   ubuntu16不可运行**
**ubuntu18 打包后   deepin15可运行   ubuntu18可运行   ubuntu16不可运行**
**ubuntu16 打包后   deepin15可运行   ubuntu18可运行   ubuntu16可运行***


