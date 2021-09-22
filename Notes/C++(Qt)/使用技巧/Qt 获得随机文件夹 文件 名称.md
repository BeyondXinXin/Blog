# Qt 获得随机文件夹 文件 名称

```cpp
QString GetRandString(const quint32 len, const QString &char_set) {
    QString result("");
    QTime t = QTime::currentTime();
    qsrand(static_cast<quint32>(t.msec() + t.second() * 1000));
    for (quint32 i = 0; i < len; i++) {
        qint32 ir = qrand() % char_set.length();
        result[i] = char_set.at(ir);
    }
    return result;
}
```
