# Qt creator 项目结构树Header Files、Source Files

&emsp;&emsp;最近这大半年一直用的qt5.11.x。用cmkae配置的项目目录看的很舒服。接下来公司有几个项目应该从linux搬到windos去，我干脆直接换成5.12，让后发现这个项目目录突然很坑，看的贼别扭，多了Header Files和Source Files。qmake可以用pri来分文件结构，可是cmake没办法了。简化项目树的话，会把所有文件都放在一起。找了半天没有找到如何设置回来，当时一直以为是windos的原因，linux是分开的。可是看的实在不爽，让后发现原因了，这个好像根本就没法修改，是默认的，让后我装了三个版本看了下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200504230448387.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200504225929466.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;总结，如果需要隐藏Header Files、Source Files的话，再单独安装一个qtcreator 4.09吧，实在没找到哪里可以设置。直接把4.09的codedll，放到4.11他不兼容，改源码的话，估计会很麻烦。