# GithubImageHost图床本地缓存设计


项目介绍：[一个简易的Github图床客户端](https://blog.csdn.net/a15005784320/article/details/120108907?spm=1001.2014.3001.5501)  

项目仓库：[GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)   



---

试过很多图床，都缺少全部图片预览的功能（按照目录，预览仓库内所有图片），只有预览通过该图床上传过的图片。  
想了下自己想要的：默认只预览本地上传和下载的图片，当点击更新仓库按钮后则同步仓库内所有图片到本地缓存并支持预览。  
实现：把图片利用Qt的scaled调整到200, 150的尺寸，每次更新过后保存到本地文件。  


利用QDataStream实现自定义结构体的写入写出：

```cpp
struct GHImage
{
    QString html_url { "" };
    QString download_url { "" };
    QString name { "" };
    QString github_path { "" };
    QString sha { "" };
    QImage pix;

    friend QDataStream &operator<<(QDataStream &out, const GHImage &info)
    {
        return out << info.html_url << info.download_url << info.name << info.github_path << info.sha << info.pix;
    }

    friend QDataStream &operator>>(QDataStream &in, GHImage &info)
    {
        return in >> info.html_url >> info.download_url >> info.name >> info.github_path >> info.sha >> info.pix;
    }

    inline bool operator==(const GHImage &info)
    {
        return sha == info.sha && github_path == info.github_path;
    }
};

struct GithubInfo
{
    QString gh_token;
    QString user_name;
    QString repo_name;

    friend QDataStream &operator<<(QDataStream &out, const GithubInfo &info)
    {
        return out << info.gh_token << info.user_name << info.repo_name;
    }

    friend QDataStream &operator>>(QDataStream &in, GithubInfo &info)
    {
        return in >> info.gh_token >> info.user_name >> info.repo_name;
    }

    friend QDebug &operator<<(QDebug out, const GithubInfo &info)
    {
        out << info.gh_token << info.user_name << info.repo_name;
        return out;
    }

    inline bool operator==(const GithubInfo &info)
    {
        return gh_token == info.gh_token && user_name == info.user_name && repo_name == info.repo_name;
    }

    inline bool isEmpty() const
    {
        return gh_token.isEmpty() || user_name.isEmpty() || repo_name.isEmpty();
    }
};

```

```cpp

using GHImageMap = QMap<QString, QList<GHImage>>;
static GHImageMap images_;
static QSize img_size_;
static GithubInfo info_;

GithubInfo GitHubImageHost::info_;
QSize GitHubImageHost::img_size_(200, 150);
GitHubImageHost::GHImageMap GitHubImageHost::images_;

void GitHubImageHost::WriteImages()
{

    QFile file(image_map_cfg_);
    if (file.open(QIODevice::WriteOnly)) {
        QDataStream out(&file);
        out << info_;
        out << int(images_.size());
        foreach (auto key, images_.keys()) {
            auto &list = images_.value(key);
            out << key << int(list.size());
            foreach (auto var, list) {
                out << var;
            }
        }
        file.close();
    }
}

void GitHubImageHost::ReadImages()
{
    images_.clear();
    QFile file(image_map_cfg_);
    if (file.open(QIODevice::ReadOnly)) {
        QDataStream in(&file);

        GithubInfo info;
        in >> info;
        if (info == info_) {
            int path_size;
            in >> path_size;
            while (path_size > 0) {
                path_size--;
                QString path;
                QList<GHImage> img_list;
                int img_size;
                in >> path >> img_size;
                while (img_size > 0) {
                    img_size--;
                    QString path;
                    GHImage img;
                    in >> img;
                    img_list << img;
                }
                images_[path] = img_list;
            }

        } else {
            qDebug() << u8"githubinfo.cfg 校验失败";
        }

        file.close();
    }
}
```







