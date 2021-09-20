# Python学习笔记


## 1 IDE
工作的话用Qt creator 搭建一个python 的文本编辑器设置好代码规范和执行快捷键。
空余时间自己学习为了方便养成习惯就用vim。
跑别人代码的话就是vscode。

## 2 利用python输出信息
**print()**:括号里放需要显示的变量
**str()**:把变量变为比较方便阅读的信息
```python
print("study python")
message="study python"
print(message)
day=1
message="study python 第"
print(message+str(day)+"天")
```

## 3 变量 字符串
python使用=可以直接赋值，他会默认判断右侧类型。在&ensp; "" &ensp;'' &ensp;双引号和单引号内的都是字符串。这样可以把引号也声明为字符串。
```python
str1="a b c ' e"
str2='a b c "d" e'
print(str1)
print(str2)
```
字符串拼接&ensp;+&ensp;
```python
message = "hello world!"
print(message)
message = message + "  " + message
print(message)
```
字符串大小写
- upper 全部大写
- lower 全部小写
- title 首字母大写
```python
name = "yao xin Yao xin"
print(name)
print(name.title())
print(name.upper())
print(name.lower())
```

字符串删除空白
- rstrip 删除尾部空格
- lstrip 删除首部空格
- strip  删除首尾空格
```python
message = ' message '
message.rstrip()
message.lstrip()
message.strip()
```

## 4 变量 数字
python 分整数和浮点数，带.的就是浮点数。
&ensp;+&ensp;-&ensp;\*&ensp;/&ensp;\*\*&ensp;()&ensp;[]&ensp;{}&ensp;
使用方法就是正常运算符，其中\*\*代表乘方运算
```pyhton
3+2
3/1.5
3**2
3*2
3*2.1
```

## 5 注释
### 表示本行是注释
快捷键:
- qt creator : ctrl+/ 注释/取消注释
- vscode : ctrl+k+c ctrl+k+u 注释/取消注释
- vim ：“:74,79 s/^/#/g” ":74,79 s/^#//g" 注释/取消注释

### 1.1.6. 06 列表
1*n的数组，里边可以存任意类型。**"[]"** 用来表示列表，**","** 分隔列表。
```pyhton
list = ["a", "b", "c"]
print(list)
```
**[ ]** 访问列表元素"[n]"0是第一个，可以使用负数，表示反向取值
```pyhton
list = ["a", "b", "c"]
print(list[0])
print(list[1])
print(list[2])
print(list[-1])
print(list[-2])
print(list[0]+list[1]+list[2])
```
 **[ ]=** 修改
```pyhton
list = ["a", "b", "c"]
print(list)
list[0] = "d"
print(list)
```
**append** 尾部添加新元素 
```pyhton
list = ["a", "b", "c"]
print(list)
list.append("d")
print(list)
```

**insert** 任意位置添加新元素 
```pyhton
list = ["a", "b", "c"]
print(list)
list.insert(0, "d")
print(list)
list.insert(2, "d")
print(list)
```

**del** 删除元素 
```pyhton
list = ["a", "b", "c"]
print(list)
del list[1]
print(list)
```

**pop** 删除元素,且得到删除的元素 
```pyhton
list = ["a", "b", "c"]
print(list)
tmp = list.pop(0)
print(list)
print(tmp)
```

**remove** 根据值删除元素（只删除第一个） 
```pyhton
list = ["a", "a", "a"]
print(list)
list.remove('a')
print(list)
list.remove('a')
print(list)
list.remove('a')
print(list)
```

**sort** 队列表排序，不可退回
```pyhton
list = ["a", "b", "aa", "ab", "ba", "bb"]
print(list)
list.sort()
print(list)
```
**sorted** 队列表临时排序
```pyhton
list = ["a", "b", "aa", "ab", "ba", "bb"]
print(list)
print(sorted(list))
print(list)
```

**reverse** 反向排序
```pyhton
list = ["a", "b", "c"]
print(list)
list.reverse()
print(list)
list.reverse()
print(list)
```

**len** 统计数量
```pyhton
list = []
print(len(list))
list.append("d")
print(len(list))
list.append("d")
print(len(list))
list.append("d")
print(len(list))
```




## 6 函数
&emsp;&emsp;函数使代码快与主程序分离

### 6.1 定义函数

```python
def FunTest():
	print("FunTest")

def FunTest(arg1):
	print(arg1)

def FunTest(arg1="FunTest"):
	print(arg1)

def FunTest(arg1,arg2):
	return arg1

def FunTest(arg1,arg2):
	return arg1,arg2
```
### 6.2 函数调用
```python
FunTest()
FunTest(1)
tmp=FunTest(1)
tmp=FunTest(arg1=1,arg2=1)
```
### 6.3 禁止函数修改参数
&emsp;&emsp;传副本进去
```python
FunTest(arg1[:])
```
### 6.4 任意数量的参数
```python
def FunTest(*arg):
	print(arg1)
```


## 7 模块
&emsp;&emsp;把函数单独存在模块中，可以与主程序文件分离。

```python
#Test.py
def FunTest(arg1):
	print(arg1)
```

### 7.1 导入整个模块
```python
import Test
Test.FunTest(1)
```

### 7.2 导入特定函数
```python
from Test import FunTest
FunTest(1) #无需使用Test.
```
### 7.3 as给函数别名
```python
from Test import FunTest as F
F(1) #无需使用FunTest
```
### 7.4 as给模块起别名
```python
import Test as T
T.FunTest(1)#无需使用FunTest
```
### 7.5 导入所有函数
```python
from Test import *
FunTest(1) #无需使用Test.
```

