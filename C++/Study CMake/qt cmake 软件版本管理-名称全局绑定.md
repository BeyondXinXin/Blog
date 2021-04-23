说白了其实就是建一个头文件专门存放软件的版本和名称，用的时候全局调用


**CMakeLIst.tst**里需要写

```bash
project(OpenBrowser VERSION "0.5.0")
configure_file(
    "${PROJECT_SOURCE_DIR}/DeeplvConfig.h.in"
    "${PROJECT_SOURCE_DIR}/Source/01Business/DeeplvConfig.h"
)
# configure_file作用就是拷贝文件
```
目录里新建**DeeplvConfig.h.in**

```cpp
#ifndef INCLUDE_GUARD
#define INCLUDE_GUARD

#define OpenBrowser_NAME "OpenBrowser"
#define OpenBrowser_VER  "@OpenBrowser_VERSION@"
#define OpenBrowser_YEARS "2020"
#define OpenBrowser_VER_MAJOR "@OpenBrowser_VERSION_MAJOR@"
#define OpenBrowser_VER_MINOR "@OpenBrowser_VERSION_MINOR@"
#define OpenBrowser_VER_PATCH "@OpenBrowser_VERSION_PATCH@"

#endif // INCLUDE_GUARD
```
这样在执行cmake的时候，会自动在程序源码目录下自动新建一个**DeeplvConfig.h**，程序里只要调用这个就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301104150869.png#pic_center)

Qt label/button等 控件调用方法
```cpp
  ui->label->setText(QString::fromStdString(OpenBrowser_NAME) + " V" 
						+ QString::fromStdString(OpenBrowser_VER));
  ui->label->setText(ui->label->text()
                       .arg(QString::fromStdString(OpenBrowser_NAME) + " V")
                       .arg(QString::fromStdString(OpenBrowser_VER)));
```
Qt QTreeWidget/QTabWidget等 控件调用方法
```cpp
	QStringList strlist1 = {"产品型号", QString::fromStdString(OpenBrowser_NAME)};
    QTreeWidgetItem *item1 = new QTreeWidgetItem(strlist1);
    ui->software_tree->addTopLevelItem(item1);

	QTreeWidgetItem *tmp_item = ui->software_tree->topLevelItem(1);
    tmp_item->setText(1, QString::fromStdString(OpenBrowser_NAME));
    tmp_item = ui->software_tree->topLevelItem(2);
    tmp_item->setText(1, tmp_item->text(1).arg(QString::fromStdString(OpenBrowser_VER)));
```
Qt QtableWidget等 控件调用方法
```cpp
	ui->tab_widget->setTabText(0, QString::fromStdString(OpenBrowser_NAME));
```
