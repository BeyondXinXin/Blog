# git使用记录

## 1 小乌龟 TortoiseGit使用本地代理


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/70723710211704.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/138773710214208.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/213373710223155.png =800x)


这样也可以

```bash
git config --global https.proxy http://127.0.0.1:12333
git config --global https.proxy https://127.0.0.1:12333
```

## 2 记录：git删除远程仓库提交


### 2.1 背景
周末来加班，需要合并几次提交，**MR**好了之后才发现无法编译通过，少了东西。想了下还是把自己的提交还原等本人来解决把。

### 2.2 需求
远方仓库删除自己的提交

### 2.3 操作

#### 2.3.1 备份一下

水平比较菜，怕出问题还是先备份一下吧。github上创一个私有仓库，把目前的仓库先提交备份一下。

```bash
git remote add backups https://github.com/xxxxx/xxxxx.git
```
> 原则上是不进行删除远程仓库提交的操作，一旦回退这期间别人的提交的数据也都无法复原，错了重新覆盖再提交一份就好。

#### 2.3.2 重置

```bash
git log # 查看提交的head
git reset --hard xxxxxx # xxxx指需要还原的那一次提交

```


#### 2.3.3 提交

```bash
git push origin master -f
```

这个时候本地和**origin**是还原后的，**backups**是还原之前的。


### 2.4 reset 和 revert

* reset ：重置，直接放弃某一个版本之后所有的数据（没有提交记录、数据无法找回）
* revert ：回滚，再提交一次还原到某一个版本（再生成一个新的提交）


## 3 同步本地文件或仓库到Github

最近整理文件，想把一些东西存到Github的私有仓库。这里记录下方法

1. 现在Github创建好几个私有仓库，并记住地址。（我用的Https）

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/75673910216040.png =800x)



![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/156513910216649.png =800x)




2. 控制台 打开本地需要同步的文件夹


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/239953910243604.png =800x)


3. 初始化仓库、提交文件、绑定远程地址、推送

```sh
git init
git add .
git commit -m "Test"
git remote add origian https://github.com/BeyondXinXin/Test.git
git push -u origian master
```


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/310043910225817.png =800x)


4. 可以再Github看到已经提交成功

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/git%E4%BD%BF%E7%94%A8%E8%AE%B0%E5%BD%95.md/383933910215115.png =800x)


## 4 TortoiseGit  速度较慢 改用 openssh

之前一直用**GitKraken**+小飞机在**ubuntu**下拉代码学习。最近把家里的电脑换成**windos**，我发现只要用**TortoiseGit**来拉代码速度永远15kb/s。已经开了代理，**TortoiseGit**也设置使用本地代理的端口速度就是上不去。但是直接**git clone**速度却正常。

翻到了这段说明[https://www.iteye.com/topic/1124117](https://www.iteye.com/topic/1124117)，重装**TortoiseGit**。不用**TortoisePLink**改用**openssh**后果然速度正常了。



