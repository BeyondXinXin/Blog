# QComboBox隐藏item

## 需求

用**QComboBox**做了一个下拉框，需要隐藏其中几个选项。本来是每次修改**QComboBox**的**Items**。
由于需要用到隐藏前的序号，如果修改**Items**会增加很多逻辑。

找到一个好的办法： [how-to-hide-qcombobox-items-instead-of-clearing-them-out](https://stackoverflow.com/questions/25172220/how-to-hide-qcombobox-items-instead-of-clearing-them-out)

## 代码

```cpp
QComboBox *editor = new QComboBox(parent);
editor->addItems(item_list_);
editor->installEventFilter(const_cast<ConeComboxDelegate *>(this));

const auto column = index.column();

if (2 == column) {
    const auto cone_data = index.model()->data(index, Qt::UserRole).toInt();

    const auto data = ConeTabelModel::GetConePartName(cone_data);
    const auto part_size = std::get<2>(data);
    const auto cone_id = std::get<3>(data);

    QListView *view = qobject_cast<QListView *>(editor->view());
    Q_ASSERT(view != nullptr);

    for (int i = 0; i < item_list_.size(); i++) {
        if (i < part_size + cone_id && i >= cone_id) {
            view->setRowHidden(i, false);
        } else {
            view->setRowHidden(i, true);
        }
    }

    view->setFixedHeight(25 * part_size);
}


```






