# DCMTK   检测到“RuntimeLibrary”的不匹配项: 值“MT_StaticRelease”不匹配值“MD_DynamicRelease”


* `DCMTK`链接时报错：

```cpp
ofstd.lib(ofcond.obj):-1: error: LNK2038: 检测到“RuntimeLibrary”的不匹配项:
 值“MT_StaticRelease”不匹配值“MD_DynamicRelease”(mocs_compilation.cpp.obj 中)
```
* 解决办法：  

&emsp;&emsp;没有生成动态链接库，重新编译下就可以

![](https://img-blog.csdnimg.cn/20210118194436183.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)









