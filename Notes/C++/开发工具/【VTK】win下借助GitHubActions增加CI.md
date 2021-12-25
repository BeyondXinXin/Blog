# 【VTK】win下借助GitHubActions增加CI

待过的团队规模都不大，没用过CI。但是总感觉自己有必要了解CI/CD，周末研究了下持续集成。知识是永远学不完的，要清楚自己要什么：

> 我想搭建一套自己用的c++(cmake、qt、vtk等第三方库)的持续集成环境（ubuntu+windos）。

* 自己用就够了
* ubuntu、windos（msvc）
* c++（cmake工程）
* 比较大的第三方库（qt、vtk等）
* 多个仓库共用编译后文件

ubuntu：服务器上加一些脚本。就自己用，需要的开发环境是固定的。

win：实在没有win的服务器，准备借助 GitHub Actions

## 1 GitHub Actions 学习

1. 阮一峰的网络日志，了解是什么

[getting-started-with-github-actions.html](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

2. B站视频，了解下语法

[https://www.bilibili.com/video/BV1RE411R7Uy](https://www.bilibili.com/video/BV1RE411R7Uy)

3. 文档，需要大概看一遍

[https://docs.github.com/cn/actions](https://docs.github.com/cn/actions)

## 2 遇到的困难

### 2.1 安装Qt

参考仓库：[武威的涛哥](https://github.com/jaredtao/HelloActions-Qt)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/143074115221931.png =400x)

### 2.2 安装第三方库

windows下如何对集成vtk做CI找到一些办法

1. 使用vcpkg管理

参考仓库 [vcpkg](https://github.com/microsoft/vcpkg)

vcpkg是个很好的项目，团队也很活跃。但我实际使用它来管理包（交叉编译）还有些问题，期待它越来越好，像Cargo那样便捷。


2. 下载源码直接编译，利用缓存加快速度

参考仓库 [f3d](https://github.com/f3d-app/f3d/tree/master/.github/workflows)

测试：win服务器qt+vtk第一次编译大概70分钟左右。编译完成后用缓存恢复30s就够了。缓存7天不适用会自动删除。

但是我没法采用，缓存没办法跨仓库使用。

> 有办法，但是我不会搞。actions/cache是开源的，没用过js，我简单改了下缓存的源码。有保护机制，下载链接直接输出显示为：**，获取不到。不想去学习js了，遂放弃。相关源码：[restore/index.js](https://github.com/actions/cache/blob/main/dist/restore/index.js) 。

虽然第三方库不能用cache，但是qt可以用cache。第一次安装3min，以后10s左右。

3. 用其他仓库代替缓存

给很少改动的第三方库专门搞个仓库，用actions编译后挂到Release里，需要做CI的仓库每次去这里下载。

参考仓库 [ttk](https://github.com/topology-tool-kit/ttk) + [ttk-paraview](https://github.com/topology-tool-kit/ttk-paraview)

试了下，效果不错。针对我的使用场景完全满足。


4. 用其他仓库代替缓存（自己编译）

第三个办法改成本地编译上传。




## 3 Demo测试

我最后选择第四种。本地编译更快、修改更方便。就自己用，第三方代码、开发环境、版本可以任意修改。

搞两个public仓库，完整的做一次测试。没问题就慢慢拓展到自己其他代码中。


测试准备用：vs2019-qt5.15.2-vtk9.1，对[vtkExamples](https://gitlab.kitware.com/vtk/vtk-examples/-/tree/master/src/Cxx/Qt)下所以qt例子做一次自动集成。

1. 上传本地编译文件

建立仓库、本地编译 vs2019-qt5.15.2-vtk9.1 并上传。


2. 拉取官网测试代码，并把Qt的例子拿出来

[vtkExamples/src/Cxx/Qt](https://gitlab.kitware.com/vtk/vtk-examples/-/tree/master/src/Cxx/Qt)，这几个例子的代码基于很早的版本，简单改成vtk9.1可以编译通过的

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/16631717213819.png =1000x)

> 就是加一个cmake文件管理、qvtkwidget改成QVTKOpenGLNativeWidget、RenderWindowUIMultipleInheritance的UI改下名称。

警告是写法太老了，就是拉过来测试下CI，不改源码了。


3. 创建测试仓库，上传 workflows

VTK只要6s就可以拷贝完成、第一次缓存Qt（Install Qt 3分钟）、测试下次push代码是否自动执行。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/589824317238088.png =800x)


4. 上传代码、自动编译、打包、上传Release


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/354645317229080.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/499215317225907.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/444771118238307.png =800x)

5. 换其他电脑去仓库下载测试

可以看到Qt和vtk的dll、可执行程序都压缩好了

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/152870218221804.png =1000x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/577335917227642.png =1000x)



## 4 测试仓库



编译结果：[BeyondXinXin/GitHubActionsCache](https://github.com/BeyondXinXin/GitHubActionsCache)

CI测试仓库：[BeyondXinXin/GitHubActionsCacheTest](https://github.com/BeyondXinXin/GitHubActionsCacheTest)


测试workflow的yml文件可以直接在[仓库](https://github.com/BeyondXinXin/GitHubActionsCacheTest/blob/main/.github/workflows/CI-Windows.yml)看，说明：

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/292690818235401.png =1000x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7/%E3%80%90vtk%E3%80%91win%E4%B8%8B%E5%80%9F%E5%8A%A9githubactions%E5%A2%9E%E5%8A%A0ci.md/563580918221504.png =1000x)


