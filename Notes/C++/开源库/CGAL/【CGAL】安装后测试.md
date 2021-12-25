# 【CGAL】安装后测试

用qt的话搞这种跨平台的很方便,直接新建纯c++项目,用cmake管理不要用qmake。

跑一下这段测试程序(官方案例第一个,为了方便理解我中文注释了下


如果用qmake或者windos下用vs的话(上一步需要install),配置下includes 路径和lib路径,vs的话直接属性配置,添加路径就可以了。

* qmake

``` cmake

INCLUDEPATH+=XXXX     .h路径
CONFIG(debug, debug|release):{
LIBS+=-LXXXXX    lib路径
-lxxxxd\
-lxxxxd
}else:CONFIG(release, debug|release):{
LIBS+=-LXXXXX    lib路径
-lxxxx\
-lxxxx
}
```

* cmake

```cmake
cmake_minimum_required(VERSION 3.1.0)
project(cgalc)

find_package(CGAL REQUIRED)
include(${CGAL_USE_FILE})

add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(${PROJECT_NAME} ${CGAL_LIBS})
```



```c++
#include <iostream>
#include <CGAL/Simple_cartesian.h>

typedef CGAL::Simple_cartesian<double> Kernel;
typedef Kernel::Point_2 Point_2;
typedef Kernel::Segment_2 Segment_2;

int main() {
    Point_2 p(1, 1), q(10, 10), m(5, 9);
    Segment_2 s(p, q);



    std::cout << "p位置:" << p << std::endl;
    std::cout << "q位置:" << q.x() << " " << q.y() << std::endl;
    std::cout << "m位置:" << m << std::endl;

    std::cout << "---------计算欧几里德距离的平方----------- " << std::endl;
    std::cout << "平方距离(p,q) = "
              << CGAL::squared_distance(p, q) << std::endl;

    std::cout << "---------计算欧几里德距离的平方----------- " << std::endl;
    std::cout << "平方距离(线段(p,q), m) = "
              << CGAL::squared_distance(s, m) << std::endl;

    std::cout << "---------判断共线----------- " << std::endl;
    std::cout << "p, q, m ";
    switch (CGAL::orientation(p, q, m)) {
    case CGAL::COLLINEAR:
        std::cout << "共线\n";
        break;
    case CGAL::LEFT_TURN:
        std::cout << "左侧\n";
        break;
    case CGAL::RIGHT_TURN:
        std::cout << "右侧\n";
        break;
    }

    std::cout << "---------计算中点----------- " << std::endl;
    std::cout << " 中点(p,q) = " << CGAL::midpoint(p, q) << std::endl;
    return 0;
}
```

![输出结果](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E5%AE%89%E8%A3%85%E5%90%8E%E6%B5%8B%E8%AF%95.md/248281713224072.png =600x)



