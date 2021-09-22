# Qt 图表UI   QTreeWidget


@[TOC](Qt 图表UI   QTreeWidget)


##  QTreeWidget和QTreeView区别，应该使用哪一个
&emsp;&emsp;Qt界面中需要使用图表的时候，默认提供两个**widget**   **QTreeWidget**和**QTreeView**。
&emsp;&emsp;如果你需要给QTreeWidget增加新建后删除后各种ui变化，选中后各种ui变化等等特殊效果/事件，建议不要用**QTreeWidget和Item**，使用**mode/view**。**QTreeWidget**最好仅用在表格变化不大的地方。比如固定的列表信息、固定尺寸报表等。
&emsp;&emsp;两个大致区别是 **QTreeWidget**继承自**QTreeView**。Qt表格显示使用的是 **view/mode** 模式，界面和数据分开，两者使用代理链接。QTreeView就是界面，如果需要修改数据则应该通过代理。比如Qt封装好的[QFileSystemModel在view中显示](https://blog.csdn.net/a15005784320/article/details/103481745)，就是典型的mode/view结构。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020030107530565.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;**QTreeView**提供了一个接口，**setModel**用来设置**mode**（也就是数据）。**QTreeWidget**作用就是默认包含了一个**mode**，并增加了如果操作这个默认**mode**的接口。**QTableWidget**类提供具有默认模型的基于项目的表视图。这样当使用**QTreeWidget**时候会简单很多，当然他也引入了一写新的问题，比如默认带了表视图，当我图表视图ui很复杂时候不太方便实现，而且数据没有分开逻辑不清晰。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301080912781.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;自己的项目中应该使用那个看情况，如果你的图表ui不复杂，跟**QTableWidget**默认的图表视图差异不大，而且不需要跟这个Mode关联（比如QSql、QFile），应该使用**QTableWidget**，反之则用**QTreeView**。
&emsp;&emsp;（以上属于个人理解，如果错误请指出）


##  QTreeWidget常用样式表

```css
QTreeWidget {
    border-radius:5px;
    font-size:20px;
    background: rgb(79, 79, 83);
    outline:0px;
}
QTreeWidget::item {
    color:rgb(233, 233, 233);
    background: rgb(79, 79, 83);
	min-height: 30px;
}
QTreeWidget::item:alternate {
    background: rgb(79, 79, 83);
}
QHeaderView {
    color: white;
}
QHeaderView::section {
    background-color: rgb(105, 106, 111);
    border:none;
    font-size:20px;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301081518251.png#pic_center)

```css
QTreeWidget {
    border-radius:5px;
    font-size:14px;
    background: rgb(79, 79, 83);
    outline:0px;
}
QTreeWidget::item {
    color:rgb(233, 233, 233);
    background: rgb(87, 87, 91);
    padding:0px 14px;
	min-height: 40px;
}
QTreeWidget::item:alternate {
    background: rgb(79, 79, 83);
}
QTreeWidget::item:selected, QTreeWidget::item:hover  {
	background: rgb(104, 104, 108);
}
QHeaderView {
    color: white;
    text-align:center;
}
QHeaderView::section {
    background-color: rgb(105, 106, 111);
    border:none;
    font-size:14px;
    padding:0px 14px;
}
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301081842666.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

```css
QTreeView{
border:1px solid #0F1F2F;
selection-background-color:#265687;
selection-color:#4894C6;
alternate-background-color:#265687;
gridline-color:#0F1F2F;
}
QTreeView::branch:closed:has-children{
margin:4px;
border-image:url(:/qss/blackblue/branch_open.png);
}

QTreeView::branch:open:has-children{
margin:4px;
border-image:url(:/qss/blackblue/branch_close.png);
}

QTreeView,QTreeView::branch{
background:#1B3149;
}
QTreeView::item:selected{
color:#4894C6;
background:qlineargradient(spread:pad,x1:0,y1:0,x2:0,y2:1,stop:0 #243D5B,stop:1 #243D5B);
}
QTreeView::item:hover,QHeaderView{
color:#4894C6;
background:qlineargradient(spread:pad,x1:0,y1:0,x2:0,y2:1,stop:0 #265687,stop:1 #265687);
}
QTreeView::item{
padding:1px;
margin:0px;
}
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301082853702.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
##  QTreeWidget常用属性
---
QTreeview有的接口QTreeWidget基本都可以使用，下边这里几个是QTreeWidget可以使用QTreeview常用接口
```cpp
ui->treeWidget->setAutoExpandDelay(-1);//节点展开鼠标悬停时间
ui->treeWidget->setIndentation(10);//缩进字节（添加自定义图标用的）
ui->treeWidget->setRootIsDecorated(1);//第一列是否缩进（添加自定义图标用的）
ui->treeWidget->setUniformRowHeights(1);//强制所有项等高
ui->treeWidget->setItemsExpandable(1);//是否支持展开折叠
ui->treeWidget->setSortingEnabled(1);////是否支持自动排序（如果需要排序的表格一般都常常改变，建议别用QTreeWidget了）
ui->treeWidget->setAnimated(1);//是否支持动画，这个需要单独在定义显示动画
ui->treeWidget->setAllColumnsShowFocus(1);//选中是焦点在本格还是本行（节点）
ui->treeWidget->setWordWrap(1);//自动换行，如果文字太多想用...省略的话，用矩形框把qstring封一下在画
ui->treeWidget->setHeaderHidden(0);//是否显示标题，下边有一个Visible，区别在于Visible是隐藏Hidden是在内存销毁
ui->treeWidget->setExpandsOnDoubleClick(0);//双击是否可以展开子节点。其实如果有节点的话还是建议用mode/view
```

---
QTreeWidget专有的
**1.ui上Widget显示几列**
```cpp
ui->treeWidget->setColumnCount(2);
```

---
QTreeWidget的head专有的
**1.Widget表头是否可见**
```cpp
ui->treeWidget->header()->setVisible(1);
```
**2.Widget表头顺序是否可以拖动改变**
```cpp
ui->treeWidget->header()->setCascadingSectionResizes(1);
```
**3.Widget表头文字属性（居中？靠左？靠右？）**
```cpp
ui->treeWidget->header()->setDefaultAlignment(Qt::Alignment alignment);
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200301083653785.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
**4.Widget表头宽度**
```cpp
 ui->treeWidget->header()->setDefaultSectionSize(100);
```
**5.Widget被选部分是否高亮显示**
```cpp
 ui->treeWidget->header()->setHighlightSections(1);
```
**6.Widget各个区域的最小值**
```cpp
 ui->treeWidget->header()->setMinimumSectionSize(50);
```
**7.Widget排序按钮是否显示**
```cpp
  ui->treeWidget->header()->setSortIndicatorShown(1));
```
**8.Widget最后一个区域是否占满表格余下的所有部分**
```cpp
  ui->treeWidget->header()->setStretchLastSection(1);
```

```cpp
    for (qint32 i = 0; i < ui->treeWidget->topLevelItemCount(); ++i) {
        QTreeWidgetItem *item = ui->treeWidget->topLevelItem(i);
        if (item) {
            item->setFlags(item->flags() | Qt::ItemIsEditable);
        }
    }
```



##  QTreeWidget 设置表格可以编辑/选中/不可编辑等等

```cpp
    for (qint32 i = 0; i < ui->treeWidget->topLevelItemCount(); ++i) {
        QTreeWidgetItem *item = ui->treeWidget->topLevelItem(i);
        if (item) {
            item->setFlags(item->flags() | Qt::ItemIsEditable);
        }
    }
```

```cpp
Qt.NoItemFlags          0   没有设置任何属性。
Qt.ItemIsSelectable     1   可以选择。
Qt.ItemIsEditable       2   可以编辑。
Qt.ItemIsDragEnabled    4   可以拖动它。
Qt.ItemIsDropEnabled    8   它可以用作放置目标。
Qt.ItemIsUserCheckable  16  用户可以选中或取消选中它。
Qt.ItemIsEnabled        32  用户可以与项目交互。
Qt.ItemIsTristate       64  该项可通过三个独立的状态进行检查。
```

可以看到上面没有不可以编辑这个选项，我现在用法是。如果需要把某几个设置为不可以编辑的话，直接自定义一个QStyledItemDelegate，让后把DisableEditor返回空算了（比较傻哈），比如下边是设置第一列可以编辑，后边几列不可以编辑。其实如果你要是都不可以编辑的话，初始化默认就是不可编辑的，什么都不用加。

```cpp

class DisableEditor : public QStyledItemDelegate {
  public:
    explicit DisableEditor(QWidget *parent = nullptr);

    virtual QWidget *createEditor(
        QWidget *parent,
        const QStyleOptionViewItem &option,
        const QModelIndex &index) const override ;
};
DisableEditor::DisableEditor(QWidget *parent)
    : QStyledItemDelegate(parent) {
}
QWidget *DisableEditor::createEditor(
    QWidget *parent, const QStyleOptionViewItem &option, const QModelIndex &index) const {
    Q_UNUSED(parent);
    Q_UNUSED(option);
    Q_UNUSED(index);
    return nullptr;
}
```

```cpp
    for (qint32 i = 1; i < ui->treeWidget->columnCount(); ++i) {
        ui->treeWidget->setItemDelegateForColumn(
            i, new DisableEditor(ui->treeWidget));
    }
```
