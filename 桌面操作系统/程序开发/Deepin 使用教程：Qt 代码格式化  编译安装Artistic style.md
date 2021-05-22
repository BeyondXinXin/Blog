# Deepin 使用教程：Qt 代码格式化  编译安装Artistic style

使用代码格式化这里有一个方便就是，自己配置两套风格，一个自己喜欢的，一个公司要求的。自己开发时候用自己喜欢的，提交之前用公司要求的再刷一遍。

C++ 风格指南
[https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/contents/](https://zh-google-styleguide.readthedocs.io/en/latest/google-cpp-styleguide/contents/)

Artistic style 下载地址
 [https://sourceforge.net/projects/astyle/files/astyle/](https://sourceforge.net/projects/astyle/files/astyle/)
我的镜像
链接: [https://pan.baidu.com/s/1s0Uih1JUvM2-aNSxW2Qq4w](https://pan.baidu.com/s/1s0Uih1JUvM2-aNSxW2Qq4w)  密码: i2i0

> cd astyle/build 
> cmake .. 
> make 
> sudo cp -rf astyle /usr/local/bin

测试
> astyle

Qt配置
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115133045637.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115133050295.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191115133104134.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
这是我的风格

```cpp
--style=google
indent=spaces=4 # 缩进采用4个空格
indent-switches # -S 设置 switch 整体缩进
indent-cases # -K 设置 cases 整体缩进
indent-namespaces # -N 设置 namespace 整体缩进
indent-preproc-block # -xW 设置预处理模块缩进
indent-preproc-define # -w 设置宏定义模块缩进 
pad-oper # -p 操作符前后填充空格
#delete-empty-lines # -xe 删除多余空行
add-braces # -j 单行语句加上大括号
align-pointer=name # *、&这类字符靠近变量名字
```
  
    
    
---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)



