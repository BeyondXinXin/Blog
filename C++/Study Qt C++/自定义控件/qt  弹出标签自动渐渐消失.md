# qt  弹出标签自动渐渐消失



![在这里插入图片描述](https://img-blog.csdnimg.cn/20190831163600973.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190831163557147.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
https://github.com/Greedysky/TTKWidgetTools
研究网上别人代码,看到一个可能以后会用的功能
弹出一个label   过段时间自动淡淡退出



先自定义一个label
```javascript
//  设置背景
setWindowFlags(Qt::Window | Qt::FramelessWindowHint);
setAttribute(Qt::WA_TranslucentBackground);
setAttribute(Qt::WA_QuitOnClose);
setAttribute(Qt::WA_DeleteOnClose);
//设置文字和大小
m_font.setPointSize(size);
QFontMetrics metrics = QFontMetrics(m_font);
setFixedSize(metrics.width(text) + m_margin.x(),
metrics.height() + m_margin.y());
QLabel::setText(text);
//paint
QPainter painter(this);
painter.setRenderHint(QPainter::Antialiasing);
painter.setPen(Qt::NoPen);
painter.setBrush(QColor(0, 0, 0, 175));
painter.drawRoundRect(rect(), 6, 6);

painter.setPen(QColor(255, 255, 255));
painter.drawText(rect(), Qt::AlignCenter, text());
painter.end();

```


初始化函数绑定结束事件
结束用一个动画实现渐渐退出的效果
```javascript
//绑定
connect(&m_timer, SIGNAL(timeout()), SLOT(closeAnimation()));
 m_timer.setInterval(1000);
 m_timer.start();

//结束槽函数
void   closeAnimation() {
m_timer.stop();
QPropertyAnimation *animation =
new QPropertyAnimation(this, "windowOpacity", this);
animation->setDuration(1000);
animation->setStartValue(1);
animation->setEndValue(0);
animation->start();
connect(animation, SIGNAL(finished()), SLOT(close()));
}
```
