**docsify** 中文使用教程： [https://docsify.js.org/#/zh-cn/cover](https://docsify.js.org/#/zh-cn/cover)
**docsify** chat：	[https://gitter.im/docsifyjs/Lobby](https://gitter.im/docsifyjs/Lobby)
[https://github.com/docsifyjs/docsify-cli](https://github.com/docsifyjs/docsify-cli)


### 1.1. docsif介绍
&emsp;&emsp;docsify是一个文档网站生成工具（md转html 类似于gitbook）。docsify 是一个动态生成文档网站的工具。不同于 GitBook、Hexo 的地方是它不会生成将 .md 转成 .html 文件，所有转换工作都是在运行时进行。如果只是需要快速的搭建一个小型的文档网站，或者不想因为生成的一堆 .html 文件“污染” commit 记录，只需要创建一个 index.html 就可以开始写文档。

使用docsify 的文档项目：
[https://github.com/docsifyjs/awesome-docsify#showcase](https://github.com/docsifyjs/awesome-docsify#showcase)
### 1.2. 特性
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

&emsp;&emsp;使用方式，你可以安装npm工具来完成docsify的部署和配置。但是我感觉那样很麻烦，而且npm的各种版本对应就是个大坑。你其实只需要一个index.html就可以实现文档网站生成。启动一个静态服务器直接用python就可以，或者[Nginx](https://blog.csdn.net/a15005784320/article/details/103437776)

```bash
cd Blog && python -m SimpleHTTPServer 3000　// python2
cd Blog && python -m http.seriver 3000 // python3
```

&emsp;&emsp;使用docsify需要几个文件，index.html、_coverpage.md、_sidebar.md、README.md。
index.html&emsp;&emsp;用来调外部js解析md文档
README.md&emsp;&emsp;是首页
_coverpage.md&emsp;&emsp;是封面
_sidebar.md&emsp;&emsp;是左侧导航栏

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
&emsp;&emsp;估计这是一个只有自己访问的网址导航工具吧。
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