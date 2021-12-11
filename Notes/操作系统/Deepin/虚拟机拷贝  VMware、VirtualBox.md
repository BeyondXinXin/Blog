# Deepin 使用教程：虚拟机拷贝  VMware、VirtualBox

linux下使用虚拟机基本上就是VMwareWork和VirtualBox。deepin商店就可以安装。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8B%B7%E8%B4%9D%20%20vmware%E3%80%81virtualbox.md/264143510223153.png)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8B%B7%E8%B4%9D%20%20vmware%E3%80%81virtualbox.md/330933510216038.png)





基本上大家都是做一个虚拟机让后来回拷贝多台电脑可以使用。
**VirtualBox载入VirtualBox：**.vdi文件，把自己配置好环境的.vdi文件直接拷贝给别人，别人创建虚拟机，载入现有盘片就可以直接使用已经装好的系统了。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8B%B7%E8%B4%9D%20%20vmware%E3%80%81virtualbox.md/442673510216647.png)


**VMwareWork载入VMwareWork：**.vmx文件，跟VirtualBox一样直接复制到别人电脑就可以了。

**VirtualBox载入VMwareWork**：无法直接使用.vmx，但是两者都支持标准的虚拟机硬盘格式.ovf
使用   `ovftool Windows\ 7\ x64.vmx  export.ovf`   可以把VMwareWork默认的.vmx输出为.ovf，让后直接导入ovf文件就可以了
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8B%B7%E8%B4%9D%20%20vmware%E3%80%81virtualbox.md/544203510243602.png)

**VMwareWork载入VirtualBox**：无法直接使用.vdi文件，跟上面一样导出.ovf，VMwareWork导入就可以了。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/deepin/%E8%99%9A%E6%8B%9F%E6%9C%BA%E6%8B%B7%E8%B4%9D%20%20vmware%E3%80%81virtualbox.md/99473610225815.png)



