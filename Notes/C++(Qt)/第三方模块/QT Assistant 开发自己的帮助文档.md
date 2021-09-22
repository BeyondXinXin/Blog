# QT Assistant 开发自己的帮助文档

@[TOC](QT Assistant 开发自己的帮助文档)
## QT Assistant使用
qt自带Qt Assistant，大家叫 qt助手，写的很全面，很实用，当你需要什么功能时候按下F1，打开看看你会发现qt官方基本上把你的需求都封装好了。这里贴一个使用方法https://www.cnblogs.com/mzy-google/p/5162119.html

## QT Assistant开发自己软件帮助文档
很多时候我们也需要给自己的软件写帮助文档。用的比较多的就是chm，下一个chm编辑器就可以。其实qt也自带了一个帮助文档编辑器，类似于chm支持html和css。接下来教大家如何利用qt Assistant制作帮助文档。
qt官方有一个例子  **Simple Text Viewer Example** ，我们用这个作为案例来解释。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190808084913451.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
此示例演示如何在自定义应用程序中使用Qt助手作为自定义帮助查看器。这分两个阶段完成。
首先，创建文档并自定义Qt助手；其次，将启动和控制Qt助手的功能添加到应用程序中。
简单文本查看器应用程序允许用户选择和查看现有文件。应用程序提供自己的自定义文档，可从主窗口菜单栏的“帮助”菜单或单击应用程序的“查找文件”对话框中的“帮助”按钮获得这些文档。
示例由四个类组成：
助手提供启动qt助手的功能。
主窗口是主应用程序窗口。
findFileDialog允许用户使用通配符匹配搜索文件。
textedit提供了一个富文本浏览器，确保HTML文档中引用的图像显示正确。
注意：我们只对与主要问题相关的实现部分进行评论，即让qt助手充当简单文本查看器应用程序的自定义帮助查看器。

## 创建文档并自定义Qt助手
如何以HTML页面的形式创建实际文档不在本例的范围内。通常，HTML页面可以手工编写，也可以在文档工具（如QDoc或Doxygen）的帮助下生成。在本例中，我们假设已经创建了HTML文件。所以，唯一需要做的就是告诉Qt助手如何构造和显示帮助信息。
## 为Qt助手组织文档
纯HTML文件只包含有关特定主题的文本或文档，但通常不包含有关几个HTML文档如何相互关联或应该按何种顺序读取的信息。缺少的是一个目录以及一个快速访问某些帮助内容的索引，而不需要浏览大量文档来查找信息。

为了组织文档并使其可用于Qt助手，我们必须创建一个Qt帮助项目（.qhp）文件。项目文件的第一个也是最重要的部分是名称空间的定义。命名空间必须是唯一的，并且将是qt助手中页面URL的第一部分。此外，我们还必须设置一个虚拟文件夹，作为文档集的公用文件夹。这意味着，由两个不同名称空间标识的两个文档集可以交叉引用HTML文件，因为这些文件位于一个大虚拟文件夹中。但是，对于这个示例，我们只有一个文档集可用，因此虚拟文件夹名称和功能并不重要。

```javascript
	<?xml version="1.0" encoding="UTF-8"?>
	<QtHelpProject version="1.0">
	<namespace>org.qt-project.examples.simpletextviewer</namespace>
	<virtualFolder>doc</virtualFolder>
```
下一步是定义过滤器部分。筛选器部分包含目录、索引和所有文档文件的完整列表，可以为其分配任意数量的筛选器属性。过滤器属性是可以自由选择的普通字符串。稍后在qt助手中，用户可以定义引用这些属性的自定义过滤器。如果筛选部分的属性与自定义筛选的属性匹配，则将显示文档，否则qt助手将隐藏文档。

同样，由于我们只有一个文档集，所以我们不需要qt助手的过滤功能，因此可以跳过过滤属性。

现在，我们建立目录。表中的项目由节标记定义，该节标记包含项目标题的属性以及到实际页面的链接。节标记可以无限嵌套，但出于实际原因，建议不要将它们嵌套在三层或四层以上。对于我们的示例，我们希望对目录使用以下大纲：
简单文本查看器

 - 查找文件
 - 文件对话框
 - 通配符匹配
 - 浏览
 - 打开文件
