# Study-VTK：使用中文 图例、标签等（Qt）

### 一 ttf文件下载
vtk如果想使用中文的话需要加载中文字体  .ttf文件  商用的、免费的百度一下有一大堆。


### 二 vtk使用中文（指定ttf）
```cpp
	vtkNew<vtkTextProperty> tprop;
	tprop->SetFontFamily(VTK_FONT_FILE); 
	tprop->SetFontFile("./font/simhei.ttf"); 
```

### 三 qt 下vtk使用中文
加进qrc的ttf文件，vtk无法使用，必须释放到本地才可以，因为qrc里的路径  “ ：”冒号vtk不认

```cpp
this->chart_->GetLegend()->GetLabelProperties()->SetFontFile("./font/simhei.ttf");// 可以
this->chart_->GetLegend()->GetLabelProperties()->SetFontFile(":/font/simhei.ttf");// 不可以 ：vtk不认
```

```cpp
DirMake("./font");
QFile::copy(":/font/simhei.ttf", "./font/simhei.ttf");
```

```cpp
QString GetFullPath(const QString &path) {
    if (QDir::isAbsolutePath(path)) {
        return path;
    } else {
        return QDir::currentPath() + "/" + path;
    }
}

bool DirMake(const QString &path) {
    QString full_path = GetFullPath(path);
    QDir dir(full_path);
    if (dir.exists()) {
        return true;
    } else {
        return dir.mkpath(full_path);
    }
}
```



### 四 具体演示

###### **1 vtk 直接渲染文字   vtkTextActor  增加 中/英 图例（英文自己在ts里加）。**

```cpp
	vtkNew<vtkTextActor> model_label ;
	model_label->GetTextProperty()->SetFontFamily(VTK_FONT_FILE);
	model_label->GetTextProperty()->SetFontFile("./font/simhei.ttf");
 	QString label_tmp = tr("重构结果");
	model_label->SetInput(label_tmp.toLocal8Bit().data());
```



###### **2 vtk 切片显示/图片显示   vtkCornerAnnotation 角标信息  增加 中/英 图例（英文自己在ts里加）。**
```cpp
	this->annotation_ = vtkSmartPointer<vtkCornerAnnotation>::New();
    vtkNew<vtkTextProperty> tprop;
    tprop->SetFontFamily(VTK_FONT_FILE);
    tprop->SetFontFile("./font/simhei.ttf");
    this->annotation_->SetTextProperty(tprop);
    // 或者
	/*this->annotation_->GetTextProperty()->SetFontFamily(VTK_FONT_FILE);
	this->annotation_->GetTextProperty()->SetFontFile("./font/simhei.ttf");*/
	
	QString bottom_left = QString(tr("%1\n切片:%2/%3\n\n\n"))
                          .arg(tag_hash_.value("Series Description"))
                          .arg(time).arg(total_time);
    this->annotation_->SetText(0, bottom_left.toLocal8Bit().data());
    this->renderer_ = vtkSmartPointer<vtkRenderer>::New();
	this->renderer_->AddViewProp(this->annotation_);
```



###### **3 vtk 图表显示   vtkChartXY  增加 中/英 图例（英文自己在ts里加）。**
```cpp
	vtkNew<vtkNamedColors> colors;
    vtkColor3d color3d = colors->GetColor3d("light_grey");
    vtkNew<vtkTable> table;
    vtkNew<vtkFloatArray> distance_array, diameter, ref_diameter_array;
    QString vessel = tr("血管直径");
    QString reference = tr("参考直径");
    distance_array->SetName("distance");
    diameter->SetName(vessel.toLocal8Bit().data());
    ref_diameter_array->SetName(reference.toLocal8Bit().data());
    table->AddColumn(distance_array);
    table->AddColumn(diameter);
    table->AddColumn(ref_diameter_array);
    this->chart_ = vtkSmartPointer<vtkChartXY>::New();
	this->line1_ = this->chart_->AddPlot(vtkChart::LINE);
	this->line2_ = this->chart_->AddPlot(vtkChart::LINE);
	this->line1_->SetInputData(table, 0, 1);
  	this->line2_->SetInputData(table, 0, 2);
 	this->chart_->SetShowLegend(true);
    this->chart_->GetLegend()->GetLabelProperties()->SetFontFamily(VTK_FONT_FILE);
    this->chart_->GetLegend()->GetLabelProperties()->SetFontFile("./font/simhei.ttf");
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