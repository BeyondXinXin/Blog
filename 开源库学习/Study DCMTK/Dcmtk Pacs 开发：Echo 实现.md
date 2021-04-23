前言：
&emsp;&emsp;要做一个简单的开源dcm浏览器 [KISS Dicom Viewer](https://blog.csdn.net/a15005784320/article/details/108678403) ，小型pacs服务肯定必不可少。开发中到处找现成代码，基本上找到的资源都是一个发布版，很少有可以用来研究的源码。 [KISS Dicom Viewer](https://blog.csdn.net/a15005784320/article/details/108678403) 目前处于开发阶段，最近几篇博客就用来记录下开发一个小型pacs数据库（Qt+Dcmtk）的过程。提供服务包括：通讯测试echo、远程查询findscu、远程下载get/move、本机存储storescp。


&emsp;&emsp;Dicom协议、通讯原理等等，网上有很多优秀的中文博客来说明，这里就不介绍了。


---

&emsp;&emsp;Dcmtk 封装的echoscu 服务说明  [https://support.dcmtk.org/docs/echoscu.html](https://support.dcmtk.org/docs/echoscu.html)
&emsp;&emsp;如果你需要定义自己的echoscu服务，可以看下我整理的：

---


![](https://img-blog.csdnimg.cn/20201013184800906.png#pic_center)
@[TOC](Dcmtk  Pacs 开发：echo 实现)

# 如何使用
传入参数 依次是  aec  aet ip part   
```cpp
    LocalSettings settings;
    QString msg;
    if (EchoSCU(settings.statInfo.aetitle, "Echo",
                Kiss::getLocalIP(), settings.statInfo.store_port, msg)) {
        QMessageBox::information(
            this, QString("Echo SCP"), QString("Echo succeeded."));
    } else {
        QMessageBox::critical(this, QString("Echo SCP"), msg);
    }
```

# 实现源码  获取本机 ip

```cpp
    GLOBAL_EXTERN bool isIP(const QString &ip);
    GLOBAL_EXTERN QString getLocalIP();
    
 	QString getLocalIP() {
        QStringList ips;
        QList<QHostAddress> addrs = QNetworkInterface::allAddresses();
        foreach (QHostAddress addr, addrs) {
            QString ip = addr.toString();
            if (isIP(ip)) {
                ips << ip;
            }
        }
        //优先取192开头的IP,如果获取不到IP则取127.0.0.1
        QString ip = "127.0.0.1";
        foreach (QString str, ips) {
            if (str.startsWith("192.168.1") || str.startsWith("192")) {
                ip = str;
                break;
            }
        }
        return ip;
    }

    bool isIP(const QString &ip) {
        QRegExp RegExp("((2[0-4]\\d|25[0-5]|[01]?\\d\\d?)\\.){3}(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)");
        return RegExp.exactMatch(ip);
    }
```
# 实现源码  端口、aetitle 配置文件记录

```cpp
#define LOCALSETTINGS_CFG "etc/localsettings.cfg"

struct StationInfo {
    QString aetitle;
    ushort store_port;
    friend QDataStream &operator<<(QDataStream &out, const StationInfo &info) {
        return out << info.aetitle << info.store_port;
    }
    friend QDataStream &operator>>(QDataStream &in, StationInfo &info) {
        return in >> info.aetitle >> info.store_port;
    }
};

class LocalSettings {
  public:
    LocalSettings();
    void saveConfig();
    void loadConfig();
    StationInfo statInfo;
};
```

```cpp
LocalSettings::LocalSettings() {
    loadConfig();
}

void LocalSettings::saveConfig() {
    QFile file(LOCALSETTINGS_CFG);
    if (file.open(QIODevice::WriteOnly)) {
        QDataStream out(&file);
        out << statInfo;
        file.close();
    }
}

void LocalSettings::loadConfig() {
    QFile file(LOCALSETTINGS_CFG);
    if (file.open(QIODevice::ReadOnly)) {
        QDataStream in(&file);
        in >> statInfo ;
        file.close();
    }
}
```

# 实现源码  调用dcmtk echoscu接口 服务

```cpp
#ifndef ECHOSCU_H
#define ECHOSCU_H
#ifdef ECHOSCU_CPP
    #define ECHOSCU_EXTERN extern
#else
    #define ECHOSCU_EXTERN
#endif
class QString;
ECHOSCU_EXTERN bool EchoSCU(const QString &peer_title, const QString &our_title,
                            const QString &hostname, int port, QString &msg);
#endif // ECHOSCU_H
```

```cpp
#define ECHOSCU_CPP
#include "echoscu.h"
#include <QString>

#include "dcmtk/config/osconfig.h"
/* make sure OS specific configuration is included first */

#define INCLUDE_CSTDLIB
#define INCLUDE_CSTDIO
#define INCLUDE_CSTRING
#define INCLUDE_CSTDARG
#include "dcmtk/ofstd/ofstdinc.h"

#include "dcmtk/dcmnet/dimse.h"
#include "dcmtk/dcmnet/diutil.h"
#include "dcmtk/dcmdata/dcfilefo.h"
#include "dcmtk/dcmdata/dcdict.h"
#include "dcmtk/dcmdata/dcuid.h"

/* DICOM 标准转移语法 */
static const char *transferSyntaxes[] = {
    UID_LittleEndianImplicitTransferSyntax, /* 默认 */
    UID_LittleEndianExplicitTransferSyntax,
    UID_BigEndianExplicitTransferSyntax,
    UID_JPEGProcess1TransferSyntax,
    UID_JPEGProcess2_4TransferSyntax,
    UID_JPEGProcess3_5TransferSyntax,
    UID_JPEGProcess6_8TransferSyntax,
    UID_JPEGProcess7_9TransferSyntax,
    UID_JPEGProcess10_12TransferSyntax,
    UID_JPEGProcess11_13TransferSyntax,
    UID_JPEGProcess14TransferSyntax,
    UID_JPEGProcess15TransferSyntax,
    UID_JPEGProcess16_18TransferSyntax,
    UID_JPEGProcess17_19TransferSyntax,
    UID_JPEGProcess20_22TransferSyntax,
    UID_JPEGProcess21_23TransferSyntax,
    UID_JPEGProcess24_26TransferSyntax,
    UID_JPEGProcess25_27TransferSyntax,
    UID_JPEGProcess28TransferSyntax,
    UID_JPEGProcess29TransferSyntax,
    UID_JPEGProcess14SV1TransferSyntax,
    UID_RLELosslessTransferSyntax,
    UID_JPEGLSLosslessTransferSyntax,
    UID_JPEGLSLossyTransferSyntax,
    UID_DeflatedExplicitVRLittleEndianTransferSyntax,
    UID_JPEG2000LosslessOnlyTransferSyntax,
    UID_JPEG2000TransferSyntax,
    UID_MPEG2MainProfileAtMainLevelTransferSyntax,
    UID_MPEG2MainProfileAtHighLevelTransferSyntax,
    UID_JPEG2000Part2MulticomponentImageCompressionLosslessOnlyTransferSyntax,
    UID_JPEG2000Part2MulticomponentImageCompressionTransferSyntax
};

bool EchoSCU(const QString &peer_title,
             const QString &our_title,
             const QString &hostname,
             int port,
             QString &msg) {
    //------------------------------Initialization Work----------------------------//
    T_ASC_Network *net;
    T_ASC_Parameters *params;
    T_ASC_Association *assoc;
    OFString temp_str;
    bool ret = false;
    DIC_NODENAME local_host;
    DIC_NODENAME peer_host;
    DIC_US msg_id;
    DIC_US status;
    DcmDataset *status_detail = nullptr;
    int presentation_context_id = 1;
    OFCondition cond = ASC_initializeNetwork(NET_REQUESTOR, 0, 6, &net);
    if (cond.bad()) {
        DimseCondition::dump(temp_str, cond);
        msg = QString::fromLatin1(temp_str.c_str());
        goto Cleanup;
    }
    cond = ASC_createAssociationParameters(&params, ASC_DEFAULTMAXPDU);
    if (cond.bad()) {
        DimseCondition::dump(temp_str, cond);
        msg = QString::fromLatin1(temp_str.c_str());
        goto Cleanup;
    }
    ASC_setAPTitles(params,
                    our_title.toLocal8Bit().data(),
                    peer_title.toLocal8Bit().data(),
                    nullptr);
    cond = ASC_setTransportLayerType(params, OFFalse);
    if (cond.bad()) {
        DimseCondition::dump(temp_str, cond);
        msg = QString::fromLatin1(temp_str.c_str());
        goto Cleanup;
    }
    gethostname(local_host, sizeof(local_host) - 1);
    sprintf(peer_host, "%s:%d", hostname.toLocal8Bit().data(), port);
    ASC_setPresentationAddresses(params, local_host, peer_host);
    cond = ASC_addPresentationContext(
               params, static_cast<unsigned char>(presentation_context_id),
               UID_VerificationSOPClass, transferSyntaxes, 3);
    presentation_context_id += 2;
    if (cond.bad()) {
        DimseCondition::dump(temp_str, cond);
        msg = QString::fromLatin1(temp_str.c_str());
        goto Cleanup;
    }
    cond = ASC_requestAssociation(net, params, &assoc);
    if (cond.bad()) {
        if (cond == DUL_ASSOCIATIONREJECTED) {
            T_ASC_RejectParameters rej;
            ASC_getRejectParameters(params, &rej);
            ASC_printRejectParameters(temp_str, &rej);
            msg = QString("Association rejected: %1").arg(temp_str.c_str());
            goto Cleanup;
        } else {
            DimseCondition::dump(temp_str, cond);
            msg = QString("Association request failed: %1").arg(temp_str.c_str());
            goto Cleanup;
        }
    }
    if (ASC_countAcceptedPresentationContexts(params) == 0) {
        msg = QString("No Acceptable Presentation Contexts");
        goto Cleanup;
    }
    //------------------------------Real Work----------------------------//
    msg_id = assoc->nextMsgID++;
    cond = DIMSE_echoUser(
               /* in */ assoc, msg_id,
               /* blocking info for response */ DIMSE_BLOCKING, 0,
               /* out */ &status,
               /* Detail */ &status_detail);
    if (status_detail != nullptr) {
        delete status_detail;
    }
    if (cond == EC_Normal) {
        cond = ASC_releaseAssociation(assoc);
        ret = true;
    } else if (cond == DUL_PEERABORTEDASSOCIATION) {
    } else {
        DimseCondition::dump(temp_str, cond);
        msg = QString::fromLatin1(temp_str.c_str());
        cond = ASC_abortAssociation(assoc);
    }
    //------------------------------Cleanup Work----------------------------//
Cleanup:
    cond = ASC_destroyAssociation(&assoc);
    cond = ASC_dropNetwork(&net);
    return ret;
}

```





