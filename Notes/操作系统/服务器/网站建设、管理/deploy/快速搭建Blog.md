# 快速搭建Blog

linux 快速搭建Blog（腾讯云服务器+Centos+宝塔+ZBlog）


---


摘要：记录下服务器快速搭建一个自己的Blog的过程：腾讯云服务器安装Centos系统、ssh登录服务器，安装宝塔套件、浏览器登录宝塔控制面板，一件安装环境、安装Z-Blog服务器、设置Z-Blog皮肤和插件

## 1 腾讯云服务器安装Centos系

如果没有什么特别的需求的话，公共镜像里Centos 选一个合适的版本就可以。为了方便快速配置环境，我使用宝塔面板，宝塔对Centos的适配性比ubuntu/debain要好。服务器安装大概几分钟就可以了。

## 2 ssh登录服务器，安装宝塔套件
 可以使用ssh命令远程登录自己的服务器。（windos下控制台一样的）

```Bash
ssh 用户名@ip地址 -p 端口号
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/e2e8dcb764d65c55d1cc2b9f02c7db6d.png#pic_center)


远程登录成功后，可以一键安装宝塔套件



```Bash
# Centos安装命令：
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
# Ubuntu/Deepin安装命令：
wget -O install.sh http://download.bt.cn/install/install-ubuntu_6.0.sh && sudo bash install.sh
```
安装过程大概几分钟就好了

![](https://img-blog.csdnimg.cn/img_convert/53cfaaf02657b936115f02d7a5dbf1c1.png#pic_center)


## 3 浏览器登录宝塔控制面板，一件安装环境
  安装成功后输入

```Bash
bt default
```
可以看到宝塔面板的登录网页，账号和密码。打开浏览器登录

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/1079136c4a92c50551820c89dfb56977.png#pic_center)


软件商店可以一键安装自己需要的环境（记得安装宝塔一键部署源码插件）

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/e606eafb0c1c67285646aae6fdfb4443.png#pic_center)


## 4 安装Z-Blog服务器
使用一键部署源码插件，安装Z-Blog。如果自己有域名的话，也在这里输入。

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/53607992d7c46a810df9dbe03c776429.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/aae98395437e736aae40e833f142728b.png#pic_center)


成功后可以在网站里看到自己网站点设置可以部署证书，FTP可以修改网站资源。

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/a51663d4ecc95ad1b2a1dcea594eebd3.png#pic_center)


## 5 设置Z-Blog皮肤和插件
进入Z-BLOG后台，http://118.25.63.144:501/zb_system/login.php（php版本的，如果你装的asp版的建议重装）

  进去之后更新，安装插件和皮肤。本博客的设置

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201223213136588.png#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201223213154777.png#pic_center)


