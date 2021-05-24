# Qt  带有图片的listwidget


看到一个不错的文字和图片对应起来的方式,记录下
给每个item传入Qt::UserRole   item->setData(Qt::UserRole, i.key());
根据  item->data(Qt::UserRole).toInt();返回dialog返回信息


![在这里插入图片描述](https://img-blog.csdnimg.cn/20190831154211743.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


```javascript
 QMap<int, QString> symbolMap;
symbolMap.insert(132, QObject::tr("Data"));
symbolMap.insert(135, QObject::tr("Decision"));
symbolMap.insert(137, QObject::tr("Document"));
symbolMap.insert(138, QObject::tr("Manual Input"));
symbolMap.insert(139, QObject::tr("Manual Operation"));
symbolMap.insert(141, QObject::tr("On Page Reference"));
symbolMap.insert(142, QObject::tr("Predefined Process"));
symbolMap.insert(145, QObject::tr("Preparation"));
symbolMap.insert(150, QObject::tr("Printer"));
symbolMap.insert(152, QObject::tr("Process"));
```
	
```javascript
while (i.hasNext()) {
        i.next();
        QListWidgetItem *item = new QListWidgetItem(i.value(),
                listWidget);
        //设定一个Icon(视图)
        item->setIcon(iconForSymbol(i.value()));
        //将ID保存到QListWidgetItem中去---Qt::UserRole为自定义角色(模型数据)
        item->setData(Qt::UserRole, i.key());
    }
```

```javascript
QString fileName = ":/images/" + symbolName.toLower();
    fileName.replace(' ', '-');
    return QIcon(fileName);
```

```javascript
void flowchartsymbolpicker::done(int result) {
    id = -1;
    if (result == QDialog::Accepted) {
        QListWidgetItem *item = listWidget->currentItem();
        if (item) {
            id = item->data(Qt::UserRole).toInt();
        }
    }
    QDialog::done(result);
}
```
