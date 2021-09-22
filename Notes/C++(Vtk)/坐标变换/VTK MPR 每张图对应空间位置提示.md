# VTK MPR 每张图对应空间位置提示




![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/xxx.6hcdgq7v0700.png)


看了下小蚂蚁的MPR功能，每张切片有“上下左右前后”的标注，自己也实现下。




![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/xxx.69dnaawam6o0.png)

![](https://cdn.jsdelivr.net/gh/BeyondXinXin/BeyondXinXIn@main/PixX/xxx.lkp78krav5s.gif)




## 计算方位

首先要知道自己每个切片的初始切割矩阵，根据初始矩阵可以确定初始的方位。合适的办法是每次重新切割图片时，计算方位。图省事，我直接用定时器来获取当前每个视图的矩阵。重新计算当前的图片方位，让后显示。


```cpp
const static double mpr_matrix1_[16] = {
    0, 0, 1, 0,
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 1
};
const static double mpr_matrix2_[16] = {
    1, 0, 0, 0,
    0, 0, 1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1
};
const static double mpr_matrix3_[16] = {
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
};
```


```cpp
timer_ = new QTimer(this);
connect(timer_, &QTimer::timeout, this, [&] {
    if(mpr_widget_->reslice_widget_) {
        vtkNew<vtkMatrix4x4>reslice_axes;
        reslice_axes->DeepCopy(mpr_widget_->reslice_widget_->GetImageReslicers()[2]->GetResliceAxes());
        QString x2 = GetPosition(reslice_axes->GetElement(0, 0), reslice_axes->GetElement(2, 0),
                                    QStringList() << "右" << "左" << "下" << "上");
        QString y2 = GetPosition(reslice_axes->GetElement(1, 1), reslice_axes->GetElement(2, 1),
                                    QStringList() << "后" << "前" << "上" << "下");
        reslice_axes->DeepCopy(mpr_widget_->reslice_widget_->GetImageReslicers()[1]->GetResliceAxes());
        QString x1 = GetPosition(reslice_axes->GetElement(0, 0), reslice_axes->GetElement(1, 0),
                                    QStringList() << "右" << "左" << "前" << "后");
        QString y1 = GetPosition(reslice_axes->GetElement(2, 1), reslice_axes->GetElement(1, 1),
                                    QStringList() << "上" << "下" << "后" << "前");
        reslice_axes->DeepCopy(mpr_widget_->reslice_widget_->GetImageReslicers()[0]->GetResliceAxes());
        QString x0 = GetPosition(reslice_axes->GetElement(1, 0), reslice_axes->GetElement(0, 0),
                                    QStringList() << "前" << "后" << "右" << "左");
        QString y0 = GetPosition(reslice_axes->GetElement(2, 1), reslice_axes->GetElement(0, 1),
                                    QStringList() << "上" << "下" << "左" << "右");
        emit SgnUpdataMPRPosition(QStringList() << x0 << y0 << x1 << y1 << x2 << y2);
    }
});
timer_->start(500);
```

```cpp
QString GetPosition(const double &a, const double &b, const QStringList &str1) {
    QString str;
    if(a > 0.9) {
        str = str1.at(0);
    } else if(a < -0.9) {
        str = str1.at(1);
    } else {
        if(b > 0.9) {
            str = str1.at(2);
        } else if(b < -0.9) {
            str = str1.at(3);
        } else {
            if(a > 0) {
                str = str1.at(0);
            } else {
                str = str1.at(1);
            }
            if(b < 0) {
                str += str1.at(3);
            } else {
                str += str1.at(2);
            }
        }
    }
    return str;
}
```


## 显示

临时写的demo，比较随意。自己工程不建议这样搞

```cpp
// 标签
QFont ft;
ft.setPointSize(12);
QPalette pa;
pa.setColor(QPalette::WindowText, Qt::red);
QLabel *lab;
for(int i = 0; i < 3; i++) {
    lab = new QLabel(m_ControlWidget->GetWidget(i));
    lab->setFixedSize(35, 25);
    lab->move(12, m_ControlWidget->GetWidget(i)->height() / 2 - 12);
    lab->setObjectName(QString::number(i * 2));
    lab->setText(lab->objectName());
    lab->setFont(ft);
    lab->setPalette(pa);
    lab = new QLabel(m_ControlWidget->GetWidget(i));
    lab->setFixedSize(35, 25);
    lab->move(m_ControlWidget->GetWidget(i)->width() / 2 - 12, 12);
    lab->setObjectName(QString::number( i * 2 + 1));
    lab->setText(lab->objectName());
    lab->setFont(ft);
    lab->setPalette(pa);
}
```

```cpp

void MainWindow::resizeEvent(QResizeEvent *event) {
    UpdataPosition();
    QMainWindow::resizeEvent(event);
}

void MainWindow::UpdataPosition(const QStringList lists) {
    QList<QLabel *>labs;
    for(int i = 0; i < 3; i++) {
        labs << m_ControlWidget->GetWidget(i)->findChildren<QLabel *>();
    }
    foreach (auto &lab, labs) {
        if(lab->objectName().toInt() % 2 == 0) {
            lab->move(
                12, m_ControlWidget->GetWidget(lab->objectName().toInt() % 2)->height() / 2 - 12);
        } else {
            lab->move(
                m_ControlWidget->GetWidget(lab->objectName().toInt() % 2)->width() / 2 - 12, 12);
        }
    }
    if(!lists.isEmpty()) {
        foreach (auto &lab, labs) {
            lab->setText(lists.at(lab->objectName().toInt()));
        }
        return;
    }
}

```












