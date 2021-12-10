# Ubuntu 控制台前多了个   base

[参考网址](https://www.iteye.com/blog/784838898-2440612)
[Jupyter介绍](https://zh.wikipedia.org/wiki/Jupyter%E9%A1%B9%E7%9B%AE)


忘记自己装了什么,发现自己控制台前突然多了个  base怎么也去不掉
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190902194019772.png)
去掉的话输入 

> conda config --set auto_activate_base False 

让后重启,启用的话  True就可以了

作用是    命令行的Jupyter命令会是否生效
