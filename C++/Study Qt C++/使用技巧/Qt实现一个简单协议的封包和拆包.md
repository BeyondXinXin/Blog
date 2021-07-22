# Qt实现一个简单协议的封包和拆包

## 需求

平时通讯经常用到遵循一定协议封包和拆包。分享一个简单的解决方案。


## 代码


```cpp
#include <QByteArray>
#include <QDataStream>
#include <QDebug>
#include <QFile>

class ProtocalData
{
public:
    enum TcpDataType
    {
        EMPTY = 0x00,
        CMD_NAV_REALTIME_DATA = 0x01, //  navigation real time data
    };

public:
    ProtocalData()
    {
        header_ = '[';
        type_ = EMPTY;
        len_ = 0x00;
        data_.clear();
        checksum_ = 0x00;
        tail_ = ']';
    }

    void SetData(const QByteArray &data, const char &type)
    {
        this->data_ = data;
        this->type_ = type;
    }

    QByteArray MakeSendData()
    {
        QByteArray send_array;
        len_ = data_.size();
        send_array.append(static_cast<char *>(&header_), sizeof(header_));
        send_array.append(static_cast<char *>(&type_), sizeof(type_));
        send_array.append((char *)(&len_), sizeof(len_));
        send_array.append(data_);
        checksum_ = qChecksum(send_array.data(), static_cast<quint32>(send_array.size()));
        send_array.append((char *)(&checksum_), sizeof(checksum_));
        send_array.append(static_cast<char *>(&tail_), sizeof(tail_));
        return send_array;
    }

    bool AnalysisData(QByteArray &receice_array)
    {
        QDataStream stream(&receice_array, QIODevice::ReadOnly);
        stream.setByteOrder(QDataStream::LittleEndian);
        stream.readRawData(&header_, sizeof(header_));
        stream.readRawData(&type_, sizeof(type_));
        stream >> len_;
        stream.skipRawData(len_);
        data_ = receice_array.mid(sizeof(header_) + sizeof(type_) + sizeof(len_), len_);
        stream >> checksum_;
        stream.readRawData(&tail_, sizeof(tail_));
        QByteArray check_arr = receice_array.left(
          static_cast<int>(sizeof(header_) + sizeof(type_) + sizeof(len_)) + len_);
        quint16 checksum = qChecksum(check_arr.data(), static_cast<quint32>(check_arr.size()));
        if (checksum != checksum_) {
            return false;
        }
        return true;
    }

    QByteArray GetData() const
    {
        return data_;
    }

private:
    char header_;
    char type_;
    qint32 len_;
    QByteArray data_;
    quint16 checksum_;
    char tail_;
};

QString ByteArrayToHexStr(const QByteArray &data)
{
    QString temp = "";
    QString hex = data.toHex();
    for (int i = 0; i < hex.length(); i = i + 2) {
        temp += hex.mid(i, 2) + " ";
    }
    return temp.trimmed().toUpper();
}

int main()
{
    QByteArray array;
    QDataStream stream(&array, QIODevice::Append);
    stream.setByteOrder(QDataStream::LittleEndian);
    stream << 10.0 << 10.0 << 10.0
           << 10.0 << 10.0 << 10.0;

    ProtocalData protocal_data;
    protocal_data.SetData(array, char(ProtocalData::CMD_NAV_REALTIME_DATA));
    array = protocal_data.MakeSendData();

    QString str;
    str = ByteArrayToHexStr(array);
    qDebug() << str;

    if (protocal_data.AnalysisData(array)) {
        str = ByteArrayToHexStr(protocal_data.GetData());
        qDebug() << str;
    }

    QFile file("file.txt");
    file.open(QIODevice::WriteOnly);
    QTextStream out(&file);
    out << str;

    return 0;
}

```


## 项目

[https://github.com/BeyondXinXin/study_qt](https://github.com/BeyondXinXin/study_qt)




