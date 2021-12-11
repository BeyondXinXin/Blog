# Deepin 使用教程：Qt creator 无法输入中文

**Fcitx 小企鹅输入法**

是一个以 GPL 方式发布的输入法框架， 编写它的目是为桌面环境提供一个灵活的输入方案，彻底解决在GNU/Linux下没有一个好的中文输入法的问题。基本上linux用到的输入法都是基于Fcitx搞的。Fcitx无法用，搜狗肯定也不能用。

Fcitx提供对qt 的支持，需要用到一个库**libfcitxplatforminputcontextplugin.so**。deepin下很多软件都是qt开发的，如果这些软件需要写中文则应该有fctix-qt5的lib，所以deepin装机默认带一个fctix-qt5的lib（基于5.6版本的）。

## 1 复制系统libfcitx到qt creator

Qt creator是个插件架构，他不会找你系统的lib，只会引用安装目录的plugins和.local里的插件。而这里默认是没有**libfcitxplatforminputcontextplugin.so**的，所以Qt creator是无法用Fcitx（搜狗）输入法输入。这时候可以直接把deepin系统的拷贝过来就可以

```bash
dpkg -L fcitx-frontend-qt5
```
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.6paeu46jyg80.png)

- qt目录：/home/yx/Qt5.11.3/5.11.3/gcc_64/plugins/platforminputcontexts/
- qt creator目录：/home/yx/Qt5.11.3/Tools/QtCreator/lib/Qt/plugins/platforminputcontexts/

- 复制后增加下权限

```bash
chmod +x *
```
- Qt creator插件的增删必须重启，所以重启下Qt creator。
- 放在qt creator目录里是为了qt creator可以输入中文。放在qt目录是为了qt编译后的程序可以输入中文。

如果还不可以就是因为deepin默认装的是5.6下编译的libfcitx，如果更新fcitx有可能会影像其他软件，所以最佳办法就是自己编译fctix-qt5，让后不要安装，把编译后的libfcitx复制到刚才两个路径

## 2 自行编译

源码

[https://github.com/fcitx/fcitx-qt5](https://github.com/fcitx/fcitx-qt5)

git clone https://github.com/fcitx/fcitx-qt5.git  或者  https://github.com/fcitx/fcitx-qt5/archive/master.zip

编译，如果报错的话看下cmake 的提示，少了什么，装什么。
```bash
mkdir bulid
cd bulid
cmake ..
make -j12
cd platforminputcontext/
cp libfcitxplatforminputcontextplugin.so /home/yx/Qt5.11.3/5.11.3/gcc_64/plugins/platforminputcontexts
cp libfcitxplatforminputcontextplugin.so /home/yx/Qt5.11.3/Tools/QtCreator/lib/Qt/plugins/platforminputcontexts/
```

记得重启qtcreator。


建议使用qt 5.9  5.12 这种长期维护的版本。我这里用5.11是因为升级到5.12有跟我用的其他库不太兼容。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.e9418jufim8.png)