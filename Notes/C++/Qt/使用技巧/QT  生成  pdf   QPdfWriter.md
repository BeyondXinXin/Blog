# QT  生成  pdf   QPdfWriter

不管用qt做什么，最后总逃不开做报告和图表。在这里整理下使用qt生成pdf报告。


@[TOC](QT  生成  pdf（QPdfWriter） 

# 1.qt生成pdf
&emsp;&emsp;qt提供一个封装好的类 &emsp;&emsp;  **QPdfWriter Class**

QPdfWriter类是生成可用作绘制设备的pdf的类。
QPdfWriter使用qpanter从一系列绘图命令中生成PDF。newPage（）方法可用于创建多个页面。
引入头文件:    #include  < QPdfWriter >

&emsp;&emsp;**需要把报告pdf分为背景图、贴图、文字三部分分别写入。构建QPdfWriter，使用QPainter以此滑入即可。**
* 背景图为所有报告皆相同的内容，比如公司信息、报告表格标题、报告标题、报告页码等；
* 贴图为每份报告固定大小，但内容不同的图片。比如缺陷位置、缺陷图片、病变图片、重构结果、图表截图等
* 文字为每份报告具体内容，比如病人姓名、检测汽车型号、检测结果等

##  1.1 选择生成目录

```cpp
    this->ReloadImage();
    QFileDialog file_dialog;
    file_dialog.setAcceptMode(QFileDialog::AcceptSave);
    file_dialog.setWindowTitle("保存PDF");
    file_dialog.setViewMode(QFileDialog::Detail);
    file_dialog.setOption(QFileDialog::DontResolveSymlinks);
    file_dialog.setNameFilters(QStringList()
                               << "PDF File (*.pdf)");
    file_dialog.setDefaultSuffix("pdf");
    if (!file_dialog.exec() || file_dialog.selectedFiles().size() == 0) {
        return ;
    }
    QString path = file_dialog.selectedFiles()[0];
```

##  1.2 构造QPdfWriter
```cpp
    QPdfWriter writer(path);
    writer.setPageSize(QPdfWriter::A4);
    writer.setPageMargins(QMargins(0, 0, 0, 0));
    writer.setResolution(300);
```
&emsp;&emsp;其余参数：

1. **void QPdfWriter::setCreator(const QString &creator)**
将文档的创建者设置为creator。
2. **bool QPdfWriter::setPageLayout(const QPageLayout &newPageLayout)**
将PDF页面布局设置为newPageLayout。必须在**newPage()** 或者 **QPainter::begin()** 之前
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200104151054245.png)
3. **bool QPdfWriter::setPageMargins(const QMarginsF &margins)**
以当前页面布局单位设置PDF页边距。必须在**newPage()** 或者 **QPainter::begin()** 之前
4. **bool QPdfWriter::setPageMargins(const QMarginsF &margins, QPageLayout::Unit units)**
设置以给定单位定义的PDF页边距。必须在**newPage()** 或者 **QPainter::begin()** 之前
5. **bool QPdfWriter::setPageOrientation(QPageLayout::Orientation orientation)**
设置PDF页面方向。必须在**newPage()** 或者 **QPainter::begin()** 之前
6. **bool QPdfWriter::setPageSize(const QPageSize &pageSize)**
将PDF页面大小设置为页面大小。必须在**newPage()** 或者 **QPainter::begin()** 之前
7. **void QPdfWriter::setPdfVersion(QPagedPaintDevice::PdfVersion version)**
将此编写器的PDF版本设置为version。
8. **void QPdfWriter::setResolution(int resolution)**
设置DPI中的PDF分辨率。
9. **void QPdfWriter::setTitle(const QString &title)**
将要创建的文档的标题设置为“标题”。
10. **QString QPdfWriter::title() const** 
返回文档的标题。

##  1.3 写入内容
&emsp;&emsp;个人感觉写报告最好的办法是，把固定的报告图片、报告背景、报告文字等做成一张高清图。让后把图片贴在pdf上，不一样参数、图标等以此按照位置放入pdf。

###  1.3.1 画背景图，0,0作为起点
```cpp
    QPainter painter(&writer);
    painter.setRenderHint(QPainter::Antialiasing);
    painter.setBrush(QBrush(QColor(90, 90, 96)));
    painter.setPen(Qt::transparent);
    painter.drawRect(painter.viewport());
    painter.drawPixmap(
        0, 0, QPixmap("report/background.png"));
```

