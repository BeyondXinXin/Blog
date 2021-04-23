# Qt Designer 样式表  类型择器无效

&emsp;&emsp; **Qt** 样式表使用基本上就是：

```cpp
选择器 {
    属性 ： 值
}
选择器 ： 状态 {
    属性 ： 值
}
选择器 ： 辅助控制器 {
    属性 ： 值
}
```

&emsp;&emsp;一般大一点正规点的程序都是把所有样式表放在一个.qss文件里统一加载。省事的话每个控件在**Qt Designer**里也可以直接添加样式表。至于使用那个要看继承设置，默认是最后一次**setStyleSheet**。

&emsp;&emsp;**Qt Designer**里添加的一方面好处就是所见即所得，但是有些情况下**Qt Designer**和最后显示的样式不一样。


&emsp;&emsp;1. **setupUi**之后如果**setStyleSheet**，不设置**UseStyleSheetPropagationInWidgetStyles** 属性时样式肯定会变。

&emsp;&emsp;2. **Qt Designer**的所见即所得仅仅针对选择器里的类选择器有效。

&emsp;&emsp;如果在**Qt Designer**添加类型选择器（.）、标识选择器（#）、属性选择器（[]）、子对象选择器（>）。仅仅对程序运行后有效，在**Qt Designer**里看不到效果。



