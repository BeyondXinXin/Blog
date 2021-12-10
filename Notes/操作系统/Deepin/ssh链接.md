# Deepin 使用教程：ssh链接

```bash
sudo apt install openssh-client #本地主机运行此条，实际上通常是默认安装client端程序的
sudo apt install openssh-server #服务器运行此条命令安装
```

```bash
sudo /etc/init.d/ssh start #服务器启动ssh-server服务
sudo /etc/init.d/ssh stop #server停止ssh服务
sudo /etc/init.d/ssh restart #server重启ssh服务
```

```bash
ifconfig #查询ip地址，在返回信息中找到自己的ip地址
```

```bash
ssh dell@192.168.30.6
# 如果需要调用图形界面程序
ssh -X dell@192.168.30.6
```

```bash
Ctrl+D   #退出
```
