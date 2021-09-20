# VisualStudio使用笔记


## 1 停靠窗口布局修改后闪退 （2017） 

&emsp;&emsp;换工作了，最近使用vs开发。调式功能真的爽，不愧是宇宙第一。不过遇到个问题，不管是代码还是各种悬浮窗口，只要不是默认布局拖动就闪退，有点小郁闷。看了下大概原因是vs版本或者系统版本比较老。

> 我这里通过更新最新版本的**VS**可以解决问题

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/20210921/xxx.1akgpm0mpeg0.png)

## 2 cmake工程  missing and no known rule to make it


&emsp;&emsp;最近研究 Visual Studio 直接使用cmake工程，总是遇到 missing and no known rule to make it 这个错误。报这个错误一般是指cmake路径错误，无法找到对应的规则。可是我确认自己这块没有问题。本来当随时vs默认安装的cmake版本有问题，也各种改和替换vs的默认调用工具。最后发现了问题：

Visual Studio使用cmake会生成一个给vs自己解析的配置json文件。类似于Qt的.user，cmake-gui的tmpsetting。叫做 CMakeSettings.json，自动生成路径跟最顶层的CMakeLists.txt在一起。

```json
{
  "configurations": [
    {
      "name": "x64-Release",
      "generator": "Ninja",
      "configurationType": "RelWithDebInfo",
      "inheritEnvironments": [
        "msvc_x64_x64"
      ],
      "buildRoot": "${env.USERPROFILE}\\CMakeBuilds\\${workspaceHash}\\build\\${name}",
      "installRoot": "${env.USERPROFILE}\\CMakeBuilds\\${workspaceHash}\\install\\${name}",
      "cmakeCommandArgs": "",
      "buildCommandArgs": "-v",
      "ctestCommandArgs": ""
    }
  ]
}
```

* name ： 这个配置文件的名称
* generator：构建工具，vs默认使用Ninja（可以替代make构建编译过程）
* configurationType：配置类型，默认是RelWithDebInfo，可我是要用Release呀。
* inheritEnvironments：编译环境
* buildRoot：编译文件目录
* installRoot：编译结果目录
* Args：cmake bulid ctest 参数

这里要改两个地方

1. configurationType改成 Release 或者 Debug
2. cmakeCommandArgs -j12

&emsp;&emsp;改好了重新生成就可以了，还报错应该还是路径有问题，比如你的工程用了其他的第三方库，可是其他库没有编译成功。








