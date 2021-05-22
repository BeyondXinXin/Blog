# Study-VTK

# Study-VTK

&emsp;&emsp;工作中需要用到vtk，他效率虽然比不上opengl，但是其比较注重代码结构严谨，功能完善而接口清晰，易于使用。在这里记录自己学习vtk和itk的过程。

> 以下内容/链接中自己写的博客主要根据   【**VTK图形图像开发进阶（张晓东 罗火灵）**】这本书学习

---

# VTK 介绍
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314095715316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)
&emsp;&emsp;VTK是用于图像处理，3D图形，体绘制和可视化的开源软件系统，包括许多高级算法（例如，表面重建，隐式建模，抽取）和渲染技术（例如，硬件加速的体积渲染，LOD控制）。
&emsp;&emsp;VTK被院士用于教学和研究。政府研究机构，例如美国的洛斯阿拉莫斯国家实验室或意大利的CINECA；以及许多使用VTK构建或扩展产品的商业公司。
&emsp;&emsp;VTK的起源是教科书“ Visualization Toolkit，一种面向对象的3D图形方法”，最初由Prentice Hall出版，现在由Kitware，Inc.出版（第三版ISBN 1-930934-07-6）。VTK（自1994年首次发布以来）已经发展到在商业，学术和研究社区中的全球用户群。

---
# Useful links:

