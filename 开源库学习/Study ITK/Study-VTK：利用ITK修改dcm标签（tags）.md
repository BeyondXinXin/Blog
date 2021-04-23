&emsp;&emsp;DICOM文件tag标签通常比较有用，之前写过如何利用ITK读取dcm的标签&emsp;&emsp;[Study-VTK：利用 itk 读取dcm标签信息](https://blog.csdn.net/a15005784320/article/details/101030403)&emsp;&emsp; 标签。这里记录下如何利用ITK修改dcm标签。

**&emsp;&emsp;请注意，修改DICOM标头的内容存在很大风险/操作标头包含有关患者的基本信息，因此必须保护其一致性，防止任何数据损坏。在尝试修改文件的DICOM标头之前，您必须确保您有充分的理由这样做。**

&emsp;&emsp;源码。
WriteDcmSrc  [http://118.25.63.144/temporary/WriteDcmSrc.zip](http://118.25.63.144/temporary/WriteDcmSrc.zip)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200411180245204.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;程序就是读取一张全黑的dcm,标签也全部是空的，只有图像信息，自己可以写如标签并保存。如果想读取任意dcm并修改写出，只要替换程序里input_black.dcm即可。

&emsp;&emsp;写入用的是**EncapsulateMetaData**
```cpp
itk::EncapsulateMetaData<std::string>(
            dictionary, entryId.toStdString(), value.toStdString() );
```

```cpp
#include "aboutdicomtags.h"
#include "ui_aboutdicomtags.h"
#include <QPainter>
#include <QTableWidget>
#include <QTableWidgetItem>
#include <QDebug>
#include <itkGDCMImageIO.h>
#include <itkImageFileReader.h>
#include <itkMetaDataObject.h>
#include "itkImageFileReader.h"
#include "itkImageFileWriter.h"
#include "itkImage.h"
#include "itkMetaDataObject.h"
#include "itkGDCMImageIO.h"
#include <list>
#include <fstream>
#include "itkRescaleIntensityImageFilter.h"
#include <QFileDialog>

QHash<QString, QString> StringUtil::dicom_tag_ = {
    {"Image Type", "0008|0008"},
    {"Instance Creation Time", "0008|0013"},
    {"SOP Class UID", "0008|0016"},
    {"SOP Instance UID", "0008|0018"},
    {"Study Date", "0008|0020"},
    {"Series Date", "0008|0021"},
    {"Content Date", "0008|0023"},
    {"Study Time", "0008|0030"},
    {"Series Time", "0008|0031"},
    {"Content Time", "0008|0033"},
    {"Accession Number", "0008|0050"},
    {"Modality", "0008|0060"},
    {"Manufacturer", "0008|0070"},
    {"Institution Name", "0008|0080"},
    {"Referring Physician's Name", "0008|0090"},
    {"Station Name", "0008|1010"},
    {"Study Description", "0008|1030"},
    {"Series Description", "0008|103e"},
    {"Institutional Department Name", "0008|1040"},
    {"Manufacturer's Model Name", "0008|1090"},
    {"Recommended Display Frame Rate", "0008|2144"},
    {"Patient's Name", "0010|0010"},
    {"Patient ID", "0010|0020"},
    {"Patient's Birth Date", "0010|0030"},
    {"Patient's Sex", "0010|0040"},
    {"Contrast/Bolus Agent", "0018|0010"},
    {"Cine Rate", "0018|0040"},
    {"KVP", "0018|0060"},
    {"Device Serial Number", "0018|1000"},
    {"Software Version(s)", "0018|1020"},
    {"Protocol Name", "0018|1030"},
    {"Frame Time", "0018|1063"},
    {"Frame Delay", "0018|1066"},
    {"Distance Source to Detector", "0018|1110"},
    {"Distance Source to Patient", "0018|1111"},
    {"Table Motion", "0018|1134"},
    {"Exposure Time", "0018|1150"},
    {"X-Ray Tube Current", "0018|1151"},
    {"Radiation Setting", "0018|1155"},
    {"Imager Pixel Spacing", "0018|1164"},
    {"Positioner Motion", "0018|1500"},
    {"Positioner Primary Angle", "0018|1510"},
    {"Positioner Secondary Angle", "0018|1511"},
    {"Shutter Shape", "0018|1600"},
    {"Shutter Left Vertical Edge", "0018|1602"},
    {"Shutter Right Vertical Edge", "0018|1604"},
    {"Shutter Upper Horizontal Edge", "0018|1606"},
    {"Shutter Lower Horizontal Edge", "0018|1608"},
    {"Study Instance UID", "0020|000d"},
    {"Series Instance UID", "0020|000e"},
    {"Study ID", "0020|0010"},
    {"Series Number", "0020|0011"},
    {"Instance Number", "0020|0013"},
    {"Patient Orientation", "0020|0020"},
    {"Laterality", "0020|0060"},
    {"Samples per Pixel", "0028|0002"},
    {"Photometric Interpretation", "0028|0004"},
    {"Number of Frames", "0028|0008"},
    {"Frame Increment Pointer", "0028|0009"},
    {"Rows", "0028|0010"},
    {"Columns", "0028|0011"},
    {"Bits Allocated", "0028|0100"},
    {"Bits Stored", "0028|0101"},
    {"High Bit", "0028|0102"},
    {"Pixel Representation", "0028|0103"},
    {"Pixel Intensity Relationship", "0028|1040"},
    {"Window Center", "0028|1050"},
    {"Window Width", "0028|1051"},
    {"Lossy Image Compression", "0028|2110"},
    {"Performed Procedure Step Start Date", "0040|0244"},
    {"Performed Procedure Step Start Time", "0040|0245"},
    {"Performed Procedure Step ID", "0040|0253"},
    {"Distance Source to Entrance", "0040|0306"},
    {"Curve Dimensions", "5000|0005"},
    {"Number of Points", "5000|0010"},
    {"Type of Data", "5000|0020"},
    {"Axis Units", "5000|0030"},
    {"Data Value Representation", "5000|0103"},
    {"Minimum Coordinate Value", "5000|0104"},
    {"Maximum Coordinate Value", "5000|0105"},
    {"Curve Data Descriptor", "5000|0110"},
    {"Coordinate Start Value", "5000|0112"},
    {"Coordinate Step Value", "5000|0114"},
    {"Curve Data", "5000|3000"}
};


AboutDicomTags::AboutDicomTags(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::AboutDicomTags) {
    ui->setupUi(this);
    this->Initial();
    QHash<QString, QString> key_list;
    ReadDicomInfo("input_black.dcm", key_list);
    InsertTagValues(key_list);
}

AboutDicomTags::~AboutDicomTags() {
    delete ui;
}

void AboutDicomTags::paintEvent(QPaintEvent *event) {
    QPainter painter(this);
    painter.setRenderHint(QPainter::Antialiasing);
    painter.setBrush(QBrush(QColor(90, 90, 96)));
    painter.setPen(Qt::transparent);
    painter.drawRect(this->rect());
    QWidget::paintEvent(event);
}

void AboutDicomTags::Initial() {
    this->setWindowTitle("利用ITK修改dcm标签");
    this->setFixedSize(800, 480);
    ui->tag_widget->setColumnCount(3);
    ui->tag_widget->setColumnWidth(0, 150);
    ui->tag_widget->setColumnWidth(1, 243);
    ui->tag_widget->setColumnWidth(2, 347);
    QStringList sListHeader;
    sListHeader << "Tag ID" << "Description" << "Value";
    ui->tag_widget->setHorizontalHeaderLabels(sListHeader);
    QFont font = ui->tag_widget->horizontalHeader()->font();
    ui->tag_widget->horizontalHeader()->setFont(font);
    ui->tag_widget->horizontalHeaderItem(0)->setTextAlignment(Qt::AlignLeft);
    ui->tag_widget->horizontalHeaderItem(1)->setTextAlignment(Qt::AlignLeft);
    ui->tag_widget->horizontalHeaderItem(2)->setTextAlignment(Qt::AlignLeft);
    ui->tag_widget->setSelectionBehavior(QAbstractItemView::SelectRows);
    ui->tag_widget->verticalHeader()->setDefaultSectionSize(20);
    ui->tag_widget->verticalHeader()->setSectionResizeMode(QHeaderView::Fixed);
    ui->tag_widget->setEditTriggers(QAbstractItemView::NoEditTriggers);
    connect(ui->tag_widget, SIGNAL(cellClicked(int, int)),
            this, SLOT(SlotcellClicked(int, int)));
    this->InsertNewItem(QString("Image Type"));
    this->InsertNewItem(QString("Instance Creation Time"));
    this->InsertNewItem(QString("SOP Class UID"));
    this->InsertNewItem(QString("SOP Instance UID"));
    this->InsertNewItem(QString("Study Date"));
    this->InsertNewItem(QString("Series Date"));
    this->InsertNewItem(QString("Content Date"));
    this->InsertNewItem(QString("Study Time"));
    this->InsertNewItem(QString("Series Time"));
    this->InsertNewItem(QString("Content Time"));
    this->InsertNewItem(QString("Accession Number"));
    this->InsertNewItem(QString("Modality"));
    this->InsertNewItem(QString("Manufacturer"));
    this->InsertNewItem(QString("Institution Name"));
    this->InsertNewItem(QString("Referring Physician's Name"));
    this->InsertNewItem(QString("Station Name"));
    this->InsertNewItem(QString("Study Description"));
    this->InsertNewItem(QString("Series Description"));
    this->InsertNewItem(QString("Institutional Department Name"));
    this->InsertNewItem(QString("Manufacturer's Model Name"));
    this->InsertNewItem(QString("Recommended Display Frame Rate"));
    this->InsertNewItem(QString("Patient's Name"));
    this->InsertNewItem(QString("Patient ID"));
    this->InsertNewItem(QString("Patient's Birth Date"));
    this->InsertNewItem(QString("Patient's Sex"));
    this->InsertNewItem(QString("Contrast/Bolus Agent"));
    this->InsertNewItem(QString("Cine Rate"));
    this->InsertNewItem(QString("KVP"));
    this->InsertNewItem(QString("Device Serial Number"));
    this->InsertNewItem(QString("Software Version(s)"));
    this->InsertNewItem(QString("Protocol Name"));
    this->InsertNewItem(QString("Frame Time"));
    this->InsertNewItem(QString("Frame Delay"));
    this->InsertNewItem(QString("Distance Source to Detector"));
    this->InsertNewItem(QString("Distance Source to Patient"));
    this->InsertNewItem(QString("Table Motion"));
    this->InsertNewItem(QString("Exposure Time"));
    this->InsertNewItem(QString("X-Ray Tube Current"));
    this->InsertNewItem(QString("Radiation Setting"));
    this->InsertNewItem(QString("Imager Pixel Spacing"));
    this->InsertNewItem(QString("Positioner Motion"));
    this->InsertNewItem(QString("Positioner Primary Angle"));
    this->InsertNewItem(QString("Positioner Secondary Angle"));
    this->InsertNewItem(QString("Shutter Shape"));
    this->InsertNewItem(QString("Shutter Left Vertical Edge"));
    this->InsertNewItem(QString("Shutter Right Vertical Edge"));
    this->InsertNewItem(QString("Shutter Upper Horizontal Edge"));
    this->InsertNewItem(QString("Shutter Lower Horizontal Edge"));
    this->InsertNewItem(QString("Study Instance UID"));
    this->InsertNewItem(QString("Series Instance UID"));
    this->InsertNewItem(QString("Study ID"));
    this->InsertNewItem(QString("Series Number"));
    this->InsertNewItem(QString("Instance Number"));
    this->InsertNewItem(QString("Patient Orientation"));
    this->InsertNewItem(QString("Laterality"));
    this->InsertNewItem(QString("Samples per Pixel"));
    this->InsertNewItem(QString("Photometric Interpretation"));
    this->InsertNewItem(QString("Number of Frames"));
    this->InsertNewItem(QString("Frame Increment Pointer"));
    this->InsertNewItem(QString("Rows"));
    this->InsertNewItem(QString("Columns"));
    this->InsertNewItem(QString("Bits Allocated"));
    this->InsertNewItem(QString("Bits Stored"));
    this->InsertNewItem(QString("High Bit"));
    this->InsertNewItem(QString("Pixel Representation"));
    this->InsertNewItem(QString("Pixel Intensity Relationship"));
    this->InsertNewItem(QString("Window Center"));
    this->InsertNewItem(QString("Window Width"));
    this->InsertNewItem(QString("Lossy Image Compression"));
    this->InsertNewItem(QString("Performed Procedure Step Start Date"));
    this->InsertNewItem(QString("Performed Procedure Step Start Time"));
    this->InsertNewItem(QString("Performed Procedure Step ID"));
    this->InsertNewItem(QString("Distance Source to Entrance"));
    this->InsertNewItem(QString("Curve Dimensions"));
    this->InsertNewItem(QString("Number of Points"));
    this->InsertNewItem(QString("Type of Data"));
    this->InsertNewItem(QString("Axis Units"));
    this->InsertNewItem(QString("Data Value Representation"));
    this->InsertNewItem(QString("Minimum Coordinate Value"));
    this->InsertNewItem(QString("Maximum Coordinate Value"));
    this->InsertNewItem(QString("Curve Data Descriptor"));
    this->InsertNewItem(QString("Coordinate Start Value"));
    this->InsertNewItem(QString("Coordinate Step Value"));
    this->InsertNewItem(QString("Curve Data"));
}

void AboutDicomTags::InsertNewItem(const QString &itemDescription) {
    qint32 iRow = ui->tag_widget->rowCount();
    ui->tag_widget->setRowCount(iRow + 1);
    QTableWidgetItem *item_description = new QTableWidgetItem(itemDescription);
    ui->tag_widget->setItem(iRow, 1, item_description);
    QString tag_str = StringUtil::GetDicomStringToTag(itemDescription);
    QTableWidgetItem *item_tag = new QTableWidgetItem(tag_str);
    ui->tag_widget->setItem(iRow, 0, item_tag);
}

bool AboutDicomTags::ReadDicomInfo(const QString &dicom_path,
                                   QHash<QString, QString> &key_list) {
    qDebug();
    typedef signed short InputPixelType;
    const unsigned int   Dimension = 2;
    typedef itk::Image< InputPixelType, Dimension > InputImageType;
    typedef itk::ImageFileReader< InputImageType > ReaderType;
    ReaderType::Pointer reader = ReaderType::New();
    reader->SetFileName(dicom_path.toLocal8Bit().data());
    typedef itk::GDCMImageIO           ImageIOType;
    ImageIOType::Pointer gdcmImageIO = ImageIOType::New();
    reader->SetImageIO( gdcmImageIO );
    try {
        reader->Update();
    } catch (itk::ExceptionObject &e) {
        std::cerr << "exception in file reader " << std::endl;
        std::cerr << e.GetDescription() << std::endl;
        std::cerr << e.GetLocation() << std::endl;
        return EXIT_FAILURE;
    }
    InputImageType::Pointer inputImage = reader->GetOutput();
    typedef itk::MetaDataDictionary   DictionaryType;
    using MetaDataStringType = itk::MetaDataObject<std::string>;
    DictionaryType &dictionary = inputImage->GetMetaDataDictionary();
    key_list.clear();
    for (auto ite = dictionary.Begin(); ite != dictionary.End(); ++ite) {
        QString id = QString::fromStdString(ite->first);
        itk::MetaDataObjectBase::Pointer entry = ite->second;
        MetaDataStringType::ConstPointer entry_value =
            dynamic_cast<const MetaDataStringType *>(ite->second.GetPointer());
        std::string key_string;
        itk::GDCMImageIO::GetLabelFromTag(id.toStdString().c_str(), key_string);
        QString key = QString::fromStdString(key_string);
        QString value = QString::fromStdString(entry_value->GetMetaDataObjectValue());
        itk::EncapsulateMetaData<std::string>(dictionary, key_string, "value" );
        key_list.insert(key, value);
    }
    return true;
}

QString AboutDicomTags::GetDicomValue(const QString &description, QHash<QString, QString> &key_list) {
    auto mi = key_list.find(description);
    if (mi != key_list.end()) {
        return mi.value();
    }
    return "";
}

void AboutDicomTags::InsertTagValues(QHash<QString, QString> &key_list) {
    QString value0 = GetDicomValue(QString("Image Type"), key_list);
    QString value1 = GetDicomValue(QString("Instance Creation Time"), key_list);
    QString value2 = GetDicomValue(QString("SOP Class UID"), key_list);
    QString value3 = GetDicomValue(QString("SOP Instance UID"), key_list);
    QString value4 = GetDicomValue(QString("Study Date"), key_list);
    QString value5 = GetDicomValue(QString("Series Date"), key_list);
    QString value6 = GetDicomValue(QString("Content Date"), key_list);
    QString value7 = GetDicomValue(QString("Study Time"), key_list);
    QString value8 = GetDicomValue(QString("Series Time"), key_list);
    QString value9 = GetDicomValue(QString("Content Time"), key_list);
    QString value10 = GetDicomValue(QString("Accession Number"), key_list);
    QString value11 = GetDicomValue(QString("Modality"), key_list);
    QString value12 = GetDicomValue(QString("Manufacturer"), key_list);
    QString value13 = GetDicomValue(QString("Institution Name"), key_list);
    QString value14 = GetDicomValue(QString("Referring Physician's Name"), key_list);
    QString value15 = GetDicomValue(QString("Station Name"), key_list);
    QString value16 = GetDicomValue(QString("Study Description"), key_list);
    QString value17 = GetDicomValue(QString("Series Description"), key_list);
    QString value18 = GetDicomValue(QString("Institutional Department Name"), key_list);
    QString value19 = GetDicomValue(QString("Manufacturer's Model Name"), key_list);
    QString value20 = GetDicomValue(QString("Recommended Display Frame Rate"), key_list);
    QString value21 = GetDicomValue(QString("Patient's Name"), key_list);
    QString value22 = GetDicomValue(QString("Patient ID"), key_list);
    QString value23 = GetDicomValue(QString("Patient's Birth Date"), key_list);
    QString value24 = GetDicomValue(QString("Patient's Sex"), key_list);
    QString value25 = GetDicomValue(QString("Contrast/Bolus Agent"), key_list);
    QString value26 = GetDicomValue(QString("Cine Rate"), key_list);
    QString value27 = GetDicomValue(QString("KVP"), key_list);
    QString value28 = GetDicomValue(QString("Device Serial Number"), key_list);
    QString value29 = GetDicomValue(QString("Software Version(s)"), key_list);
    QString value30 = GetDicomValue(QString("Protocol Name"), key_list);
    QString value31 = GetDicomValue(QString("Frame Time"), key_list);
    QString value32 = GetDicomValue(QString("Frame Delay"), key_list);
    QString value33 = GetDicomValue(QString("Distance Source to Detector"), key_list);
    QString value34 = GetDicomValue(QString("Distance Source to Patient"), key_list);
    QString value35 = GetDicomValue(QString("Table Motion"), key_list);
    QString value36 = GetDicomValue(QString("Exposure Time"), key_list);
    QString value37 = GetDicomValue(QString("X-Ray Tube Current"), key_list);
    QString value38 = GetDicomValue(QString("Radiation Setting"), key_list);
    QString value39 = GetDicomValue(QString("Imager Pixel Spacing"), key_list);
    QString value40 = GetDicomValue(QString("Positioner Motion"), key_list);
    QString value41 = GetDicomValue(QString("Positioner Primary Angle"), key_list);
    QString value42 = GetDicomValue(QString("Positioner Secondary Angle"), key_list);
    QString value43 = GetDicomValue(QString("Shutter Shape"), key_list);
    QString value44 = GetDicomValue(QString("Shutter Left Vertical Edge"), key_list);
    QString value45 = GetDicomValue(QString("Shutter Right Vertical Edge"), key_list);
    QString value46 = GetDicomValue(QString("Shutter Upper Horizontal Edge"), key_list);
    QString value47 = GetDicomValue(QString("Shutter Lower Horizontal Edge"), key_list);
    QString value48 = GetDicomValue(QString("Study Instance UID"), key_list);
    QString value49 = GetDicomValue(QString("Series Instance UID"), key_list);
    QString value50 = GetDicomValue(QString("Study ID"), key_list);
    QString value51 = GetDicomValue(QString("Series Number"), key_list);
    QString value52 = GetDicomValue(QString("Instance Number"), key_list);
    QString value53 = GetDicomValue(QString("Patient Orientation"), key_list);
    QString value54 = GetDicomValue(QString("Laterality"), key_list);
    QString value55 = GetDicomValue(QString("Samples per Pixel"), key_list);
    QString value56 = GetDicomValue(QString("Photometric Interpretation"), key_list);
    QString value57 = GetDicomValue(QString("Number of Frames"), key_list);
    QString value58 = GetDicomValue(QString("Frame Increment Pointer"), key_list);
    QString value59 = GetDicomValue(QString("Rows"), key_list);
    QString value60 = GetDicomValue(QString("Columns"), key_list);
    QString value61 = GetDicomValue(QString("Bits Allocated"), key_list);
    QString value62 = GetDicomValue(QString("Bits Stored"), key_list);
    QString value63 = GetDicomValue(QString("High Bit"), key_list);
    QString value64 = GetDicomValue(QString("Pixel Representation"), key_list);
    QString value65 = GetDicomValue(QString("Pixel Intensity Relationship"), key_list);
    QString value66 = GetDicomValue(QString("Window Center"), key_list);
    QString value67 = GetDicomValue(QString("Window Width"), key_list);
    QString value68 = GetDicomValue(QString("Lossy Image Compression"), key_list);
    QString value69 = GetDicomValue(QString("Performed Procedure Step Start Date"), key_list);
    QString value70 = GetDicomValue(QString("Performed Procedure Step Start Time"), key_list);
    QString value71 = GetDicomValue(QString("Performed Procedure Step ID"), key_list);
    QString value72 = GetDicomValue(QString("Distance Source to Entrance"), key_list);
    QString value73 = GetDicomValue(QString("Curve Dimensions"), key_list);
    QString value74 = GetDicomValue(QString("Number of Points"), key_list);
    QString value75 = GetDicomValue(QString("Type of Data"), key_list);
    QString value76 = GetDicomValue(QString("Axis Units"), key_list);
    QString value77 = GetDicomValue(QString("Data Value Representation"), key_list);
    QString value78 = GetDicomValue(QString("Minimum Coordinate Value"), key_list);
    QString value79 = GetDicomValue(QString("Maximum Coordinate Value"), key_list);
    QString value80 = GetDicomValue(QString("Curve Data Descriptor"), key_list);
    QString value81 = GetDicomValue(QString("Coordinate Start Value"), key_list);
    QString value82 = GetDicomValue(QString("Coordinate Step Value"), key_list);
    QString value83 = GetDicomValue(QString("Curve Data"), key_list);
    InsertTableValue(0, value0);
    InsertTableValue(1, value1);
    InsertTableValue(2, value2);
    InsertTableValue(3, value3);
    InsertTableValue(4, value4);
    InsertTableValue(5, value5);
    InsertTableValue(6, value6);
    InsertTableValue(7, value7);
    InsertTableValue(8, value8);
    InsertTableValue(9, value9);
    InsertTableValue(10, value10);
    InsertTableValue(11, value11);
    InsertTableValue(12, value12);
    InsertTableValue(13, value13);
    InsertTableValue(14, value14);
    InsertTableValue(15, value15);
    InsertTableValue(16, value16);
    InsertTableValue(17, value17);
    InsertTableValue(18, value18);
    InsertTableValue(19, value19);
    InsertTableValue(20, value20);
    InsertTableValue(21, value21);
    InsertTableValue(22, value22);
    InsertTableValue(23, value23);
    InsertTableValue(24, value24);
    InsertTableValue(25, value25);
    InsertTableValue(26, value26);
    InsertTableValue(27, value27);
    InsertTableValue(28, value28);
    InsertTableValue(29, value29);
    InsertTableValue(30, value30);
    InsertTableValue(31, value31);
    InsertTableValue(32, value32);
    InsertTableValue(33, value33);
    InsertTableValue(34, value34);
    InsertTableValue(35, value35);
    InsertTableValue(36, value36);
    InsertTableValue(37, value37);
    InsertTableValue(38, value38);
    InsertTableValue(39, value39);
    InsertTableValue(40, value40);
    InsertTableValue(41, value41);
    InsertTableValue(42, value42);
    InsertTableValue(43, value43);
    InsertTableValue(44, value44);
    InsertTableValue(45, value45);
    InsertTableValue(46, value46);
    InsertTableValue(47, value47);
    InsertTableValue(48, value48);
    InsertTableValue(49, value49);
    InsertTableValue(50, value50);
    InsertTableValue(51, value51);
    InsertTableValue(52, value52);
    InsertTableValue(53, value53);
    InsertTableValue(54, value54);
    InsertTableValue(55, value55);
    InsertTableValue(56, value56);
    InsertTableValue(57, value57);
    InsertTableValue(58, value58);
    InsertTableValue(59, value59);
    InsertTableValue(60, value60);
    InsertTableValue(61, value61);
    InsertTableValue(62, value62);
    InsertTableValue(63, value63);
    InsertTableValue(64, value64);
    InsertTableValue(65, value65);
    InsertTableValue(66, value66);
    InsertTableValue(67, value67);
    InsertTableValue(68, value68);
    InsertTableValue(69, value69);
    InsertTableValue(70, value70);
    InsertTableValue(71, value71);
    InsertTableValue(72, value72);
    InsertTableValue(73, value73);
    InsertTableValue(74, value74);
    InsertTableValue(75, value75);
    InsertTableValue(76, value76);
    InsertTableValue(77, value77);
    InsertTableValue(78, value78);
    InsertTableValue(79, value79);
    InsertTableValue(80, value80);
    InsertTableValue(81, value81);
    InsertTableValue(82, value82);
    InsertTableValue(83, value83);
}

void AboutDicomTags::InsertTableValue(int row, const QString &value_str) {
    QTableWidgetItem *item_description = new QTableWidgetItem(value_str);
    ui->tag_widget->setItem(row, 2, item_description);
}

void AboutDicomTags::SlotcellClicked( qint32 row,  qint32 col) {
    if(col == 2) {
        QTableWidgetItem *item = ui->tag_widget->item(row, col);
        ui->tag_widget->editItem(item);
    }
}
void AboutDicomTags::on_pushButton_clicked() {
    QFileDialog file_dialog;
    file_dialog.setAcceptMode(QFileDialog::AcceptSave);
    file_dialog.setWindowTitle("保存dcm");
    file_dialog.setViewMode(QFileDialog::Detail);
    file_dialog.setOption(QFileDialog::DontResolveSymlinks);
    file_dialog.setNameFilters(QStringList()
                               << "dcm File (*.dcm)");
    file_dialog.setDefaultSuffix("dcm");
    if (!file_dialog.exec() || file_dialog.selectedFiles().size() == 0) {
        return ;
    }
    QString path = file_dialog.selectedFiles()[0];
    typedef signed short InputPixelType;
    const unsigned int   Dimension = 2;
    typedef itk::Image< InputPixelType, Dimension > InputImageType;
    typedef itk::ImageFileReader< InputImageType > ReaderType;
    ReaderType::Pointer reader = ReaderType::New();
    reader->SetFileName( "input_black.dcm" );
    typedef itk::GDCMImageIO           ImageIOType;
    ImageIOType::Pointer gdcmImageIO = ImageIOType::New();
    reader->SetImageIO( gdcmImageIO );
    reader->Update();
    InputImageType::Pointer inputImage = reader->GetOutput();
    typedef itk::MetaDataDictionary   DictionaryType;
    //
    DictionaryType &dictionary = inputImage->GetMetaDataDictionary();
    for(qint32 i = 0; i < 84; i++) {
        QString entryId = ui->tag_widget->item(i, 0)->text();
        QString value = ui->tag_widget->item(i, 2)->text();
        itk::EncapsulateMetaData<std::string>(
            dictionary, entryId.toStdString(), value.toStdString() );
    }
    typedef itk::ImageFileWriter< InputImageType >  Writer1Type;
    Writer1Type::Pointer writer = Writer1Type::New();
    writer->SetFileName(path.toLocal8Bit().data());
    writer->SetImageIO(gdcmImageIO);
    writer->SetInput(reader->GetOutput());
    writer->Update();
}

```







&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)

本案例代码：
[https://gitee.com/yaoxin001/WorkDemo](https://gitee.com/yaoxin001/WorkDemo)

docsify首页
[http://118.25.63.144/](http://118.25.63.144/)