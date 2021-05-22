# Study-VTK：vtkWidget  分割 配准类之  放置种子点（Qt + vtkSeedWidget）

@[TOC](vtkWidget  分割/配准类之  放置种子点（Qt + vtkSeedWidget）)
## 1 vtkSeedWidget介绍
&emsp;&emsp;vtkSeedWidget 用于在场景中放置多个种子点。种子点可用于诸如连通性，分段和区域生长之类的操作。
&emsp;&emsp;vtkSeedWidget默认交互操作：
&emsp;&emsp;&emsp;&emsp; 1. 鼠标点击widget上空白位置放置种子点
&emsp;&emsp;&emsp;&emsp; 2. 鼠标移入种子点（箭头变为小手），按下delete删除种子点
&emsp;&emsp;&emsp;&emsp; 3. 鼠标移入种子点（箭头变为小手），按住鼠标左键拖动可以移动种子点
&emsp;&emsp;有放置对应就有拾取，如何自定义拾取每个点放在以后拾取的交互单独讲，这里只介绍vtk默认的拾取功能。

## 2 vtkSeedWidget 官方案例
&emsp;&emsp;vtk官方提供了三个例子，用来演示如何使用vtkSeedWidget在三维/平面场景下放置种子点。且回调种子点增加、移动、删除信息。

