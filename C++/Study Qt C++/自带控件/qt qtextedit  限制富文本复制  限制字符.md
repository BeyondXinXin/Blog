# qt qtextedit  限制富文本复制  限制字符

qtextedit 支持很多，比如富文本等。但有时候只要想普通字符，并且限制字符数量。


```cpp
	ui->description_edit->setFixedHeight(80);
	ui->description_edit->setAcceptRichText(false);
    connect(ui->description_edit, &QTextEdit::textChanged, this, [ = ] {
        QString textContent = ui->description_edit->toPlainText();
        qint32 length = textContent.count();
        qint32 maxLength = 80; // 最大字符数
        if(length > maxLength) {
            int position = ui->description_edit->textCursor().position();
            QTextCursor textCursor = ui->description_edit->textCursor();
            textContent.remove(position - (length - maxLength), length - maxLength);
            ui->description_edit->setText(textContent);
            textCursor.setPosition(position - (length - maxLength));
            ui->description_edit->setTextCursor(textCursor);
        }
    });
```
