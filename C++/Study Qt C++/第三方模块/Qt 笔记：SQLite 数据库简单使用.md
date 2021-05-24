# Qt 笔记：SQLite 数据库简单使用

> 参考网站 
>  &emsp;&emsp;[菜鸟教程——数据库教程](https://www.runoob.com/)
>  &emsp;&emsp;[Qt学习之路2](https://www.devbean.net/2013/06/qt-study-road-2-database/
)

>  第三节完整测试代码  
>  &emsp;&emsp;[https://gitee.com/yaoxin001/StudySql](https://gitee.com/yaoxin001/StudySql)



@[TOC](Qt 笔记：使用数据库)

# 0 前言
&emsp;&emsp;基本上每次用数据库都是临时百度下自己的需求，或者找一个现成的轮子直接改一下用。对数据库这块总是一知半解。准备最近这几天花时间，了解下Qt使用数据库并做个记录，方便以后查阅。
&emsp;&emsp;Qt下使用数据库无非就两种MySQL和SQLite，具体使用那个看自己的需求，大致区分的话：

 - **MySQL** 有用户的概念，支持分布式，功能全面。
 &emsp; &emsp;如果开发服务器程序、数据量很大（几十万）、访问用户很多，建议MySQL。

 - **SQLite** 没有用户概念、体积小、完全基于单个文件系统的、使用最简单、Qt内置、速度比MySQL快，没有什么端口这种。
&emsp;&emsp;嵌入式、单机的软件、基于文件系统频繁写入写出文件、需要无服务器的、零配置的不用考虑直接用SQLite。

# 1 Qt使用数据库
&emsp;&emsp;Qt 提供了 QtSql 模块来提供平台独立的基于 SQL 的数据库操作（操作系统平台和数据库本身的平台）。Qt 的数据库操作还可以很方便的与 model/view 架构进行整合。通常来说，我们对数据库的操作更多地在于对数据库表的操作，而这正是 model/view 架构的长项。Qt 使用驱动（drivers）来与不同的数据库 API 进行交互。

驱动     | 数据库
-------- | -----
QMYSQL  |MySQL
QSQLITE  | SQLite 3

&emsp;&emsp;Qt 只默认搭载 QSqlite 驱动（包括Sqlite 数据库）也就是说，如果需要使用 Sqlite 的话，什么配置都不需要。其他数据库则不行。
&emsp;&emsp;**如果熟悉sql语法请使用QSqlQuery类！**
&emsp;&emsp;**如果不熟悉sql语法请使用QSqlTableModel类和QSqlRelationalTableModel类！**


## 1.1 Qt查询安装好的数据库驱动
```cpp
QSqlDatabase::drivers();
```
&emsp;&emsp;找到系统中的全部驱动，只能使用出现在列表里的驱动。

## 1.2 Qt使用QtSql模块
&emsp;&emsp;如果需要用QtSql，则应该添加QtSql模块，添加方式：
qmake：
```cpp
// xxxx.pro/pri
QT += sql
```
cmake：
```cpp
// CMakeLists.txt
find_package(Qt5 Sql)
target_link_libraries(
    ${PROJECT_NAME}
    Qt5::Sql)
```
## 1.3 sql常用语句
- SELECT - 从数据库中提取数据
> SELECT column_name,column_name
FROM table_name;
- UPDATE - 更新数据库中的数据
> UPDATE table_name
SET column1=value1,column2=value2,...
WHERE some_column=some_value;
- DELETE - 从数据库中删除数据
> SELECT column_name,column_name
FROM table_name;
- INSERT INTO - 向数据库中插入新数据
> INSERT INTO table_name (column1,column2,column3,...)
VALUES (value1,value2,value3,...);
- CREATE TABLE - 创建新表
> CREATE TABLE table_name
(
column_name1 data_type(size),
column_name2 data_type(size),
column_name3 data_type(size),
....
);
- DROP TABLE - 删除表
> DROP TABLE table_name




# 2 QT下使用SQLite 
## 2.1 什么是SQLite
&emsp;&emsp;SQLite是一个进程内的库，实现了自给自足的、无服务器的、零配置的、事务性的 SQL 数据库引擎。它是一个零配置的数据库，这意味着与其他数据库一样，您不需要在系统中配置。
&emsp;&emsp;就像其他数据库，SQLite 引擎不是一个独立的进程，可以按应用程序需求进行静态或动态连接。SQLite 直接访问其存储文件。


## 2.2 为什么用SQLite
- 不需要一个单独的服务器进程或操作的系统（无服务器的）。
- SQLite 不需要配置，这意味着不需要安装或管理。
- 一个完整的 SQLite 数据库是存储在一个单一的跨平台的磁盘文件。
- SQLite 是非常小的，是轻量级的，完全配置时小于 400KiB，省略可选功能配置时小于250KiB。
- SQLite 是自给自足的，这意味着不需要任何外部的依赖。
- SQLite 事务是完全兼容 ACID 的，允许从多个进程或线程安全访问。
- SQLite 支持 SQL92（SQL2）标准的大多数查询语言的功能。
- SQLite 使用 ANSI-C 编写的，并提供了简单和易于使用的 API。
- SQLite 可在 UNIX（Linux, Mac OS-X, Android, iOS）和 Windows（Win32, WinCE, WinRT）中运行。

# 3 SQLite常用函数（Qt）
&emsp;&emsp;先新建几个全局变量，并初始化。

```cpp
enum SQLiteType {
    dbNull = 0,//空值类型
    dbInteger = 1,//有符号整数
    dbReal = 2,//有符号浮点数，8字节
    dbText = 3,//文本字符串
    dbBlob = 4,//根据输入类型
};
static QStringList sqlite_type_string_;
static QSqlDatabase data_base;
static QString db_name_ = "study_sql";
```

```cpp
  qDebug() << QSqlDatabase::drivers();
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
```

## 3.1 打开数据库

```cpp
// 打开数据库
bool OpenDb() {
    if (!IsOpenedDb()) {
        data_base.setDatabaseName(db_name_);
        if (!data_base.open()) {
            qWarning() << "database open error:" << data_base.lastError().text();
            return false;
        }
    }
    return true;
}
```


## 3.2 数据库是否开启状态
```cpp
// 数据库是否打开
bool IsOpenedDb() {
    return data_base.isOpen();
}
```

## 3.3 创建新表

```cpp
// 创建新表
bool CreateTab(const QString &table_name,
               const QStringList &key_list,
               const QList<SQLiteType> &type_list) {
    if (key_list.size() != type_list.size()) {
        qWarning() << "keylist != typelist error";
        return false;
    }
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_1 = QString("CREATE TABLE %1 (").arg(table_name);
    QString sql_str_3 = ");";
    QString sql_str_2 = "%1 %2 PRIMARY KEY ,";
    sql_str_2 = sql_str_2
                .arg(key_list.at(0))
                .arg(sqlite_type_string_.at(type_list.at(0)));
    QString sql_str_temp = "%1 %2 ,";
    for(qint32 i = 1; i < type_list.count(); i++) {
        sql_str_2 += sql_str_temp
                     .arg(key_list.at(i))
                     .arg(sqlite_type_string_.at(type_list.at(i)));
    }
    sql_str_2 = sql_str_2.left(sql_str_2.size() - 1);// 删除多余的 ，
    QString sql_str = sql_str_1 + sql_str_2 + sql_str_3;
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "CreateTab error!" << data_base.lastError().text();
        return false;
    }
}
```

## 3.4 删除表

```cpp
// 删除表
bool DropTab(const QString &table_name) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str = QString("DROP TABLE '%1'").arg(table_name);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "DropTab error!" << data_base.lastError().text();
        return false;
    }
}

```

## 3.5 判断表是否存在

```cpp
// 判断表是否存在
bool ExistTab(const QString &table_name, bool &result) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str = QString("SELECT 1 FROM sqlite_master "
                              "WHERE type = 'table' AND name = '%1'").arg(table_name);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        if (query.next()) {
            //有表时返回1，无表时返回null
            qint32 sql_result = query.value(0).toInt();
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
```

## 3.6 关闭数据库

```cpp
// 关闭数据库
bool CloseDb() {
    if (IsOpenedDb()) {
        data_base.close();
    }
    return true;
}
```

## 3.7 执行sql语句

```cpp
// 执行sql语句
bool ExeSqlStr(const QString &sql_str) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QSqlQuery query(data_base);
    if(query.exec(sql_str)) {
        qDebug() << query.record();
        return true;
    } else {
        qWarning() << "ExeSqlStr error!" << data_base.lastError().text();
        return false;
    }
}
```

## 3.8 查询sql

```cpp
// 查询结果并打印
bool Select(const QString &table_name,
            const QStringList &colunms = {"*"},
            const QString &where = "") {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QSqlQuery query(data_base);
    QString sql_str_columns;
    if(colunms.size()) {
        sql_str_columns = colunms.join(",");
    } else {
        qWarning() << "colunms is null";
        return false;
    }
    QString str_where = "";
    if (!where.isEmpty()) {
        str_where = "WHERE " + where;
    }
    QString sql_str = QString("SELECT %1 FROM %2 %3")
                      .arg(sql_str_columns)
                      .arg(table_name)
                      .arg(str_where);
    if (query.exec(sql_str)) {
        qint32 columns_sum = query.record().count();
        while (query.next()) {
            qDebug() << "-";
            for (qint32 i = 0; i < columns_sum; ++i) {
                qDebug() << i << query.value(i);
            }
        }
    } else {
        qWarning() << "select error!" << data_base.lastError().text();
    }
    qDebug() << "**************************************************";
    return true;
}
```

## 3.9 更新数据

```cpp
// 更新数据
bool Updata(const QString &table_name,
            const QMap<QString, QVariant> &values,
            const QString &where = "") {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString sql_str_data;
    foreach (auto var, values.keys()) {
        if(!sql_str_data.isEmpty()) {
            sql_str_data = sql_str_data + ",";
        }
        sql_str_data = sql_str_data +
                       QString("%1=?").arg(var);
    }
    QString str_where = "";
    if (!where.isEmpty()) {
        str_where = "WHERE " + where;
    }
    QString sql_str = QString("UPDATE %1 SET %2 %3")
                      .arg(table_name)
                      .arg(sql_str_data)
                      .arg(str_where);
    QSqlQuery query(data_base);
    query.prepare(sql_str);
    QList<QString> key_list = values.keys();
    for (qint32 i = 0; i < key_list.count(); ++i) {
        query.bindValue(i, values.value(key_list.at(i)));
    }
    if(query.exec()) {
        return true;
    } else {
        qWarning() << "updata error!" << data_base.lastError().text();
        return false;
    }
}
```

## 3.10 删除数据

```cpp
// 删除数据
bool Delete(const QString &table_name,
            const QString &where = "") {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString str_where = "";
    if (!where.isEmpty()) {
        str_where = "WHERE " + where;
    } else {
        qWarning() << "remove erro!" << "where isEmpty ";
        return false;
    }
    QString sql_str = QString("DELETE FROM %1 %2"
                             ).arg(table_name).arg(str_where);
    QSqlQuery query(data_base);
    if (query.exec(sql_str)) {
        return true;
    } else {
        qWarning() << "remove erro!" << data_base.lastError().text();
        return false;
    }
}
```

## 3.11 插入数据				

```cpp
// 插入数据
bool Insert(const QString &table_name,
            const QMap<QString, QVariant> &values) {
    if (!IsOpenedDb()) {
        qWarning() << "database not open error!";
        return false;
    }
    QString str_column, str_value;
    QList<QString>key_list = values.keys();
    foreach (auto var, key_list) {
        if(!str_column.isEmpty()) {
            str_column += ",";
        }
        str_column += var;
        if(!str_value.isEmpty()) {
            str_value += ",";
        }
        str_value += "?";
    }
    QString sql_str = QString("INSERT INTO %1(%2) VALUES(%3)")
                      .arg(table_name).arg(str_column).arg(str_value);
    QSqlQuery query(data_base);
    query.prepare(sql_str);
    for (qint32 i = 0; i < key_list.count(); ++i) {
        query.bindValue(i, values.value(key_list.at(i)));
    }
    if (query.exec()) {
        return true;
    } else {
        qWarning() << "insert error!" << data_base.lastError().text();
        return false;
    }
}
```

## 3.12 测试

```cpp
#define study_OPEN_CLOSE 1
#define study_SELECT 1
#define study_UPDATE 1
#define study_DELETE 1
#define study_INSERT_INTO 1
#define study_CREATE_DROP_EXIST 1


int main(int, char *[]) {
#if study_OPEN_CLOSE // study open&&close
    qDebug() << QSqlDatabase::drivers();
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
    OpenDb();
#if study_SELECT  // study sql SELECT
    Select("test01");
    Select("test01", {"name", "abbreviation"}, "Whether31='1'");
#endif
#if study_UPDATE  // study sql  UPDATE
    Select("test01", {"name", "abbreviation"}, "Whether31='0'");
    QMap<QString, QVariant> values;
    values.insert("name", "28天的月");
    Updata("test01", values, "Whether31='0'");
    Select("test01", {"name", "abbreviation"}, "Whether31='0'");
    values["name"] = "二月";
    Updata("test01", values, "Whether31='0'");
    Select("test01", {"name", "abbreviation"}, "Whether31='0'");
#endif
#if study_DELETE  // study DELETE
    Select("test01");
    Delete("test01", "Whether31='0'");
    Select("test01");
#endif
#if study_INSERT_INTO  // study INSERT INTO
    Select("test01");
    QMap<QString, QVariant> values1;
    values1.insert("id", "2");
    values1.insert("name", "二月");
    values1.insert("全拼", "February");
    values1.insert("缩写", "Feb");
    values1.insert("多少天", "28");
    values1.insert("Whether31", "0");
    Insert("test01", values1);
    Select("test01");
#endif
#if study_CREATE_DROP_EXIST  // study INSERT INTO
    bool resutl;
    ExistTab("study_CREATE_DROP_EXIST", resutl);
    qDebug() << resutl;
    CreateTab("study_CREATE_DROP_EXIST",
    {"id", "name"},
    {SQLiteType::dbInteger, SQLiteType::dbText});
    ExistTab("study_CREATE_DROP_EXIST", resutl);
    QMap<QString, QVariant> values2, values3;
    values2.insert("id", "0");
    values2.insert("name", "张三");
    values3.insert("id", "1");
    values3.insert("name", "李四");
    Insert("study_CREATE_DROP_EXIST", values2);
    Insert("study_CREATE_DROP_EXIST", values3);
    qDebug() << resutl;
    Select("study_CREATE_DROP_EXIST");
    DropTab("study_CREATE_DROP_EXIST");
    ExistTab("study_CREATE_DROP_EXIST", resutl);
    qDebug() << resutl;
#endif
    CloseDb();
#endif
    return 0;
}
```

# 4 SQLite + Qt 常用方法

# 5 SQLite 进阶

# 6 MySql使用