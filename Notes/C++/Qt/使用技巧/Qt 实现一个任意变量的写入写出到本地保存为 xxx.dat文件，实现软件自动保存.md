# Qt 实现一个任意变量的写入写出到本地保存为 xxx.dat文件，实现软件自动保存

##### 需求：
&emsp;&emsp;程序需要做到自动保存。把每一步骤的变量直接写在本地，下一步用的时候再读取。

##### 实现：
&emsp;&emsp;**DatUtil**类实现保存和读取本地文件。
```cpp
class DatUtil: public QObject {
    Q_OBJECT
  public:
    static bool SaveDatFile(const QVariant &dat, const QString &file_name);
    static bool ReadDatFile(QVariant &dat, const QString &file_name);
};
```

```cpp
/**
 * @brief DatUtil::SaveDatFile 本地保存dat
 * @param dat
 * @param file_name
 * @return
 */
bool DatUtil::SaveDatFile(const QVariant &dat, const QString &file_name) {
    QFile file(file_name);
    bool is_ok = file.open(QIODevice::WriteOnly | QIODevice::Truncate);
    if (is_ok == true ) {
        QDataStream stream(&file);
        stream << dat;
        file.close();
        return true;
    }
    return false;
}

/**
 * @brief DatUtil::ReadDatFile 本地读取dat
 * @param dat
 * @param file_name
 * @return
 */
bool DatUtil::ReadDatFile(QVariant &dat, const QString &file_name) {
    dat.clear();
    if(FileUtil::FileIsExist(file_name)) {
        QFile file (file_name);
        bool isOk = file.open(QIODevice::ReadOnly);
        if (isOk == true ) {
            QDataStream stream(&file);
            stream >> dat;
            file.close();
            return true;
        }
        return false;
    }
    return false;
}
```

```cpp
bool FileUtil::FileIsExist(const QString &strFile) {
    QFile tempFile(strFile);
    return tempFile.exists();
}
```

##### 使用：
- **读写PointF**

```cpp
   QList<QPointF> lists；
   QVariant dat = lists.at(i);
   DatUtil::SaveDatFile(dat, filenames_.at(i) + "AIFpoints.dat");
```

```cpp
    qint32 temp1 = 256, temp2 = 256;
    QVariant dat;
    if(DatUtil::ReadDatFile(dat, svd_point_file_name)) {
        temp1 = qint32(dat.toPointF().x());
        temp2 = qint32(dat.toPointF().y());
    }
```
- **读写QStringList**

```cpp
   QString path_floor = "./session/" + GlobalVar::current_sessing_.GetSessionFileName()
                     + "/DicomData/path_floor.dat";
   QVariant dat = script_dcm_sort_->Get_path_lists_();
   DatUtil::SaveDatFile(dat, path_floor);
```

```cpp
   QStringList path_list;
    QString select_floor = "./session/" + GlobalVar::current_sessing_.GetSessionFileName()
                           + "/DicomData/select_floor.dat";
    QVariant dat;
    if(DatUtil::ReadDatFile(dat, select_floor)) {
        foreach (auto var, dat.toStringList()) {
            QString svd_files_name = "./session/"
                                     + GlobalVar::current_sessing_.GetSessionFileName()
                                     + "/DicomData/" +  var + "/";
            path_list << svd_files_name;
        }
    }
```