###  1.3.2 贴生成图，比如图表、或者缺陷位置等。需要计算每张图片位置
```cpp
 // 图片
    QString md5;
    emit SignalGetCurrentMd5Out(md5);
    painter.drawPixmap(
        140, 1995, 547, 547,
        QPixmap(QString("./session/%1/screenshoot01.png").arg(md5))
        .scaled(547, 547));
    painter.drawPixmap(
        140 + 547, 1995, 547, 547,
        QPixmap(QString("./session/%1/screenshoot02.png").arg(md5))
        .scaled(547, 547));
    painter.drawPixmap(
        140 + 547 * 2, 1995, 547, 547,
        QPixmap(QString("./session/%1/screenshoot03.png").arg(md5))
        .scaled(547, 547));
    painter.drawPixmap(
        140 + 547 * 3, 1995, 547, 547,
        QPixmap(QString("./session/%1/screenshoot04.png").arg(md5))
        .scaled(547, 547));

    painter.drawPixmap(
        140, 1995 + 547,
        QPixmap(QString("./session/%1/screenshoot05.png").arg(md5))
        .scaled(1095, 401));
    painter.drawPixmap(
        140 + 1095, 1995 + 547,
        QPixmap(QString("./session/%1/screenshoot06.png").arg(md5))
        .scaled(1095, 401));
```
###  1.3.2 贴文字，各种信息等。文字大小、颜色、位置需要提前计算
```cpp
// 文字
    QFont font;
    painter.setPen(Qt::black);
    font.setPointSize(12);
    painter.setFont(font);
    DicomInfo dicom_info;
    emit SignalGetDicomInfoOut(GlobalEnum::FIRST, dicom_info);
    QString name_str = dicom_info.GetDicomTag("Patient's Name");
    QString sex = dicom_info.GetDicomTag("Patient's Sex");
    QString sex_str;
    if (sex.front() == 'M') {
        sex_str = tr("男");
    } else if (sex.front() == 'F') {
        sex_str = tr("女");
    } else {
        sex_str = ("");
    }
    QString brith_str = dicom_info.GetDicomTag("Patient's Birth Date");
    QString patient_id_str = dicom_info.GetDicomTag("Patient ID");
    QString current_time_str = QDateTime::currentDateTime().toString("yyyy-MM-dd");
    painter.drawText(145, 660, name_str);// 姓名
    painter.drawText(440, 660, sex_str);// 性别
    painter.drawText(690, 660, brith_str);// 出生年月
    painter.drawText(2080, 600, patient_id_str);// id
    painter.drawText(145, 885, current_time_str);//报告日期
    painter.drawText(145, 1035, "ML-00001");// id
    painter.drawText(145, 1185, ui->doctor_edit->text());// 医生
    painter.drawText(145, 1330, "XXXXXXXXXX");// 机构
    font.setPointSize(8);
    painter.setFont(font);
    painter.setPen(Qt::black);
    painter.drawText(1300, 1100, 2290 - 1300, 1280 - 1110,
                     Qt::TextWordWrap | Qt::AlignLeft,
                     "  " + ui->description_edit->toPlainText()); //分析
    font.setPointSize(10);
    painter.setFont(font);
    QTreeWidgetItem *item = ui->treeWidget->topLevelItem(0);
    if (item) {
        painter.drawText(175, 1550, item->text(0));// 位置
        painter.drawText(490, 1550, item->text(5));// 长度
        painter.drawText(765, 1550, item->text(1));// 直径狭窄百分比
        painter.drawText(1180, 1550, item->text(2));// 面积狭窄百分比
        painter.drawText(1575, 1550, item->text(3));// 最小管腔直径
        if(item->text(4).toDouble() > 0.8) {
            painter.setPen(Qt::green);
        } else {
            painter.setPen(Qt::red);
        }
        painter.drawText(2040, 1550, item->text(4));// ffr
    }
```

##  1.4 总结
&emsp;&emsp;需要把报告pdf分为背景图、贴图、文字三部分分别写入。构建QPdfWriter，使用QPainter以此滑入即可。


###  1.4.1 drawText  自动换行
&emsp;&emsp;文字在矩形框内自动换行
```cpp
    painter.drawText(1300, 1100, 2290 - 1300, 1280 - 1110,
                     Qt::TextWordWrap | Qt::AlignLeft,
                     "  " + ui->description_edit->toPlainText()); //分析
```
###  1.4.2 drawPixmap  设置图片大小
```cpp
 QString md5;
 emit SignalGetCurrentMd5Out(md5);
 painter.drawPixmap(
        140, 1995, 547, 547,
        QPixmap(QString("./session/%1/screenshoot01.png").arg(md5))
        .scaled(547, 547));
```
&emsp;&emsp;建议保存图片时使用 SmoothTransformation，当然如果没有需要可以不用保存图片
```cpp
full_screen->copy(x, y, w, h)
    .scaled(480, 480, Qt::KeepAspectRatio, Qt::SmoothTransformation)
    .save(file_path, "bmp");
```
###  1.4.3 drawText  文字颜色、尺寸自定义
```cpp
 QTreeWidgetItem *item = ui->treeWidget->topLevelItem(0);
    if (item) {
        font.setPointSize(8);
    	painter.setFont(font);
    	painter.setPen(Qt::black);
        painter.drawText(175, 1550, item->text(0));// 位置
        painter.drawText(490, 1550, item->text(5));// 长度
        painter.drawText(765, 1550, item->text(1));// 直径狭窄百分比
        painter.drawText(1180, 1550, item->text(2));// 面积狭窄百分比
        painter.drawText(1575, 1550, item->text(3));// 最小管腔直径
        if(item->text(4).toDouble() > 0.8) {
            painter.setPen(Qt::green);
        } else {
            painter.setPen(Qt::red);
        }
        font.setPointSize(10);
    	painter.setFont(font);
        painter.drawText(2040, 1550, item->text(4));// ffr
    }
```
###  1.4.4 多张pdf
&emsp;&emsp;使用**newPage()**进入下一张，让后以此写入背景图、贴图、文字。如果每张pdf页边距等相同则无需更改，如果不同在**newPage()**之前设置新的页边距。