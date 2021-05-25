# Qt自定义属性 绑定 QMenu实现菜单栏快速设置属性

&emsp;&emsp;**Q_PROPERTY**主要是给脚本和元对象系统用的，如果你不用**qml**、**ActiveQt**  、**property/setProperty**等的话其实他也用不到。这里提供一个快速绑定**PROPERTY**和**QMenu**的方法。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200831172556987.gif#pic_center)
&emsp;&emsp;自定义一个**QTextEdit**，给他添加几个属性。让后绑定原对象属性数量到**QMenu**。如果只需要绑定部分搞一个**QStringList**记录不需要的。**QMenu**绑定**aboutToShow**和**triggered**。

```cpp
// 初始化 菜单栏
    QStringList blacklist;
    blacklist << "Property6" ;
    const QMetaObject *mo = edit_->metaObject();
    for (int i = mo->superClass()->propertyCount(),
            count = mo->propertyCount();
            i < count; ++i) {
        QMetaProperty const &prop = mo->property(i);
        if (prop.userType() == QMetaType::UnknownType ||
                !prop.isReadable() ||
                !prop.isWritable() ||
                blacklist.contains(prop.name())) {
            continue;
        }
        ui->menu_properties->addAction(QString())->setData(i);
    }
    connect(ui->menu_properties, &QMenu::aboutToShow,
            this, &MainWindow::Slot_UpdatePropertyMenu);
    connect(ui->menu_properties, &QMenu::triggered,
            this, &MainWindow::Slot_PropertyMenuTriggered);
```

```cpp
//-----------------------------------------------------
/**
 * @brief MainWindow::Slot_UpdatePropertyMenu
 * 属相菜单显示更新
 */
void MainWindow::Slot_UpdatePropertyMenu() {
    const QMetaObject *mo = edit_->metaObject();
    for (QAction *a : ui->menu_properties->actions()) {
        QMetaProperty const &prop = mo->property(a->data().toInt());
        QString const &name = prop.name();
        int type = prop.userType();
        QVariant const &value = prop.read(edit_);
        QString const &displayName =
            QString("%1 = %2").arg(name, prop.read(edit_).toString());
        a->setText(displayName);
        switch (type) {
            case QMetaType::Bool:
                a->setCheckable(true);
                a->setChecked(value.toBool());
                break;
            default:
                break;
        }
    }
}

//-----------------------------------------------------
/**
 * @brief MainWindow::Slot_PropertyMenuTriggered
 * 属相菜单按下事件
 * @param action
 */
void MainWindow::Slot_PropertyMenuTriggered(QAction *action) {
    const QMetaObject *mo = edit_->metaObject();
    QMetaProperty const &prop = mo->property(action->data().toInt());
    switch (prop.userType()) {
        case QMetaType::Bool:
            prop.write(edit_, action->isChecked());
            break;
        default:
            ValueEditDialog ved(this);
            ved.setValue(prop.name(), prop.read(edit_));
            if (ved.exec() == QDialog::Accepted) {
                prop.write(edit_, ved.getValue());
            }
            break;
    }
}
```

&emsp;&emsp;完整代码，两个ui
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200831173033877.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200831173101254.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

```cpp
#include "valueeditdialog.h"
#include "ui_valueeditdialog.h"

//-----------------------------------------------------
ValueEditDialog::ValueEditDialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::ValueEditDialog) {
    ui->setupUi(this);
    ui->int_spin_box->setRange(
        std::numeric_limits<int>::min(), std::numeric_limits<int>::max());
}

//-----------------------------------------------------
ValueEditDialog::~ValueEditDialog() {
    delete ui;
}

//-----------------------------------------------------
void ValueEditDialog::setValue(QString const &name, const QVariant &val) {
    ui->name->setText(name);
    value_ = val;
    switch (val.userType()) {
        case QMetaType::Int:
            ui->int_spin_box->setValue(val.toInt());
            ui->stackedWidget->setCurrentWidget(ui->int_page);
            break;
        default:
            ui->line_edit->setText(val.toString());
            ui->stackedWidget->setCurrentWidget(ui->unknown_page);
            break;
    }
}

//-----------------------------------------------------
const QVariant &ValueEditDialog::getValue() {
    switch (value_.userType()) {
        case QMetaType::Int:
            value_ = ui->int_spin_box->value();
            break;
        default:
            value_ = ui->line_edit->text();
            break;
    }
    return value_;
}

```

