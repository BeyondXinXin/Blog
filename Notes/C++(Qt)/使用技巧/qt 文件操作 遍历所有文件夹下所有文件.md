# qt 文件操作 遍历所有文件夹下所有文件

平时经常需要qt实现文件读取，每次都是直接百度需求，这里整理下用过的文件相关操作


**得到文件下所有文件和其路径**
```javascript
bool FindFile(const QString &path);

bool FormConnect::FindFile(const QString &path) {

    QDir dir(path);
    if (!dir.exists()) {
        return false;
    }
    dir.setFilter(QDir::Dirs | QDir::Files);
    dir.setSorting(QDir::DirsFirst);
    QFileInfoList list = dir.entryInfoList();
    int i = 0;
    do {

        QFileInfo fileInfo = list.at(i);
        if (fileInfo.fileName() == "." | fileInfo.fileName() == "..") {
            i++;
            continue;
        }
        bool bisDir = fileInfo.isDir();
        if (bisDir) {
            FindFile(fileInfo.filePath());
        } else {
            blog_file_paths_ << fileInfo.path();
            blog_file_names_ << fileInfo.fileName();
            qDebug() << QString(" %2  %3  ")
                     .arg(fileInfo.path())
                     .arg(fileInfo.fileName());
            nFiles++;
        }
        i++;
    } while (i < list.size());
    return true;
}

```
**获取保存的文件**

```
QString QUIHelper::getSaveName(const QString &filter, QString defaultDir) {
    return QFileDialog::getSaveFileName(0, "选择文件", defaultDir, filter);
}	
```

**获取选择的文件**
```
QString QUIHelper::getFileName(const QString &filter, QString defaultDir) {
    return QFileDialog::getOpenFileName(0, "选择文件", defaultDir, filter);
}
```

**获取选择的文件集合**
```
QStringList QUIHelper::getFileNames(const QString &filter, QString defaultDir) {
    return QFileDialog::getOpenFileNames(0, "选择文件", defaultDir, filter);
}
```

**获取选择的目录**
```
QString QUIHelper::getFolderName() {
    return QFileDialog::getExistingDirectory();
}
```

**获取文件名,含拓展名**
```
QString QUIHelper::getFileNameWithExtension(const QString &strFilePath) {
    QFileInfo fileInfo(strFilePath);
    return fileInfo.fileName();
}

```

**获取选择文件夹中的文件**
```
QStringList QUIHelper::getFolderFileNames(const QStringList &filter) {
    QStringList fileList;
    QString strFolder = QFileDialog::getExistingDirectory();

    if (!strFolder.length() == 0) {
        QDir myFolder(strFolder);

        if (myFolder.exists()) {
            fileList = myFolder.entryList(filter);
        }
    }

    return fileList;
}
```

**文件夹是否存在**
```
bool QUIHelper::folderIsExist(const QString &strFolder) {
    QDir tempFolder(strFolder);
    return tempFolder.exists();
}

```

**文件是否存在**
```
bool QUIHelper::fileIsExist(const QString &strFile) {
    QFile tempFile(strFile);
    return tempFile.exists();
}
```

**复制文件**
```
bool QUIHelper::copyFile(const QString &sourceFile, const QString &targetFile) {
    bool ok;
    ok = QFile::copy(sourceFile, targetFile);
    //将复制过去的文件只读属性取消
    ok = QFile::setPermissions(targetFile, QFile::WriteOwner);
    return ok;
}
```

**删除文件夹下所有文件**
```
void QUIHelper::deleteDirectory(const QString &path) {
    QDir dir(path);
    if (!dir.exists()) {
        return;
    }

    dir.setFilter(QDir::AllEntries | QDir::NoDotAndDotDot);
    QFileInfoList fileList = dir.entryInfoList();

    foreach (QFileInfo fi, fileList) {
        if (fi.isFile()) {
            fi.dir().remove(fi.fileName());
        } else {
            deleteDirectory(fi.absoluteFilePath());
            dir.rmdir(fi.absoluteFilePath());
        }
    }
}
```
