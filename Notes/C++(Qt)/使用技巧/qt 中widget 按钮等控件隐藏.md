# qt 中widget 按钮等控件隐藏
	
&emsp;&emsp;以QPushButton为例，如果想让他不显示，很多方法都可以实现。比如下边这五种都可以实现按钮的隐藏和显示。我们需要在合适的地方使用合适的方式。

```cpp
    this->setVisible(0);
    this->setVisible(1);
    // 隐藏控件在屏幕上显示、不再占位置会改变布局。

    this->hide();
    this->show();
    // 通过析构和重新new实现显示/隐藏、不再占位置会改变布局。

    this->setFixedSize(36, 25);
    this->setFixedSize(36, 0);
    // 通过改变大小实现隐藏/显示、不再占位置会改变布局。

    QString btn_background=":xxx.png";
    this->setStyleSheet("border:none;background-image:url();");
    this->setStyleSheet(QString("border:none;background-image:url(%1);").arg(btn_background));
    // 通过改变背景图片实现显示/隐藏，占位置不改变布局，隐藏时候鼠标在该位置按下还会发送信号

	
	QString btn_backgrounds=":xxx.png||:xxxx.png";
 	QStringList tmp = sheet.split("||");
    this->setStyleSheet(
        QString("QPushButton:checked{"
                "border:none;"
                "background-image:url(%1);}"
                "QPushButton:!checked"
                "{border: none;"
                "background-image:url(%2);}").arg(tmp[0]).arg(tmp[1]));
     // 通过自身状态改变背景图片实现显示/隐藏，这里用的是checked，可以换成自定义属性，占位置不改变布局，隐藏时候鼠标在该位置按下还会发送信号
```

&emsp;&emsp;链接的话可以把隐藏/显示封装成槽函数链接需要的信号，或者**enterEvent**、**leaveEvent**、**resizeEvent**里。看实际使需要情况。