vtk 官方案例   
[https://lorensen.github.io/VTKExamples/site/Cxx/](https://lorensen.github.io/VTKExamples/site/Cxx/)
[http://118.25.63.144/VTKExamples/site/Cxx/](http://118.25.63.144/VTKExamples/site/Cxx/)（c++）
[http://118.25.63.144/VTKExamples/site/Python/](http://118.25.63.144/VTKExamples/site/Python/)（Python）
	
vtk Doxygen 文档（源码、接口查询）  
[https://vtk.org/doc/nightly/html/index.html](https://vtk.org/doc/nightly/html/index.html)

阿兵-AI医疗 csdn博客（和VTK图形图像开发进阶一样，是很好的学习vtk教材）
[https://blog.csdn.net/webzhuce?utm_source=feed](https://blog.csdn.net/webzhuce?utm_source=feed)

..

---
# 最新动态
- **[Study-VTK： vtk 9.0.0 已进入候选发布阶段！](https://blog.csdn.net/a15005784320/article/details/105030122)**

---
# 学习记录
## vtk 安装
- **[Study-VTK：ubuntu/deepin  下安装vtk（ c++）](https://blog.csdn.net/a15005784320/article/details/103083420)**
- **[Study-VTK：windos  下安装vtk（ c++）](https://blog.csdn.net/a15005784320/article/details/98477606)**
- **[Study-VTK：安装vtk（python）](https://blog.csdn.net/a15005784320/article/details/104860638)**


## vtk 常用概念
- **[Study-VTK：QVTKOpenGLWidget/QVTKOpenGLNativeWidget 显示全黑，未设置眼色缓冲](https://blog.csdn.net/a15005784320/article/details/102972633)**
- **[Study-VTK：QVTKWidget、QVTKOpenGLWidget、QVTKOpenGLNativeWidget、QVTKWidget2 区别](https://blog.csdn.net/a15005784320/article/details/99460999)**
- **[Study-VTK：PolyData 和 UnstructuredGrid 相互转换](https://blog.csdn.net/a15005784320/article/details/105763439)**


## vtk 可视化开发
- **[Study-VTK：调试时随时浏览模型/图像](https://blog.csdn.net/a15005784320/article/details/104587549)**
- **[Study-VTK：使用中文 图例、标签等（Qt）](https://blog.csdn.net/a15005784320/article/details/104058308)**
- **[Study-VTK：设置模型cell不同颜色（根据List决定颜色）](https://blog.csdn.net/a15005784320/article/details/104043365)**

#### &emsp;&emsp;0. vtk Widget 介绍
- **[Study-VTK：vtkWidget](https://blog.csdn.net/a15005784320/article/details/104995129)**
#### &emsp;&emsp;1. 测量类Widget

| Widget类名 | 缩略图 | 说明 | 详细使用方法 |
|-|-|-|-|
| [vtkDistanceWidget](https://vtk.org/doc/nightly/html/classvtkDistanceWidget.html)  |    |  用来在二位平面上测量点与点的距离 |
| [vtkAngleWidget](https://vtk.org/doc/nightly/html/classvtkAngleWidget.html)   |   |  用来在二位平面上测量角度  |
| [vtkBiDimensionalWidget](https://vtk.org/doc/nightly/html/classvtkBiDimensionalWidget.html)   |   |  用来在二位平面上测量两个正交方向的轴长  |

#### &emsp;&emsp;2. 标注类Widget

| Widget类名 | 缩略图 | 说明 | 详细使用方法 |
|-|-|-|-|
| [vtkTextWidget](https://vtk.org/doc/nightly/html/classvtkTextWidget.html)  | ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200322141732447.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70 =100x100)   |  显示文本 |[vtkWidget 标注类Widget之 文本显示vtkTextWidget](https://blog.csdn.net/a15005784320/article/details/105027338) 
| [vtkScalarBarWidget](https://vtk.org/doc/nightly/html/classvtkScalarBarWidget.html)  |    |  显示标量条 |
| [vtkCaptionWidget](https://vtk.org/doc/nightly/html/classvtkCaptionWidget.html)  |    |  带箭头的文本 |
| [vtkOrientationMarkerWidget](https://vtk.org/doc/nightly/html/classvtkOrientationMarkerWidget.html)  |    |  方向指示标志 |
| [vtkBalloonWidget](https://vtk.org/doc/nightly/html/classvtkBalloonWidget.html)  |    |  鼠标悬停提示信息 |
| [vtkBorderWidget](https://vtk.org/doc/nightly/html/classvtkBorderWidget.html)  | ![](https://img-blog.csdnimg.cn/20200322143558435.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center =100x100)   |  在2D矩形区域周围放置边框 |[vtkWidget 标注类Widget之 在2D矩形区域周围放置边框](https://blog.csdn.net/a15005784320/article/details/105027710)


#### &emsp;&emsp;3. 分割/配准类Widget

| Widget类名 | 缩略图 | 说明 | 详细使用方法 |
|-|-|-|-|
| [vtkSeedWidget](https://vtk.org/doc/nightly/html/classvtkSeedWidget.html)| ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200322121045198.png =100x100)|用于在场景中放置多个种子点|[vtkWidget 分割/配准类之 放置种子点](https://blog.csdn.net/a15005784320/article/details/104859208)
| [vtkBrokenLineWidget](https://vtk.org/doc/nightly/html/classvtkBrokenLineWidget.html)  | ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200406125209142.png =200x100)   |  用于操纵折线的Widget |[Study-VTK：vtkWidget 分割/配准类之 操纵折线 vtkBrokenLineWidget](https://blog.csdn.net/a15005784320/article/details/105214176)
| [vtkContourWidget](https://vtk.org/doc/nightly/html/classvtkContourWidget.html)  |    |  绘制轮廓线 |
| [vtkImageTracerWidget](https://vtk.org/doc/nightly/html/classvtkImageTracerWidget.html)  |    |  绘制轨迹线 |
| [vtkCheckerboardWidget](https://vtk.org/doc/nightly/html/classvtkCheckerboardWidget.html)  |    |  二维图像添加网格 |
| [vtkRectilinearWipeWidget](https://vtk.org/doc/nightly/html/classvtkRectilinearWipeWidget.html)  |    |  二维图像添加网格 |



#### &emsp;&emsp;4. 其他Widget

| Widget类名 | 缩略图 | 说明 | 详细使用方法 |
|-|-|-|-|
| [vtkBoxWidget](https://vtk.org/doc/nightly/html/classvtkBoxWidget.html)| ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200330200321943.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70  =250x100)|定义了一个ROI该区域由任意方向的六面体表示|[vtkWidget 分割/配准类之 正交六面体3D小部件 vtkBoxWidget](https://blog.csdn.net/a15005784320/article/details/105191196)

## vtk 图像处理
- **[Study-VTK：Qt VTK图片 读取和写出](https://blog.csdn.net/a15005784320/article/details/100574621)**
- **[Study-VTK：vtk imagedata 和 cv::mat 相互转换](https://blog.csdn.net/a15005784320/article/details/103583576)**
- **[Study-VTK：marchingcube 二维转三维 mhd转stl](https://blog.csdn.net/a15005784320/article/details/100576085)**
- **[Study-VTK：将三维模型转为二维切片 stl/vtp to dcm/vti](https://beondxin.blog.csdn.net/article/details/106155848)**


## vtk 图形处理
- **[Study-VTK：计算图形中心线（利用vmtk）](https://blog.csdn.net/a15005784320/article/details/103834840)**
- **[Study-VTK：提取连通域](https://blog.csdn.net/a15005784320/article/details/100745562)**
- **[Study-VTK：三维重建模型stl表面平滑 拉普拉斯平滑](https://blog.csdn.net/a15005784320/article/details/100545868)**
- **[Study-VTK：求两个模型距离](https://blog.csdn.net/a15005784320/article/details/104857883)**




## itk 使用

- **[Study-VTK：ubuntu/deepin  下安装itk（ c++）](https://blog.csdn.net/a15005784320/article/details/103083623)**
- **[Study-VTK：ubuntu/deepin  下安装itk（ c++）](https://blog.csdn.net/a15005784320/article/details/98477606)**
- **[Study-VTK：利用itk实现最短路径提取（Qt）](https://blog.csdn.net/a15005784320/article/details/100095125)**
- **[Study-VTK：利用 itk 读取dcm标签信息 标签](https://blog.csdn.net/a15005784320/article/details/101030403)**
- **[Study-VTK：利用ITK修改dcm标签（tags）](https://blog.csdn.net/a15005784320/article/details/105456767)**

---