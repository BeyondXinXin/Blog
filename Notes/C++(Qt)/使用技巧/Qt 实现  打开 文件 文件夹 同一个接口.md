# Qt 实现  打开 文件 文件夹 同一个接口


&emsp;&emsp;  打开 文件/文件夹 需要两个函数分别实现
```cpp
//-----------------------------------------------
void SLot_OpenDicomFolder() {
    QSettings s;
    QString p = s.value(OPEN_DIR_PATH, ".").toString();
    p = QFileDialog::getExistingDirectory(this, tr("Open dicom directory"), p);
    if (!p.isEmpty()) {
        s.setValue(OPEN_DIR_PATH, p);
        ui->thumbnailBar->setImagePaths(QStringList() << p);
    }
}

//-----------------------------------------------
void Slot_OpenDicomFile() {
    QSettings s;
    QString p = s.value(OPEN_FILE_PATH).toString();
    QStringList fs = QFileDialog::getOpenFileNames(this, tr("Open dicom files"), p);
    if (!fs.isEmpty()) {
        s.setValue(OPEN_DIR_PATH, fs.first());
        ui->thumbnailBar->setImagePaths(fs);
    }
}
```



&emsp;&emsp; 把每一个 **path**当成目录，如果不存在就是文件，存在的话向下遍历。
```cpp
void appendImagePaths(const QStringList &paths, bool clear_old) {
    QStringList path_list = paths;
    QStringList files;
    QStringList unloaded_files;
    while (!path_list.isEmpty()) {
        QString p = path_list.takeFirst();
        QDir dir(p);
        if (dir.exists()) {
            QStringList subs = dir.entryList(QDir::Files);
            foreach (const QString &s, subs) {
                files += p + QDir::separator() + s;
            }
            subs = dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot);
            foreach (const QString &s, subs) {
                path_list += p + QDir::separator() + s;
            }
        } else {
            files += p;
        }
    }
    if (clear_old) {
        unloaded_files = files;
        clear();
    } else {
        foreach (const QString &file, files) {
            bool found = false;
            foreach (DicomImageLabel *label, imageLabelList) {
                if (label->HasImage(file)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                unloaded_files << file;
            }
        }
    }
    ImageLoadThread *t = new ImageLoadThread(unloaded_files);
    connect(t, &ImageLoadThread::resultReady,
            this, &ThumbnailBarWidget::Slot_ImageReady);
    connect(t, &FileWatcherThread::finished,
            t, &FileWatcherThread::deleteLater);
    t->start();
}
```
