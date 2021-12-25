# CGAL Windos下安装编译使用



**windos**下安装**cgal** 如果没有其他需要（cmake默认设置），需要准备三个库：**gmp**  、**mpfr** 、**boost**。如果需要其他设置的话，看需求增加其他库，我需要**eigen3**，这里以**eigen3**为例如何增加新的模块。如果你需要其他的类似。（感觉这种开源库在windos下玩对于我这种菜鸟来说就是天坑，使用时候各种小问题）


## 1 cmake配置

根据上边介绍，我们需要准备：
- cgal安装包（现在版本是5.02，我原来工程是用的4.14，搬家到windos我就不用最新版了）

[https://github.com/CGAL/cgal/releases](https://github.com/CGAL/cgal/releases)

下载**setup.exe** 或者**Source Code**。两个区别不大，就是没有编译好的**gmp** 和**mpfr**。如果你下载exe，那么就不用再下载这两个了。

gmp  [https://gmplib.org/](https://gmplib.org/)

mpfr [https://www.mpfr.org/](https://www.mpfr.org/)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/274720312211366.png =800x)

为了截个图安装图，我下载的5.02。这里看个人，我不喜欢加一堆系统路径，所有这种需要编译的库，一律没有加系统路径。

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/431650312211505.png =800x)

- **boost 下载安装就行，这里有编译好的版本，如果没有合适的要自己编译**

[https://sourceforge.net/projects/boost/files/boost-binaries/1.72.0/](https://sourceforge.net/projects/boost/files/boost-binaries/1.72.0/)


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/123800412223595.png =800x)

- **eigen3 下载编译后的就可以**

[http://eigen.tuxfamily.org/index.php?title=Main_Page](http://eigen.tuxfamily.org/index.php?title=Main_Page)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/319700412228634.png =800x)


## 2 编译CGAL
- 按照上部应该是准备好了几个东西  **C:\local\boost_1_72_0**

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/9690712213082.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/496900612222751.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/254140612225984.png =800x)

- 打开cmake-gui 并设置

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/124070712231125.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/192620712236880.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/263890712237512.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/345260712228248.png =800x)

- vs 编译一下（debug和release）

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/115130612232939.png =800x)

- 编译完成你的静态库和动态库就都好了

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/587820512216660.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/505190512231108.png =800x)


## 3 测试、使用

怎么说吧，基本上windos下库编译完了都是让你放到系统path里。为了方便找所以我只加了一个WorkDLL，把刚才编译好的放进去。（cgal debug和release 名称不同，一块放就行，如果是相同的库，只放release）

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/388620512230931.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91windos%E4%B8%8B%E5%AE%89%E8%A3%85%E7%BC%96%E8%AF%91%E4%BD%BF%E7%94%A8.md/296070512229929.png =800x)

- 使用（静态链接），如果动态的话 **target_link_libraries**里加-l，在增加dll的路径。

```cpp
set(CGAL_DIR  "D:/lib/CGAL/bulid")
find_package(CGAL REQUIRED)
include(${CGAL_USE_FILE})
target_link_libraries(
    ${PROJECT_NAME}
    ${CGAL_LIBS}
    )
```
- 测试函数（自相交检测）
```cpp
bool CgalSelfIntersection(const char *filename,
                          QList<quint32>  &self_intersected_list,
                          QList<quint32>  &self_intersected_delete_list) {
    typedef CGAL::Exact_predicates_inexact_constructions_kernel K;
    typedef CGAL::Surface_mesh<K::Point_3>             Mesh;
    typedef boost::graph_traits<Mesh>::face_descriptor face_descriptor;
    namespace PMP = CGAL::Polygon_mesh_processing;
    using namespace std;
    ifstream input(filename);
    Mesh mesh;
    if (!input) {
        qWarning() << "off文件打开错误";
        return 0;
    }
    std::vector<K::Point_3> points;
    std::vector<std::vector<std::size_t> > polygons;
    if(!input || !CGAL::read_OFF(input, points, polygons) || points.empty()) {
        qWarning() << "Cannot open file ";
        return 0;
    }
    CGAL::Polygon_mesh_processing::orient_polygon_soup(points, polygons);
    CGAL::Polygon_mesh_processing::polygon_soup_to_polygon_mesh(points, polygons, mesh);
    input.close();
    bool intersecting = PMP::does_self_intersect(mesh,
                        PMP::parameters::vertex_point_map(get(CGAL::vertex_point, mesh)));
    qDebug() << (intersecting ?
                 "存在自相交" : "不存在自相交");
    QVector<pair<face_descriptor, face_descriptor> > intersected_tris;
    PMP::self_intersections(mesh, back_inserter(intersected_tris));
    qDebug() << intersected_tris.size() << "对三角形相交";
    QVector<pair<face_descriptor, face_descriptor>>::iterator iter;
    for (iter = intersected_tris.begin(); iter != intersected_tris.end(); iter++) {
        self_intersected_list << iter->first << iter->second;
    }
    self_intersected_delete_list = self_intersected_list;
    return 1;
}
```


## 4 如何打包

上边cmkae里是静态链接，生成的exe需要cgal的dll，在cgal编译的bin里把需要的dll跟自己生成的exe一起打包就好。
