# 记录：git删除远程仓库提交


## 背景
周末来加班，需要合并几次提交，**MR**好了之后才发现无法编译通过，少了东西。想了下还是把自己的提交还原等本人来解决把。

## 需求
远方仓库删除自己的提交

## 操作

#### 1 备份一下

水平比较菜，怕出问题还是先备份一下吧。github上创一个私有仓库，把目前的仓库先提交备份一下。

```bash
git remote add backups https://github.com/xxxxx/xxxxx.git
```
> 原则上是不进行删除远程仓库提交的操作，一旦回退这期间别人的提交的数据也都无法复原，错了重新覆盖再提交一份就好。

#### 2 重置

```bash
git log # 查看提交的head
git reset --hard xxxxxx # xxxx指需要还原的那一次提交

```


#### 3 提交

```bash
git push origin master -f
```

这个时候本地和**origin**是还原后的，**backups**是还原之前的。


## reset 和 revert

* reset ：重置，直接放弃某一个版本之后所有的数据（没有提交记录、数据无法找回）
* revert ：回滚，再提交一次还原到某一个版本（再生成一个新的提交）

## 原文

[记录：git删除远程仓库提交](https://github.com/BeyondXinXin/Blog/blob/master/%E6%A1%8C%E9%9D%A2%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E5%AE%9E%E7%94%A8%E6%8A%80%E5%B7%A7/%E8%AE%B0%E5%BD%95%EF%BC%9Agit%E5%88%A0%E9%99%A4%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93%E6%8F%90%E4%BA%A4.md)
