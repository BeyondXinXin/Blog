# QT 网络相关整理

### 1. 是否通外网
```cpp
bool IsOnline() {
    QTcpSocket tcpClient;
    tcpClient.abort();
    tcpClient.connectToHost("115.239.211.112", 80);
    return tcpClient.waitForConnected(3000);
}
```
### 2.本机公网IP地址
```cpp
QString GetNetIP(const QString &webCode) {
    QString web = webCode;
    web = web.replace(' ', "");
    web = web.replace("\r", "");
    web = web.replace("\n", "");
    QStringList list = web.split("<br/>");
    QString tar = list.at(3);
    QStringList ip = tar.split("=");
    return ip.at(1);
}
```
### 3.获取本机IP
```cpp
QString GetLocalIP() {
    QStringList ips;
    QList<QHostAddress> addrs = QNetworkInterface::allAddresses();
    foreach (QHostAddress addr, addrs) {
        QString ip = addr.toString();
        if (QUIHelper::IsIP(ip)) {
            ips << ip;
        }
    }
    //优先192,无则127.0.0.1
    QString ip = "127.0.0.1";
    foreach (QString str, ips) {
        if (str.startsWith("192.168.1") || str.startsWith("192")) {
            ip = str;
            break;
        }
    }
    return ip;
}
```
### 4.Url转IP
```cpp
QString UrlToIP(const QString &url) {
    QHostInfo host = QHostInfo::fromName(url);
    return host.addresses().at(0).toString();
}
```
### 5.IP地址、端口 是否在线
```cpp
bool IdPortOnline(const QString &ip, qint32 port) {
    QTcpSocket tcpClient;
    tcpClient.abort();
    tcpClient.connectToHost(ip, static_cast<quint16>(port));
    return tcpClient.waitForConnected(1000);
}
```
### 6.获取网页源码
```cpp
QString GetHtml(const QString &url) {
    QNetworkAccessManager *manager = new QNetworkAccessManager();
    QNetworkReply *reply = manager->get(QNetworkRequest(QUrl(url)));
    QByteArray responseData;
    QEventLoop eventLoop;
    QObject::connect(manager, SIGNAL(finished(QNetworkReply *)),
                     &eventLoop, SLOT(quit()));
    eventLoop.exec();
    responseData = reply->readAll();
    return QString(responseData);
}
```
### 7.是否ip地址
```cpp
bool IsIP(const QString &ip) {
    QRegExp RegExp("((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.)"
                   "{3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)");
    return RegExp.exactMatch(ip);
}
```
### 8.是否MAC地址
```cpp
bool IsMac(const QString &mac) {
    QRegExp RegExp("^[A-F0-9]{2}(-[A-F0-9]{2}){5}$");
    return RegExp.exactMatch(mac);
}
```
### 8.是否电话
```cpp
bool IsTel(const QString &tel) {
    if (tel.length() != 11) {
        return false;
    }
    if (!tel.startsWith("13") && !tel.startsWith("14")
            && !tel.startsWith("15") && !tel.startsWith("18")) {
        return false;
    }
    return true;
}
```
### 9.是否邮箱
```cpp
bool IsEmail(const QString &email) {
    if (!email.contains("@") || !email.contains(".com")) {
        return false;
    }
    return true;
}
```
