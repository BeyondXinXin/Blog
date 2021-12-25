前言：
&emsp;&emsp;要做一个简单的开源dcm浏览器 [KISS Dicom Viewer](https://blog.csdn.net/a15005784320/article/details/108678403) ，小型pacs服务肯定必不可少。开发中到处找现成代码，基本上找到的资源都是一个发布版，很少有可以用来研究的源码。 [KISS Dicom Viewer](https://blog.csdn.net/a15005784320/article/details/108678403) 目前处于开发阶段，最近几篇博客就用来记录下开发一个小型pacs数据库（Qt+Dcmtk）的过程。提供服务包括：通讯测试echo、远程查询findscu、远程下载get/move、本机存储storescp。


&emsp;&emsp;Dicom协议、通讯原理等等，网上有很多优秀的中文博客来说明，这里就不介绍了。


---

&emsp;&emsp;如果你需要定义自己的 dicom数据库，可以看下我整理的：

---

@[TOC](Dcmtk Pacs 开发：小型dicom数据库（sqlite）)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201013194253667.gif#pic_center)


# 数据库结构

&emsp;&emsp;正常的完善的pacs系统的话一般是搞四张表，分别存储 **PATIENT、STUDY、SERIES、IMAGE**。因为我仅仅是开发一个小型的dcm浏览器，数据就建两张表 **STUDY 和 IMAGE**。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201013192330420.png#pic_center)
创建语句

```cpp
 str = "CREATE TABLE IF NOT EXISTS StudyTable("
          "StudyUid VARCHAR(128) PRIMARY KEY NOT NULL,"
          "AccNumber VARCHAR(64) NOT NULL, PatientId VARCHAR(64) NOT NULL,"
          "PatientName VARCHAR(64), "
          "PatientSex VARCHAR(2) NOT NULL,"
          "PatientBirth DATE NOT NULL,"
          "PatientAge VARCHAR(6),"
          "StudyTime DATETIME NOT NULL,"
          "Modality VARCHAR(2) NOT NULL, "
          "StudyDesc TEXT)";
 str = "CREATE TABLE IF NOT EXISTS ImageTable("
          "ImageUid VARCHAR(128) PRIMARY KEY NOT NULL,"
          "SopClassUid VARCHAR(128) NOT NULL,"
          "SeriesUid VARCHAR(128) NOT NULL, "
          "StudyUid VARCHAR(128) NOT NULL,"
          "RefImageUid VARCHAR(128),"
          "ImageNo VARCHAR(16), "
          "ImageTime DATETIME NOT NULL,"
          "ImageDesc TEXT,"
          "ImageFile TEXT,"
          "FOREIGN KEY(StudyUid) REFERENCES StudyTable(StudyUid))";
```

# 数据库可视化  QSqlTableModel+QTableView
&emsp;&emsp;qt对于数据库的可视化封装基本上很完善了，sqlmode+tableview 可以快速实现数据库的可视化。只有两张表 **STUDY 和 IMAGE**，就是上边选中STUDY后下边的IMAGE会对应弹出该STUDY的IMAGE。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201013193202905.png#pic_center)

```cpp
class SqlImageModel : public QSqlTableModel {
    Q_OBJECT
  public:
    enum ColumnType {
        ImageUid,
        SopClassUid,
        SeriesUid,
        StudyUid,
        RefImageUid,
        ImageNo,
        ImageTime,
        ImageDesc,
        ImageFile,
        ColumnCount,
    };
    explicit SqlImageModel(QObject *parent = nullptr, QSqlDatabase db = QSqlDatabase());
    QVariant headerData(int section, Qt::Orientation orientation = Qt::Horizontal,
                        int role = Qt::DisplayRole) const;

    QStringList getAllImageFiles() const;
  Q_SIGNALS:
    void viewImages(const QStringList &imageFiles);
    void Signal_RemoveFinished();
  public Q_SLOTS:
    bool select();
  public Q_SLOTS:
    void SLot_ViewImages(const QModelIndexList &indexes);
    void SLot_ViewAllImages();
    void Slot_RemoveImages(const QModelIndexList &indexes);
    void Slot_RemoveAllImages();
    void Slot_StudySelected(const QStringList &studyUids);


};
```

```cpp
class SqlStudyModel : public QSqlTableModel {
    Q_OBJECT
  public:
    enum ColumnType {
        StudyUid,
        AccNumber,
        PatientId,
        PatientName,
        PatientSex,
        PatientBirth,
        PatientAge,
        StudyTime,
        Modality,
        StudyDesc,
//        ColumnCount,
    };

    explicit SqlStudyModel(QObject *parent = nullptr,
                           QSqlDatabase db = QSqlDatabase());

    QVariant headerData(int section,
                        Qt::Orientation orientation, int role = Qt::DisplayRole) const;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const;
    QString getFirstSelectedStudyUid() const;

  public Q_SLOTS:
    bool select();

  Q_SIGNALS:
    void Signal_studySelectionChanged(const QStringList &studyUids);
    void Signal_NewStudy(const QSqlRecord &studyRec);
    void Signal_NewImage(const QSqlRecord &studyRec);
    void Signal_RemoveFinished();

  public Q_SLOTS:
    void Slot_SelectionChanged(const QModelIndexList &indexes);
    void Slot_RemoveStudies();
    void Slot_NewStudy(const QModelIndex &index);
    void Slot_NewImage(const QModelIndex &index);

  private:
    QStringList selected_study_uids_;
    StudyRecord *mod_study_;
    int modify_row_;

};
```

```cpp
class SqlStudyTabView : public KissTabView {
    Q_OBJECT
  public:
    explicit SqlStudyTabView(QAbstractTableModel *model, QWidget *parent = nullptr);
    ~SqlStudyTabView() {}
  Q_SIGNALS:
    void Signal_ViewImages();
    void Signal_RemoveStudies();
    void Singal_StudySelectionChanged(const QModelIndexList &indexes);
  protected slots:
    void selectionChanged(const QItemSelection &selected,
                          const QItemSelection &deselected);
    void contextMenuEvent(QContextMenuEvent *e);
  private:
    void SetupContextMenu();
    void HideColumns();
  private:
    QStringList study_uids_;
    QAction *view_image_;
    QAction *remove_study_;
};
```

```cpp
class SqlImageTabView : public KissTabView {
    Q_OBJECT
  public:
    explicit SqlImageTabView(QAbstractTableModel *model, QWidget *parent = nullptr);
    ~SqlImageTabView() {}
  Q_SIGNALS:
    void Signal_ViewImages(const QModelIndexList &indexes);
    void Signal_RemoveImages(const QModelIndexList &indexes);
  private:
    void SetupContextMenu();
    void HideColumns();
  private:
    QAction *view_image_action_;
    QAction *remove_image_action_;
};
```
# 数据库查询
&emsp;&emsp;QSqlTableModel可以很快速便捷的实现模型的检索
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201013193758836.png#pic_center)

```cpp
void StudyExplorerWidget::SetStudyFilter() {
    QString filter, temp;
    if (ui->fromCheckBox->isChecked()) {
        filter = QString("StudyTime>\'%1\'").arg(
                     ui->fromDateTimeEdit->dateTime().toString("yyyy-MM-dd hh:mm:ss"));
    }
    if (ui->toCheckBox->isChecked()) {
        if (!filter.isEmpty()) {
            filter.append(" and ");
        }
        filter.append(QString("StudyTime<\'%1\'").arg(
                          ui->toDateTimeEdit->dateTime().toString("yyyy-MM-dd hh:mm:ss")));
    }
    if (!ui->modalityCombo->currentText().isEmpty()) {
        if (!filter.isEmpty()) {
            filter.append(" and ");
        }
        filter.append(QString("Modality=\'%1\'").arg(ui->modalityCombo->currentText()));
    }
    if (!ui->patientIDEdit->text().isEmpty()) {
        temp = ui->patientIDEdit->text();
        temp.replace(QChar('*'), QChar('%'));
        temp.replace(QChar('?'), QChar('_'));
        if (!filter.isEmpty()) {
            filter.append(" and ");
        }
        filter.append(QString("PatientId LIKE \'%%1%\'").arg(temp));
    }
    if (!ui->patientNameEdit->text().isEmpty()) {
        temp = ui->patientNameEdit->text();
        temp.replace(QChar('*'), QChar('%'));
        temp.replace(QChar('?'), QChar('_'));
        if (!filter.isEmpty()) {
            filter.append(" and ");
        }
        filter.append(QString("PatientName LIKE \'%%1%\'").arg(temp));
    }
    if (!ui->accNumberEdit->text().isEmpty()) {
        temp = ui->accNumberEdit->text();
        temp.replace(QChar('*'), QChar('%'));
        temp.replace(QChar('?'), QChar('_'));
        if (!filter.isEmpty()) {
            filter.append(" and ");
        }
        filter.append(QString("AccNumber LIKE \'%%1%\'").arg(temp));
    }
    this->RefreshReadStudyModel(filter);
}

void StudyExplorerWidget::RefreshReadStudyModel(const QString &filter) {
    bool close = false;
    if(DbManager::IsOpenedDb()) {
    } else {
        if (DbManager::OpenDb()) {
            close = true;
        }
    }
    study_model_->setFilter(filter);
    study_model_->select();
    if(close) {
        DbManager::CloseDb();
    }
}
```

# 数据库增删改查
&emsp;&emsp;需求很简单，我这里使用sql语句实现。

```cpp
#ifndef STUDYDAO_H
#define STUDYDAO_H

#include "Db/dbmanager.h"

class StudyRecord;
class ImageRecord;

class StudyDao : public QObject {
    Q_OBJECT
  public:
    static const QString study_table_name_;
    static const QString image_table_name_;
  public:
    explicit StudyDao(QObject *parent = nullptr);
    virtual ~StudyDao() override;
    bool InsertStudyToDb(const StudyRecord &study, bool imported = false);
    bool RemoveStudyFromDb(const QString &study_uid);
    bool VerifyStudyByStuid(const QString &study_uid);
    //
    bool InsertImageToDb(const ImageRecord &image, bool imported = false);
    bool RemoveImageFromDb(const QString &image_uid, bool updateStudy = true);
    bool RemoveAllImagesOfStudyFromDb(const QString &study_uid, bool updateStudy = true);
    bool UpdateImageFile(const QString &image_uid, const QString &image_file);
    bool VerifyImageByIMmuid(const QString &image_uid);
  public:
    static bool Initial();
  private:
    static bool CreateTable();
    static bool CheckTable();
  private:
};

#endif // STUDYDAO_H

```

```cpp
#include "studydao.h"
#include <Global/KissGlobal>


const QString StudyDao::study_table_name_ = "StudyTable";
const QString StudyDao::image_table_name_ = "ImageTable";

StudyDao::StudyDao(QObject *parent):
    QObject(parent) {
}

StudyDao::~StudyDao() {
}

bool StudyDao::InsertStudyToDb(const StudyRecord &study, bool imported) {
    Q_UNUSED(imported)
    bool success = false;
    if(DbManager::OpenDb()) {
        QMap<QString, QVariant> data;
        data.insert("StudyUid", study.study_uid_);
        data.insert("AccNumber", study.acc_number_);
        data.insert("PatientId", study.patient_id_);
        data.insert("PatientName", study.patient_name_);
        data.insert("PatientSex", study.patient_sex_);
        if(study.patient_birth_.toString("yyyy-MM-dd").isEmpty()) {
            data.insert("PatientBirth", "");
        } else {
            data.insert("PatientBirth", study.patient_birth_.toString("yyyy-MM-dd"));
        }
        data.insert("PatientAge", study.patient_age_);
        data.insert("StudyTime", study.study_time_.toString(NORMAL_DATETIME_FORMAT));
        data.insert("Modality", study.modality_);
        data.insert("StudyDesc", study.study_desc_);
        if (DbManager::insert(study_table_name_, data)) {
            success = true;
        }
    }
    DbManager::CloseDb();
    return success;
}

bool StudyDao::RemoveStudyFromDb(const QString &study_uid) {
    bool success = false;
    if (study_uid.isEmpty()) {
        return false;
    }
    if(DbManager::OpenDb()) {
        QString where = QString("StudyUid = '%1'").arg(study_uid);
        if (DbManager::remove(study_table_name_, where)) {
            success = true;
        }
    }
    DbManager::CloseDb();
    this->RemoveAllImagesOfStudyFromDb(study_uid, false);
    return success;
}

/**
 * @brief StudyDao::VerifyStudyByStuid
 * @param study_uid
 * @return
 */
bool StudyDao::VerifyStudyByStuid(const QString &study_uid) {
    bool success = false;
    if (study_uid.isEmpty()) {
        return false;
    }
    if(DbManager::OpenDb()) {
        QStringList key_list;
        key_list.append("StudyUid");
        QString where = QString("StudyUid = '%1'").arg(study_uid);
        QList<QMap<QString, QVariant>> res;
        if (DbManager::select(study_table_name_, key_list, res, where)) {
            if (res.size() == 1) {
                success = true;
            }
        }
    }
    DbManager::CloseDb();
    return success;
}

bool StudyDao::InsertImageToDb(const ImageRecord &image, bool imported) {
    Q_UNUSED(imported)
    bool success = false;
    if(DbManager::OpenDb()) {
        QMap<QString, QVariant> data;
        data.insert("ImageUid", image.image_uid_);
        data.insert("SopClassUid", image.sop_class_uid_);
        data.insert("SeriesUid", image.series_uid_);
        data.insert("StudyUid", image.study_uid_);
        data.insert("RefImageUid", image.ref_image_uid_);
        data.insert("ImageNo", image.image_number_);
        data.insert("ImageTime", image.image_yime_.toString(NORMAL_DATETIME_FORMAT));
        data.insert("ImageDesc", image.image_desc_);
        data.insert("ImageFile", image.image_file_);
        if (DbManager::insert(image_table_name_, data)) {
            success = true;
        }
    }
    DbManager::CloseDb();
    return success;
}

bool StudyDao::RemoveImageFromDb(const QString &image_uid, bool updateStudy) {
    Q_UNUSED(updateStudy)
    bool success = false;
    // select data && Remove file
    if (image_uid.isEmpty()) {
        return false;
    }
    if (DbManager::OpenDb()) {
        QStringList key_list;
        key_list.append("ImageFile");
        QString where = QString("ImageUid = '%1'").arg(image_uid);
        QList<QMap<QString, QVariant>> res;
        if (DbManager::select(image_table_name_, key_list, res, where)) {
            if (res.size() == 1) {
                const QMap<QString, QVariant> &res0 = res.at(0);
                if (res0.size() == 1) {
                    QString image_file = res0.value("ImageFile").toString();
                    QString file = QString("./DcmFile/%2").arg(image_file);
                    // QString dir_name = file.left(file.lastIndexOf('/'));
                    FileUtil::DeleteFileOrFolder(file);
                    success = true;
                } else {
                }
            } else {
            }
        }
    }
    DbManager::CloseDb();
    // remove data
    if(DbManager::OpenDb()) {
        QString where = QString("ImageUid = '%1'").arg(image_uid);
        if (DbManager::remove(image_table_name_, where)) {
            success = true;
        }
    }
    DbManager::CloseDb();
    return success;
}

bool StudyDao::RemoveAllImagesOfStudyFromDb(
    const QString &study_uid, bool updateStudy) {
    Q_UNUSED(updateStudy)
    if (study_uid.isEmpty()) {
        return false;
    }
    bool result = false;
    //
    QStringList image_uids;
    // select data
    if (DbManager::OpenDb()) {
        QStringList key_list;
        key_list.append("ImageUid");
        QString where = QString("StudyUid = '%1'").arg(study_uid);
        QList<QMap<QString, QVariant>> res;
        if (DbManager::select(image_table_name_, key_list, res, where)) {
            if (res.size() >= 1) {
                for (int i = 0; i < res.size(); i++) {
                    const QMap<QString, QVariant> &res0 = res.at(i);
                    if (res0.size() == 1) {
                        image_uids << res0.value("ImageUid").toString();
                    }
                }
            }
        }
    }
    DbManager::CloseDb();
    // remove data
    foreach (auto var, image_uids) {
        RemoveImageFromDb(var);
    }
    return result;
}

bool StudyDao::UpdateImageFile(const QString &image_uid, const QString &image_file) {
    if (image_uid.isEmpty()) {
        return false;
    }
    if (image_file.isEmpty()) {
        return false;
    }
    bool result = false;
    // Create StudyTable
    QString str ;
    str = "UPDATE ImageTable SET ImageFile=%1 WHERE ImageUid=%2";
    str = str.arg(image_uid, image_file);
    result = DbManager::ExecSqlStr(str);
    return result;
}

bool StudyDao::VerifyImageByIMmuid(const QString &image_uid) {
    bool success = false;
    if (image_uid.isEmpty()) {
        return false;
    }
    if(DbManager::OpenDb()) {
        QStringList key_list;
        key_list.append("ImageUid");
        QString where = QString("ImageUid = '%1'").arg(image_uid);
        QList<QMap<QString, QVariant>> res;
        if (DbManager::select(image_table_name_, key_list, res, where)) {
            if (res.size() == 1) {
                success = true;
            }
        }
    }
    DbManager::CloseDb();
    return success;
}

bool StudyDao::Initial() {
    bool result = false;
    if (DbManager::OpenDb()) {
        bool exist;
        if (DbManager::IsExistTable(study_table_name_, exist)) {
            if (!exist) {
                result = CreateTable();
            } else {
                if (CheckTable()) {
                    result = true;
                } else {
                    if (DbManager::RemoveTable(study_table_name_)) {
                        result = CreateTable();
                    }
                }
            }
        }
    }
    DbManager::CloseDb();
    return result;
}

bool StudyDao::CreateTable() {
    bool result = false;
    // Create StudyTable
    QString str ;
    str = "CREATE TABLE IF NOT EXISTS StudyTable("
          "StudyUid VARCHAR(128) PRIMARY KEY NOT NULL,"
          "AccNumber VARCHAR(64) NOT NULL, PatientId VARCHAR(64) NOT NULL,"
          "PatientName VARCHAR(64), "
          "PatientSex VARCHAR(2) NOT NULL,"
          "PatientBirth DATE NOT NULL,"
          "PatientAge VARCHAR(6),"
          "StudyTime DATETIME NOT NULL,"
          "Modality VARCHAR(2) NOT NULL, "
          "StudyDesc TEXT)";
    result = DbManager::ExecSqlStr(str);
    str = "CREATE INDEX IF NOT EXISTS IX_StudyTable_StudyDate ON StudyTable(StudyTime)";
    result = DbManager::ExecSqlStr(str);
    // Create ImageTable
    str = "CREATE TABLE IF NOT EXISTS ImageTable("
          "ImageUid VARCHAR(128) PRIMARY KEY NOT NULL,"
          "SopClassUid VARCHAR(128) NOT NULL,"
          "SeriesUid VARCHAR(128) NOT NULL, "
          "StudyUid VARCHAR(128) NOT NULL,"
          "RefImageUid VARCHAR(128),"
          "ImageNo VARCHAR(16), "
          "ImageTime DATETIME NOT NULL,"
          "ImageDesc TEXT,"
          "ImageFile TEXT,"
          "FOREIGN KEY(StudyUid) REFERENCES StudyTable(StudyUid))";
    result = DbManager::ExecSqlStr(str);
    str = "CREATE INDEX IF NOT EXISTS IX_ImageTable_ImageTime ON ImageTable(ImageTime)";
    result = DbManager::ExecSqlStr(str);
    return result;
}

bool StudyDao::CheckTable() {
    bool ok1 = false;
    bool ok2 = false;
    if (DbManager::IsExistTable(study_table_name_, ok1) &&
            DbManager::IsExistTable(image_table_name_, ok2) ) {
        if (ok1 && ok2) {
            return true;
        }
    }
    return false;
}
```

```cpp
#ifndef DBMANAGER_H
#define DBMANAGER_H

#include <QObject>
#include <QMutex>
#include <QSqlDatabase>

namespace Kiss {
    class DbManager : public QObject {
        Q_OBJECT
      public :
        enum SQLiteType {
            dtNull = 0,//空值类型
            dtInteger = 1,//有符号整数
            dtReal = 2,//有符号浮点数，8字节
            dtText = 3,//文本字符串
            dtBlob = 4,//根据输入类型
            dtVarchar_64 = 5,
            dtTimeStamp = 6,
            dtTimeStamp_NotNull = 7,
        };
      public:
        static bool DbInitial();
        static bool Deallocate();
        static bool CreateDbFile();
        static bool IsOpenedDb();
        static bool OpenDb();
        static bool CloseDb();
        static bool IsExistTable(const QString &table_name, bool &result);
        static bool CreateTable(const QString &table_name,
                                const QStringList &key_list,
                                const QList<SQLiteType> &type_list);
        static bool RemoveTable(const QString &table_name);
        static bool IsExistColumn(const QString &table_name,
                                  const QString &column_name,
                                  bool &result);
        static bool update(const QString &table_name,
                           const QMap<QString, QVariant> &values,
                           const QString &where);
        static bool remove(const QString &table_name,
                           const QString &where = "");
        static bool insert(const QString &table_name,
                           const QMap<QString, QVariant> &values);
        static bool select(const QString &table_name,
                           const QStringList &colunms,
                           QList<QMap<QString, QVariant>> &values,
                           const QString &where = "");
        static bool ExecSqlStr(const QString &sql_str);
      signals:
      public slots:
      private:
        explicit DbManager(QObject *parent = nullptr);
        virtual ~DbManager() override;
      public:
        static QSqlDatabase data_base;
      private:
        static QMutex file_mutex_;
        static QMutex data_mutex_;
        static QString db_name_;
        static QString file_name_;
        static QStringList sqlite_type_string_;
        static bool init_;
    };
}

using namespace Kiss;
#endif // DBMANAGER_H

```

```cpp
#include "dbmanager.h"

#include <Global/KissGlobal>

QSqlDatabase DbManager::data_base;
QMutex DbManager::file_mutex_;
QMutex DbManager::data_mutex_;
QString DbManager::db_name_ = DB_CONNECTION_NAME;
QString DbManager::file_name_ = DB_NAME;
QStringList DbManager::sqlite_type_string_;
bool DbManager::init_ = false;

bool DbManager::DbInitial() {
    QMutexLocker locker(&data_mutex_);
    if (!init_) {
        init_ = true;
        if (QSqlDatabase::contains(db_name_)) {
            data_base = QSqlDatabase::database(db_name_);
        } else {
            data_base = QSqlDatabase::addDatabase("QSQLITE", db_name_);
        }
        sqlite_type_string_.append("NULL");
        sqlite_type_string_.append("INTEGER");
        sqlite_type_string_.append("REAL");
        sqlite_type_string_.append("TEXT");
        sqlite_type_string_.append("BLOB");
        sqlite_type_string_.append("VARCHAR ( 64 )");
        sqlite_type_string_.append("TimeStamp");
        sqlite_type_string_.append("TimeStamp NOT NULL");
        return true;
    }
    return true;
}

bool DbManager::Deallocate() {
    QMutexLocker locker(&data_mutex_);
    data_base = QSqlDatabase();
    if (QSqlDatabase::contains(db_name_)) {
        QSqlDatabase::removeDatabase(db_name_);
    }
    return true;
}

bool DbManager::CreateDbFile() {
    if (!QFile::exists(file_name_)) {
        QFile db_file(file_name_);
        if (!db_file.open(QIODevice::WriteOnly)) {
            db_file.close();
            qWarning() << "dbFile open failed";
            return false;
        }
        db_file.close();
    }
    return true;
}

bool DbManager::IsOpenedDb() {
    QMutexLocker locker(&data_mutex_);
    return data_base.isOpen();
}

bool DbManager::OpenDb() {
    file_mutex_.lock();
    if (!IsOpenedDb()) {
        QMutexLocker locker(&data_mutex_);
        data_base.setDatabaseName(file_name_);
        if (!data_base.open()) {
            qWarning() << "database open error:" << data_base.lastError().text();
            return false;
        }
    }
    return true;
}

bool DbManager::CloseDb() {
    file_mutex_.unlock();
    if (IsOpenedDb()) {
        QMutexLocker locker(&data_mutex_);
        data_base.close();
    }
    return true;
}

bool DbManager::IsExistTable(const QString &table_name, bool &result) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str = QString("SELECT 1 FROM sqlite_master "
                              "WHERE type = 'table' AND  "
                              "name = '%1'").arg(table_name);
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        if (query.next()) {
            qint32 sql_result = query.value(0).toInt(); //有表时返回1，无表时返回null
            if (sql_result) {
                result = true;
                return true;
            } else {
                result = false;
                return true;
            }
        } else {
            result = false;
            return true;
        }
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::CreateTable(const QString &table_name,
                            const QStringList &key_list,
                            const QList<DbManager::SQLiteType> &type_list) {
    if (key_list.size() != type_list.size()) {
        qWarning() << "keylist != typelist error";
        return false;
    }
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_1 = QString("CREATE TABLE %1 (").arg(table_name);
    QString sql_str_2 = "%1 %2 PRIMARY KEY ,";
    QString sql_str_temp = "%1 %2 ,";
    sql_str_2 = sql_str_2
                .arg(key_list.at(0))
                .arg(sqlite_type_string_.at(type_list.at(0)));
    for (qint32 i = 1; i < type_list.size(); ++i) {
        sql_str_2 += sql_str_temp.arg(key_list.at(i))
                     .arg(sqlite_type_string_.at(type_list.at(i)));
    }
    sql_str_2 = sql_str_2.left(sql_str_2.size() - 1);
    QString sql_str_3 = ");";
    QString sql_str = sql_str_1 + sql_str_2 + sql_str_3;
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::RemoveTable(const QString &table_name) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str = QString("DROP TABLE '%1'").arg(table_name);
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::IsExistColumn(const QString &table_name,
                              const QString &column_name,
                              bool &result) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str = QString("SELECT 1 FROM sqlite_master "
                              "WHERE type = 'table' and "
                              "name = '%1' and sql like '%%2%' "
                             ).arg(table_name).arg(column_name);
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        if (query.next()) {
            qint32 sql_result = query.value(0).toInt(); //有此字段时返回1，无字段时返回null
            if (sql_result) {
                result = true;
                return true;
            } else {
                result = false;
                return true;
            }
        } else {
            result = false;
            return true;
        }
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::update(const QString &table_name,
                       const QMap<QString, QVariant> &values,
                       const QString &where) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_data;
    QList<QString> key_list = values.keys();
    foreach (QString key, key_list) {
        if (!sql_str_data.isEmpty()) {
            sql_str_data += ",";
        }
        sql_str_data += QString("%1=?").arg(key);
    }
    QString sql_str;
    if (where.isEmpty()) {
        sql_str = QString("UPDATE %1 SET %2"
                         ).arg(table_name).arg(sql_str_data);
    } else {
        sql_str = QString("UPDATE %1 SET %2 WHERE %3"
                         ).arg(table_name).arg(sql_str_data).arg(where);
    }
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    query.prepare(sql_str);
    for (qint32 i = 0; i < key_list.count(); ++i) {
        query.bindValue(i, values.value(key_list.at(i)));
    }
    if (query.exec()) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::remove(const QString &table_name,
                       const QString &where) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QMutexLocker locker(&data_mutex_);
    QString sql_str = QString("DELETE FROM %1 WHERE %2"
                             ).arg(table_name).arg(where);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::insert(const QString &table_name,
                       const QMap<QString, QVariant> &values) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_column, sql_str_data;
    QList<QString> key_list = values.keys();
    foreach (QString key, key_list) {
        if (!sql_str_column.isEmpty()) {
            sql_str_column += ",";
        }
        sql_str_column += key;
        if (!sql_str_data.isEmpty()) {
            sql_str_data += ",";
        }
        sql_str_data += "?";
    }
    QString sql_str = QString("INSERT INTO %1(%2) VALUES(%3)")
                      .arg(table_name).arg(sql_str_column).arg(sql_str_data);
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    query.prepare(sql_str);
    for (qint32 i = 0; i < key_list.count(); ++i) {
        query.bindValue(i, values.value(key_list.at(i)));
    }
    if (query.exec()) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

bool DbManager::select(const QString &table_name,
                       const QStringList &colunms,
                       QList<QMap<QString, QVariant>> &values,
                       const QString &where) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_columns;
    if (colunms.size()) {
        sql_str_columns = colunms.join(",");
    } else {
//        sql_str_columns = "*";
        qWarning() << "colunms is null";
        return false;
    }
    QString sql_str;
    if (where.isEmpty()) {
        sql_str = QString("SELECT %1 FROM %2")
                  .arg(sql_str_columns)
                  .arg(table_name);
    } else {
        sql_str = QString("SELECT %1 FROM %2 WHERE %3")
                  .arg(sql_str_columns)
                  .arg(table_name).arg(where);
    }
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        qint32 columns_sum = query.record().count();
        while (query.next()) {
            QMap<QString, QVariant> row;
            for (qint32 i = 0; i < columns_sum; ++i) {
                row.insert(colunms.at(i), query.value(i));
            }
            values.append(row);
        }
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError();
        return false;
    }
}

bool DbManager::ExecSqlStr(const QString &sql_str) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QMutexLocker locker(&data_mutex_);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "sqlstr exec error:" << data_base.lastError().text();
        return false;
    }
}

DbManager::DbManager(QObject *parent) : QObject(parent) {
}

DbManager::~DbManager() {
}


```
# 添加数据 StoreScp
&emsp;&emsp;[Dcmtk Pacs 开发：StoreScp 实现](https://blog.csdn.net/a15005784320/article/details/109058249)

# 添加数据 本地加载
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201013194053481.png#pic_center)
&emsp;&emsp;两个线程，一个负责打开本地dcm文件，一个往数据库添加

```cpp
#include "importdcmfilethread.h"

#include <Db/KissDb>
#include <Global/KissGlobal>

#include "dcmtk/dcmdata/dcuid.h"


ImportDcmFileThread::ImportDcmFileThread(ImportStudyModel *model, QObject *parent) :
    QThread(parent) {
    this->abort_ = false;
    this->import_model_ = model;
}

void ImportDcmFileThread::run() {
    StudyDao dao;
    foreach (StudyRecord *study, import_model_->getStudyList()) {
        if (abort_) {
            break;
        }
        int images = 0;
        QString study_dir_name =
            QString("%1/%2_%3").arg(study->study_time_.date().toString("yyyyMM"),
                                    study->study_time_.toString(DICOM_DATETIME_FORMAT),
                                    study->acc_number_);
        if(!dao.VerifyStudyByStuid(study->study_uid_)) {
            dao.InsertStudyToDb(*study, true);
        }
        FileUtil::DirMake(QString("%1/%2").arg(DICOM_SAVE_PATH, study_dir_name));
        foreach (ImageRecord *image, study->image_list_) {
            bool raw = image->sop_class_uid_ == QString(UID_XRayAngiographicImageStorage);
            QString src_file = image->image_file_;
            image->image_file_ = QString("%1/%2_%3.dcm").arg(study_dir_name,
                                 raw ? "angio" : "", image->image_uid_);
            QFileInfo info(QString("%1/%2").arg(DICOM_SAVE_PATH, image->image_file_));
            if (FileUtil::FileCopy(src_file, QString("%1/%2").arg(DICOM_SAVE_PATH, image->image_file_))) {
                if (!dao.VerifyImageByIMmuid(image->image_uid_)) {
                    if (dao.InsertImageToDb(*image, true)) {
                        images++;
                    } else {
                    }
                } else {
                    if (dao.UpdateImageFile(image->image_uid_, image->image_file_)) {
                        images++;
                    } else {
                        FileUtil::DeleteFileOrFolder(
                            QString("%1/%2").arg(DICOM_SAVE_PATH, image->image_file_));
                    }
                }
            }
            image->image_file_ = src_file;
            emit Signal_ResultReady();
        }
        study->status_ = tr("Imported: Images %1.").arg(images);
        import_model_->resetStudyStatus(study);
    }
}


void ImportDcmFileThread::SetAbort(bool yes) {
    abort_ = yes;
}


```

```cpp
#include "scandcmfilethread.h"

#include <Global/KissGlobal>

#include "dcmtk/config/osconfig.h"
#include "dcmtk/dcmdata/dcfilefo.h"
#include "dcmtk/dcmdata/dcdeftag.h"
#include "dcmtk/dcmsr/dsrdoc.h"
#include "dcmtk/dcmimgle/dcmimage.h"
#include "dcmtk/dcmdata/dcuid.h"


ScanDcmFileThread::ScanDcmFileThread(QObject *parent) :
    QThread(parent) {
    this->abort_ = false;
}

void ScanDcmFileThread::run() {
    using namespace Kiss;
    foreach (QString file, file_list_) {
        if (abort_) {
            break;
        }
        StudyRecord *study = nullptr;
        DcmFileFormat dcmFile;
        OFCondition cond = dcmFile.loadFile(file.toLocal8Bit().data());
        DcmDataset *dset = dcmFile.getDataset();
        if (cond.good() && dset) {
            const char *value = nullptr;
            QString studyUid, seriesUid, instUid, sopClassUid;
            dset->findAndGetString(DCM_StudyInstanceUID, value);
            studyUid = QString::fromLatin1(value);
            dset->findAndGetString(DCM_SeriesInstanceUID, value);
            seriesUid = QString::fromLatin1(value);
            dset->findAndGetString(DCM_SOPInstanceUID, value);
            instUid = QString::fromLatin1(value);
            dset->findAndGetString(DCM_SOPClassUID, value);
            sopClassUid = QString::fromLatin1(value);
            if (!(studyUid.isEmpty() || seriesUid.isEmpty() ||
                    instUid.isEmpty() || sopClassUid.isEmpty())) {
                study = new StudyRecord(studyUid);
                dset->findAndGetString(DCM_AccessionNumber, value);
                study->acc_number_ = QString::fromLocal8Bit(value).remove(QChar(' '));
                dset->findAndGetString(DCM_PatientID, value);
                study->patient_id_ = QString::fromLocal8Bit(value);
                dset->findAndGetString(DCM_PatientName, value);
                study->patient_name_ = QString::fromLocal8Bit(value);
                dset->findAndGetString(DCM_PatientSex, value);
                study->patient_sex_ = QString::fromLocal8Bit(value).remove(QChar(' '));
                dset->findAndGetString(DCM_PatientBirthDate, value);
                study->patient_birth_ = QDate::fromString(QString::fromLatin1(value), "yyyyMMdd");
                dset->findAndGetString(DCM_PatientAge, value);
                study->patient_age_ = QString::fromLocal8Bit(value).remove(QChar(' '));
                dset->findAndGetString(DCM_StudyDate, value);
                study->study_time_.setDate(QDate::fromString(QString::fromLatin1(value), "yyyyMMdd"));
                dset->findAndGetString(DCM_StudyTime, value);
                study->study_time_.setTime(formatDicomTime(QString::fromLatin1(value)));
                dset->findAndGetString(DCM_StudyDescription, value);
                study->study_desc_ = QString::fromLocal8Bit(value);
                dset->findAndGetString(DCM_InstitutionName, value);
                study->institution_ = QString::fromLocal8Bit(value);
                dset->findAndGetString(DCM_Modality, value);
                study->modality_ = QString::fromLatin1(value);
                if (sopClassUid == UID_XRayAngiographicImageStorage ||// 造影血管
                        true) {
                    ImageRecord *image = new ImageRecord(instUid);
                    image->sop_class_uid_ = sopClassUid;
                    image->series_uid_ = seriesUid;
                    image->study_uid_ = studyUid;
                    image->image_file_ = file;
                    study->image_list_.append(image);
                    dset->findAndGetString(DCM_ReferencedSOPInstanceUID, value, true);
                    image->ref_image_uid_ = QString::fromLatin1(value);
                    dset->findAndGetString(DCM_InstanceNumber, value);
                    image->image_number_ = QString::fromLatin1(value);
                    dset->findAndGetString(DCM_SeriesDescription, value);
                    image->image_desc_ = QString::fromLocal8Bit(value);
                    dset->findAndGetString(DCM_ContentDate, value);
                    image->image_yime_.setDate(
                        QDate::fromString(QString::fromLatin1(value), "yyyyMMdd"));
                    dset->findAndGetString(DCM_ContentTime, value);
                    image->image_yime_.setTime(formatDicomTime(QString::fromLatin1(value)));
                }
            }
        }
        if (study && (study->image_list_.isEmpty())) {
            delete study;
            study = nullptr;
        }
        emit Signal_ResultRecord(study);
        emit Signal_ResultReady();
    }
}

void ScanDcmFileThread::SetFiles(const QStringList &files) {
    file_list_ = files;
}

void ScanDcmFileThread::SetAbort(bool yes) {
    abort_ = yes;
}



```
