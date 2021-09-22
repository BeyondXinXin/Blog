# Qt Json常用函数
@[TOC]( )


### QList< QMap< QString, QVariant>>    和 Json 转换

```cpp
bool JsonToListMap(
    const QString &msg, QList<QMap<QString, QVariant>> &list) {
    QJsonParseError json_error;
    QJsonDocument parse_doucment = QJsonDocument::fromJson(msg.toUtf8(), &json_error);
    if (json_error.error == QJsonParseError::NoError) {
        if (parse_doucment.isArray()) {
            QJsonArray json_array = parse_doucment.array();
            qint32 size = json_array.size();
            for (qint32 i = 0; i < size; i++) {
                QMap<QString, QVariant> temp_map;
                QJsonObject json_obj = json_array.at(i).toObject();
                for (qint32 j = 0; j < json_obj.size(); j++) {
                    QString tmp = json_obj.keys().at(j);
                    QVariant tp = json_obj.value(tmp).toVariant();
                    temp_map.insert(tmp, tp);
                }
                list.append(temp_map);
            }
            return true;
        } else {
            qWarning() << "the json is not array error! "
                       "jsonError:" << json_error.error;
            return false;
        }
    } else {
        qWarning() << "the json analysisError! "
                   "jsonError:" << json_error.error;
        return false;
    }
}

bool ListMapToJson(
    const QList<QMap<QString, QVariant>> &list, QString &msg) {
    QJsonArray json_array;
    for (qint32 i = 0; i < list.size(); ++i) {
        QMap<QString, QVariant> temp_map = list.at(i);
        QJsonObject jsonObj;
        for (auto ite = temp_map.begin(); ite != temp_map.end(); ++ite) {
            jsonObj.insert(ite.key(), ite.value().toString());
        }
        json_array.append(jsonObj);
    }
    QJsonDocument parse_doucment(json_array);
    msg = parse_doucment.toJson(QJsonDocument::Compact);
    return true;
}

```

### QList < QList< QVariant >> 和 Json 转换

```cpp
bool ListListToJson(
    const QList<QList<QVariant>> &list, QString &msg) {
    QJsonArray json_array;
    for (qint32 i = 0; i < list.size(); ++i) {
        QList<QVariant> temp_list = list.at(i);
        QJsonArray temp_array;
        for (qint32 j = 0; j < temp_list.size(); ++j) {
            temp_array.append(temp_list.at(j).toString());
        }
        json_array.append(temp_array);
    }
    QJsonDocument parse_doucment(json_array);
    msg = parse_doucment.toJson(QJsonDocument::Compact);
    return true;
}

bool JsonToListList(const QString &msg, QList<QList<QVariant>> &list) {
    QJsonParseError json_error;
    QJsonDocument parse_document = QJsonDocument::fromJson(msg.toUtf8(), &json_error);
    if (json_error.error == QJsonParseError::NoError) {
        if (parse_document.isArray()) {
            QJsonArray json_array1 = parse_document.array();
            qint32 size = json_array1.size();
            for (qint32 i = 0; i < size; ++i) {
                QList<QVariant> temp_list;
                QJsonArray json_array2 = json_array1.at(i).toArray();
                for (qint32 j = 0; j < json_array2.size(); ++j) {
                    temp_list.append(json_array2.at(j).toVariant());
                }
                list.append(temp_list);
            }
            return true;
        } else {
            qWarning() << "the json is not array error! "
                       "jsonError:" << json_error.error;
            return false;
        }
    } else {
        qWarning() << "the json analysisError! "
                   "jsonError:" << json_error.error;
        return false;
    }
}
```

###  QList < QList < double>> 和 Json 转换

```cpp
bool ListDoubleToJson(const QList<QList<double>> &list, QString &msg) {
    QJsonArray json_array;
    for (qint32 i = 0; i < list.size(); ++i) {
        QList<double> temp_list = list.at(i);
        QJsonArray temp_array;
        for (qint32 j = 0; j < temp_list.size(); ++j) {
            temp_array.append(temp_list.at(j));
        }
        json_array.append(temp_array);
    }
    QJsonDocument parse_doucment(json_array);
    msg = parse_doucment.toJson(QJsonDocument::Compact);
    return true;
}

bool JsonToListDouble(const QString &msg, QList<QList<double>> &list) {
    QJsonParseError json_error;
    QJsonDocument parse_document = QJsonDocument::fromJson(msg.toUtf8(), &json_error);
    if (json_error.error == QJsonParseError::NoError) {
        if (parse_document.isArray()) {
            QJsonArray json_array1 = parse_document.array();
            qint32 size = json_array1.size();
            for (qint32 i = 0; i < size; ++i) {
                QList<double> temp_list;
                QJsonArray json_array2 = json_array1.at(i).toArray();
                for (qint32 j = 0; j < json_array2.size(); ++j) {
                    temp_list.append(json_array2.at(j).toDouble());
                }
                list.append(temp_list);
            }
            return true;
        } else {
            qWarning() << "the json is not array error! "
                       "jsonError:" << json_error.error;
            return false;
        }
    } else {
        qWarning() << "the json analysisError! "
                   "jsonError:" << json_error.error;
        return false;
    }
}

```

