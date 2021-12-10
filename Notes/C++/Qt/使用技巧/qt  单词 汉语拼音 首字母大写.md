# qt  单词 汉语拼音 首字母大写
有时候会遇到 姓名等专有名词全部小写，用空格分开。而希望显示首字母大写

```cpp
QString ChineseLetterHelper::GetFirstUpper(const QString &src) {
    QStringList temp_list = src.split(" ");
    QString name_str;
    for(qint32 i = 0; i < temp_list.count(); i++) {
        name_str += temp_list.at(i)
                    .left(1).toUpper() +
                    temp_list.at(i)
                    .mid(1, temp_list.at(i).length() - 1).toLower();
        name_str += " ";
    }
    return  name_str;
}
```