在帮助项目文件中，大纲由以下内容表示：

```javascript
<filterSection>
    <toc>
      <section title="Simple Text Viewer" ref="index.html">
        <section title="Find File" ref="./findfile.html">
          <section title="File Dialog" ref="./filedialog.html"></section>
          <section title="Wildcard Matching" ref="./wildcardmatching.html"></section>
          <section title="Browse" ref="./browse.html"></section>
        </section>
        <section title="Open File" ref="./openfile.html"></section>
      </section>
    </toc>
```
目录定义后，我们将列出所有索引关键字：

```javascript
 <keywords>
    <keyword name="Display" ref="./index.html"/>
    <keyword name="Rich text" ref="./index.html"/>
    <keyword name="Plain text" ref="./index.html"/>
    <keyword name="Find" ref="./findfile.html"/>
    <keyword name="File menu" ref="./findfile.html"/>
    <keyword name="File name" ref="./filedialog.html"/>
    <keyword name="File dialog" ref="./filedialog.html"/>
    <keyword name="File globbing" ref="./wildcardmatching.html"/>
    <keyword name="Wildcard matching" ref="./wildcardmatching.html"/>
    <keyword name="Wildcard syntax" ref="./wildcardmatching.html"/>
    <keyword name="Browse" ref="./browse.html"/>
    <keyword name="Directory" ref="./browse.html"/>
    <keyword name="Open" ref="./openfile.html"/>
    <keyword name="Select" ref="./openfile.html"/>
  </keywords>
```
最后一步，我们必须列出组成文档的所有文件。这里要注意的一个重要点是，所有文件都必须列出，包括图像文件，甚至样式表（如果使用）。

```
      <files>
        <file>browse.html</file>
        <file>filedialog.html</file>
        <file>findfile.html</file>
        <file>index.html</file>
        <file>intro.html</file>
        <file>openfile.html</file>
        <file>wildcardmatching.html</file>
        <file>images/browse.png</file>
        <file>images/*.png</file>
      </files>
    </filterSection>
  </QtHelpProject>
```
帮助项目文件现在已完成。如果希望在qt助手中看到结果文档，则必须从中生成一个qt压缩帮助文件，并将其注册到qt助手的默认帮助集合中。

```javascript
	qhelpgenerator simpletextviewer.qhp -o simpletextviewer.qch
	assistant -register simpletextviewer.qch
```
如果现在启动qt助手，您将看到qt文档旁边的简单文本查看器文档。出于测试目的，这是可以的，但对于最终版本，我们只希望在qt助手中有简单的文本查看器文档。

## 自定义qt助手
让qt助手只显示简单文本查看器文档的最简单方法是创建自己的帮助集合文件。收集文件以二进制格式存储，类似于压缩的帮助文件，由帮助收集项目文件（*.qhcp）生成。在收集文件的帮助下，我们可以自定义Qt助手提供的外观甚至一些功能。

首先，我们更改窗口标题和图标。它不会显示“qt助手”，而是显示“简单文本查看器”，因此用户更清楚地知道帮助查看器实际上属于我们的应用程序。

```javascript
 <?xml version="1.0" encoding="UTF-8"?>
  <QHelpCollectionProject version="1.0">
  <assistant>
      <title>Simple Text Viewer</title>
      <applicationIcon>images/handbook.png</applicationIcon>
      <cacheDirectory>QtProject/SimpleTextViewer</cacheDirectory>
```
cache directory标记指定用户数据目录（请参见qt帮助收集文件）的子目录，其中存储用于全文搜索的缓存文件或设置文件。

之后，我们在新配置中首次启动时设置qt助手显示的页面。URL由qt帮助项目文件中定义的命名空间和虚拟文件夹组成，后跟实际的页面文件名。

```javascript
 <startPage>qthelp://org.qt-project.examples.simpletextviewer/doc/index.html</startPage>
```
接下来，我们将“关于”菜单项的名称更改为“关于简单文本查看器”。“关于”对话框的内容也会通过指定从中获取“关于”文本或图标的文件进行更改。

