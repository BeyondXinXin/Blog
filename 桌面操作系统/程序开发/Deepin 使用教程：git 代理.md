# Deepin 使用教程：git 代理
原文在这里，拷贝过来记录下：
&emsp;&emsp;[https://baijiahao.baidu.com/s?id=1603409484949165821&wfr=spider&for=pc](https://baijiahao.baidu.com/s?id=1603409484949165821&wfr=spider&for=pc)

&emsp;&emsp;在获取github上面的代码的时候，发现有时候很慢，这时候就需要使用代理。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200523112214384.png)
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
---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)