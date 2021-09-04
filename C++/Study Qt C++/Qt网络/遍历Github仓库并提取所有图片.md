# 遍历Github仓库并提取所有图片


项目介绍：[一个简易的Github图床客户端](https://blog.csdn.net/a15005784320/article/details/120108907?spm=1001.2014.3001.5501)  

项目仓库：[GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)   


---

利用 QElapsedTimer+QCoreApplication::processEvents() 可是实现UI同步（QEventLoop增加实现循环放在这里不合适）
利用 QtConcurrent 实现文件的检索


同步等待（不干扰UI）

```cpp
void SleepWait(const int &seconds)
{
    if (seconds <= 0) {
        return;
    }
    QElapsedTimer t;
    t.start();
    while (t.elapsed() < seconds) {
        QCoreApplication::processEvents();
    }
}
```

并行检索

```cpp
void FunAppedQureData(QStringList &list, const QStringList &data)
{
    list << data;
};

QStringList GitHubImageHost::QueryImage(const QString &path)
{
    const auto url_str = QUrl(QString("%1/repos/%2/%3/contents/%4").arg(gh_api_url_, info_.user_name, info_.repo_name, path));
    auto reply = NetworkAccess::Request(QUrl(url_str));
    auto recursive_path = ParsingJson(reply, path);
    return recursive_path;
}


bool GitHubImageHost::GetAllImage(QString &msg)
{

    if (info_.isEmpty()) {
        msg = u8"图床未设置参数";
        return false;
    }

    images_.clear();
    QStringList list { "" };
    while (!list.isEmpty()) {
        QFuture<QStringList> f = QtConcurrent::mappedReduced(list, &GitHubImageHost::QueryImage, &FunAppedQureData);
        bool finished = false;
        while (!finished) {
            SleepWait(100);
            if (f.isRunning()) {
                finished = true;
            }
        }
        list.clear();
        list << f.result();
    }

    foreach (auto key, images_.keys()) {
        qDebug() << "------------------------------------------------";
        qDebug() << "path:" << key << "size:" << images_[key].size();
        QtConcurrent::blockingMap(images_[key], &DownloadImage);
    }

    WriteImages();

    return true;
}
```

GitHub返回结果的分析

```cpp
QStringList GitHubImageHost::ParsingJson(NetworkReply net_r, const QString &dir)
{
    QStringList dirs;
    auto json_doc = QJsonDocument::fromJson(net_r.data);
    if (json_doc.isArray()) {
        auto json_array = json_doc.array();
        QJsonArray::Iterator i = json_array.begin();
        while (i != json_array.end()) {
            if (i->isObject()) {
                auto tmp_json_obj = i->toObject();
                const auto type = tmp_json_obj[QStringLiteral("type")].toString();
                const auto path = tmp_json_obj[QStringLiteral("path")].toString();
                if ("dir" == type) {
                    dirs << path;
                } else if ("file" == type) {
                    const auto name = tmp_json_obj[QStringLiteral("name")].toString();
                    if (name.right(6).contains("bmp")
                        || name.right(6).contains("gif")
                        || name.right(6).contains("jpg")
                        || name.right(6).contains("jpeg")
                        || name.right(6).contains("png")) {
                        GHImage image;
                        image.html_url = tmp_json_obj[QStringLiteral("html_url")].toString();
                        image.download_url = tmp_json_obj[QStringLiteral("download_url")].toString();
                        image.name = name;
                        image.github_path = tmp_json_obj[QStringLiteral("path")].toString();
                        image.sha = tmp_json_obj[QStringLiteral("sha")].toString();
                        images_[dir] << image;
                    }
                }
            }
            i++;
        }
    }
    return dirs;
}
```

