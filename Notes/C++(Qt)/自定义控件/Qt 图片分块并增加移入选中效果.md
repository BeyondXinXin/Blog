# Qt 图片分块并增加移入选中效果

需要把图片分成几个部分，增加移入和选中的效果：



![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.79or8h4prs80.gif)



没找到类似的，干脆自己画一下吧。**QPolygon**直接支持判断是否包含点。


```cpp
bool QPolygon::containsPoint(const QPoint &point, Qt::FillRule fillRule) const

// Returns true if the given point is inside the polygon according to the specified fillRule; otherwise returns false.
// This function was introduced in Qt 4.3.
```


项目  [https://github.com/BeyondXinXin/study_qt](https://github.com/BeyondXinXin/study_qt)



