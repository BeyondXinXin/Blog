# Qt 命令行解析    QCommandLineParser   QCommandLineOption

写程序时经常需要命令行解析，qt提供了  QCommandLineParser和QCommandLineOption两个类帮助快速解析命令行。


```javascript
QApplication app(argc, argv);
QCommandLineParser a;//建立命令行解析
a.addHelpOption();//增加-h/-help解析命令
a.addVersionOption();    //增加-v 解析命令
a.setSingleDashWordOptionMode(QCommandLineParser::ParseAsLongOptions);
//设置解析格式：
//ParseAsLongOptions                                           -abc   相当于  -abc                              
//ParseAsCompactedShortOptions                  -abc   相当于  -a  -b   -c

QCommandLineOption mAnalysis(
	"m", "自定义命令");
//建立一个自定义命令   参数为m  即程序执行时输入-m则进入自己定义的命令        
/*QCommandLineOption(const QString &name, const QString &description, const QString &valueName = QString(), const QString &defaultValue = QString())，
name参数表示选项的名称，
description参数表示选项的描述信息，输入-h后可以看到
valueName表示选项的取值的名称，
defaultValue表示选项的默认值*/
a.addOption(mAnalysis);//命令解析增加自定义命令
a.process(app);

if (a.isSet(mAnalysis)) {
	//如果输入-m后会....
	}
```

如何输入命令提示符，调试时候在这里，发布后用  控制台输入 程序名称后面加命令
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822091845877.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822091831379.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822092040323.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822092142774.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822092203647.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190822092127219.png)
