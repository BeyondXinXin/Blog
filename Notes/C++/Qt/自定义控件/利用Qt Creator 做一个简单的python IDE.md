# 利用Qt Creator 做一个简单的python IDE

@[TOC]( )

# 1  确认本机python环境（版本和路径）
```bash
whereis python
which python
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020041922005063.png#pic_center)





# 2  添加外部工具
菜单栏 -> 工具 -> 外部 -> 配置（configuration）   
依次添加工具和目录。python  python3.7。
>执行档添加上一步得到的路径
>/home/yx/anaconda3/bin/python
>参数
> %{CurrentDocument:FilePath}
> 工作目录
> %{CurrentDocument:Path}

 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419215048525.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419215212992.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419220417208.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
# 3  增加运行快捷键
1. 菜单栏 -> 工具 -> 选项 -> 环境  -> 键盘
2. 搜索  +p  移除打印的快捷键  （点击 x 和 record）
3. 搜索python 增加 ctrl+p 

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419220655931.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020041922093259.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419220942960.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419221102683.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

# 4  测试
&emsp;&emsp;打开一个.py文件，按下ctrl+p 既可以调试程序。错误信息也会在输出栏显示
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419221320280.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419221351277.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

# 5  注释/保存  快捷键

- ctrl+/  增加注释
- ctrl+s 保存
如果文件旁边有*，代表文件没有保存，此时运行还是上一次的。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200419221606395.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)