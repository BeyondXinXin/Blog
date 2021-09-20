# docsify学习笔记

## 1 docsify介绍

自己从事客户端的开发工作，总搭建自己的博客把零散的知识记录起来。对网页开发这块不太懂，总是没事copy别人一个前端模板来用，可是找不到自己满意的那种，简洁的小清新范。
经过好久的筛选之后，我放弃了用那种网上的模板了。实在找不到自己满意的，自己写静态网页吧会一点可是太麻烦干脆直接把网站改成gitbook那种由md转换过来的好了。不管是风格还是开发过程都很喜欢。
类似于gitbook文档创作分享网站有很多，我也试过几个最后选择使用docsify。这样搭建的网站比较适合自己用。

效果：[http://118.25.63.144](http://118.25.63.144)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200404092428268.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200404092447991.png)
选择使用docsify的原因：
- 不会生成html（测试gitbook搞了一堆html出来，看着就烦），文档目录比较整洁
- 不喜欢npm和第三方工具（感觉这玩意版本太坑了）
- 使用起来比docute简单


web这块基本完全不懂，这是自己摸索出来一套使用逻辑，也不知道是否合适：

1. 网站主要是个人工作知识备忘录，和自己喜欢的网址导航页，代码就直接挂在gitee了 [https://gitee.com/yaoxin001/Blog](https://gitee.com/yaoxin001/Blog)
2. 平时记录直接写在csdn上，但是这玩意查找很不方便，外观也不是自己喜欢的。
3. csdn博客写好后，把挂在gitee的代码增加新博客的导航，改成自己喜欢的样子。
4. 服务器使用Nginx服务，代理位置从gitee上在拉一份，每次提交后登录服务器更新下。

其实整个网站都可以直接挂在gitee或者github，不过还是想搭建在自己服务器上，还可以学习下这个步骤。

## 2 docsify使用



**docsify** 中文使用教程： [https://docsify.js.org/#/zh-cn/cover](https://docsify.js.org/#/zh-cn/cover)  
**docsify** chat：	[https://gitter.im/docsifyjs/Lobby](https://gitter.im/docsifyjs/Lobby)  
[https://github.com/docsifyjs/docsify-cli](https://github.com/docsifyjs/docsify-cli)  


### 2.1. docsif介绍
docsify是一个文档网站生成工具（md转html 类似于gitbook）。docsify 是一个动态生成文档网站的工具。不同于 GitBook、Hexo 的地方是它不会生成将 .md 转成 .html 文件，所有转换工作都是在运行时进行。如果只是需要快速的搭建一个小型的文档网站，或者不想因为生成的一堆 .html 文件“污染” commit 记录，只需要创建一个 index.html 就可以开始写文档。

使用docsify 的文档项目：
[https://github.com/docsifyjs/awesome-docsify#showcase](https://github.com/docsifyjs/awesome-docsify#showcase)
### 2.2. 特性
- 无需构建，写完文档直接发布
- 容易使用并且轻量 (~19kB gzipped)
- 智能的全文搜索
- 提供多套主题
- 丰富的 API
- 支持 Emoji
- 兼容 IE10+
- 支持 SSR (example)

### 1.3. 使用docsify 
效果：[http://118.25.63.144](http://118.25.63.144)
全部代码在：[https://gitee.com/yaoxin001/Blog](https://gitee.com/yaoxin001/Blog)

使用方式，你可以安装npm工具来完成docsify的部署和配置。但是我感觉那样很麻烦，而且npm的各种版本对应就是个大坑。你其实只需要一个index.html就可以实现文档网站生成。启动一个静态服务器直接用python就可以，或者[Nginx](https://blog.csdn.net/a15005784320/article/details/103437776)

```bash
cd Blog && python -m SimpleHTTPServer 3000　// python2
cd Blog && python -m http.seriver 3000 // python3
```

使用docsify需要几个文件，index.html、_coverpage.md、_sidebar.md、README.md。
index.html用来调外部js解析md文档
README.md是首页
_coverpage.md是封面
_sidebar.md是左侧导航栏

```bash
(base) yx@yx-PC:~$ tree Documents/Gitee/Blog/
Documents/Gitee/Blog/
├── bg.png
├── blog
├── _coverpage.md
├── icon.jpg
├── index.html
├── README.md
├── server.py
├── _sidebar.md
├── Study-VTK.md
└── SUMMARY.md
```

> index.html

```php
<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
</head>
<body>
  <div id="app"></div>
  <script>
    window.$docsify = {
      coverpage: true,
      loadSidebar: true,
      subMaxLevel: 2
    }
  </script>
  <script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
</body>
</html>
```

> README.md

```php
# 介绍
估计这是一个只有自己访问的网址导航工具吧。
```

> _coverpage.md

```php
![logo](icon.jpg)

# Beyond欣 's Blog Navigation
> 人最怕安逸，追求什么也别追求安逸
* 
[百度](https://www.baidu.com/)
[翻译](https://fanyi.baidu.com/?aldtype=16047#auto/zh/)
[阿里邮箱](http://mail.hichina.com/)
[CSDN](https://blog.csdn.net/a15005784320)
[gitee](https://gitee.com/yaoxin001)  
[Get Started](#介绍)
```

> _sidebar.md

```php
* [介绍]()
* [Study-VTK](Study-VTK)
```







## 3 docsify部署码云



docsify 中文使用教程： [https://docsify.js.org/#/zh-cn/cover](https://docsify.js.org/#/zh-cn/cover)
码云Pages [https://gitee.com/help/articles/4136](https://gitee.com/help/articles/4136)
码云Gitee Pages Pro [https://gitee.com/help/articles/4228](https://gitee.com/help/articles/4228)

码云 Pages 是一个免费的静态网页托管服务，您可以使用 码云 Pages 托管博客、项目官网等静态网页。如果您使用过 Github Pages 那么您会很快上手使用码云的 Pages服务。目前码云 Pages 支持 Jekyll、Hugo、Hexo编译静态资源。  
docsify是一个文档网站生成工具（md转html 类似于gitbook）。docsify 是一个动态生成文档网站的工具。不同于 GitBook、Hexo 的地方是它不会生成将 .md 转成 .html 文件，所有转换工作都是在运行时进行。如果只是需要快速的搭建一个小型的文档网站，或者不想因为生成的一堆 .html 文件“污染” commit 记录，只需要创建一个 index.html 就可以开始写文档。

效果：[http://yaoxin001.gitee.io/blog/#/](http://yaoxin001.gitee.io/blog/#/)

配置比较简单，只用修改部署目录就可以。  
**！需要在部署目录的同级目录新建一个.nojekyll文件，空的就可以。这样gitee pages就不会忽略“_”开头的文件**
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200405171730322.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200405170937511.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200405171338806.png)