```javascript
 <aboutMenuText>
      <text>About Simple Text Viewer</text>
  </aboutMenuText>
  <aboutDialog>
      <file>about.txt</file>
      <icon>images/icon.png</icon>
  </aboutDialog>
```
Qt助手提供了通过首选项对话框添加或删除文档的可能性。当使用qt助手作为更多应用程序的中心帮助查看器时，此功能非常有用，但在我们的示例中，我们希望实际阻止用户删除文档。因此，我们在“首选项”对话框中隐藏“文档”选项卡。

由于地址栏在这么小的文档集中并不真正相关，因此我们也将其关闭。通过只有一个过滤器部分，没有任何过滤器属性，我们还可以禁用qt助手的过滤器功能，这意味着过滤器页面和过滤器工具栏将不可用。

```javascript
      <enableDocumentationManager>false</enableDocumentationManager>
      <enableAddressBar>false</enableAddressBar>
      <enableFilterFunctionality>false</enableFilterFunctionality>
  </assistant>
```
出于测试目的，我们已经生成了压缩的帮助文件，并将其注册到Qt助手的默认帮助集合中。通过以下几行，我们获得了相同的结果。唯一重要的区别是，我们注册压缩的帮助文件，而不是在默认集合中，而是在我们自己的集合文件中。

```javascript
<docFiles>
      <generate>
          <file>
              <input>simpletextviewer.qhp</input>
              <output>simpletextviewer.qch</output>
              </file>
          </generate>
      <register>
          <file>simpletextviewer.qch</file>
          </register>
      </docFiles>
  </QHelpCollectionProject>
```
作为最后一步，我们必须从帮助集合项目文件中生成二进制集合文件。这可以通过运行QcollectionGenerator工具来完成。

```javascript
qcollectiongenerator simpletextviewer.qhcp -o simpletextviewer.qhc
```
为了测试对qt助手所做的所有自定义，我们将集合文件名添加到命令行：

```javascript
assistant -collectionFile simpletextviewer.qhc
```

## 通过助手类控制qt助手
我们首先将了解如何从远程应用程序启动和操作Qt助手。为此，我们创建了一个名为助手的类。

这个类提供了一个用于显示文档页面的公共函数和一个私有助手函数，以确保qt助手已启动并正在运行。

在函数startAssistant（）中，只需创建和启动一个qprocess就可以启动qt助手。如果进程已在运行，则函数将立即返回。否则，必须设置并启动流程。

```javascript
bool Assistant::startAssistant()
  {
      if (!proc)
          proc = new QProcess();

      if (proc->state() != QProcess::Running) {
          QString app = QLibraryInfo::location(QLibraryInfo::BinariesPath) + QDir::separator();
  #if !defined(Q_OS_MAC)
          app += QLatin1String("assistant");
  #else
          app += QLatin1String("Assistant.app/Contents/MacOS/Assistant");
  #endif

          QStringList args;
          args << QLatin1String("-collectionFile")
              << QLibraryInfo::location(QLibraryInfo::ExamplesPath)
              + QLatin1String("/assistant/simpletextviewer/documentation/simpletextviewer.qhc")
              << QLatin1String("-enableRemoteControl");

          proc->start(app, args);

          if (!proc->waitForStarted()) {
              QMessageBox::critical(nullptr, QObject::tr("Simple Text Viewer"),
                  QObject::tr("Unable to launch Qt Assistant (%1)").arg(app));
              return false;
          }
      }
      return true;
  }
```
为了启动这个过程，我们需要qt助手的可执行文件名以及在定制模式下运行qt助手的命令行参数。可执行文件的名称有点复杂，因为它依赖于平台，但幸运的是它在MacOS上只是不同的。

启动qt助手时，可以使用-collectionfile命令行参数更改显示的文档。在没有任何选项的情况下启动时，qt助手将显示一组默认文档。安装qt后，qt助手中设置的默认文档包含qt参考文档以及qt附带的工具，如qt designer和qmake。

