> 如果需要一个高自由度的**Tree**视图，一般使用`QTreeView`+`QAbstractItemModel`+`QSortFilterProxyModel`+`QStyledItemDelegate`。`QTreeWidget`=`QTreeView`+`QTreeWidgetItem`（无法增加自定义接口）


&emsp;&emsp;图省事且明确知道**需求不会增加**，可以用`QTreeWidget`方便些。



---


# QTreeWidget 实现检索、右键菜单等功能


&emsp;&emsp;`QTreeWidget`是真方便，就怕你照着需求做完，项目经理让你加代理。


## 增加表头和右键菜单


```cpp
class KissQTreeWidget : public QTreeWidget {
    Q_OBJECT
  public:
    explicit KissQTreeWidget(QWidget *parent = nullptr);
    virtual ~KissQTreeWidget();
  protected:
    void Initial();
    virtual void contextMenuEvent(QContextMenuEvent *e);
    QMenu *context_menu_;
    QItemSelection selection_;
};
```
```cpp
KissQTreeWidget::KissQTreeWidget(QWidget *parent): QTreeWidget(parent) {
    this->Initial();
}

KissQTreeWidget::~KissQTreeWidget() {
}

void KissQTreeWidget::Initial() {
    QStringList header_list = {"Tag ID", "VR", "VM", "Length", "Description", "value"};
    QList<int> headerwidth_list = {200, 70, 100, 50, 300, 300};
    this->setHeaderLabels(header_list);
    qint32 i = 0;
    foreach (auto var, headerwidth_list) {
        this->setColumnWidth(i, var);
        i++;
    }
    this->setGeometry(0, 0, 1200, 800);
    this->header()->setDefaultAlignment(Qt::AlignCenter);
    // 右键菜单
    this->context_menu_ = new QMenu(this);
    context_menu_->addAction(tr("Open the folder where DCM is located"), this, [ = ]() {
    });
    context_menu_->addAction(tr("Copy current selection"), this, [ = ]() {
    });
    context_menu_->addSeparator();
    context_menu_->addAction(tr("Copy all values"), this, [ = ]() {
    });
}

void KissQTreeWidget::contextMenuEvent(QContextMenuEvent *e) {
    if (indexAt(e->pos()).isValid()) {
        context_menu_->popup(e->globalPos());
    }
}
```


## 增加检索功能

```cpp
void DicomTagsWidget::SlotFilterChanged() {
    QTreeWidgetItemIterator it(tree_wid_);
    QString str = ui.filter->text();
    if(str.isEmpty()) {
        while (*it) {
            (*it)->setHidden(false);
            ++it;
        }
        return;
    }
    while (*it) {
        (*it)->setHidden(true);
        ++it;
    }
    QList<QTreeWidgetItem *> items;
    for(qint32 i = 0; i < tree_wid_->columnCount(); i++) {
        items << tree_wid_->findItems(str, Qt::MatchContains | Qt::MatchRecursive, i);
    }
    foreach (auto var, items) {
        var->setHidden(false);
        while (var->parent()) {
            var->parent()->setHidden(false);
            var = var->parent();
        }
    }
}

```




















