# Deepin 使用教程：安装nvidia 驱动、cuda、cudnn、libtorch

## 标题Deepin 使用教程：安装nvidia 驱动、cuda、cudnn、libtorch

最近两周都是远程办公，公司电脑没法用，我寻思把家里的笔记本也配置好gpu的工作环境吧。系统装的deepin自动安装各种失败，这里手动安装记录下。

一、电脑配置以及版本选择

家里笔记本配置　 联想y7000p   gtx1650（notebooks）& Intel Device
安装的版本在这里，你需要根据自己显卡找到合适的驱动和cuda版本。


nvidia  430.09
cuda 10.1.168（updata 1）
cudnn 7.6.4 for cuda 10.1
cuda 10.0.130
cudnn 7.6.4 for cuda10.0

[Nvidia 驱动下载 https://www.nvidia.cn/Download/index.aspx?lang=cn](https://www.nvidia.cn/Download/index.aspx?lang=cn)
[cuda下载  https://developer.nvidia.com/cuda-toolkit-archive](https://developer.nvidia.com/cuda-toolkit-archive)
[cudnn下载   https://developer.nvidia.com/rdp/cudnn-archive](https://developer.nvidia.com/rdp/cudnn-archive)

二、驱动安装
这里我装的时候看到网上有很多方法，不见得都是正确的，大家都是相互借鉴。如果我这个对你造成误导那先说声对不起哈。
大致思路就是
1）禁用 nouveau
Nouveau是由第三方为NVIDIA显卡开发的一个开源3D驱动，效果不是很好。
2）关闭图形化界面
3）安装驱动
4）开启图形化界面

三、


未完待续…

过年时候装的，因为写安装教程，我打算系统清空重新边截图边写过程，最近工作比较忙就一直搁浅了。争取下周补上。