在我们的示例中，通过将特定于应用程序的收集文件传递给进程的命令行选项，我们将用自定义文档替换默认文档集。

作为最后一个参数，我们添加了-enableRemoteControl，它使qt助手监听其stdin通道中的命令，例如在文档中显示某个页面的命令。然后我们开始这个过程，等待它真正运行。如果由于某种原因无法启动qt助手，startAssistant（）将返回false。

ShowDocumentation（）的实现现在很简单。首先，我们确保qt助手正在运行，然后通过进程的stdin通道发送显示页面的请求。在这里，命令由一个行尾标记终止以刷新通道是非常重要的。

```javascript
void Assistant::showDocumentation(const QString &page)
  {
      if (!startAssistant())
          return;

      QByteArray ba("SetSource ");
      ba.append("qthelp://org.qt-project.examples.simpletextviewer/doc/");

      proc->write(ba + page.toLocal8Bit() + '\n');
  }
```
最后，我们确保Qt助手在应用程序关闭的情况下正确终止。qprocess的析构函数会终止进程，这意味着应用程序不可能执行诸如保存用户设置之类的操作，这将导致设置文件损坏。为了避免这种情况，我们要求qt助手在助手类的析构函数中终止。

```javascript
Assistant::~Assistant()
  {
      if (proc && proc->state() == QProcess::Running) {
          proc->terminate();
          proc->waitForFinished(3000);
      }
      delete proc;
  }
```
## 主窗口类
主窗口类为主应用程序窗口提供两个菜单：文件菜单允许用户打开和查看现有文件，而帮助菜单提供有关应用程序和qt的信息，并允许用户打开qt助手以显示应用程序的文档。

为了能够访问帮助功能，我们在主窗口的构造函数中初始化助手对象。

```javascript
 MainWindow::MainWindow()
  {
      assistant = new Assistant;
      ...
  }

```
然后我们为简单的文本查看器应用程序创建所有操作。特别感兴趣的是可以通过F1快捷方式或“帮助>帮助内容”菜单项访问的Assistantact操作。此操作连接到主窗口类的showdocumentation（）插槽。
```javascript
void MainWindow::createActions()
  {
      assistantAct = new QAction(tr("Help Contents"), this);
      assistantAct->setShortcut(QKeySequence::HelpContents);
      connect(assistantAct, SIGNAL(triggered()), this, SLOT(showDocumentation()));
      ...
  }
```
在showdocumentation（）槽中，我们使用文档主页的URL调用助手类的showdocumentation（）函数。

```javascript
void MainWindow::showDocumentation()
  {
      assistant->showDocumentation("index.html");
  }
```
最后，我们必须重新实现受保护的qwidget:：closeEvent（）事件处理程序，以确保在终止应用程序之前正确关闭应用程序的qt助手实例。

```
 void MainWindow::closeEvent(QCloseEvent *)
  {
      delete assistant;
  }
```

## findFileDialog类
简单文本查看器应用程序提供了一个“查找文件”对话框，允许用户使用通配符匹配搜索文件。搜索是在指定的目录中执行的，用户可以选择浏览现有的文件系统以查找相关目录。

在构造函数中，我们保存对作为参数传递的助手和qtextedit对象的引用。助手对象将在findfiledialog的help（）槽中使用，稍后我们将看到，而qtextedit将在对话框的openfile（）槽中用于显示所选文件。

```javascript
  FindFileDialog::FindFileDialog(TextEdit *editor, Assistant *assistant)
      : QDialog(editor)
  {
      currentAssistant = assistant;
      currentEditor = editor;
      ...
  }
```
在findFileDialog类中要观察的最相关的成员是private help（）槽。插槽连接到对话框的帮助按钮，并通过调用助手的showdocumentation（）函数将当前qt助手实例与对话框的文档一起带到前台。

```javascript
void FindFileDialog::help()
  {
      currentAssistant->showDocumentation("filedialog.html");
  }
```

## 总结
为了使Qt助手充当应用程序的自定义帮助工具，除了包含Qt压缩帮助文件的自定义帮助收集文件外，还必须为应用程序提供控制Qt助手的过程。











