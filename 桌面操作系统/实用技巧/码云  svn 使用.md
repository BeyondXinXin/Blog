# 码云  svn 使用

废话就不多说了,现在迫切需要一个代码管理工具来整理自己在公司的修改.

用公司svn的话,上边有很多东西,本身是小白,担心搞挂了,
自己电脑做svn服务器和svn客户端   或者本地git就自己用    感觉特别傻逼
github用过一段,网络时好时差
gitbash放到我自腾讯云服务器上,我试了下速度跟github查不了多少

正好十一假期花一天纠结了一圈,试试   [码云](https://gitee.com/)  ,听说做的不错,正好试试.


# 需求  搭建一个私有的svn方便自己个人程序的编写

 1. 注册码云账号
这个没啥好讲的,绑定就好了.
 2. 建立组织
这步可以忽略,我觉得这样拓展性更好一点
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002133527600.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002133639377.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)

添加成员在这里![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134318283.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


 3. 建立仓库(相当于SVN服务器)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134355538.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134441786.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134458248.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134505814.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019100213451194.png)

 4. 本地搭建SVN客户端
安装  rapidsvn
商店直接搜索暗转就可以
或者
sudo apt-get install rapidsvn

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134714232.png)
书签右键签出新的工作副本
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134758846.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
地址填克隆这里的
账号密码就是自己的码云账号密码

 5. 提交代码可以工作了
刚加进来是空白的,需要添加按如下步骤
这种文件![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002134929619.png)
右键add
让后右键connect就可以了


![在这里插入图片描述](https://img-blog.csdnimg.cn/20191002135010655.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)