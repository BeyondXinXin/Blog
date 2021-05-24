# qt 图表增加任意点

qt 画2d图表无非就是QCustomPlot  Qwt QCharts。无论是性能、易用、美观都是QCustomPlot最好。


QCustomPlot下载   [https://www.qcustomplot.com/index.php/download](https://www.qcustomplot.com/index.php/download)
QCustomPlot帮助文档，你下载后文件夹里.qch结尾的就是帮助文档，添加到qt creator 里可以直接看
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307150111393.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307150335478.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020030715162120.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

利用QCustomPlot增加任意点，并连成直线。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200307153005219.gif)

```cpp
 qcpbars_ = new QCPBars(ui->plot->xAxis, ui->plot->yAxis);
    qcpbars_->setAntialiased(false);
    qcpbars_->setStackingGap(0);
    qcpbars_->setPen(QPen(QColor(62, 177, 115)));// 直方图颜色
    qcpbars_->setBrush(QColor(62, 177, 115));// 直方图颜色
    ui->plot->setBackground(QColor(69, 69, 69));// 图标背景颜色
    ui->plot->axisRect()->setBackground(QColor(54, 54, 54));// 图标颜色
    ui->plot->setInteraction(QCP::iRangeDrag, false); //鼠标单击拖动
    ui->plot->setInteraction(QCP::iRangeZoom, false); //滚轮滑动缩放
    ui->plot->addGraph();
    ui->plot->graph()->setScatterStyle(
        QCPScatterStyle(QCPScatterStyle::ssCircle,
                        QPen(Qt::black, 1.5), QBrush(Qt::white), 9));
    ui->plot->graph()->setLineStyle((QCPGraph::lsLine));
    QPen pen;
    pen.setWidth(1);
    pen.setColor(Qt::white);
    ui->plot->graph()->setPen(pen);
    ui->plot->xAxis->setSubTicks(0);
    ui->plot->yAxis->setSubTicks(0);
    ui->plot->xAxis->setLabelColor(QColor(223, 223, 223));
    ui->plot->yAxis->setLabelColor(QColor(223, 223, 223));
    ui->plot->xAxis->setTickLabelColor(QColor(223, 223, 223));
    ui->plot->yAxis->setTickLabelColor(QColor(223, 223, 223));
    ui->plot->xAxis->setBasePen(QPen(QColor(223, 223, 223), 1));
    ui->plot->yAxis->setBasePen(QPen(QColor(223, 223, 223), 1));
    ui->plot->xAxis->setTickPen(QPen(QColor(223, 223, 223), 1));
    ui->plot->yAxis->setTickPen(QPen(QColor(223, 223, 223), 1));
    ui->plot->xAxis->setSubTickPen(QPen(QColor(223, 223, 223), 1));
    ui->plot->yAxis->setSubTickPen(QPen(QColor(223, 223, 223), 1));
    ui->plot->xAxis->grid()->setPen(QPen(QColor(88, 88, 90), 0, Qt::DashLine));
    ui->plot->yAxis->grid()->setPen(QPen(QColor(88, 88, 90), 0, Qt::DashLine));
```

```cpp
void HistogramView::SlotMousePressEvent(QMouseEvent *event) {
    int x_pos = event->pos().x();
    int y_pos = event->pos().y();
    double x_val = ui->plot->xAxis->pixelToCoord(x_pos);
    double y_val = ui->plot->yAxis->pixelToCoord(y_pos);
    for (int i = 0; i < point_x_.count(); i++) {
        if (fabs(x_val - point_x_.at(i)) < 5 && fabs(y_val - point_y_.at(i)) < 5) {
            ui->id->setText(QString::number(i));
            ui->pos->setText(QString("x:%1  y:%2")
                             .arg(point_x_[contrast_value_.id])
                             .arg(point_y_[contrast_value_.id]));
            SlotDateUnite(1);
            break;
        }
    }
}

void HistogramView::SlotMouseReleaseEvent(QMouseEvent *event) {
    Q_UNUSED(event);
    ui->id->setText(QString::number(-1));
    ui->pos->setText(QString("x:-1  y:-1"));
    SlotDateUnite(1);
}

void HistogramView::SlotMouseMoveEvent(QMouseEvent *event) {
    if (contrast_value_.id == -1) {
        return;
    }
    double x_pos = event->pos().x();
    double y_pos = event->pos().y();
    double x_val = ui->plot->xAxis->pixelToCoord(x_pos);
    double y_val = ui->plot->yAxis->pixelToCoord(y_pos);
    y_val = QString::number(y_val, 'f', 3).toDouble();
    x_val = QString::number(x_val, 'f', 3).toDouble();
    // 点逻辑关系
    if (contrast_value_.id == 0) {
        if (x_val >= point_x_[1]) {
            x_val = point_x_[1] - 2;
        } else if (x_val <= -20) {
            x_val = -20;
        }
        if (y_val >= point_y_[1]) {
            y_val = point_y_[1] - 0.01;
        } else if (y_val <= 0) {
            y_val = 0.01;
        }
    } else if (contrast_value_.id == point_x_.count() - 1) {
        if (x_val <= point_x_[point_x_.count() - 2]) {
            x_val =  point_x_[point_x_.count() - 2] + 2;
        } else if (x_val >= 300) {
            x_val = 300;
        }
        if (y_val <= point_y_[point_x_.count() - 2]) {
            y_val = point_y_[point_x_.count() - 2] + 0.01;
        } else if (y_val > 1) {
            y_val = 1;
        }
    } else {
        if (x_val <= point_x_[contrast_value_.id - 1]) {
            x_val =  point_x_[contrast_value_.id - 1] + 2;
        }
        if (y_val <= point_y_[contrast_value_.id - 1]) {
            y_val = point_y_[contrast_value_.id - 1] + 0.01;
        }
        if (x_val >= point_x_[contrast_value_.id + 1]) {
            x_val = point_x_[contrast_value_.id + 1] - 2;
        }
        if (y_val >= point_y_[contrast_value_.id + 1]) {
            y_val = point_y_[contrast_value_.id + 1] - 0.01;
        }
    }
    point_x_[contrast_value_.id] = x_val;
    point_y_[contrast_value_.id] = y_val;
    ui->pos->setText(QString("x:%1  y:%2")
                     .arg(point_x_[contrast_value_.id])
                     .arg(point_y_[contrast_value_.id]));
    SlotDateUnite(1);
}

void HistogramView::SlotHistoramReduction() {
    historgram_.Execute();
    historgram_.GetValWindow(
        &contrast_value_.minimum,
        &contrast_value_.maximum,
        &contrast_value_.level,
        &contrast_value_.window);
    SlotDateUnite(0);
}
```

