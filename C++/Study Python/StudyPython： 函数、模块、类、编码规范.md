
@[TOC](StudyPython 函数、模块、类、编码规范)

# StudyPython ：函数、模块、类

&emsp;&emsp;很少用到python。偶尔使用也是那种面向过程的一个劲乱堆让后c++调一下脚本。突然需要实现一段功能然后给别人看，趁着给之前还是赶紧了解下python的函数、模块、类以及命名规则规范下吧，以后如果用到务必让自己写的东西有一定规范且别人一看就明白。




## 1. 1 函数
&emsp;&emsp;函数使代码快与主程序分离

### 1.1. 1.1 定义函数

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
### 1.2. 1.2 函数调用
```python
FunTest()
FunTest(1)
tmp=FunTest(1)
tmp=FunTest(arg1=1,arg2=1)
```
### 1.3. 1.3 禁止函数修改参数
&emsp;&emsp;传副本进去
```python
FunTest(arg1[:])
```
### 1.4. 1.4 任意数量的参数
```python
def FunTest(*arg):
	print(arg1)
```


## 2. 2 模块
&emsp;&emsp;把函数单独存在模块中，可以与主程序文件分离。

```python
#Test.py
def FunTest(arg1):
	print(arg1)
```

### 2.1. 2.1 导入整个模块
```python
import Test
Test.FunTest(1)
```

### 2.2. 2.2 导入特定函数
```python
from Test import FunTest
FunTest(1) #无需使用Test.
```
### 2.3. 2.3 as给函数别名
```python
from Test import FunTest as F
F(1) #无需使用FunTest
```
### 2.4. 2.4 as给模块起别名
```python
import Test as T
T.FunTest(1)#无需使用FunTest
```
### 2.5. 2.5 导入所有函数
```python
from Test import *
FunTest(1) #无需使用Test.
```

## 3. 3 类
&emsp;&emsp;类可以定义在方法, 函数或者类中. 函数可以定义在方法或函数中. 封闭区间中定义的变量对嵌套函数是只读的。
### 3.1. 3.1 创建类
&emsp;&emsp;类包含属性和方法
- 公有属性：何地调用都可以。无任何修饰。
- 私有属性：只能在类内部调用。使用双下划线__对类方法进行修饰
- 公有方法：何地调用都可以。无任何修饰。
- 私有方法：只能在类内部调用。使用双下划线__对类方法进行修饰。
- 魔法方法：在类名的前面和后面都使用双下划线进行修饰。

### 3.2. 3.2 导入类
&emsp;&emsp;导入类和导入模块完全一样
### 3.3. 3.3 使用类
&emsp;&emsp;实例化之后用.来实现调用

## 4. 4 编码规范

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

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201122133238321.png#pic_center)

