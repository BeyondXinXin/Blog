&emsp;&emsp;程序中如果有大量可执行程序需要添加，cmake 提供了macro指令帮助批量生成。下边这个可以实现每次生成**studyexplorer dicomviewer logviewer**三个可执行程序


```cpp
macro(DCMTK_ADD_EXECUTABLE PROGRAM)
    include_directories(${KissDicomViewer_INCLUDE_DIRS})
    add_executable(${PROGRAM} ${PROGRAM}.cpp  ${KissDicomViewer_Resource_DIR})
    target_link_libraries(${PROGRAM} KissDicomViewer_sharde)
endmacro()

foreach(SUBDIR studyexplorer dicomviewer logviewer)
  DCMTK_ADD_EXECUTABLE(${SUBDIR})
endforeach()
```


![在这里插入图片描述](https://img-blog.csdnimg.cn/20201003092843251.png#pic_center)