## 8 类
&emsp;&emsp;类可以定义在方法, 函数或者类中. 函数可以定义在方法或函数中. 封闭区间中定义的变量对嵌套函数是只读的。
### 8.1 创建类
&emsp;&emsp;类包含属性和方法
- 公有属性：何地调用都可以。无任何修饰。
- 私有属性：只能在类内部调用。使用双下划线__对类方法进行修饰
- 公有方法：何地调用都可以。无任何修饰。
- 私有方法：只能在类内部调用。使用双下划线__对类方法进行修饰。
- 魔法方法：在类名的前面和后面都使用双下划线进行修饰。

### 8.2 导入类
&emsp;&emsp;导入类和导入模块完全一样
### 8.3 使用类
&emsp;&emsp;实例化之后用.来实现调用

## 9 编码规范

google python 编码规范
[https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/contents/](https://zh-google-styleguide.readthedocs.io/en/latest/google-python-styleguide/contents/)

&emsp;&emsp;把google python 编码规范简单翻了一遍，毕竟自己也不是专门的ai开发，只记录下自己感觉以后需要注意的地方。

1. 少用括号，除非是用于实现行连接, 否则不要在返回语句或条件语句中使用括号. 
2. 用4个空格来缩进代码
3. 顶级定义之间空两行, 方法定义之间空一行
4. 空格 
&emsp;&emsp;括号内不要有空格
&emsp;&emsp;不要在逗号, 分号, 冒号前面加空格, 但应该在它们后面加(除了在行尾).
5. Main

```python
def main():
      ...

if __name__ == '__main__':
    main()
```
6. 命名
&emsp;&emsp;所有类一律用大写开头
&emsp;&emsp;类中变量全部小写且_结束
&emsp;&emsp;类中所有函数名称大写开头
&emsp;&emsp;除了计数器和迭代器不用用 i,x,y这种单字节  

![image](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/image.120u1bt40xa.png)  






## 10 python体验-图片保存json

自己属于客户端程序开发（Qt/c++），本来觉得自己永远用不到python的，有计算，解方程也是也是直接matlab算一下就可以。怎奈由于种种原因必须用python搞个东西（其使用qt也可以，明天写一个qt版本，图片信息可以直接保存进数据库）；这里记录下程序。

大概内容就是  
遍历删除文件
新建文件夹
读取图片，数据用二进制保存
把原始字节码编码成 base64 字节码 
将 base64 字节码解码成 utf-8 格式的字符串
用字典的形式保存数据
保存json文件

```python
# 初始化
from sys import argv
from base64 import b64encode
from json import dumps
ENCODING = 'utf-8'    # 指定编码形式

# 输入参数
SCRIPT_NAME,IMAGE_NAME = argv
print("\n\n"+SCRIPT_NAME+"\n\n")  

# 设置路径
import glob
import os
IMAGE_NAME_load=IMAGE_NAME+"/*.jpg"
IMAGE_NAME_save=IMAGE_NAME+"/"
JSON_NAME_save=IMAGE_NAME+"/json/"
#print(glob.glob(IMAGE_NAME_load))  
if os.path.exists(IMAGE_NAME_save):   
  paths = glob.glob(os.path.join(IMAGE_NAME_save, '*.jpg'))
  paths.sort()
else:
  print("Fail")  
  exit()

# 设置生成文件夹
if os.path.exists(JSON_NAME_save): 
  json_paths = glob.glob(os.path.join(JSON_NAME_save, '*.json'))
  for path in json_paths : 
    print("删除文件：  "+path)  
    os.remove(path)
  os.removedirs(JSON_NAME_save)
os.makedirs(JSON_NAME_save) 

# 迭代写入  
for path in paths : 
  print("------------------------------")  
  path_tmp,name_tmp = os.path.split(path); 
  print("输入文件：  "+path)  
  path_save=JSON_NAME_save+name_tmp[:-4]+".json"
  print("输出文件：  "+path_save)  
  
  with open(path, 'rb') as jpg_file:# 读取二进制图片，获得原始字节码，注意 'rb'
      byte_content = jpg_file.read() 
  base64_bytes = b64encode(byte_content) # 把原始字节码编码成 base64 字节码 
  base64_string = base64_bytes.decode(ENCODING) # 将 base64 字节码解码成 utf-8 格式的字符串

# 用字典的形式保存数据
  raw_data = {}
  shapes= {}
  points= {}
  raw_data["version"] = "3.16.7"
  raw_data["flags"] = {}
  raw_data["shapes"] = [shapes]
  shapes["label"]= "deom"
  shapes["line_color"]=[] 
  shapes["fill_color"]=[] 
  shapes["points"]=[
          [243.0,203.0],
          [253.0,198.0],
          [275.0,192.0],
          [304.0,201.0],
          [320.0,213.0],
          [325.0,221.0],
          [329.0,238.0],
          [327.0,259.0],
          [322.0,273.0],
          [311.0,286.0],
          [300.0,298.0],
          [283.0,313.0],
          [269.0,308.0],
          [251.0,308.0],
          [243.0,299.0],
          [234.0,302.0],
          [219.0,280.0],
          [213.0,275.0],
          [210.0,256.0],
          [210.0,237.0],
          [219.0,222.0]]
  shapes["shape_type"]= "polygon"
  shapes["flags"]= {}
  raw_data["lineColor"] = [0,255,0,12]
  raw_data["fillColor"] = [255,0,0,128]
  raw_data["imagePath"] = ""
  raw_data["imageData"] = base64_string
  raw_data["imageHeight"] = ""
  raw_data["imageWidth"] = ""
  json_data = dumps(raw_data, indent=2)
  with open(path_save, 'w') as json_file:
      json_file.write(json_data)
print("\n\n\n Success")  

```









