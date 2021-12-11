# Deepin 使用教程：git 代理
原文在这里，拷贝过来记录下：

[https://baijiahao.baidu.com/s?id=1603409484949165821&wfr=spider&for=pc](https://baijiahao.baidu.com/s?id=1603409484949165821&wfr=spider&for=pc)

在获取github上面的代码的时候，发现有时候很慢，这时候就需要使用代理。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20211211/xxx.3ung9o2xtx20.png)


设置代理

```bash
git config --global https.proxy http://127.0.0.1:12333
git config --global https.proxy https://127.0.0.1:12333
```

如果拉取gitee，记得取消代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```
