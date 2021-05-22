# Study-VTK：三维重建模型stl表面平滑 拉普拉斯平滑


自己重建的stl模型表面不是很好,需要对表面做一个平滑,VTK中 的vtkSmoothPolyDataFilter  实现了网格的拉普拉斯平滑算法
[阿冰先生](https://blog.csdn.net/webzhuce/article/details/88616614)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190904195813327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
初始化
```javascript
 vtkSmartPointer<vtkSmoothPolyDataFilter> smoothFilter;
```

绑定
```javascript
vtkNew<vtkSTLReader> reader;
reader->SetFileName(qstr_tmp.toLocal8Bit().data());
reader->Update();
smoothFilter->SetInputConnection(reader->GetOutputPort());
smoothFilter->SetNumberOfIterations(0);
smoothFilter->Update();
```


调整拉普拉斯平滑系数
```javascript
void FrmMainWindow::on_pushButton_clicked() {
    smoothFilter->SetNumberOfIterations(ui->horizontalSlider->value());
    smoothFilter->Update();
}
```



使用前后对比
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190904195348152.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190904193818302.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
vtk学习教程
[Study-VTK](https://blog.csdn.net/a15005784320/article/details/104855111)