# Study-VTK：安装vtk（python）

&emsp;&emsp;先看下deepin有没有安装python环境、以及版本。

```bash
ls /usr/bin/python* -l
python2 --version
python3 --version
```
&emsp;&emsp;deepin默认装机是安装python2.7和python3.5的，这两个一般不要动。我之前把python3.5卸载了，deepin商店所有软件无法安装，浏览器输入法什么的都无法使用。让后还是装回来了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314150126390.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
&emsp;&emsp;为了系统不会出问题，一般的操作是安装anaconda3虚拟环境，让后在anaconda3下配置python环境（安装好默认有一个python3.7）和vtk环境。这样你在anaconda3下边随便瞎搞，系统不会炸。
[Deepin 使用教程：安装python3环境](https://blog.csdn.net/a15005784320/article/details/103084981)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314150712383.png)

```bash
conda install -c conda-forge vtk 
#现在是默认安装vtk8.2  pip的话是直接在系统默认安装vtk8.1
```
&emsp;&emsp;测试下没有任何输出就安装完毕了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314173723610.png)