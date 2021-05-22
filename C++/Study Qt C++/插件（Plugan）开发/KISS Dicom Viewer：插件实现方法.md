项目地址：
[CodeChina kissDicomViewer](https://codechina.csdn.net/a15005784320/kiss-dicom-viewer)  
详细介绍：
[CSDN 一个简单的 DICOM 浏览器](https://beondxin.blog.csdn.net/article/details/108678403)  

---

# KISS Dicom Viewer：插件实现方法
@[TOC]( )

&emsp;&emsp;**KISS Dicom Viewer**计划做四个插件：多平面重建(MPR)、三维重建(VR体渲染)、图像前处理、图像融合。`MPR`和`VR`需要用到`ITK+GDCM+VTK`，图像前处理和图像融合需要用到`opencv`。把这几个做成插件一方面是自己学习Qt的插件框架，另一方面主程序里只加`DCMTK`这一个除`Qt`外的第三方库。

## 1 前处理

&emsp;&emsp;图像前处理思路就是每次再界面上刷新图片时调用一个模板函数`QPixmap(const QPixmap &, QWidget *)`，实现最后渲染不同效果。
### 1.1 图片前处理实现

&emsp;&emsp;前处理是直接调用现成的API：[仿照小蚂蚁实现 sharpen smooth Edge Emboss](https://beondxin.blog.csdn.net/article/details/113620255)

### 1.2 界面设计

![](https://img-blog.csdnimg.cn/20210203220901718.png)


![](https://img-blog.csdnimg.cn/20210203220906578.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


### 1.3 插件设计
#### 1.3.1 定义插件接口

&emsp;&emsp;使用 `Q_DECLARE_INTERFACE`绑定插件的标识符，声明几个虚函数。`GetPretreatments`用来获取前处理插件里包含了几个计算模块。`PretreatmentFun`用来获取每个计算模块的处理函数。

```cpp
using Pretreatmen = std::function <QPixmap(const QPixmap &, QWidget *) >;
class PretreatmentInterface {
  public:
    virtual ~PretreatmentInterface() {}
    virtual QStringList GetPretreatments() const = 0;
    virtual Pretreatmen PretreatmentFun(const QString &str) = 0;
};
QT_BEGIN_NAMESPACE
#define PretreatmentInterface_iid "kissdicomviewer_PretreatmentInterface"
Q_DECLARE_INTERFACE(PretreatmentInterface, PretreatmentInterface_iid)
QT_END_NAMESPACE
```

#### 1.3.2 插件的实现

* `GetPretreatments` 返回本插件包含6个处理模块（`" "`再界面上显示为分隔线）。
* `PretreatmentFun` 返回每个模块方法对应的函数。（具体在 本文 1.1）

```cpp
class pretreatmentFiltersPlugin : public QObject, public PretreatmentInterface {
    Q_OBJECT
    Q_PLUGIN_METADATA(IID "kissdicomviewer_PretreatmentInterface" FILE "pretreatmentfiltersplugin.json")
    Q_INTERFACES(PretreatmentInterface)

  public:
    QStringList GetPretreatments() const override;
    Pretreatmen PretreatmentFun(const QString &str) override;
};
```

```cpp
QStringList pretreatmentFiltersPlugin::GetPretreatments() const {
    return {
        tr("none"),
        tr(""),
        tr("sharpen"),
        tr("smooth"),
        tr("Edge"),
        tr("Emboss")
    };
}

QPixmap Sharpening(const QPixmap &pix, QWidget * ) {
    ......
}
QPixmap Smooth(const QPixmap &pix, QWidget * ) {
    ......
}
QPixmap Edge(const QPixmap &pix, QWidget * ) {
    ......
}
QPixmap Emboss(const QPixmap &pix, QWidget * ) {
    ......
}

Pretreatmen pretreatmentFiltersPlugin::PretreatmentFun(const QString &str) {
    Pretreatmen fun;
    if (str == tr("none") || str.isEmpty()) {
        fun = [&](const QPixmap & pix, QWidget *) {
            return pix;
        };
    } else if (str == tr("smooth")) {
        fun = Smooth;
    } else if (str == tr("sharpen")) {
        fun = Sharpening;
    }  else if (str == tr("Edge")) {
        fun = Edge;
    } else if (str == tr("Emboss")) {
        fun = Emboss;
    } else {
        fun = [&](const QPixmap & pix, QWidget *) {
            return pix;
        };
    }
    return fun;
}


```

#### 1.3.3 插件的读取

1. 指定插件读取路径，并遍历目录内所有文件（不递归，进本目录文件）
2. 依次判断每个文件是否存在 **前处理插件** （不存在就没有前处理模块）
3. 根据前处理插件的`GetPretreatments`增加菜单里的`QAction`，并绑定对应的触发处理函数（`PretreatmentFun`）。

```cpp
void DicomViewer::SetupPlugin() {
    QDir pluginsDir("./plugins");
    const auto entryList = pluginsDir.entryList(QDir::Files);
    for (const QString &fileName : entryList) {
        QPluginLoader loader(pluginsDir.absoluteFilePath(fileName));
        QObject *plugin = loader.instance();
        if (plugin) {
            const auto i_pretreatment =
                qobject_cast<PretreatmentInterface *>(plugin);
            if (i_pretreatment) {
                QMenu *m = ui->flipBtn->menu();
                QAction *a;
                QActionGroup *filter_group = new QActionGroup(this);
                QMenu *filter = new QMenu("filter", this);
                const QStringList texts = i_pretreatment->GetPretreatments();
                foreach (const QString var, texts) {
                    if(var.isEmpty()) {
                        filter->addSeparator();
                    } else {
                        a = filter->addAction(var);
                        Pretreatmen fun = i_pretreatment->PretreatmentFun(var);
                        connect(a, &QAction::triggered, this, [ = ] {
                            ui->viewContainer->SetPretreatmen(fun);
                        });
                        a->setCheckable(true);
                        // a->setChecked(true);
                        filter_group->addAction(a);
                    }
                }
                m->addMenu(filter);
            }
        }
    }
}
```
#### 1.3.4 插件的调用
&emsp;&emsp;触发绑定再菜单栏的`QAction`后则会前处理函数替换到该界面的默认前处理函数。
```cpp
// m_fun_ 前处理函数默认值
    m_fun_ = [&](const QPixmap & pix, QWidget *) {
        return pix;
    };
// 更新 前处理函数
void DicomImageView::SetPretreatmen(Pretreatmen fun) {
    this->m_fun_ = fun;
    RefreshPixmap();
    UpdateAnnotations();
}
// 刷新图片
void DicomImageView::RefreshPixmap() {
    QPixmap pixmap;
    if (m_series_) {
        m_series_->GetPixmap(pixmap, m_vtype_);// 获取将要刷新的图片
        pixmap = m_fun_(pixmap, this);// 调用前处理函数
        pixmap_item_->setPixmap(pixmap);// 设置图片
```


## 2 多平面重建(MPR)
&emsp;&emsp;仅做了MPR的实现，还未开始集成。


## 3 三维重建(VR体渲染)
&emsp;&emsp;仅做了体渲染的实现，还未开始集成。

## 4 图像融合
&emsp;&emsp;还没调研。





