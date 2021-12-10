# qt  自定义 菜单栏 快捷方式

想做一个类似海康mvs软件抬头这样的效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190923181646821.png)

自己画的结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190923181511534.png)
实现方式其实挺简单,就是自己重构一个菜单栏和快捷方式栏
新建myMenu类继承QMenuBar	
自定义QStatusBar
myMenu里传入显示widget,新建的菜单选项绑定到传入父widget	
QStatusBar也一样
详细代码如下
最下边注释的是状态栏,有需要可以添加
**需要把frmtcpclient.h换成自己的mainwidget,命名是去年刚学习时候写的,惨不忍睹**
**串口网口用的刘典武大神现成的,需要的话自己去找下http://www.qtcn.org/bbs/u.php?uid=110085**



做出类似海康那个效果还需要对照着画个ui,layout_titlemenu就是下图中那个红色的框,中间可以在加一个直线

```javascript
    this->my_menu_ = new myMenu(this, this);
    ui->layout_titlemenu->addWidget(my_menu_);
    ui->layout_titlemenu->addWidget(my_menu_->I_ToolBar);
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190923183055372.png)

```javascript
#ifndef MYSCROLLAREA_H
#define MYSCROLLAREA_H

// 01frame includes
#include "app.h"

// 02control includes
#include "frmtcpclient.h"
#include "settingsdialog.h"
#include "frmtcpserver.h"
#include "frmudpserver.h"


class FormTitle;

class myMenu : public QMenuBar {
    Q_OBJECT
  public:
    myMenu(QWidget *parent, FormTitle *p);
    ~myMenu();
    QToolBar *I_ToolBar;

  public slots :

    // 界面目录
    void File_open();		// 打开
    void File_save();		// 保存
    void File_open_database();		// 另存为
    void Help_info();		// 帮助
    void About_info();//关于
    void Act_edit_screenshot();//截图
    void qappclose();//退出
    void qappfullScreen();//全屏
    void qappmaxScreen();//退出全屏
    void qappNet();//打开网络
    void qappCom();//打开串口

  private:
    FormTitle *I_MainWindow;

    QStatusBar *T_StatusBa;
    QString currentPath;	// 当前图像路径
    frmTcpClient *I_frmTcpClient;
    frmTcpServer *I_frmTcpServer;
    frmUdpServer *I_frmUdpServer;
    QSerialPort *m_serialPort; //串口类
    SettingsDialog *com_Settings;

    void initT_ToolBar();
    void Menu_File();		// 文件菜单
    void Menu_Edit();		// 编辑菜单
    void Menu_Help();		   // 帮助菜单

};


#endif // MYSCROLLAREA_H
```

```javascript
// 01frame includes
#include "myMenu.h"

// 02control includes
#include "screenwidget.h"

// 04ui includes
#include "formtitle.h"

