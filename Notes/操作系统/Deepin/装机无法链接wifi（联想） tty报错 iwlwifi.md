# Deepin 使用教程：装机无法链接wifi（联想） tty报错 iwlwifi

联想的ldeapad_laptop会干扰无线wifi硬件的开关，下图是官方解释

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%A3%85%E6%9C%BA%E6%97%A0%E6%B3%95%E9%93%BE%E6%8E%A5wifi%EF%BC%88%E8%81%94%E6%83%B3%EF%BC%89%20tty%E6%8A%A5%E9%94%99%20iwlwifi.md/420483410221172.png)

# 1. 临时使用
在终端输入如下命令，WiFi就可以正常使用了

```bash
sudo rfkill unblock wifi
sudo rfkill list
sudo modprobe -r ideapad_laptop
```

# 2. 永久使用
上边只是临时使用，如果需要永久使用需要增加开机启动命令。有很多方法可以实现，我是增加一个开机启动脚本。当然你可以直接增加 rc.local  [deepin官方介绍自动动程序](https://wiki.deepin.org/wiki/%E8%87%AA%E5%90%AF%E5%8A%A8%E7%A8%8B%E5%BA%8F#.E4.BD.BF.E7.94.A8systemd.E6.89.A7.E8.A1.8Crc.local)

```bash
sudo vim /etc/init.d/rc_ideapad.sh
```

输入如下并保存，echo '1'，这个1是你自己的密码，如果密码里有！的话需要在''一下

```bash
#! /bin/sh
### BEGIN INIT INFO
# Provides:          XXX
# Required-Start:    $syslog $remote_fs
# Required-Stop:     $syslog $remote_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: start XXX
# Description:       start XXX
### END INIT INFO

echo '1'|sudo -S modprobe -r ideapad_laptop

exit 0
```

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%A3%85%E6%9C%BA%E6%97%A0%E6%B3%95%E9%93%BE%E6%8E%A5wifi%EF%BC%88%E8%81%94%E6%83%B3%EF%BC%89%20tty%E6%8A%A5%E9%94%99%20iwlwifi.md/547613410211702.png)


增加开机启动即可

```bash
sudo update-rc.d rc_ideapad.sh defaults 22
```


# 3.  tty报错 iwlwifi 0000:00:14.3: Unhandled alg: 0x707

我最开始是参考别人的方法，这样直接屏蔽ideapad_laptop，wifi是正常的，但是tty一直报错，没法使用命令终端（ctrl+alt+F2-6）。如果你也出现这个错误可以尝试把自己添加的 **blacklist ideapad_laptop** 删除，使用增加启动脚本的方式屏蔽ldeapad_laptop。

```bash
sudo vim /etc/modprobe.d/ideapad.conf
写入如下内容：
blacklist ideapad_laptop
保存后执行如下命令：
sudo modprobe -r ideapad_laptop
```
其实我也不清楚这个错误的原因，百度半天的结果是更新内核，何必呢，干脆不把它加入黑名单就可以了。

