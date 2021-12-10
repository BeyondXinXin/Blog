# QT 标签连接网页

很多软件右下角都有一个超链接连接到网站，qt实现这个非常方便。只需要qlabel settext就可以了

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190806113250971.png)

遵从html的语言格式
```javascript
    QLabel *permanent = new QLabel(this);
    permanent->setFrameStyle(QFrame::Box | QFrame::Sunken);
    permanent->setText(
        "<a href=\"https://me.csdn.net/a15005784320\">Beyond欣</a>");    
    permanent->setTextFormat(Qt::RichText);
    permanent->setOpenExternalLinks(true);
    T_StatusBa->addPermanentWidget(permanent);
```
