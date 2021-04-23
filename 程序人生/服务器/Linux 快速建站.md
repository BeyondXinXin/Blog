之前写过一篇win下建站的博客[快速搭建自己个人博客网站](https://blog.csdn.net/a15005784320/article/details/98870991)
&emsp;&emsp;自从换了工作差不多有四五个月了，也没有管过自己的个人网站，一直就挂在哪里。突然心血来潮想整理下，登录发现，win竟然不会用了。再加上自己本来买的就是超低配的，装个win卡的要命。趁着最近一直在linux工作，干脆换成ubuntu server好了。
&emsp;&emsp;记录下自己快速建站的步骤。

---

  @[toc](Linux 快速建站)

## 1. 准备工具

* 系统 **Ubuntu Server 16.04.1 LTS 32位**

&emsp;&emsp;用16  32 主要是因为服务器本身很垃圾。



* 反向代理web服务器 **Nginx**

&emsp;&emsp;ubuntu server下主流的服务器有两种 Nginx与Apache，相比较下Nginx占用资源小、更稳定(静态网页)。两个我都试了下，最后选Nginx，主要要是这玩意小！我的云服务器是超级低配版的。

* 博客模板
https://www.yangqq.com/
http://www.templatesy.com/Search/category/2
http://www.cssmoban.com/tags.asp?n=博客
* 文件管理  FileZilla

## 2. 安装系统

华为、百度、阿里 的云服务器我都申请过免费的试过。系统安装这快没啥的，选中需要的一键安装就可以了。
[快速搭建自己个人博客网站](https://blog.csdn.net/a15005784320/article/details/98870991)
这里有腾讯的购买教程
![选择](https://img-blog.csdnimg.cn/20191207174651187.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207180408347.png)
## 3. 登录服务器

默认安装好的云服务器，ssh都是配置好的，直接登录就可以。公网ip也都是确定的。
可以看我之前写的 [Deepin 使用教程：ssh链接](https://blog.csdn.net/a15005784320/article/details/103220785)

```bash
ssh ubuntu@118.25.63.144
```

如果报错 WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
因为我反复装了几个系统测试，你每次ssh链接都会建立一个本地秘钥，如果服务器重装，本地秘钥需要删除。

```bash
(base) yx@yx-PC:~$ ssh ubuntu@118.25.63.144
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:Gu831LBb88irYoSz2hy1zf9AsL5fZzu/2HLPj7eW+iE.
Please contact your system administrator.
Add correct host key in /home/yx/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /home/yx/.ssh/known_hosts:1
  remove with:
  ssh-keygen -f "/home/yx/.ssh/known_hosts" -R 118.25.63.144
ECDSA host key for 118.25.63.144 has changed and you have requested strict checking.
Host key verification failed.
(base) yx@yx-PC:~$ rm -rf /home/yx/.ssh/known_hosts 
(base) yx@yx-PC:~$ ssh ubuntu@118.25.63.144
The authenticity of host '118.25.63.144 (118.25.63.144)' can't be established.
ECDSA key fingerprint is SHA256:Gu831LBb88irYoSz2hy1zf9AsL5fZzu/2HLPj7eW+iE.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '118.25.63.144' (ECDSA) to the list of known hosts.
ubuntu@118.25.63.144's password: 
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-92-generic i686)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

ubuntu@VM-0-10-ubuntu:~$ 
```

## 4. 安装 Nginx
```bash
# 安装并开启服务
sudo apt-get install nginx
sudo service nginx start
```
其实用Nginx不用Apache还有一个原因就是，这玩意配置太方便了，因为已经好了。这个时候你就可以在外网访问自己的网站了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207181417877.png)
## 5. 配置 Nginx

**修改网站目录**

```bash
sudo vim /etc/nginx/sites-available/default
# 36行 root 网站目录； 比如我的 /home/ubuntu/www
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207182505689.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019120718261766.png#pic_center)

**修改进程数量**
&emsp;&emsp;关于开几个进程，这是作者原话
> As a general rule you need the only worker with large number of worker_connections, say 10,000 or 20,000.
However, if nginx does CPU-intensive work as SSL or gzipping and you have 2 or more CPU, then you may set worker_processes to be equal to CPU number.
Besides, if you serve many static files and the total size of the files is bigger than memory, then you may increase worker_processes to utilize a full disk bandwidth. Igor Sysoev

&emsp;&emsp;其实就是建议你Nginx开的进程数越多越好。对我没卵用，我的云服务器就是单核。更改位置在这里。

```bash
sudo vim /etc/nginx/nginx.conf
# worker_processes  设置成cpu核数  1 2 4等
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207182140429.png#pic_center)

## 6. 重启 Nginx

```bash
sudo service nginx restart
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019120718275344.png#pic_center)


## 7. 上传网站
&emsp;&emsp;先下载一个网站模板通过filezilla上传到上边写的网站路径里。
&emsp;&emsp;上传完毕，公网就可以直接访问你的网站了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207183631432.png)

## 8. 报错解决思路
&emsp;&emsp;首先是系统方面的错误，这块基本不会出现。大厂的云服务器公共镜像是很稳定的。
&emsp;&emsp;让后是**Nginx**安装&配置错误，比如我上边截图的404就是找不到index.html，跟**Nginx**相关错误，需要去看他的日志。

&emsp;&emsp;Nginx 日志分为访问日志和错误日志。默认打开，设置是否打开和路径在这里

```bash
 cat /etc/nginx/nginx.conf
 # 如果要关闭 
 # access_log off;
 # error_log off;
```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207184544300.png#pic_center)
&emsp;&emsp;访问 错误日志
```bash
cat /var/log/nginx/access.log 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207185307929.png#pic_center)

&emsp;&emsp;访问 访问日志

```bash
cat /var/log/nginx/access.log 
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019120718510955.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207185133848.png#pic_center)