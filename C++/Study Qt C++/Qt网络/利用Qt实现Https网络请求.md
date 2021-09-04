# 利用Qt实现Https网络请求


项目介绍：[一个简易的Github图床客户端](https://blog.csdn.net/a15005784320/article/details/120108907?spm=1001.2014.3001.5501)  

项目仓库：[GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)   


---

看了  [vnote](https://github.com/vnotex/vnote)  的代码，理解后重新敲了一遍。



```cpp
#ifndef NETWORKACCESS_H
#define NETWORKACCESS_H

#include <QByteArray>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QObject>
#include <QPair>
#include <QUrl>
#include <QVector>

struct NetworkReply
{
    QNetworkReply::NetworkError error = QNetworkReply::HostNotFoundError;
    QByteArray data;

    QString ErrorStr();
};

class NetworkAccess : public QObject
{
    Q_OBJECT
public:
    typedef QVector<QPair<QByteArray, QByteArray>> RawHeaderPairs;

    explicit NetworkAccess(QObject *p_parent = nullptr);

    void AsyncRequest(const QUrl &url);

    static NetworkReply Request(const QUrl &url);

    static NetworkReply Request(const QUrl &url, const RawHeaderPairs &raw_header);

    static NetworkReply Put(const QUrl &url, const RawHeaderPairs &raw_header, const QByteArray &data);

    static NetworkReply Post(const QUrl &url, const RawHeaderPairs &raw_header, const QByteArray &data);

    static NetworkReply Delete(const QUrl &url, const RawHeaderPairs &raw_header, const QByteArray &data);

Q_SIGNALS:
    void SgnRequestFinished(const NetworkReply &reply, const QString &url);

private:
    static void HandleReply(QNetworkReply *reply, NetworkReply &m_reply);
    static QNetworkRequest NetworkRequest(const QUrl &url);
    static NetworkReply SendRequest(const QUrl &url,
                                    const RawHeaderPairs &header,
                                    const QByteArray &action,
                                    const QByteArray &data);

private:
    QNetworkAccessManager net_access_mgr_;
};

#endif // NETWORKACCESS_H

```


```cpp

#include "network_access.h"

#include <QEventLoop>
#include <QMetaEnum>
#include <QNetworkReply>
#include <QScopedPointer>
#include <QThread>

QString NetworkReply::ErrorStr()
{
    static const auto index_enum = QNetworkReply::staticMetaObject.indexOfEnumerator("NetworkError");
    const auto meta_enum = QNetworkReply::staticMetaObject.enumerator(index_enum);
    return meta_enum.key(error);
}

NetworkAccess::NetworkAccess(QObject * p_parent)
  : QObject(p_parent)
{
    connect(&net_access_mgr_, &QNetworkAccessManager::finished,
            this, [this](QNetworkReply * p_reply) {
                NetworkReply reply;
                NetworkAccess::HandleReply(p_reply, reply);
                emit SgnRequestFinished(reply, p_reply->request().url().toString());
            });
}

void NetworkAccess::AsyncRequest(const QUrl & url)
{
    if (!url.isValid()) {
        return;
    }
    net_access_mgr_.get(NetworkRequest(url));
}

NetworkReply NetworkAccess::Request(const QUrl & url)
{
    return Request(url, RawHeaderPairs());
}

NetworkReply NetworkAccess::Request(const QUrl & url, const RawHeaderPairs & raw_header)
{
    return SendRequest(url, raw_header, "GET", QByteArray());
}

NetworkReply NetworkAccess::Put(const QUrl & url, const RawHeaderPairs & raw_header, const QByteArray & data)
{
    return SendRequest(url, raw_header, "PUT", data);
}

NetworkReply NetworkAccess::Post(const QUrl & url, const RawHeaderPairs & raw_header, const QByteArray & data)
{
    return SendRequest(url, raw_header, "POST", data);
}

NetworkReply NetworkAccess::Delete(const QUrl & url, const RawHeaderPairs & raw_header, const QByteArray & data)
{
    return SendRequest(url, raw_header, "DELETE", data);
}

void NetworkAccess::HandleReply(QNetworkReply * reply, NetworkReply & m_reply)
{
    m_reply.error = reply->error();
    m_reply.data = reply->readAll();

    if (m_reply.error != QNetworkReply::NoError) {
        qWarning() << "request reply error" << m_reply.error << reply->request().url() << m_reply.data;
    }

    reply->deleteLater();
}

QNetworkRequest NetworkAccess::NetworkRequest(const QUrl & url)
{
    QNetworkRequest request(url);
    request.setAttribute(QNetworkRequest::FollowRedirectsAttribute, true);
    return request;
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