**[SeedWidget](http://118.25.63.144/VTKExamples/site/Cxx/Widgets/SeedWidget.html)**
&emsp;&emsp;空间场景中放置种子点。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314134912779.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
**[SeedWidgetImage](http://118.25.63.144/VTKExamples/site/Cxx/Widgets/SeedWidgetImage.html)**
&emsp;&emsp;图片场景中放置种子点，而且增加回调信息（种子点数量、当前选择、移动坐标）。
![\[外链图片转存失败,源站可能有防盗链机制,建议将图片保存下来直接上传(img-PFjTYKlx-15841](https://img-blog.csdnimg.cn/20200314135023424.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
**[SeedWidgetWithCustomCallback](http://118.25.63.144/VTKExamples/site/Cxx/Widgets/SeedWidgetWithCustomCallback.html)**
&emsp;&emsp;空间场景中放置种子点，而且增加回调信息（种子点数量、当前选择、移动坐标）。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314135107780.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

## 3 vtkSeedWidget常用函数
```cpp
	void SetInteractor( vtkRenderWindowInteractor * ) override;
	// 设置交互器，如果不自定义使用默认的那么操作就是第一节介绍的vtkSeedWidget默认交互操作
	
	void SetRepresentation( vtkSeedRepresentation *rep )
	// 设置种子点，这个vtkSeedRepresentation放置和操作定义种子集合的点。
	// 这样有个好处就是，添加的种子点数据和界面是分开的（交互/实体 分开），可以多个界面展示同一组点

	void On() {this->SetEnabled(1);}
	void Off() {this->SetEnabled(0);}
	// 这一组设置vtkSeedWidget是否开启交互功能 （观察/命令 模式切换）
	//这两组对应使用实现vtkSeedWidget的开启关闭

	virtual void CompleteInteraction();
	// 设置只能移动删除种子点
	virtual void RestartInteraction();
	// 复位交互，可以增加、删除、移动种子点
	// 这两组对应使用实现vtkSeedWidget可以添加几个点

	void DeleteSeed(int n);
	// vtkSeedWidget交互/实体 分开，所以你想全部清空时候，只清空种子点模型是不行的

	int InvokeEvent(unsigned long event, void *callData);
	int InvokeEvent(const char *event, void *callData);
	// 这个就理解成Qt的信号吧，emit信号用的

```


## 4 vtkSeedWidget使用技巧
### 4.1 开启/关闭 放置种子点交互
&emsp;&emsp;Off之后进入观察模式，只能看无法修改种子点。On之后开启种子点的交互。
```cpp
void ImageSeeder::WidgetsOn() {
    if (this->seed_widget_ != nullptr) {
        this->seed_widget_->On();
    }
}

void ImageSeeder::WidgetsOff() {
    if (this->seed_widget_ != nullptr) {
        this->seed_widget_->Off();
    }
}
```
### 4.2 绑定种子点增加/删除信号到Qt
&emsp;&emsp;交互/实体 分开的，其实只要清楚数量的改变就可以了，如果需要点坐标信息，去vtkSeedRepresentation里找。
```cpp
if (this->connections_ == nullptr) {
            this->connections_ = vtkSmartPointer<vtkEventQtSlotConnect>::New();
            this->connections_->Connect(
                this->seed_widget_, vtkCommand::PlacePointEvent,
                this, SLOT(SlotAddSeed(vtkObject *, unsigned long,
                                       void *, void *)));
            this->connections_->Connect(
                this->seed_widget_, vtkCommand::DeletePointEvent,
                this, SLOT(SlotAddSeed(vtkObject *, unsigned long,
                                       void *, void *)));
        }
```

```cpp
void ImageSeeder::SlotAddSeed(vtkObject *caller, unsigned long vtk_event,
                              void *client_data, void *call_data) {
    Q_UNUSED(client_data)
    Q_UNUSED(vtk_event)
    qint32 n = *static_cast<int *>(call_data);
    vtkSmartPointer<vtkSeedWidget> widget = dynamic_cast<vtkSeedWidget *>(caller);
    if (n >= 0 && widget) {
        qint32 num_seeds = widget->GetSeedRepresentation()->GetNumberOfSeeds();
        qDebug() << num_seeds;
    }
}

void ImageSeeder::SlotDeleteSeed(vtkObject *caller, unsigned long vtk_event,
                                 void *client_data, void *call_data) {
    Q_UNUSED(client_data)
    Q_UNUSED(vtk_event)
    qint32 n = *static_cast<int *>(call_data);
    vtkSmartPointer<vtkSeedWidget> widget = dynamic_cast<vtkSeedWidget *>(caller);
    if (n >= 0 && widget) {
        qint32 num_seeds = widget->GetSeedRepresentation()->GetNumberOfSeeds() - 1;
        qDebug() << num_seeds;
    }
}
```

### 4.3 创建种子点增加/删除/移动  回调事件
&emsp;&emsp;如果用Qt的话，这个回调就不需要使用了。
```cpp
  vtkSmartPointer<vtkSeedCallback> seedCallback =
    vtkSmartPointer<vtkSeedCallback>::New();
  seedCallback->SetRepresentation(rep);
  seedWidget->AddObserver(vtkCommand::PlacePointEvent,seedCallback);
  seedWidget->AddObserver(vtkCommand::InteractionEvent,seedCallback);
```

```cpp
class vtkSeedCallback : public vtkCommand {
  public:
    static vtkSeedCallback *New() {
        return new vtkSeedCallback;
    }
    vtkSeedCallback() {}
    virtual void Execute(vtkObject *, unsigned long event, void *calldata) {
        if(event == vtkCommand::PlacePointEvent) {
            std::cout << "Point placed, total of: "
                      << this->SeedRepresentation->GetNumberOfSeeds() << std::endl;
        }
        if(event == vtkCommand::InteractionEvent) {
            if(calldata) {
                std::cout << "Interacting with seed : "
                          << *(static_cast< int * >(calldata)) << std::endl;
            }
        }
        std::cout << "List of seeds (Display coordinates):" << std::endl;
        for(vtkIdType i = 0; i < this->SeedRepresentation->GetNumberOfSeeds(); i++) {
            double pos[3];
            this->SeedRepresentation->GetSeedDisplayPosition(i, pos);
            std::cout << "(" << pos[0] << " "
                      << pos[1] << " " << pos[2] << ")" << std::endl;
        }
    }
    void SetRepresentation(vtkSmartPointer<vtkSeedRepresentation> rep) {
        this->SeedRepresentation = rep;
    }
  private:
    vtkSmartPointer<vtkSeedRepresentation> SeedRepresentation;
};
```

### 4.4 设置种子点数量，达到后只能移动无法新建
&emsp;&emsp;4.2的槽函数修改下，达到一定数量后禁止添加。
```cpp
void ImageSeeder::SlotAddSeed(vtkObject *caller, unsigned long vtk_event,
                              void *client_data, void *call_data) {
    Q_UNUSED(client_data)
    Q_UNUSED(vtk_event)
    qint32 n = *static_cast<int *>(call_data);
    if(n == max_points_sum) {
        this->WidgetDisable();
    }
    vtkSmartPointer<vtkSeedWidget> widget = dynamic_cast<vtkSeedWidget *>(caller);
    if (n >= 0 && widget) {
        qint32 num_seeds = widget->GetSeedRepresentation()->GetNumberOfSeeds();
        emit SignalSeedChanged(num_seeds);
    }
}

void ImageSeeder::SlotDeleteSeed(vtkObject *caller, unsigned long vtk_event,
                                 void *client_data, void *call_data) {
    Q_UNUSED(client_data)
    Q_UNUSED(vtk_event)
    qint32 n = *static_cast<int *>(call_data);
    if(n < max_points_sum) {
        this->seed_widget_->RestartInteraction();
    }
    vtkSmartPointer<vtkSeedWidget> widget = dynamic_cast<vtkSeedWidget *>(caller);
    if (n >= 0 && widget) {
        qint32 num_seeds = widget->GetSeedRepresentation()->GetNumberOfSeeds() - 1;
        emit SignalSeedChanged(num_seeds);
    }
}
```

### 4.5 初始化种子点数量和位置 QList<QList<double>>
&emsp;&emsp;交互/实体 分开的，只要在vtkSeedRepresentation添加点和坐标，vtkSeedWidget会自动更新的。这里的InvokeEvent（）作用是发送点增加的信号，处理别的事情。
```cpp
void ImageSeeder::SetSeedList(const QList<QList<double>> seed_list) {
    this->InitialSeeds();
    if (this->representation_ != nullptr) {
        for (qint32 i = 0; i < seed_list.size(); ++i) {
            double p[3] = {seed_list[i][0], seed_list[i][1], seed_list[i][2]};
            qint32 num = this->representation_->CreateHandle(p);
            vtkSmartPointer<vtkHandleWidget> handle = 
            		this->seed_widget_->CreateNewHandle();
            handle->SetEnabled(true);
            this->representation_->SetSeedWorldPosition(static_cast<quint32>(num), p);
            this->seed_widget_->InvokeEvent(vtkCommand::PlacePointEvent, &(num));
        }
    }
}
```


### 4.6 导入导出种子点 QList<QList<double>>
 &emsp;&emsp;交互/实体 分开的，只要导入导出vtkSeedRepresentation就可以了，导入就是4.5的初始化。

```cpp
QList<QList<double>> ImageSeeder::GetSeedList() const {
    QList<QList<double>> list;
    if (this->representation_ != nullptr) {
        qint32 num_seeds =
            this->representation_->GetNumberOfSeeds();
        for (qint32 i = 0; i < num_seeds; ++i) {
            double pos[3];
            this->representation_->GetSeedWorldPosition(static_cast<quint32>(i), pos);
            list.append({pos[0], pos[1], pos[2]});
        }
    }
    return list;
}
```
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)