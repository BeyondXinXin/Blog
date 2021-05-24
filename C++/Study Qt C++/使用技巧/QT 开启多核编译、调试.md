# QT 开启多核编译、调试

同样程序，同事比我跑起来快多了。原来大家开了多核编译，我试了试，快的飞起，比原来爽多了。

首先要知道自己cpu是几核的，我的是i7   8700  6核12线程，也就是说我最多搞成12核编译，我试了下，那样我电脑打开个pdf都卡的要命，反复实验，qt开8核最适合我。具体设置方法如下

**如果默认kit就是多核，那样所有qt程序都采用多核的话**
菜单---工具----选项
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817124827929.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817124837146.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817124844110.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

这里输入-j8就可以了。

**单独某一个程序多核**
**qmake的话**
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019081712541124.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817125422599.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

这两种都可以的

**cmake的话**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817125513494.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190817125524347.png)

都可以