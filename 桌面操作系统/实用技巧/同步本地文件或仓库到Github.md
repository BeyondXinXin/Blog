# 同步本地文件或仓库到Github

&emsp;&emsp;最近整理文件，想把一些东西存到Github的私有仓库。这里记录下方法

1. 现在Github创建好几个私有仓库，并记住地址。（我用的Https）

![](vx_images/5893010150446.png)


![](vx_images/1641111168872.png)



2. 控制台 打开本地需要同步的文件夹


![](vx_images/3596612156739.png)


3. 初始化仓库、提交文件、绑定远程地址、推送

```sh
git init
git add .
git commit -m "Test"
git remote add origian https://github.com/BeyondXinXin/Test.git
git push -u origian master
```


![](vx_images/2355617176905.png)


4. 可以再Github看到已经提交成功

![](vx_images/100519169574.png)



