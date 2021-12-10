# QTableView代理退出编辑模式前就修改数据


## 需求

列表上有一些**QComboBox**和**QDoubleSpinBox**，留下来的代码是用的代理（**createEditor** + **setEditorData** + **setModelData**）。



最新的需求需要实时修改。如果是用的代理（**paint** + **editorEvent**）或者**QTableWidget**，这个需求很好实现。

代理（**createEditor** + **setEditorData** + **setModelData**）则是在列表的**editorEvent**后便判断是否完成修改来发送**commitData**和**sizeHintChanged**来实现退出编辑后修改**Model**的数据。
**setEditorData**和**createEditor**都是**const**修饰的，信号发不出去，**index**也是**const**传入的，无法调用**setModelData**。

不想大该原来的代码，干脆在代理初始化的时候把**Model**传进去吧。

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.121qyf3g317k.png)

## 代码

```cpp
QWidget *ComboxDelegate::createEditor(QWidget *parent, const QStyleOptionViewItem & /*option*/, const QModelIndex &index) const
{
    QComboBox *editor = new QComboBox(parent);
    editor->addItems(item_list_);
    editor->installEventFilter(const_cast<ComboxDelegate *>(this));

    connect(editor, static_cast<void (QComboBox::*)(int)>(&QComboBox::activated),
            this, [&, index](int data) {
                model_->setData(index, data, Qt::EditRole);
            });

    return editor;
}
```

## 反思

感觉代理就是为了抽离**data**和**view**，像上边那样操作就失去了代理的意义。直接用**QTableWidget**设置每个单元个的**Widget**就好了。





