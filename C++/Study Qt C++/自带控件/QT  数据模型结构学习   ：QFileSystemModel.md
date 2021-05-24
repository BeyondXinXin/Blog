# QT  数据模型结构学习   ：QFileSystemModel

qt自带几个比较方便的数据结构，今天学习  继承自 QAbstractItemModel 的 QFileSystemModel。

QFileSystemModel是一个用于访问本机文件系统的数据模型（还有一个是QDirModel，两者主要区别是使用主线程还是独立线程，建议使用独立线程的QFileSystemModel）。QFileSystemModel配合qt的view可以实现目录的访问。

* **QFileSystemModel**自带目录变化监听
* QModelIndex **setRootPath**(const QString &path); 设置检索根目录
* bool **isDir**(const QModelIndex &index) const; 选中索引是否为目录节点
* QString **filePath**(const QModelIndex &index) const;  选中索引路径
* QString **type**(const QModelIndex &index) const;  选中索引文件类型
* inline QString **fileName**(const QModelIndex &index) const;  选中索引文件名称
* qint64 **size**(const QModelIndex &index) const;  选中索引文件大小

![在这里插入图片描述](https://img-blog.csdnimg.cn/2019121019495522.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)



>  代码取自异步社区  qt5.9开发指南        https://www.epubit.com/bookDetails?id=N25171
treeview、listview、tableview共同传入一个mode。相互之间通过模型索引QModelIndex关联。

```bash
# .pro文件
QT       += core gui
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets
TARGET = samp5_1
TEMPLATE = app
SOURCES += main.cpp\
        mainwindow.cpp
HEADERS  += mainwindow.h
FORMS    += mainwindow.ui
```

```cpp
// main.h
#include "mainwindow.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();

    return a.exec();
}
```

```cpp
// mainwindow.h
#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <QMainWindow>
#include <QFileSystemModel>
namespace Ui {
    class MainWindow;
}
class MainWindow : public QMainWindow {
    Q_OBJECT
  private:
    QFileSystemModel    *model; //定义数据模型变量
  public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();
  private slots:
    void on_treeView_clicked(const QModelIndex &index);
  private:
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H
```

```cpp
// mainwindow.cpp
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow) {
    ui->setupUi(this);
    model = new QFileSystemModel(this); //QFileSystemModel提供单独线程，推荐使用
    model->setRootPath(QDir::currentPath()); //设置根目录
    ui->treeView->setModel(model); //设置数据模型
    ui->listView->setModel(model); //设置数据模型
    ui->tableView->setModel(model); //设置数据模型
    //信号与槽关联，treeView单击时，其目录设置为listView和tableView的根节点
    connect(ui->treeView, SIGNAL(clicked(QModelIndex)),
            ui->listView, SLOT(setRootIndex(QModelIndex)));
    connect(ui->treeView, SIGNAL(clicked(QModelIndex)),
            ui->tableView, SLOT(setRootIndex(QModelIndex)));
}

MainWindow::~MainWindow() {
    delete ui;
}

void MainWindow::on_treeView_clicked(const QModelIndex &index) {
    ui->chkIsDir->setChecked(model->isDir(index));
    ui->LabPath->setText(model->filePath(index));
    ui->LabType->setText(model->type(index));
    ui->LabFileName->setText(model->fileName(index));
    qint64 sz =  model->size(index) / 1024;
    if (sz < 1024) {
        ui->LabFileSize->setText(QString("%1 KB").arg(sz));
    } else {
        ui->LabFileSize->setText(QString::asprintf("%.1f MB", sz / 1024.0));
    }
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191210195355971.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
```cpp
//  mainwindow.ui

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QButtonGroup>
#include <QtWidgets/QCheckBox>
#include <QtWidgets/QGroupBox>
#include <QtWidgets/QHBoxLayout>
#include <QtWidgets/QHeaderView>
#include <QtWidgets/QLabel>
#include <QtWidgets/QListView>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QSplitter>
#include <QtWidgets/QTableView>
#include <QtWidgets/QTreeView>
#include <QtWidgets/QVBoxLayout>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QWidget *centralWidget;
    QVBoxLayout *verticalLayout_5;
    QSplitter *splitterMain;
    QGroupBox *groupBox_3;
    QVBoxLayout *verticalLayout_3;
    QTreeView *treeView;
    QSplitter *splitter;
    QGroupBox *groupBox;
    QVBoxLayout *verticalLayout;
    QListView *listView;
    QGroupBox *groupBox_2;
    QVBoxLayout *verticalLayout_2;
    QTableView *tableView;
    QGroupBox *groupBox_4;
    QVBoxLayout *verticalLayout_4;
    QHBoxLayout *horizontalLayout;
    QLabel *LabFileName;
    QLabel *LabFileSize;
    QLabel *LabType;
    QCheckBox *chkIsDir;
    QLabel *LabPath;
    QMenuBar *menuBar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QStringLiteral("MainWindow"));
        MainWindow->resize(900, 559);
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QStringLiteral("centralWidget"));
        verticalLayout_5 = new QVBoxLayout(centralWidget);
        verticalLayout_5->setSpacing(3);
        verticalLayout_5->setContentsMargins(11, 11, 11, 11);
        verticalLayout_5->setObjectName(QStringLiteral("verticalLayout_5"));
        verticalLayout_5->setContentsMargins(3, 3, 3, 3);
        splitterMain = new QSplitter(centralWidget);
        splitterMain->setObjectName(QStringLiteral("splitterMain"));
        splitterMain->setOrientation(Qt::Horizontal);
        groupBox_3 = new QGroupBox(splitterMain);
        groupBox_3->setObjectName(QStringLiteral("groupBox_3"));
        verticalLayout_3 = new QVBoxLayout(groupBox_3);
        verticalLayout_3->setSpacing(4);
        verticalLayout_3->setContentsMargins(11, 11, 11, 11);
        verticalLayout_3->setObjectName(QStringLiteral("verticalLayout_3"));
        verticalLayout_3->setContentsMargins(4, 4, 4, 4);
        treeView = new QTreeView(groupBox_3);
        treeView->setObjectName(QStringLiteral("treeView"));

        verticalLayout_3->addWidget(treeView);

        splitterMain->addWidget(groupBox_3);
        splitter = new QSplitter(splitterMain);
        splitter->setObjectName(QStringLiteral("splitter"));
        splitter->setOrientation(Qt::Vertical);
        groupBox = new QGroupBox(splitter);
        groupBox->setObjectName(QStringLiteral("groupBox"));
        verticalLayout = new QVBoxLayout(groupBox);
        verticalLayout->setSpacing(4);
        verticalLayout->setContentsMargins(11, 11, 11, 11);
        verticalLayout->setObjectName(QStringLiteral("verticalLayout"));
        verticalLayout->setContentsMargins(4, 4, 4, 4);
        listView = new QListView(groupBox);
        listView->setObjectName(QStringLiteral("listView"));

        verticalLayout->addWidget(listView);

        splitter->addWidget(groupBox);
        groupBox_2 = new QGroupBox(splitter);
        groupBox_2->setObjectName(QStringLiteral("groupBox_2"));
        verticalLayout_2 = new QVBoxLayout(groupBox_2);
        verticalLayout_2->setSpacing(3);
        verticalLayout_2->setContentsMargins(11, 11, 11, 11);
        verticalLayout_2->setObjectName(QStringLiteral("verticalLayout_2"));
        verticalLayout_2->setContentsMargins(4, 4, 4, 4);
        tableView = new QTableView(groupBox_2);
        tableView->setObjectName(QStringLiteral("tableView"));

        verticalLayout_2->addWidget(tableView);

        splitter->addWidget(groupBox_2);
        splitterMain->addWidget(splitter);

        verticalLayout_5->addWidget(splitterMain);

        groupBox_4 = new QGroupBox(centralWidget);
        groupBox_4->setObjectName(QStringLiteral("groupBox_4"));
        groupBox_4->setMaximumSize(QSize(16777215, 100));
        verticalLayout_4 = new QVBoxLayout(groupBox_4);
        verticalLayout_4->setSpacing(6);
        verticalLayout_4->setContentsMargins(11, 11, 11, 11);
        verticalLayout_4->setObjectName(QStringLiteral("verticalLayout_4"));
        horizontalLayout = new QHBoxLayout();
        horizontalLayout->setSpacing(6);
        horizontalLayout->setObjectName(QStringLiteral("horizontalLayout"));
        LabFileName = new QLabel(groupBox_4);
        LabFileName->setObjectName(QStringLiteral("LabFileName"));

        horizontalLayout->addWidget(LabFileName);

        LabFileSize = new QLabel(groupBox_4);
        LabFileSize->setObjectName(QStringLiteral("LabFileSize"));

        horizontalLayout->addWidget(LabFileSize);

        LabType = new QLabel(groupBox_4);
        LabType->setObjectName(QStringLiteral("LabType"));

        horizontalLayout->addWidget(LabType);

        chkIsDir = new QCheckBox(groupBox_4);
        chkIsDir->setObjectName(QStringLiteral("chkIsDir"));

        horizontalLayout->addWidget(chkIsDir);


        verticalLayout_4->addLayout(horizontalLayout);

        LabPath = new QLabel(groupBox_4);
        LabPath->setObjectName(QStringLiteral("LabPath"));

        verticalLayout_4->addWidget(LabPath);


        verticalLayout_5->addWidget(groupBox_4);

        MainWindow->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainWindow);
        menuBar->setObjectName(QStringLiteral("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 900, 23));
        MainWindow->setMenuBar(menuBar);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QApplication::translate("MainWindow", "\346\226\207\344\273\266\347\263\273\347\273\237Model/View", Q_NULLPTR));
        groupBox_3->setTitle(QApplication::translate("MainWindow", "TreeView", Q_NULLPTR));
        groupBox->setTitle(QApplication::translate("MainWindow", "ListView", Q_NULLPTR));
        groupBox_2->setTitle(QApplication::translate("MainWindow", "TableView", Q_NULLPTR));
        groupBox_4->setTitle(QString());
        LabFileName->setText(QApplication::translate("MainWindow", "\346\226\207\344\273\266\345\220\215\357\274\232", Q_NULLPTR));
        LabFileSize->setText(QApplication::translate("MainWindow", "\346\226\207\344\273\266\345\244\247\345\260\217\357\274\232", Q_NULLPTR));
        LabType->setText(QApplication::translate("MainWindow", "\350\212\202\347\202\271\347\261\273\345\236\213\357\274\232", Q_NULLPTR));
        chkIsDir->setText(QApplication::translate("MainWindow", "\350\212\202\347\202\271\346\230\257\347\233\256\345\275\225", Q_NULLPTR));
        LabPath->setText(QApplication::translate("MainWindow", "\350\267\257\345\276\204\345\220\215\357\274\232", Q_NULLPTR));
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
```