myMenu::myMenu(QWidget *parent, FormTitle *p)
    : QMenuBar(parent) {
    I_MainWindow = static_cast<FormTitle *>(p) ;
    initT_ToolBar();
    Menu_File();
    Menu_Edit();
    Menu_Help();
    I_frmTcpClient = new frmTcpClient();
    I_frmTcpServer = new frmTcpServer();
    I_frmUdpServer = new frmUdpServer();
    com_Settings  = new SettingsDialog();

    this->setFixedWidth(200);
    QStringList qss;
    qss.append(QString("QMenuBar"
                       "{background:transparent;"
                       "border: 0px solid gray;}"));
    qss.append(QString("QMenuBar::item"
                       "{background:transparent;"
                       "border: 0px solid gray;}"));
    qss.append(QString("QMenuBar::item::selected"
                       "{background-color: rgb(65, 65, 69);}"));
    this->setStyleSheet(qss.join(""));
}
myMenu::~myMenu() {
}
//文件菜单
void myMenu::Menu_File() {
    QAction *Act_file_new = new QAction(QIcon(":/Image/file/New.png"),
                                        tr("新建"), this);
    Act_file_new->setShortcut(Qt::Key_Control & Qt::Key_I);
    Act_file_new->setStatusTip(tr("新建"));

    QAction *Act_file_open = new QAction(QIcon(":/Image/file/Open.png"),
                                         tr("打开"), this);
    Act_file_open->setShortcuts(QKeySequence::Open);
    Act_file_open->setStatusTip(tr("打开"));
    connect(Act_file_open, SIGNAL(triggered()),
            I_MainWindow, SIGNAL(SingalOpenFileOut()));

    QAction *Act_file_save = new QAction(QIcon(":/Image/file/Save.png"),
                                         tr("保存"), this);
    Act_file_save->setShortcuts(QKeySequence::Save);
    Act_file_save->setStatusTip(tr("保存"));
    connect(Act_file_save, SIGNAL(triggered()),
            I_MainWindow, SIGNAL(SingalSaveFileOut()));

    QAction *Act_file_saveas = new QAction(QIcon(":/Image/file/SaveAs.png"),
                                           tr("另存为"), this);
    Act_file_new->setShortcut(Qt::Key_Control & Qt::Key_D);
    Act_file_saveas->setStatusTip(tr("另存为"));
    connect(Act_file_saveas, SIGNAL(triggered()), this, SLOT(File_open_database()));


    QAction *Act_file_close = new QAction(QIcon(":/Image/file/Close.png"),
                                          tr("关闭"), this);
    Act_file_close->setShortcuts(QKeySequence::Close);
    Act_file_close->setStatusTip(tr("关闭软件"));



    QMenu *file = addMenu(tr("文件"));
    file->addAction(Act_file_new);
    file->addAction(Act_file_open);
    file->addAction(Act_file_save);
    file->addAction(Act_file_saveas);
    file->addSeparator();						//添加一个分割器
    file->addAction(Act_file_close);

    I_ToolBar->addAction(Act_file_open);
    I_ToolBar->addAction(Act_file_save);

}
//编辑菜单
void myMenu::Menu_Edit() {

    QAction *Act_edit_full = new QAction(QIcon(":/Image/edit/Edit_Full.png"),
                                         tr("全屏显示"), this);
    Act_edit_full->setShortcut(QKeySequence(Qt::CTRL + Qt::Key_F));
    Act_edit_full->setStatusTip(tr("全屏显示"));
    connect(Act_edit_full, SIGNAL(triggered()), this, SLOT(qappfullScreen()));

    QAction *Act_edit_back = new QAction(QIcon(":/Image/edit/Edit_Max.png"),
                                         tr("退出全屏"), this);
    Act_edit_back->setShortcut(QKeySequence(Qt::Key_Escape));
    connect(Act_edit_back, SIGNAL(triggered()), this, SLOT(qappmaxScreen()));
    Act_edit_back->setStatusTip(tr("退出全屏"));

    QAction *Act_edit_screenshot = new QAction(QIcon(":/Image/btndo2.png"),
            tr("截图"), this);
    Act_edit_screenshot->setShortcut(QKeySequence(Qt::CTRL + Qt::Key_A));
    connect(Act_edit_screenshot, SIGNAL(triggered()), this, SLOT(Act_edit_screenshot()));
    Act_edit_screenshot->setStatusTip(tr("截图"));


    QAction *Act_edit_net1 = new QAction(QIcon(""), tr("打开网络——tcp服务器"), this);
    connect(Act_edit_net1, SIGNAL(triggered()), this, SLOT(qappNet()));
    QAction *Act_edit_net2 = new QAction(QIcon(""), tr("打开网络——tcp客户端"), this);
    connect(Act_edit_net2, SIGNAL(triggered()), this, SLOT(qappNet()));
    QAction *Act_edit_net3 = new QAction(QIcon(""), tr("打开网络——udp客户端"), this);
    connect(Act_edit_net3, SIGNAL(triggered()), this, SLOT(qappNet()));
    Act_edit_net1->setObjectName("Act_edit_net1");
    Act_edit_net2->setObjectName("Act_edit_net2");
    Act_edit_net3->setObjectName("Act_edit_net3");
    Act_edit_net1->setStatusTip(tr("打开网络——tcp服务器"));
    Act_edit_net2->setStatusTip(tr("打开网络——tcp客户端"));
    Act_edit_net3->setStatusTip(tr("打开网络——udp客户端"));


    QAction *Act_edit_com = new QAction(QIcon(""), tr("打开端口"), this);
    Act_edit_com->setShortcut(QKeySequence(Qt::CTRL + Qt::Key_A));
    connect(Act_edit_com, SIGNAL(triggered()), this, SLOT(qappCom()));
    Act_edit_com->setStatusTip(tr("打开端口"));



    QMenu *Act_edit_net = new QMenu(tr("打开网络"));
    Act_edit_net->addAction(Act_edit_net1);
    Act_edit_net->addAction(Act_edit_net2);
    Act_edit_net->addAction(Act_edit_net3);
    Act_edit_net->setStatusTip(tr("打开网络"));

    QMenu *edit = addMenu(tr("编辑"));
    edit->addAction(Act_edit_full);
    edit->addAction(Act_edit_back);
    edit->addAction(Act_edit_screenshot);
    edit->addSeparator();
    edit->addMenu(Act_edit_net);
    edit->addAction(Act_edit_com);


    I_ToolBar->addAction(Act_edit_screenshot);
    I_ToolBar->insertSeparator(Act_edit_screenshot);
}

