# ubuntu 下 QT调用脚本无效    切换默认sh为bash或者dash


### 程序
```cpp
QProcess::execute("sh gpu_ivus.sh");
```

```bash
#!/bin/bash
source /home/ubuntu/anaconda3/bin/activate base
python deeplabv3plus_multichannels.py --dataroot 'KeyFrames' --saveroot 'KeyAI'
```

### 报错
&emsp;&emsp;找不到 source
&emsp;&emsp;找不到 python

### 原因
&emsp;&emsp;dash不支持,需要默认sh切换为bash

### 解决办法
```bash
ls -l /bin/sh
sudo dpkg-reconfigure dash  #选择否
ls -l /bin/sh
```