```cpp
#ifndef VALUEEDITDIALOG_H
#define VALUEEDITDIALOG_H

#include <QDialog>
#include <QVariant>


namespace Ui {
    class ValueEditDialog;
}

class ValueEditDialog : public QDialog {
    Q_OBJECT

  public:
    explicit ValueEditDialog(QWidget *parent = nullptr);
    ~ValueEditDialog();
  public:
    void setValue(QString const &name, QVariant const &val);
    QVariant const &getValue();
  private:
    Ui::ValueEditDialog *ui;
    QVariant value_;

};

#endif // VALUEEDITDIALOG_H

```

```cpp
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QTextEdit>
#include <QPointer>

namespace Ui {
    class MainWindow;
}

class PropertyTextEdit : public QTextEdit {
    Q_OBJECT
  public:
    using QTextEdit::QTextEdit;
    PropertyTextEdit(QWidget *parent = nullptr);
    ~PropertyTextEdit();

    Q_PROPERTY(int Property1 READ getProperty1 WRITE SetProperty1)
    int getProperty1() const {
        return this->property1_;
    }
    void SetProperty1(const int &value) {
        this->property1_ = value;
        this->UpdataProperyShow();
    }

    Q_PROPERTY(bool Property2 READ IsProperty2 WRITE SetProperty2)
    bool IsProperty2() const {
        return this->property2_;
    }
    void SetProperty2(const bool &value) {
        this->property2_ = value;
        this->UpdataProperyShow();
    }

    Q_PROPERTY(int Property3 READ getProperty3 WRITE SetProperty3)
    int getProperty3() const {
        return this->property3_;
    }
    void SetProperty3(const int &value) {
        this->property3_ = value;
        this->UpdataProperyShow();
    }


    Q_PROPERTY(int Property4 READ getProperty4 WRITE SetProperty4)
    int getProperty4() const {
        return this->property4_;
    }
    void SetProperty4(const int &value) {
        this->property4_ = value;
        this->UpdataProperyShow();
    }

    Q_PROPERTY(bool Property5 READ IsProperty5 WRITE SetProperty5)
    bool IsProperty5() const {
        return this->property5_;
    }
    void SetProperty5(const bool &value) {
        this->property5_ = value;
        this->UpdataProperyShow();
        if(value) {
        }
    }

    Q_PROPERTY(QString Property6 READ getProperty6 WRITE SetProperty6)
    QString getProperty6() const {
        return this->property6_;
    }
    void SetProperty6(const QString &value) {
        this->property6_ = value;
        this->UpdataProperyShow();
    }

    Q_PROPERTY(QString Property7 READ getProperty7 WRITE SetProperty7)
    QString getProperty7() const {
        return this->property7_;
    }
    void SetProperty7(const QString &value) {
        this->property7_ = value;
        this->UpdataProperyShow();
    }


  private Q_SLOTS:
    void UpdataProperyShow();
  private:
    int property1_ = 10;
    bool property2_ = false;
    int property3_ = 20;
    int property4_ = 60;
    bool property5_ = true;
    QString property6_ = "PropertyTextEdit";
    QString property7_ = "PropertyTextEdit";
};

class MainWindow : public QMainWindow {
    Q_OBJECT

  public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

  private Q_SLOTS:
    void Slot_UpdatePropertyMenu();
    void Slot_PropertyMenuTriggered(QAction *action);
  private:
    Ui::MainWindow *ui;
  private:
    QPointer<PropertyTextEdit> edit_;


};

#endif // MAINWINDOW_H

```

