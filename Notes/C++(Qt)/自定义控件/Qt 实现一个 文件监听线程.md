# Qt 实现一个 文件监听线程

```cpp
class FileWatcherThread : public QThread {
    Q_OBJECT
  public:
    FileWatcherThread(const QString &dir, QObject *parent = nullptr);
    void run() Q_DECL_OVERRIDE;
  Q_SIGNALS:
    void Signal_FilesChanged(const QStringList &removed, const QStringList &added);
  private :
    void ScanDir();
  private:
    QString m_dir_;
    QStringList m_files_;
};
```

```cpp

//--------------------------------------
FileWatcherThread::FileWatcherThread(const QString &dir, QObject *parent):
    QThread(parent) {
    m_dir_ = dir;
}

//--------------------------------------
void FileWatcherThread::run()  {
    ScanDir();
    exec();
}

//--------------------------------------
void FileWatcherThread::ScanDir() {
    QStringList removed, added;
    removed = m_files_;
    QStringList files = QDir(m_dir_).entryList(QDir::Files);
    foreach (const QString &f, files) {
        QString file = m_dir_ + QDir::separator() + f;
        if (m_files_.contains(file)) {
            removed.removeOne(file);
        } else {
        }
        added += file;
    }
    m_files_ = added;
    emit Signal_FilesChanged(removed, added);
    QTimer::singleShot(500, this, &FileWatcherThread::ScanDir);
}
```

&emsp;&emsp;调用

```cpp
    FileWatcherThread *t = new FileWatcherThread(dir);
    connect(this, &ThumbnailBarWidget::Signal_QuitFileWatcher,
            t, &FileWatcherThread::quit);
    connect(t, &FileWatcherThread::finished,
            t, &FileWatcherThread::deleteLater);
    connect(t, &FileWatcherThread::Signal_FilesChanged,
            this, &ThumbnailBarWidget::Slot_FilesChanged);
    t->start();
```
