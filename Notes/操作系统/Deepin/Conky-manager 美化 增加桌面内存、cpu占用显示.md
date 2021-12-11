首先非常感谢 [https://zzzmh.cn/](https://zzzmh.cn/)，这里参考他的教程，里边还有很多其他的教程，感觉很好。

---
#  1.最终效果
&emsp;&emsp;一直想要一个桌面就可以显示电脑信息的插件，先看效果。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/conky-manager%20%E7%BE%8E%E5%8C%96%20%E5%A2%9E%E5%8A%A0%E6%A1%8C%E9%9D%A2%E5%86%85%E5%AD%98%E3%80%81cpu%E5%8D%A0%E7%94%A8%E6%98%BE%E7%A4%BA.md/538633110226935.png)

这个是借助Conky-manager实现的。

# 2. 安装Conky-manager
可以去github上下载
[https://github.com/teejee2008/conky-manager/releases](https://github.com/teejee2008/conky-manager/releases)
或者命令行安装

```bash
# 安装 conky
sudo apt install conky-all
# 安装 conky-manager
wget --no-check-certificate https://github.com/teejee2008/conky-manager/releases/download/v2.4/conky-manager-v2.4-amd64.run
chmod +x conky-manager-v2.4-amd64.run
sudo ./conky-manager-v2.4-amd64.run
```
安装好后，程序目录在 **～/.conky** 隐藏文件，ctrl+h 可以在深度文件管理器看到
里边 **fonts/** 是字体，其他几个文件夹是作者提供的桌面控件模板，跟deepin完全不兼容，体验感贼差，直接删了就行。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191207154125230.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

新建文件夹 **yxConky/**  里边在新建 **yx_conky** 文件，复制如下内容。你也可以去github上看看，语法定义，建立自己的自定义控件。

```bash
default_color white
double_buffer yes
no_buffers yes
update_interval 1.0
total_run_times 0
own_window yes
own_window_type dock
own_window_transparent yes
own_window_hints undecorated,below,sticky,skip_taskbar,skip_pager
own_window_colour 000000
own_window_argb_visual yes
own_window_argb_value 0
double_buffer yes
draw_shades yes
draw_outline no
draw_borders no
draw_graph_borders n0
minimum_size 296 5
maximum_width 165
default_color ffffff
default_shade_color 000000
default_outline_color 000000
alignment top_right
gap_x 6
gap_y 30
cpu_avg_samples 2
override_utf8_locale no
uppercase no # set to yes if you want all text to be in uppercase
use_spacer no
use_xft yes
xftfont WenQuanYi Zen Hei:pixelsize=16
override_utf8_locale yes
use_spacer no
minimum_size 296 5
TEXT
${font LCD:style=Bold:pixelsize=48}${time %H:%M}${font LCD:pixelsize=24} ${time %S}${font WenQuanYi Zen Hei:style=Bold:pixelsize=18}
${alignc}${time %Y-%m-%d 星期%a}
${hr 2}
${font WenQuanYi Zen Hei:style=Bold:pixelsize=16}${color #FCFCFC}主机: ${color}$alignr$nodename
${color #FFFFFF}开机:${color}$alignr$uptime
${color #FFFFFF}CPU:${color} $cpu% $alignr$acpitemp°C
${cpubar 4 /}
${color #FFFFFF}内存:${color}${alignr}$mem/$memmax
${membar 4 /}
${color #FFFFFF}磁盘: ${color}${alignr}${fs_used /}/${fs_size /}
${fs_bar 4 /}
${color #FFFFFF}网络:${color}$alignr${addr wlp0s20f3}
下载速度:$alignr${downspeed wlp0s20f3}
上传速度:$alignr${upspeed wlp0s20f3}
```

保存后打开 Conky-manager 。启动器下就有，刷新一下，选中自己刚才新建的，记得设置开机自启。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/conky-manager%20%E7%BE%8E%E5%8C%96%20%E5%A2%9E%E5%8A%A0%E6%A1%8C%E9%9D%A2%E5%86%85%E5%AD%98%E3%80%81cpu%E5%8D%A0%E7%94%A8%E6%98%BE%E7%A4%BA.md/463213210222689.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/conky-manager%20%E7%BE%8E%E5%8C%96%20%E5%A2%9E%E5%8A%A0%E6%A1%8C%E9%9D%A2%E5%86%85%E5%AD%98%E3%80%81cpu%E5%8D%A0%E7%94%A8%E6%98%BE%E7%A4%BA.md/181983310238173.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/conky-manager%20%E7%BE%8E%E5%8C%96%20%E5%A2%9E%E5%8A%A0%E6%A1%8C%E9%9D%A2%E5%86%85%E5%AD%98%E3%80%81cpu%E5%8D%A0%E7%94%A8%E6%98%BE%E7%A4%BA.md/259483310235675.png)