```cpp
#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QMetaProperty>
#include <QDebug>
#include "valueeditdialog.h"

//-----------------------------------------------------
PropertyTextEdit::PropertyTextEdit(QWidget *parent) {
    this->setParent(parent);
    //
    this->setReadOnly(true);
    this->UpdataProperyShow();
}

//-----------------------------------------------------
PropertyTextEdit::~PropertyTextEdit() {
}

//-----------------------------------------------------
/**
 * @brief PropertyTextEdit::UpdataProperyShow
 * 界面刷新
 */
void PropertyTextEdit::UpdataProperyShow() {
    this->clear();
    const QMetaObject *mo = this->metaObject();
    for (int i = mo->superClass()->propertyCount(),
            count = mo->propertyCount();
            i < count; ++i) {
        QMetaProperty const &prop = mo->property(i);
        QString const &name = prop.name();
        QString const &displayName =
            QString("%1 = %2").arg(name, prop.read(this).toString());
        this->append(displayName);
    }
}


//-----------------------------------------------------
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow) {
    ui->setupUi(this);
    // 初始化 PropertyTextEdit
    edit_ = new PropertyTextEdit(this);
    this->setCentralWidget(edit_);
    // 初始化 菜单栏
    QStringList blacklist;
    blacklist << "Property6" ;
    const QMetaObject *mo = edit_->metaObject();
    for (int i = mo->superClass()->propertyCount(),
            count = mo->propertyCount();
            i < count; ++i) {
        QMetaProperty const &prop = mo->property(i);
        if (prop.userType() == QMetaType::UnknownType ||
                !prop.isReadable() ||
                !prop.isWritable() ||
                blacklist.contains(prop.name())) {
            continue;
        }
        ui->menu_properties->addAction(QString())->setData(i);
    }
    connect(ui->menu_properties, &QMenu::aboutToShow,
            this, &MainWindow::Slot_UpdatePropertyMenu);
    connect(ui->menu_properties, &QMenu::triggered,
            this, &MainWindow::Slot_PropertyMenuTriggered);
}

//-----------------------------------------------------
MainWindow::~MainWindow() {
    delete ui;
}

//-----------------------------------------------------
/**
 * @brief MainWindow::Slot_UpdatePropertyMenu
 * 属相菜单显示更新
 */
void MainWindow::Slot_UpdatePropertyMenu() {
    const QMetaObject *mo = edit_->metaObject();
    for (QAction *a : ui->menu_properties->actions()) {
        QMetaProperty const &prop = mo->property(a->data().toInt());
        QString const &name = prop.name();
        int type = prop.userType();
        QVariant const &value = prop.read(edit_);
        QString const &displayName =
            QString("%1 = %2").arg(name, prop.read(edit_).toString());
        a->setText(displayName);
        switch (type) {
            case QMetaType::Bool:
                a->setCheckable(true);
                a->setChecked(value.toBool());
                break;
            default:
                break;
        }
    }
}

//-----------------------------------------------------
/**
 * @brief MainWindow::Slot_PropertyMenuTriggered
 * 属相菜单按下事件
 * @param action
 */
void MainWindow::Slot_PropertyMenuTriggered(QAction *action) {
    const QMetaObject *mo = edit_->metaObject();
    QMetaProperty const &prop = mo->property(action->data().toInt());
    switch (prop.userType()) {
        case QMetaType::Bool:
            prop.write(edit_, action->isChecked());
            break;
        default:
            ValueEditDialog ved(this);
            ved.setValue(prop.name(), prop.read(edit_));
            if (ved.exec() == QDialog::Accepted) {
                prop.write(edit_, ved.getValue());
            }
            break;
    }
}
























```