```cpp
void HistogramView::SlotSpinboxValueChange() {// spinbox change
    if (QObject::sender() == ui->level || QObject::sender() == ui->window) {
        ui->minimum->setValue(ui->level->value() - (ui->window->value() / 2.0));
        ui->maximum->setValue(ui->level->value() + (ui->window->value() / 2.0));
    } else if (QObject::sender() == ui->minimum || QObject::sender() == ui->maximum) {
        if (ui->minimum->value() >= ui->maximum->value()) {
            ui->minimum->setValue(ui->maximum->value() - 255);
        }
        ui->level->setValue(0.5 * (contrast_value_.minimum + contrast_value_.maximum));
        ui->window->setValue(contrast_value_.maximum - contrast_value_.minimum);
    }
    SlotDateUnite(2);
}

void HistogramView::SlotPosChange() {// pos change
    qint32 tmp = point_x_.count();
    if (QObject::sender() == ui->add_btn) {
        if (tmp < 5) {
            tmp++;
        }
    } else if (QObject::sender() == ui->less_btn) {
        if (tmp > 2) {
            tmp--;
        }
    }
    point_x_.clear();
    point_y_.clear();
    point_x_ << contrast_value_.minimum;
    point_y_ << 0;
    for (qint32 i = 1; i < tmp - 1; ++i) {
        point_y_ << (1.0 / (tmp - 1.0))*i;
        point_x_ << contrast_value_.minimum + i*(contrast_value_.window / (tmp - 1));
    }
    point_x_ << contrast_value_.maximum;
    point_y_ << 1;
    SlotDateUnite(1);
}

void HistogramView::SlotDateUnite(const qint32 change) {
    switch (change) {
        case 0: {// sturct change
            ui->minimum->setValue(contrast_value_.minimum);
            ui->maximum->setValue(contrast_value_.maximum);
            ui->level->setValue(contrast_value_.level);
            ui->window->setValue(contrast_value_.window);
            ui->id->setText(QString::number(contrast_value_.id));
            ui->pos->setText(contrast_value_.pos);
            this->SlotPosChange();
            break;
        }
        case 1: {// pos change
            contrast_value_.minimum = point_x_[0];
            contrast_value_.maximum = point_x_[point_x_.count() - 1];
            contrast_value_.level =
                0.5 * (contrast_value_.minimum + contrast_value_.maximum);
            contrast_value_.window =
                contrast_value_.maximum - contrast_value_.minimum;
            contrast_value_.id = ui->id->text().toInt();
            contrast_value_.pos = ui->pos->text();

            ui->minimum->setValue(contrast_value_.minimum);
            ui->maximum->setValue(contrast_value_.maximum);
            ui->level->setValue(contrast_value_.level);
            ui->window->setValue(contrast_value_.window);
            ui->id->setText(QString::number(contrast_value_.id));
            ui->pos->setText(contrast_value_.pos);
            break;
        }
        case 2: {// spinbox change
            contrast_value_.minimum = ui->minimum->value();
            contrast_value_.maximum = ui->maximum->value();
            contrast_value_.level = ui->level->value();
            contrast_value_.window = ui->window->value();
            contrast_value_.id = ui->id->text().toInt();
            contrast_value_.pos = ui->pos->text();
            this->SlotPosChange();
            break;
        }
        default:
            break;
    }
    HistogramExecute();
    historgram_.CalcOrgImgHistData(51);
    QVector<double> ticks;
    for (int i = 0; i < 51; ++i) {
        ticks << contrast_value_.minimum + (i * contrast_value_.window / 50);
    }
    qcpbars_->setData(ticks, historgram_.GetHistogramData());
    ui->plot->graph()->setData(point_x_, point_y_);
    ui->plot->xAxis->setRange(
        contrast_value_.minimum - 10, contrast_value_.maximum + 10);
    ui->plot->yAxis->setRange(-0.2, 1.2);
    ui->plot->replot();
}

```
