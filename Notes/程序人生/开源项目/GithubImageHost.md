# GithubImageHost

一个简易的Github图床客户端。（**QNetworkAccess** + **GitHub**）  

仓库： [GithubImageHost](https://github.com/BeyondXinXin/GithubImageHost)


---


## 进度

* 2021.09.04：拿掉上传功能去重构，打算改为利用全局快捷键实现上传（类似utools那种）。  
学习的目的已经完成，感觉Demo还凑合能用，想想十月一假期加上：任务栏缩略图、进度条、弹窗、快捷键做的完善一些。

* 2021.09.04：学习API的本意已经实现了，该有的功能都做完了。


## 说明

学习Qt网络编程的几个API，做一个图床用来练手。  

试过很多图床，都缺少全部图片预览的功能（按照目录，预览仓库内所有图片），只有预览通过该图床上传过的图片。一直想要这个功能，干脆自己实现下吧。  


> 如果只是想要一个图床，建议直接使用**PicX**:  [https://picx.xpoet.cn/#/upload](https://picx.xpoet.cn/#/upload)



## 效果

![image](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210905/image.3jiweq7jpmk0.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210905/xxx.1nt862as9itc.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210905/xxx.wz3j4kr31io.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210905/xxx.4bz7ysg8t3s0.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210905/xxx.10fnkyclr80w.png1)


## 功能

* 图床功能：利用Github仓库实现网络图床

* 图床预览：预览图床内所有图片（仅主分支）

* 支持Github Token：利用token可以实现远程修改仓库

* 上传图片：目前是源文件上传，后续增加压缩后上传

* 删除图片：利用commit实现删除（仓库大小不会改变，后续改）

* 本地记录已缓存图片：本地保留更新过的图片

* 跨平台：只使用了Qt的Api，理论上全平台通用。只试过Windos



## 参考

本来就是练手的项目，所有东西一律抄来的：  


* Github Api 官方文档（英文）：[Getting started with the REST API](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api)

* Github Api 官方文档（中文）：[REST API 入门指南](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api)

* Github Api使用：[segmentfault【SolomonXie】一篇文章搞定Github API 调用 (v3）](https://segmentfault.com/a/1190000015144126)

* UI： [picx（Dark Reader 插件下显示效果）](https://github.com/XPoet/picx)

* 界面： [feiyangqingyun/QWidgetDemo](https://github.com/feiyangqingyun/QWidgetDemo)

* API设计： [vnote](https://github.com/vnotex/vnote)




## 使用


1. 创建Github仓库
2. 获取GitHub Token
3. 配置图床


## 相关笔记


* [x] [利用Qt实现Https网络请求](https://github.com/BeyondXinXin/Blog/blob/master/C%2B%2B/Study%20Qt%20C%2B%2B/Qt%E7%BD%91%E7%BB%9C/%E5%88%A9%E7%94%A8Qt%E5%AE%9E%E7%8E%B0Https%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82.md)

* [x] [利用Qt并行抓去网络图片(https)](https://github.com/BeyondXinXin/Blog/blob/master/C%2B%2B/Study%20Qt%20C%2B%2B/Qt%E7%BD%91%E7%BB%9C/%E5%88%A9%E7%94%A8Qt%E5%B9%B6%E8%A1%8C%E6%8A%93%E5%8E%BB%E7%BD%91%E7%BB%9C%E5%9B%BE%E7%89%87(https).md)

* [x] [遍历Github仓库并提取所有图片](https://github.com/BeyondXinXin/Blog/blob/master/C%2B%2B/Study%20Qt%20C%2B%2B/Qt%E7%BD%91%E7%BB%9C/%E9%81%8D%E5%8E%86Github%E4%BB%93%E5%BA%93%E5%B9%B6%E6%8F%90%E5%8F%96%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.md)

* [x] [GithubImageHost图床本地缓存设计](https://github.com/BeyondXinXin/Blog/blob/master/C%2B%2B/Study%20Qt%20C%2B%2B/%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7/GithubImageHost%E5%9B%BE%E5%BA%8A%E6%9C%AC%E5%9C%B0%E7%BC%93%E5%AD%98%E8%AE%BE%E8%AE%A1.md)

* [x] [利用Qt实现Gif转预览图片](https://github.com/BeyondXinXin/Blog/blob/master/C%2B%2B/Study%20Qt%20C%2B%2B/%E5%9B%BE%E5%83%8F/%E5%88%A9%E7%94%A8Qt%E5%AE%9E%E7%8E%B0Gif%E8%BD%AC%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87.md)

