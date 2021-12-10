# ubuntu 下  virtualbox 启动时Kernel driver not installed (rc=-1908) 错误

之前好好地，换了个电脑总是出现这个问题，百度各种方法，挨个试了一遍感觉就是装了一大堆乱七八糟也没啥用。

找了一圈原因很简单，主板bios开着安全启动，关闭了就行
bios里找**secure Boot Enable**  把他关了，应该就可以了。
