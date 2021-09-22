# Deepin 使用教程：虚拟机拷贝  VMware、VirtualBox

linux下使用虚拟机基本上就是VMwareWork和VirtualBox。deepin商店就可以安装。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314123556718.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314124821316.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)





基本上大家都是做一个虚拟机让后来回拷贝多台电脑可以使用。
**VirtualBox载入VirtualBox：**.vdi文件，把自己配置好环境的.vdi文件直接拷贝给别人，别人创建虚拟机，载入现有盘片就可以直接使用已经装好的系统了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314124012851.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


**VMwareWork载入VMwareWork：**.vmx文件，跟VirtualBox一样直接复制到别人电脑就可以了。

**VirtualBox载入VMwareWork**：无法直接使用.vmx，但是两者都支持标准的虚拟机硬盘格式.ovf
使用   `ovftool Windows\ 7\ x64.vmx  export.ovf`   可以把VMwareWork默认的.vmx输出为.ovf，让后直接导入ovf文件就可以了
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314124552685.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

**VMwareWork载入VirtualBox**：无法直接使用.vdi文件，跟上面一样导出.ovf，VMwareWork导入就可以了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200314124659942.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

&emsp;
&emsp;
&emsp;
&emsp;
&emsp;
&emsp;

---
Deepin  系列教程
[Deepin 使用教程：前言](https://blog.csdn.net/a15005784320/article/details/103083242)