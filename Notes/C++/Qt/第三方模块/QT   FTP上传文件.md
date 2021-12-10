# QT   FTP上传文件

@[TOC](QT   FTP上传文件)
## 两台电脑通过网线建立本地连接，保证网关在同一段；

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190806135413813.png)



## 服务器端打开ftp；
控制面板→程序→启用或关闭windows功能→windows功能→Internet信息服务
启用“FTP服务”FTP扩展性” IIS管理控制台”

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190806135432695.png)
开始屏幕的搜索中输入“IIS”，然后点击打开“IIS管理器”
打开“IIS管理器”后，在左栏的“网站”上点击右键，打开“添加FTP站点”
然后按照提示填写站点信息
点击“下一步”，按照下图提示，设置“绑定和SSL设置”，在“IP地址”处，可以用内网IP也可以用外网IP，访客自然也就根据你的IP设定来决定;
点击“下一步”，设置“身份验证和授权信息”
然后在本机浏览器地址栏中输入“ftp://填写的IP”测试一下






## 客户端网页测试远程访问；
客户端（另一台电脑）浏览器地址栏中输入“ftp://填写的IP”测试一下

## 客户端cmd测试远程访问；
win+r打开运行窗口，输入cmd
回车打开cmd命令窗口
cmd命令中输入：ftp回车
回车切换至ftp命令窗口，输入命令：open，回车提示：到
到即所要连接测试的ftp地址，我们输入：IP 22
即：ip地址+空格+端口号，没有+号
回车后弹出用户一行，输入ftp的用户名后回车，输入ftp用户名对应的密码
输入密码后回车，如果提示,user logged in就说么ftp创建无问题


## 客户端程序测试远程访问。
新建程序，添加ftpclass.cpp、ftpclass.h，复制main.cpp内容到程序入口函数
注意：/*项目-属性-常规-字符集-使用多字节字符集*/
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190806135502787.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)


```javascript
//main.cpp
#include "stdafx.h"
#include "ftpclass.h"

void main()
{
	printf("------- 开始测试！------\n");
	printf("01--创建连接 %d\n", FtpClass::createConnection());
	printf("02--打开目标ftp %d\n", FtpClass::createTable());	
	
	/*可以读取ini内参数
	FtpClass::ftp_Ip = TEXT("Ini读取");
	FtpClass::ftp_Port = TEXT("Ini读取");
	FtpClass::ftp_User = TEXT("Ini读取");
	FtpClass::ftp_Password = TEXT("Ini读取");
	FtpClass::ftp_Fixed_Path = TEXT("Ini读取");*/
	
	printf("03--创建文件夹 %d\n", FtpClass::createFolder("自动生成目录1","自动生成目录2","自动生成目录3"));	
	/*上传目标路径*/

	printf("04--上传文件 %d\n", FtpClass::insert( "D:/a.txt", "b.txt"));
	/*本机文件需要上传文件*/  /*上传后文件名称,可以和本地文件名称不一样，类型最好别换*/
	
	printf("05--关闭通讯 %d\n", FtpClass::createClose());
	printf("------ 结束测试！------\n");
	
	return ;
}

```

```javascript
//ftpclass.h
/*项目-属性-常规-字符集-使用多字节字符集*/
/*wininet.lib、shlwapi.lib可以直接添加到附加依赖项*/
/*BOOL_VERIFY、NULL_VERIFY 程序结束判断*/


#pragma once

#pragma comment(lib,"wininet.lib")
#pragma comment(lib,"shlwapi.lib")

#define  BOOL_VERIFY(emStatus_bool,switch_bool) \
if (emStatus_bool == true)\
{return true;}\
else{\
if (switch_bool == 3) printf("      FTP_03_err:创建文件夹失败！%d\n"); \
if (switch_bool == 4) printf("      FTP_04_err:上传文件失败！\n");     \
if (switch_bool == 5) printf("      FTP_05_err:关闭窗口句柄失败！\n"); \
return false;\
}


#define  NULL_VERIFY(emStatus_null,switch_null) \
if (emStatus_null != NULL)\
{return true;}\
else{\
if (switch_null == 1) {printf("      FTP_01_err:打开通讯错误 Error:%d\n", GetLastError());}\
if (switch_null == 2) {printf("      FTP_02_err:建立连接错误 Error:%d\n", GetLastError());}\
return false;\
}


#include "stdafx.h"//没用
#include <afxinet.h>//MFC相关
#include "wininet.h"//调用FTP相关类
#include "shlwapi.h"//调用文件操作相关类


class FtpClass
{
public:	
	/*ini读取变量*/
	static CString ftp_Ip;//目标ip
	static CString ftp_Port;//目标端口
	static CString ftp_User;//目标账户
	static CString ftp_Password;//目标密码
	static CString ftp_Fixed_Path;//目标固定路径
	static CString ftp_Free_Path;//目标自己生成路径
	
	 /*全局变量*/
	static BOOL  pRes;
	static HINTERNET hInternet;
	static HINTERNET hConnect;
	
	/*全局函数*/
	static bool createConnection();											//创建一个连接
	static bool createTable();	
	static bool ThreadInternetConnect(PVOID ) 
	//打开目标ftp
	static bool createFolder(CString temp1, CString temp2, CString temp3);  //上传文件
	static bool insert(CString temp, CString temp1);                        //出入数据
	static bool createClose();                                              //断开连接
};
```

