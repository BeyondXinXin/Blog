# 升级vtk9 ：造成itk4编译不过去

&emsp;&emsp;最近打算尝试下VTK9，发现ITK4没有办法编译。看了下错误，ITK的glue用的cmake宏已经被vtk9移除了。要是ITK也一起升级到ITK5的话，担心升级带来的问题更不好找了。照着ITK5的相关代码改了下TIK4.13相关语法，改了好几个文件一大片代码才成功编译过去。难道ITK4已经不在支持VTK9了吗？
&emsp;&emsp;翻了下ISSUSE：
* ITK5 全部支持 VTK9
* ITK4 只有 4.13.3 这一个版本默认支持VTK9

---

&emsp;&emsp;其实有拉一份最新的ITK5.2的master试用下，刚编译完就遇到俩问题：  

1. itk::GDCMSeriesFileNames 返回文件路径 std::string 编码是UTF8的，itk::ImageSeriesReader 读取的路径 std::string 是本机编码页。也不知道是不是我没有仔细看说明，反正默认编译直接导致中文无法使用。

2. ITK5 自带的GDCM是3.0+，ITK4 自带的GDCM全是2.8+。ITK5的 SYSTEM GDCM如果选旧版本也是一堆问题，之前写的部分代码直接不能用了。


&emsp;&emsp;算了，我还是先接着用ITK4吧。
