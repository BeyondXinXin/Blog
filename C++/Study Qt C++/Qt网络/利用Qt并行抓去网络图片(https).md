# 利用Qt并行抓去网络图片(https)

项目介绍：[一个简易的Github图床客户端](https://blog.csdn.net/a15005784320/article/details/120108907?spm=1001.2014.3001.5501)  

项目仓库：[GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)   


---

利用 QNetworkAccessManager 可以直接获取网络请求

```cpp

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




```cpp

QNetworkRequest NetworkAccess::NetworkRequest(const QUrl & url)
{
    QNetworkRequest request(url);
    request.setAttribute(QNetworkRequest::FollowRedirectsAttribute, true);
    return request;
}

NetworkReply NetworkAccess::Request(const QUrl & url)
{
    return Request(url, RawHeaderPairs());
}

NetworkReply NetworkAccess::Request(const QUrl & url, const RawHeaderPairs & raw_header)
{
    return SendRequest(url, raw_header, "GET", QByteArray());
}

NetworkReply NetworkAccess::SendRequest(
  const QUrl & url,
  const RawHeaderPairs & header,
  const QByteArray & action,
  const QByteArray & data)
{
    QEventLoop loop;

    NetworkReply reply;
    if (!url.isValid()) {
        return reply;
    }
    QNetworkAccessManager net_access_mgr;
    connect(&net_access_mgr, &QNetworkAccessManager::finished,
            [=, &reply, &loop](QNetworkReply * p_reply) {
                HandleReply(p_reply, reply);
                loop.quit();
            });
    auto request(NetworkRequest(url));
    for (const auto & header : header) {
        request.setRawHeader(header.first, header.second);
    }
    net_access_mgr.sendCustomRequest(request, action, data);

    loop.exec();

    return reply;
}
```









