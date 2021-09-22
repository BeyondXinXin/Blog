# 利用Qt实现Gif转预览图片


项目介绍：[一个简易的Github图床客户端](https://blog.csdn.net/a15005784320/article/details/120108907?spm=1001.2014.3001.5501)  

项目仓库：[GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)   


---


需要把图床的gif搞成本地的预览图片，本来当会很麻烦，看了下QMove的源码，原来直接用QImageReader就可以实现gif的解析了。


```cpp

struct NetworkReply
{
    QNetworkReply::NetworkError error = QNetworkReply::HostNotFoundError;
    QByteArray data;

    QString ErrorStr();
};

void GitHubImageHost::DownloadImage(GHImage &gh_image)
{
    if (gh_image.pix.isNull()) {

        auto reply = NetworkAccess::Request(QUrl(gh_image.download_url));

        if (!gh_image.html_url.right(5).contains("gif")) {
            gh_image.pix = QImage::fromData(reply.data).scaled(img_size_, Qt::KeepAspectRatio, Qt::SmoothTransformation);
        } else {
            QBuffer buffer;
            buffer.open(QFile::WriteOnly);
            buffer.write(reply.data);
            buffer.close();
            QImageReader reader(&buffer);
            gh_image.pix = reader.read().scaled(img_size_, Qt::KeepAspectRatio, Qt::SmoothTransformation);
        }
    }
}


```



