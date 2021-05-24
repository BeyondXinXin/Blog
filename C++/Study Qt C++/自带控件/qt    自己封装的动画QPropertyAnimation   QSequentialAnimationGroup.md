# qt    自己封装的动画QPropertyAnimation   QSequentialAnimationGroup


https://blog.csdn.net/liang19890820/article/details/51850579
[一去二三里](https://blog.csdn.net/liang19890820/article/details/51850579)
需要做个小动画,这篇博客写的很好

我记录下自己学到的东西方便以后自己寻找
Qt封装的动画框架可以很容易实现动画效果
1.创建QPropertyAnimation对象。
2.动画对象绑定要实现动画的对象
3.动画对象设置要实现动画的属性
4.设置属性的起始值和终止值
5.设置动画运行时长
6.启动动画
其中1、2、3步也可以通过QPropertyAnimation的构造函数来完成。


QSequentialAnimationGroup类提供动画的串行组。
这里可以放多个动画,但是同一事件只能有一个动画
提供了延时切换等接口


---
有时候需要窗口抖动(qq那种
只需要获取界面的坐标，然后进行上、下、左、右坐标浮动，
通过setKeyValueAt()来设置每一时刻的位置，实现抖动效果。

```javascript
void MainWindow::onShakeWindow() {
    QPropertyAnimation *pAnimation = new QPropertyAnimation(this, "pos");
    pAnimation->setDuration(500);
    pAnimation->setLoopCount(2);
    pAnimation->setKeyValueAt(0, QPoint(geometry().x() - 3, geometry().y() - 3));
    pAnimation->setKeyValueAt(0.1, QPoint(geometry().x() + 6, geometry().y() + 6));
    pAnimation->setKeyValueAt(0.2, QPoint(geometry().x() - 6, geometry().y() + 6));
    pAnimation->setKeyValueAt(0.3, QPoint(geometry().x() + 6, geometry().y() - 6));
    pAnimation->setKeyValueAt(0.4, QPoint(geometry().x() - 6, geometry().y() - 6));
    pAnimation->setKeyValueAt(0.5, QPoint(geometry().x() + 6, geometry().y() + 6));
    pAnimation->setKeyValueAt(0.6, QPoint(geometry().x() - 6, geometry().y() + 6));
    pAnimation->setKeyValueAt(0.7, QPoint(geometry().x() + 6, geometry().y() - 6));
    pAnimation->setKeyValueAt(0.8, QPoint(geometry().x() - 6, geometry().y() - 6));
    pAnimation->setKeyValueAt(0.9, QPoint(geometry().x() + 6, geometry().y() + 6));
    pAnimation->setKeyValueAt(1, QPoint(geometry().x() - 3, geometry().y() - 3));
    pAnimation->start(QAbstractAnimation::DeleteWhenStopped);
}
```
---
如果希望窗口从不透明到透明再便会透明只需要
设置每一时刻的透明度值，动画结束时界面还原（透明度再为1）

```javascript
void MainWindow::onOpacityWindow() {
    QPropertyAnimation *pAnimation = new QPropertyAnimation(this, "windowOpacity");
    pAnimation->setDuration(1000);
    pAnimation->setKeyValueAt(0, 1);
    pAnimation->setKeyValueAt(0.5, 0);
    pAnimation->setKeyValueAt(1, 1);
    pAnimation->start(QAbstractAnimation::DeleteWhenStopped);
}
```
---
如果要设置界面下坠动画
只需要计算桌面的宽度、高度，来设置动画的起始值和结束值。

```javascript
void MainWindow::onDropWindow() {
    QPropertyAnimation *pAnimation = new QPropertyAnimation(this, "geometry");
    QDesktopWidget *pDesktopWidget = QApplication::desktop();
    int x = (pDesktopWidget->availableGeometry().width() - width()) / 2;
    int y = (pDesktopWidget->availableGeometry().height() - height()) / 2;
    pAnimation->setDuration(1000);
    pAnimation->setStartValue(QRect(x, 0, width(), height()));
    pAnimation->setEndValue(QRect(x, y, width(), height()));
    pAnimation->setEasingCurve(QEasingCurve::OutElastic);
    pAnimation->start(QAbstractAnimation::DeleteWhenStopped);
}
```
---
如果要实现控件颜色改变动画

```javascript
 QPropertyAnimation *pAnimation = new QPropertyAnimation();
    pAnimation->setTargetObject(this);
    pAnimation->setPropertyName("alpha");
    pAnimation->setDuration(1000);
    pAnimation->setKeyValueAt(0, 255);
    pAnimation->setKeyValueAt(0.5, 100);
    pAnimation->setKeyValueAt(1, 255);
    pAnimation->setLoopCount(-1);  //永远运行，直到stop
    connect(pStartButton, SIGNAL(clicked(bool)), pAnimation, SLOT(start()));
```
---
有时候同时多个动画,我们需要切换

```javascript
  // 动画一
    QPropertyAnimation *pAnimation1 = new QPropertyAnimation(list.at(0), "geometry");
    pAnimation1->setDuration(1000);
    pAnimation1->setStartValue(QRect(0, 0, 100, 30));
    pAnimation1->setEndValue(QRect(120, 130, 100, 30));
    pAnimation1->setEasingCurve(QEasingCurve::OutBounce);

    // 动画二
    QPropertyAnimation *pAnimation2 = new QPropertyAnimation(list.at(1), "geometry");
    pAnimation2->setDuration(1000);
    pAnimation2->setStartValue(QRect(120, 130, 120, 30));
    pAnimation2->setEndValue(QRect(170, 0, 120, 30));
    pAnimation2->setEasingCurve(QEasingCurve::OutInCirc);


m_pGroup = new QSequentialAnimationGroup(this);
    // 添加动画
    m_pGroup->addAnimation(pAnimation1);
    // 暂停1秒
    m_pGroup->addPause(1000);
    m_pGroup->addAnimation(pAnimation2);
    // 循环2次
    m_pGroup->setLoopCount(2);
    // 从后向前执行
    m_pGroup->setDirection(QAbstractAnimation::Backward);
    connect(m_pGroup, SIGNAL(currentAnimationChanged(QAbstractAnimation *)),
            this, SLOT(onCurrentAnimationChanged(QAbstractAnimation *)));
    connect(pStartButton, SIGNAL(clicked(bool)), this, SLOT(startAnimation()));

// 开始动画
void MainWindow::startAnimation() {
    m_pGroup->start();
}

// 动画切换时会调用
void MainWindow::onCurrentAnimationChanged(QAbstractAnimation *current) {
    QPropertyAnimation *pAnimation = dynamic_cast<QPropertyAnimation *>(current);

    if (pAnimation == NULL) {
        return;
    }
    QLabel *pLabel = dynamic_cast<QLabel *>(pAnimation->targetObject());
    if (pLabel != NULL) {
        pLabel->setText(pLabel->text() + ".");
    }
}

```