//帮助菜单
void myMenu::Menu_Help() {
    QAction *Act_about_info =
        new QAction(QIcon(":/ImageProcessing/Image/help/Help_Info.png"),
                    tr("关于"), this);
    connect(Act_about_info, SIGNAL(triggered()), this, SLOT(About_info()));
    Act_about_info->setStatusTip(tr("关于"));

    QAction *Act_help_info =
        new QAction(QIcon(":/ImageProcessing/Image/help/Help_Info.png"),
                    tr("帮助"), this);
    connect(Act_help_info, SIGNAL(triggered()), this, SLOT(Help_info()));
    Act_help_info->setStatusTip(tr("帮助"));
    Act_help_info->setStatusTip(tr("帮助"));


    QMenu *help = addMenu(tr("帮助"));
    help->addAction(Act_about_info);
    help->addAction(Act_help_info);


}


// -------------------槽函数-------------------------------------------
void myMenu::Act_edit_screenshot() { //截屏
    ScreenWidget::Instance()->showFullScreen();
}
void myMenu::qappclose() { // 退出
    qApp->quit();
}
void myMenu::File_open() {	// 打开图片
    QString path = QFileDialog::getOpenFileName(this,
                   tr("选择图像"), ".",
                   tr("Images(*.jpg *.png *.bmp)"));
    if (path.size() == 0) {
        return;
    }
    QTextCodec *code = QTextCodec::codecForName("GB2312");//解决中文路径问题
    std::string name = code->fromUnicode(path).data();

    QUIHelper::showMessageBoxInfo(QString("打开图片路径:%1").arg(path));
    QUIHelper::showMessageBoxQuestion("图片和数据库无法匹配打开失败");


}
void myMenu::File_save() {		// 保存文件

}
void myMenu::File_open_database() {		// 打开配置文件
    QString path = QFileDialog::getOpenFileName(this,
                   tr("选择图像"), ".",
                   tr("Images(*.ini)"));
    if (path.size() == 0) {
        return;
    }
    QTextCodec *code = QTextCodec::codecForName("GB2312");//解决中文路径问题
    std::string name = code->fromUnicode(path).data();

    QUIHelper::showMessageBoxInfo(QString("打开图片路径:%1").arg(path));
    QUIHelper::showMessageBoxQuestion("图片和数据库无法匹配打开失败");

}
void myMenu::qappfullScreen() { //全屏
    //I_MainWindow->setWindowFlags(Qt::Window);
    I_MainWindow->showFullScreen();
}
void myMenu::qappmaxScreen() { //退出全屏
    //I_MainWindow->setWindowFlags(Qt::SubWindow);
    I_MainWindow->showNormal();
}

void myMenu::qappNet() { //网络
    QString a = sender()->objectName();
    QString b = QUIHelper::getLocalIP();
    if (a == "Act_edit_net1") {
        I_frmTcpClient->setWindowTitle("打开网络——tcp服务器    本机ip:" + b);
        I_frmTcpClient->show();
    } else if (a == "Act_edit_net2") {
        I_frmTcpServer->setWindowTitle("打开网络——tcp客户端    本机ip:" + b);
        I_frmTcpServer->show();
    } else if (a == "Act_edit_net3") {
        I_frmUdpServer->setWindowTitle("打开网络——udp客户端    本机ip:" + b);
        I_frmUdpServer->show();
    }
}

void myMenu::qappCom() { //打开串口
    com_Settings->show();
}

void myMenu::initT_ToolBar() {
    I_ToolBar = new QToolBar(tr("工具栏01")) ;
    Qt::ToolBarArea area;
    area = Qt::LeftToolBarArea;//设置停靠位置
    I_ToolBar -> setMovable(true);

    QStringList qss;
    qss.append(QString("QToolBar"
                       "{spacing: 25px;}"));
    qss.append(QString("QToolButton"
                       "{background:transparent;"
                       "border: 0px solid gray;}"));
    qss.append(QString("QToolButton::hover"
                       "{background-color: rgb(65, 65, 69);}"));
    qss.append(QString("QToolBar::separator"
                       "{background-color: rgb(25, 25, 25);"
                       "width: 1px;height: 5px;}"));
    I_ToolBar->setStyleSheet(qss.join(""));
    I_ToolBar->setFixedWidth(200);
}


// -------------------帮助-------------------------------------------
void myMenu::Help_info() {

}
// -------------------关于-------------------------------------------
void myMenu::About_info() {

}

/*
 * void myMenu::initT_StatusBa() {
    T_StatusBa = new  QStatusBar;
    T_StatusBa->showMessage("欢迎使用！", 10000);
    QLabel *permanent = new QLabel(this);
    permanent->setFrameStyle(QFrame::Box | QFrame::Sunken);
    permanent->setText(
        "<a href=\"http://www.arteryflow.com\">XXXXXX有限公司</a>");
    permanent->setTextFormat(Qt::RichText);
    permanent->setOpenExternalLinks(true);
    T_StatusBa->addPermanentWidget(permanent);
    I_MainWindow->setStatusBar(T_StatusBa);

}*/

```
