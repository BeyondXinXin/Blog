# 同步本地文件或仓库到Github

&emsp;&emsp;最近整理文件，想把一些东西存到Github的私有仓库。这里记录下方法

1. 现在Github创建好几个私有仓库，并记住地址。（我用的Https）

![\[\]](https://img-blog.csdnimg.cn/20210405152639915.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



![\[\]](https://img-blog.csdnimg.cn/20210405152647766.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




2. 控制台 打开本地需要同步的文件夹


![\[\]](https://img-blog.csdnimg.cn/20210405152654847.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



3. 初始化仓库、提交文件、绑定远程地址、推送

```sh
git init
git add .
git commit -m "Test"
git remote add origian https://github.com/BeyondXinXin/Test.git
git push -u origian master
```


![\[\]](https://img-blog.csdnimg.cn/20210405152701638.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)



4. 可以再Github看到已经提交成功

![\[\]](https://img-blog.csdnimg.cn/20210405152707623.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)