```javascript
//ftpclass.cpp
#include "stdafx.h"
#include "ftpclass.h"



CString FtpClass::ftp_Ip = TEXT("192.168.3.104");
CString FtpClass::ftp_Port = TEXT("21");
CString FtpClass::ftp_User = TEXT("Administrator");
CString FtpClass::ftp_Password = TEXT("xinxin");
CString FtpClass::ftp_Fixed_Path = TEXT("1级固定目录/2级固定目录/3级固定目录");
CString FtpClass::ftp_Free_Path = TEXT("自动生成目录");
BOOL  FtpClass::pRes = false;
HINTERNET FtpClass::hInternet = NULL;
HINTERNET FtpClass::hConnect = NULL;


//创建一个连接
bool FtpClass::createConnection() {
	/*ftp_Ip = TEXT("Ini读取");
	ftp_Port = TEXT("Ini读取");
	ftp_User = TEXT("Ini读取");
	ftp_Password = TEXT("Ini读取");
	ftp_Fixed_Path = TEXT("Ini读取");*/

	hInternet = InternetOpen(NULL, INTERNET_OPEN_TYPE_DIRECT,
		NULL, NULL, INTERNET_FLAG_NO_CACHE_WRITE);
	NULL_VERIFY(hInternet,1);
}
bool FtpClass::ThreadInternetConnect(PVOID param) {

 // 打开http      
 hConnect = InternetConnect(hInternet, ftp_Ip, INTERNET_DEFAULT_FTP_PORT,//INTERNET_DEFAULT_FTP_PORT  第三个参数默认值21
  ftp_User, ftp_Password, INTERNET_SERVICE_FTP,
  INTERNET_FLAG_EXISTING_CONNECT || INTERNET_FLAG_PASSIVE, 0);

 return 1;
}

//打开目标ftp
bool FtpClass::createTable()
{
 /*hConnect = InternetConnect(hInternet, ftp_Ip, 25,//INTERNET_DEFAULT_FTP_PORT  第三个参数默认值21
  ftp_User, ftp_Password, INTERNET_SERVICE_FTP,
  INTERNET_FLAG_EXISTING_CONNECT || INTERNET_FLAG_PASSIVE, 0);
 NULL_VERIFY(hConnect,2);*/
 HANDLE hThread = CreateThread(NULL, 0, (LPTHREAD_START_ROUTINE)ThreadInternetConnect, (LPVOID)NULL, 0, NULL); 
 //超时3秒，如果等待结果是超时
 if (WaitForSingleObject(hThread, 3 * 1000) == WAIT_TIMEOUT) {
  TerminateThread(hThread, 0);
  CloseHandle(hThread);
  NULL_VERIFY(hConnect, 2);  
 }
 NULL_VERIFY(hConnect, 2);
}

//上传文件
bool FtpClass::createFolder(CString temp1, CString temp2, CString temp3)
{
	/*新建文件件每次只能创建一级，多个需要分多次创建*/
	pRes = false;	
	ftp_Free_Path = "";
	ftp_Free_Path = ftp_Fixed_Path  + "/" + temp1;
	FtpCreateDirectory(hConnect, ftp_Free_Path);
	ftp_Free_Path = ftp_Free_Path + "/" + temp2;
	FtpCreateDirectory(hConnect, ftp_Free_Path);
	ftp_Free_Path = ftp_Free_Path + "/" + temp3;
	pRes = FtpCreateDirectory(hConnect, ftp_Free_Path);
	BOOL_VERIFY(pRes,3);
}
//出入数据
bool FtpClass::insert(CString temp, CString temp1)
{
	pRes = false;
	ftp_Free_Path = ftp_Free_Path + "/" +temp1;
	pRes = FtpPutFile(hConnect, temp,/*本机文件*/
		ftp_Free_Path,  /*TEXT("一级目录/二级目录/三级目录/a.txt"),*/
		FTP_TRANSFER_TYPE_ASCII, 0);
	BOOL_VERIFY(pRes,4);
}
//断开连接
bool FtpClass::createClose()
{	
	pRes = false;
	if (InternetCloseHandle(hConnect))
		pRes = InternetCloseHandle(hInternet);
	BOOL_VERIFY(pRes,5);
}

```
