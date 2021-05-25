# 利用vtk Qt实现一个可以调用python命令的控制台

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200604084240688.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020060408422737.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70)
```cpp
#include "pvpython.h"
#include "vtkOutputWindow.h"

int main(int, char *[]) {
    auto opwindow = vtkOutputWindow::New();
    vtkOutputWindow::SetInstance(opwindow);
    opwindow->Delete();
    return ParaViewPython::Run();
}

```


```cpp
#include "vtkMultiProcessController.h"
#include "vtkPythonInterpreter.h"

#include <vector>
#include <vtksys/SystemTools.hxx>

namespace ParaViewPython {
    int Run() {
        int ret_val = 0;
        std::vector<char *> pythonArgs;
        pythonArgs.push_back(nullptr);
        vtkPythonInterpreter::Initialize();
        ret_val =
            vtkPythonInterpreter::PyMain(
                static_cast<int>(pythonArgs.size()) - 1, &*pythonArgs.begin());
        return ret_val;
    }
}

```
