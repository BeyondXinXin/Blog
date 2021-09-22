# Qt 实现ini文件写入写出封装

##### 需求：
&emsp;&emsp;一个本地配置文件读写的封装，	例如:7天内不在弹出弹窗、是否记住登录用户名

##### 实现：
```cpp
class SettingUtil : public QObject {
    Q_OBJECT
    Q_ENUMS(SettingKeys)
  public:
    enum SettingKeys {
        BackupTime = 0,
        RemberName = 1,
        Null = -1,
    };
  public:
    static SettingUtil *Instance();
    explicit SettingUtil() {}
    virtual ~SettingUtil();
    void Initial();
    void SetInfo(const SettingKeys &key, const QString &value);
    void GetInfo(const SettingKeys &key, QString &value);
    const QString GetInfo(const SettingKeys key);
  private:
    QPointer<QSettings> settings_;
    static SettingUtil *instance;
};
```

```cpp
SettingUtil *SettingUtil::instance = nullptr;
SettingUtil *SettingUtil::Instance() {
    if (!instance) {
        static QMutex mutex;
        QMutexLocker locker(&mutex);
        if (!instance) {
            instance = new SettingUtil;
        }
    }
    return instance;
}



SettingUtil::~SettingUtil() {
    settings_->deleteLater();
}

void SettingUtil::Initial() {
    settings_ = new QSettings("./settings.ini", QSettings::IniFormat);
    QString rember_name = GetInfo(RemberName);
    if(rember_name.isEmpty()) {
        SetInfo(RemberName, "0");
    }
}

void SettingUtil::SetInfo(const SettingUtil::SettingKeys &key, const QString &value) {
    switch (key) {
        case 0:
            settings_->setValue("Backup_Time", value);
            break;
        case 1:
            settings_->setValue("Rember_Name", value);
            break;
        default:
            break;
    }
}

void SettingUtil::GetInfo(const SettingUtil::SettingKeys &key, QString &value) {
    value = GetInfo(key);
}

const QString SettingUtil::GetInfo(const SettingUtil::SettingKeys key) {
    QString value;
    switch (key) {
        case 0:
            value = settings_->value("Backup_Time").toString();
            break;
        case 1:
            value = settings_->value("Rember_Name").toString();
            break;
        default:
            break;
    }
    return value;
}
```
##### 使用：
&emsp;&emsp;软件开始先初始化
```cpp
SettingUtil::Instance()->Initial();
```
&emsp;&emsp;是否记住用户名
```cpp
void LoginManager::event_Widget_LoginType(
    const qint32 &type, QString &str, const qint32 &isrember) {
    switch (type) {
        case GlobalEnum::RemberName: {
                if(isrember == 1) {
                    SettingUtil::Instance()->SetInfo(SettingUtil::RemberName, str);
                }   else if(isrember == 2) {
                    str = SettingUtil::Instance()->GetInfo(SettingUtil::RemberName);
                } else {
                    SettingUtil::Instance()->SetInfo(SettingUtil::RemberName, "noRember");
                }
            }
            break;
```
&emsp;&emsp;7天不在弹出弹窗

```cpp
    //压缩备份数据
    bool result = true;
    result &= JlCompress::compressDir("./backup/session.bak", "./session");
    result &= JlCompress::compressDir("./backup/backup.bak", "./", false);
    SettingUtil::instance()->SetBackupTime(QDateTime::currentMSecsSinceEpoch());
    qDebug() << "backup result:" << result;
    emit SignalBackupFinish(result);
    start_flag_ = false;
```

```cpp
    //检查上一次备份数据库时间
    qint64 last_backup_time = SettingUtil::instance()->GetBackupTime();
    if (QDateTime::currentDateTime().toMSecsSinceEpoch() - last_backup_time >
            1000l * 60 * 60 * 24 * 90) { //超过90天
        QMessageBox box;
        QCheckBox *check = new QCheckBox(QString(tr("%1天内不再提醒")).arg(90));
        box.setWindowTitle(tr("提示"));
        box.setText(tr("请及时备份数据库"));
        box.addButton(QMessageBox::Ok);
        box.setCheckBox(check);
        box.exec();
        if (check->isChecked()) {
            SettingUtil::instance()->SetBackupTime(QDateTime::currentMSecsSinceEpoch());
        }
    }
```

