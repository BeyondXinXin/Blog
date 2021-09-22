# Nginx增加访问统计

Nginx 访问统计 增加html静态网页显示  每天定时更新

---


想统计自己网站的访问量，之前试过百度统计，在每个网页增加一些文件，百度会自己帮忙收集统计。其实如果你自己网站就是用Nginx挂在服务器上的，他自己就会帮你统计，你只需要把他整理下就可以。我简单整理了下，可以看先效果：
[http://118.25.63.144/count.html](http://118.25.63.144/count.html)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410203804639.png)
如果你希望这样简单的统计下自己小网站的访问量可以像我这样简单操作下：
## 1 修改Nginx 导出日志

```bash
whereis nginx
cd /etc/nginx/
ls -l
sudo vim nginx.conf
```
修改nginx  access_log  到指定目录

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410204310749.png)

## 2 写脚本 对日志进行统计并写入html，并清空日志
```bash
#!/bin/bash
cd /home/ubuntu/Blog

date1=`date +%F`
date2=`date +%r`
ips=`awk '{print $1"<br>"}' access.log|sort | uniq -c |sort -n -k 1 -r|head -n 10`
pv=`awk '{print $7}' access.log | wc -l`
ip=`awk '{print $1}' access.log | sort -n | uniq -c | wc -l`
html=`awk '{print $7"<br>"}' access.log|sort | uniq -c |grep -v '.jpg'|grep -v '.ico'|grep -v '.php'|grep -v '.do'|grep -v '400'|grep -v '.svg'|grep -v 'cgi-bin'|grep -v '.css'|grep -v '.js'|grep -v '.png'|grep -v '.jsp'|grep -v '.gif' |sort -n -k 1 -r | head -n 20`
echo  "<br><br>--------${date1}--${date2}------------- 
<br> Pv is $pv
<br> Ip is $ip
<br>
<br> $ips ...
<br>
<br> $html ...<br>----------<br><br>" >> count.html | sort -rn count.html | sed -i '31d' count.html | sort -r
:> access.log
:> error.log
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410204526554.png)
## 3 脚本每天凌晨定时执行

```bash
crontab -e # 添加每天凌晨12:01 执行脚本
```

> 01 00 * * *  /home/ubuntu/Blog/statistics.sh

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200410222229841.png)
## 4 如果有需要的话网页只能特定ip访问


