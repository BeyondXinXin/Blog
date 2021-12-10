# Deepin 使用教程：虚拟机（VirtualBox）安装增强功能

&emsp;&emsp;4月份v20发布，直接把笔记本换成v20了，让后每天卡死n次，各种闪退。用了几天赶紧换回来。这次6月份更新版发布，决定还是先装个虚拟机跑跑没问题在搞吧。
&emsp;&emsp;用的VirtualBox，个人感觉免费的而且功能多。vm需要收费，vm免费版跟VirtualBox没法比。VirtualBox如果需要清爽的使用需要安装虚拟增强功能，这样才有界面支持缩放、文件拖拽等功能。默认安装肯定是失败的。
&emsp;&emsp;其实只需要点设备、安装增强功能。让后弹出失败，这是在虚拟机里打开文件夹，sudo执行下VBoxLinuxAdditions.run让后重启虚拟机就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200604214818239.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

