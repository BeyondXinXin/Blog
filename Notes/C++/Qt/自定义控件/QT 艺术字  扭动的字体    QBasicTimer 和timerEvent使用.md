# QT 艺术字  扭动的字体    QBasicTimer 和timerEvent使用


需要用到timerEvent和QBasicTimer


![在这里插入图片描述](https://img-blog.csdnimg.cn/20190906143633782.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
官方提供很多不错的案例,比如这个
彩色字体动态扭动的效果
> Examples\Qt-X.XX\widgets\widgets\lineedits\wiggly.pro

[Wiggly Example](https://doc.qt.io/qt-5/qtwidgets-widgets-wiggly-example.html)	
The Wiggly example shows how to animate a widget using QBasicTimer and timerEvent(). In addition, the example demonstrates how to use QFontMetrics to determine the size of text on screen.

timerEvent 实现每一时刻位置和颜色的输入位置
paintEvent实时画出效果	

**使用方法**
```javascript
WigglyWidget *wigglyWidget = new WigglyWidget;
    QLineEdit *lineEdit = new QLineEdit;

    QVBoxLayout *layout = new QVBoxLayout(this);
    layout->addWidget(wigglyWidget);
    layout->addWidget(lineEdit);

    connect(lineEdit, &QLineEdit::textChanged, wigglyWidget, &WigglyWidget::setText);
    lineEdit->setText(tr("Hello world!"));

    setWindowTitle(tr("Wiggly"));
    resize(360, 145);
```
本WigglyWidget类提供了波浪线显示文本。我们将QWidget子类化并重新实现标准的paintEvent（）和timerEvent（）函数来绘制和更新小部件。此外，我们实现了一个setText()设置窗口小部件文本的公共插槽。

QBasicTimertimer类型的变量用于定期更新窗口小部件，使窗口小部件移动。该变量用于存储当前显示的文本，并计算摇摆线上每个字符的位置和颜色。textstep

paintEvent()只要将QPaintEvent发送到窗口小部件，就会调用该函数。绘制事件将发送到需要自行更新的窗口小部件，例如，由于移动了覆盖窗口小部件而暴露窗口小部件的一部分。对于摇摆的小部件，还将从timerEvent()插槽每60毫秒生成一个绘制事件。

的sineTable表示它是用来使沿正弦曲线的波浪插件动议正弦曲线，再乘以100的y值。

该QFontMetrics对象提供有关控件的字体信息。该x变量是水平位置，我们开始绘制文本。的y变量是文本的基线的垂直位置。计算两个变量，使文本水平和垂直居中。为了计算基线，我们考虑了字体的上升（基线上方字体的高度）和字体的下降（字体在基线下面的高度）。如果下降等于上升，则它们相互抵消，基线为height()/ 2。

每次paintEvent()调用函数时，我们都会创建一个QPainter对象painter来绘制窗口小部件的内容。对于每个角色text，我们根据w确定颜色和摆动线上的位置step。另外，x增加字符的宽度。
**WigglyWidget类**
```javascript
class WigglyWidget : public QWidget {
    Q_OBJECT
  public:
    WigglyWidget(QWidget *parent = nullptr);

  public slots:
    void setText(const QString &newText) {
        text = newText;
    }

  protected:
    void paintEvent(QPaintEvent *event) override;
    void timerEvent(QTimerEvent *event) override;

  private:
    char m_padding [4];
    QBasicTimer timer;
    QString text;
    int step;
    char m_padding4 [4];
};
```

```javascript
WigglyWidget::WigglyWidget(QWidget *parent)
    : QWidget(parent) {
    setBackgroundRole(QPalette::Midlight);
    setAutoFillBackground(true);

    QFont newFont = font();
    newFont.setPointSize(newFont.pointSize() + 20);
    setFont(newFont);

    step = 0;
    timer.start(60, this);
}

void WigglyWidget::paintEvent(QPaintEvent * /* event */) {
    static const int sineTable[16] = {
        0, 38, 71, 92, 100, 92, 71, 38, 0, -38, -71, -92, -100, -92, -71, -38
    };

    QFontMetrics metrics(font());
    int x = (width() - metrics.horizontalAdvance(text)) / 2;
    int y = (height() + metrics.ascent() - metrics.descent()) / 2;
    QColor color;
    QPainter painter(this);
    for (int i = 0; i < text.size(); ++i) {
        int index = (step + i) % 16;
        color.setHsv((15 - index) * 16, 255, 191);
        painter.setPen(color);
        painter.drawText(x, y - ((sineTable[index] * metrics.height()) / 400),
                         QString(text[i]));
        x += metrics.horizontalAdvance(text[i]);
    }
}

void WigglyWidget::timerEvent(QTimerEvent *event) {
    if (event->timerId() == timer.timerId()) {
        ++step;
        update();
    } else {
        QWidget::timerEvent(event);
    }
}
```

