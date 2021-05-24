# QT 字体图标

@[TOC](QT 字体图标)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813182332215.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
作为一个半路出家的小码农，今天突发发现字体图标这个好东西。
使用非常简单，像字体一样调用。而且还可以任意放大不失真。

## 字体图标库下载
这里有网上找到的几个免费字体图标库
fontawesome-webfont.ttf
下载地址：http://fontawesome.dashgame.com/
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813175940178.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

pe-icon-set-weather.ttf 
下载地址：https://www.pixeden.com/icon-fonts/the-icons-font-set-weather

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813180026486.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

## 自定义字体图标库
阿里图标库网址：http://www.iconfont.cn
把自己想要的字体图标添加至购物车，下载之后*.ttf文件就是我们自己的图标库了‘



## QT使用字体图标库
新建qt widget  application应用，一路默认即可。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813180251595.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
添加qrc文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813180311425.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
添加前缀![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813180333975.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

添加ttf文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813180440156.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

添加以下代码到mainwindow

```javascript	
QFont iconFont;
    //判断图形字体是否存在,不存在则加入
    QFontDatabase fontDb;
    if (!fontDb.families().contains("FontAwesome")) {
        int fontId = fontDb.addApplicationFont(":/image/fontawesome-webfont.ttf");
        QStringList fontName = fontDb.applicationFontFamilies(fontId);
        if (fontName.count() == 0) {
            qDebug() << "load fontawesome-webfont.ttf error";
        }
    }
    if (fontDb.families().contains("FontAwesome")) {
        iconFont = QFont("FontAwesome");
        iconFont.setHintingPreference(QFont::PreferNoHinting);
    }
    iconFont.setPixelSize(100);

    QStringList list;
    for (int i = 0; i < 10 ; i++) {
        QChar str = QChar(0xf000 + i);
        QString tip = QString("0xf%1").arg(i, 3, 16, QChar('0'));
        QLabel *lab = new QLabel;
        lab->setAlignment(Qt::AlignCenter);
        lab->setFont(iconFont);
        lab->setText(str);
        lab->setToolTip(tip);
        lab->setMinimumSize(30, 30);


        QPalette blue_pe,red_pe;
        blue_pe.setColor(QPalette::WindowText,Qt::blue);
        red_pe.setColor(QPalette::WindowText,Qt::red);

        if (i%4==0)
            lab->setPalette(blue_pe);
        else if (i%4==1)
            lab->setPalette(red_pe);
        else if (i%4==2)
            lab->setStyleSheet("color:yellow;");


        ui->horizontalLayout->addWidget(lab);

    }

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190813182434706.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


