# qt  桌面悬浮球  ToolTip  右键菜单

腾讯管家或者360桌面总会带一个很没用的悬浮球,qt做出这种效果非常简单

 1. 设置窗体无边框和无背景(Qt::FramelessWindowHint | Qt::WindowSystemMenuHint)
 2. 设置ToolTip 鼠标悬浮提示文字
 3. 设置右键菜单
	

```javascript
ShapedClock::ShapedClock(QWidget *parent)  : QWidget(parent, Qt::FramelessWindowHint | Qt::WindowSystemMenuHint) {
    QAction *quitAction = new QAction(tr("E&xit"), this);
    quitAction->setShortcut(tr("Ctrl+Q"));
    connect(quitAction, SIGNAL(triggered()), qApp, SLOT(quit()));
    addAction(quitAction);
    setContextMenuPolicy(Qt::ActionsContextMenu);
    setToolTip(tr("用鼠标左键拖动时钟。\n"
                  "使用鼠标右键打开上下文菜单。"));
}
```




![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906150454953.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906150503521.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906150856574.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906150904244.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)