# qt 屏蔽QScrollArea滚动条响应菜单事件

```cpp
ui->scroll_area->verticalScrollBar()->setContextMenuPolicy(Qt::NoContextMenu);
ui->scroll_area->horizontalScrollBar()->setContextMenuPolicy(Qt::NoContextMenu);
```
