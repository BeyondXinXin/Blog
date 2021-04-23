# StudyPython  1
&emsp;&emsp;很多时候想表达的东西用c++写出来很难看，而且不想写那么多代码。每次都是不得不用python的时候临时百度下，今年接下来几个项目都是研发的同事写好python或者shell脚本我去调用，感觉还是大致了解下python的基本规则吧。计划是花一个月时间，每天了解一点点。能做到不用百度可以直接看得懂别人的代码就可以。

> 测试代码  [https://gitee.com/yaoxin001/StudyPython](https://gitee.com/yaoxin001/StudyPython)
> StudyPython_01-06.py


@[TOC]( )

&emsp;&emsp;这个比较简单，deepin默认就带python2.7和3.5不要去动，安装Anaconda用户目录下下会有3.7，并设置为默认。

#### 1.1.1. 01 IDE
&emsp;&emsp;工作的话用Qt creator 搭建一个python 的文本编辑器设置好代码规范和执行快捷键。
&emsp;&emsp;空余时间自己学习为了方便养成习惯就用vim。
&emsp;&emsp;跑别人代码的话就是vscode。

#### 1.1.2. 02 利用python输出信息
&emsp;&emsp;**print()**:括号里放需要显示的变量
&emsp;&emsp;**str()**:把变量变为比较方便阅读的信息
```python
print("study python")
message="study python"
print(message)
day=1
message="study python 第"
print(message+str(day)+"天")
```

#### 1.1.3. 03 变量 字符串
&emsp;&emsp;python使用=可以直接赋值，他会默认判断右侧类型。在&ensp; "" &ensp;'' &ensp;双引号和单引号内的都是字符串。这样可以把引号也声明为字符串。
```python
str1="a b c ' e"
str2='a b c "d" e'
print(str1)
print(str2)
```
&emsp;&emsp;字符串拼接&ensp;+&ensp;
```python
message = "hello world!"
print(message)
message = message + "  " + message
print(message)
```
&emsp;&emsp;字符串大小写
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

&emsp;&emsp;字符串删除空白
- rstrip 删除尾部空格
- lstrip 删除首部空格
- strip  删除首尾空格
```python
message = ' message '
message.rstrip()
message.lstrip()
message.strip()
```

#### 1.1.4. 04 变量 数字
&emsp;&emsp;python 分整数和浮点数，带.的就是浮点数。
&emsp;&emsp;&ensp;+&ensp;-&ensp;\*&ensp;/&ensp;\*\*&ensp;()&ensp;[]&ensp;{}&ensp;
&emsp;&emsp;使用方法就是正常运算符，其中\*\*代表乘方运算
```pyhton
3+2
3/1.5
3**2
3*2
3*2.1
```

#### 1.1.5. 05 注释
&emsp;&emsp;# 表示本行是注释
&emsp;&emsp;快捷键:
- qt creator : ctrl+/ 注释/取消注释
- vscode : ctrl+k+c ctrl+k+u 注释/取消注释
- vim ：“:74,79 s/^/#/g” ":74,79 s/^#//g" 注释/取消注释

#### 1.1.6. 06 列表
&emsp;&emsp;1*n的数组，里边可以存任意类型。**"[]"** 用来表示列表，**","** 分隔列表。
```pyhton
list = ["a", "b", "c"]
print(list)
```
&emsp;&emsp;**[ ]** 访问列表元素"[n]"0是第一个，可以使用负数，表示反向取值
```pyhton
list = ["a", "b", "c"]
print(list[0])
print(list[1])
print(list[2])
print(list[-1])
print(list[-2])
print(list[0]+list[1]+list[2])
```
&emsp;&emsp; **[ ]=** 修改
```pyhton
list = ["a", "b", "c"]
print(list)
list[0] = "d"
print(list)
```
&emsp;&emsp;**append** 尾部添加新元素 
```pyhton
list = ["a", "b", "c"]
print(list)
list.append("d")
print(list)
```

&emsp;&emsp;**insert** 任意位置添加新元素 
```pyhton
list = ["a", "b", "c"]
print(list)
list.insert(0, "d")
print(list)
list.insert(2, "d")
print(list)
```

&emsp;&emsp;**del** 删除元素 
```pyhton
list = ["a", "b", "c"]
print(list)
del list[1]
print(list)
```

&emsp;&emsp;**pop** 删除元素,且得到删除的元素 
```pyhton
list = ["a", "b", "c"]
print(list)
tmp = list.pop(0)
print(list)
print(tmp)
```

&emsp;&emsp;**remove** 根据值删除元素（只删除第一个） 
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

&emsp;&emsp;**sort** 队列表排序，不可退回
```pyhton
list = ["a", "b", "aa", "ab", "ba", "bb"]
print(list)
list.sort()
print(list)
```
&emsp;&emsp;**sorted** 队列表临时排序
```pyhton
list = ["a", "b", "aa", "ab", "ba", "bb"]
print(list)
print(sorted(list))
print(list)
```

&emsp;&emsp;**reverse** 反向排序
```pyhton
list = ["a", "b", "c"]
print(list)
list.reverse()
print(list)
list.reverse()
print(list)
```

&emsp;&emsp;**len** 统计数量
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