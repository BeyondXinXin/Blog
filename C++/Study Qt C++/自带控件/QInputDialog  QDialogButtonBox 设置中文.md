# QInputDialog  QDialogButtonBox 弹窗按钮设置中文

&emsp;&emsp;`Qt`默认弹窗都是英文，需要自己手动修改下才能改为中文。

> 用`qt5_create_translation`的话，直接修改`.ts`文件。


## QInputDialog

&emsp;&emsp;修改前
```cpp
     QString dlgTitle = "系统设置登录";
     QString txtLabel = "请输入管理员密码";
     QString defaultInput = "******";
     QLineEdit::EchoMode echoMode = QLineEdit::Password;
     bool ok = false;
     QString text = QInputDialog::getText(
                    this, dlgTitle, txtLabel, echoMode, defaultInput, &ok);
     if (ok && !text.isEmpty()) {
     }
```
&emsp;&emsp;修改后
```cpp
     QString dlgTitle = "系统设置登录";
     QString txtLabel = "请输入管理员密码";
     QString defaultInput = "******";
     QLineEdit::EchoMode echoMode = QLineEdit::Password;
     bool ok = false;
     QInputDialog *input_dialog = new QInputDialog(this);
     input_dialog->setOkButtonText("确定");
     input_dialog->setCancelButtonText("取消");
     input_dialog->setWindowTitle(dlgTitle);
     input_dialog->setTextValue(defaultInput);
     input_dialog->setTextEchoMode(echoMode);
     input_dialog->setLabelText(txtLabel);
     QString text;
     if(QDialog::Accepted == input_dialog->exec()) {
     ok = true;
     text = input_dialog->textValue();
     } else {
     ok = false;
     }
     if (ok) {
     }

```



## QDialogButtonBox
&emsp;&emsp;修改前（ui_XXX.h）
```cpp
        buttonBox = new QDialogButtonBox(ReportCustomDialog);
        buttonBox->setObjectName(QStringLiteral("buttonBox"));
        buttonBox->setMinimumSize(QSize(150, 40));
        buttonBox->setMaximumSize(QSize(150, 40));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::Discard|QDialogButtonBox::Ok);
        buttonBox->setCenterButtons(false);
```

&emsp;&emsp;修改后

```cpp
        buttonBox = new QDialogButtonBox(ReportCustomDialog);
        buttonBox->setObjectName(QStringLiteral("buttonBox"));
        buttonBox->setMinimumSize(QSize(150, 40));
        buttonBox->setMaximumSize(QSize(150, 40));
        buttonBox->setOrientation(Qt::Horizontal);
        buttonBox->setStandardButtons(QDialogButtonBox::NoButton);
        buttonBox->setCenterButtons(false);
```

```cpp
    ui->buttonBox->addButton("确认", QDialogButtonBox::AcceptRole);
    ui->buttonBox->addButton("取消", QDialogButtonBox::RejectRole);
```