# QuaZip 打开 DICOM zip文件

项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  

---



&emsp;&emsp;小蚂蚁有一个功能，导入文件时支持`DICOM zip`文件，一般`DICOM`文件数量都比较多，大家相互拷贝的时候常常压缩成`zip`文件。小蚂蚁可以直接打开`zip`文件（读取里边所有的`DICOM`文件并显示）。小蚂蚁那么高的效率应该是自己实现`zip`文件的解压，在内存里直接判断是否`DICOM`文件，是的话直接拷贝出来。
&emsp;&emsp;我能想到的自己可以实现的办法就是：如果载入文件后缀是`.zip`我就解压到本地一个目录，遍历里边所有文件，依次用`DCMTK`打开。把需要的影像加载到内存后删除本地解压缩的文件。


## 解压办法

&emsp;&emsp;本来用的`unzip`，现在**kissDicomViewer**想做成夸平台的。虽然有现成的`QZipWriter`和`Qzipreader`。但是实际使用过才发现`QZipWriter`勉强能用，`Qzipreader`就是个坑。老老实实的把`quazip`加进来吧。用`JlCompress::extractDir`来解压。

```cpp
class UnzipDicomFile : public QThread {
    Q_OBJECT
  public:
    explicit UnzipDicomFile() {}
    virtual ~UnzipDicomFile() override {}
    virtual void run() override;
    void SetPath(const QString &path);
  private:
    QString path_;
};

//-------------------------------------------------------
void UnzipDicomFile::run() {
    Kiss::FileUtil::DirRemove("./ZipCache");
    Kiss::FileUtil::DirMake("./ZipCache/");
    JlCompress::extractDir(this->path_, "./ZipCache/");
}

//-------------------------------------------------------
void UnzipDicomFile::SetPath(
    const QString &path) {
    this->path_ = path;
}

```

## 使用

&emsp;&emsp;保留之前的打开文件逻辑，如果当前返回的只有一个文件并且后缀是`.zip`则使用`UnzipDicomFile`先解压到本地`"./ZipCache"`。让后读取这个文件夹。全部载入后删除本地`"./ZipCache"`。


```cpp
void ThumbnailBarWidget::appendImagePaths(
    const QStringList &paths, bool clear_old) {
    emit Signal_ImageLoadBegin();
    if(1 == paths.size() && paths.first().right(4) == ".zip") {
        QPointer<UnzipDicomFile> script_recoery_;
        script_recoery_ = new UnzipDicomFile();
        connect(script_recoery_, &UnzipDicomFile::finished,
        this, [&] {
            appendImagePaths(QStringList() << "./ZipCache", true);
        });
        connect(script_recoery_, &UnzipDicomFile::finished,
                script_recoery_, &UnzipDicomFile::deleteLater);
        script_recoery_->SetPath(paths.first());
        script_recoery_->start();
        return;
    }
/*
    原先打开文件方法
*/
    Kiss::FileUtil::DirRemove("./ZipCache");
    emit Signal_ImageLoadFinished();
```






