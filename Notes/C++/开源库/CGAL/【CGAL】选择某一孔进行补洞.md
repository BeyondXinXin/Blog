# CGAL 选择某一孔进行补洞
## 1 需求和原理
需要做一个片状模型表面选择补洞的效果，之前代码是用vtk实现的，就是寻找边缘，让后依次链接，但是效果不是很好。把洞用三角形补上后显得很突兀，没有对空洞根据周围做一个细化和光顺。vtk只进行到步骤b，cgal有现成的到步骤d

补洞原理是这片文章

> P. Liepa. Filling holes in meshes. In Proceedings of the 2003 Eurographics/ACM SIGGRAPH Symposium on Geometry Processing, pages 200–205. Eurographics Association, 2003.

补洞后光顺是这篇文章
> M. Zou, T. Ju, and N. Carr. An algorithm for triangulating multiple 3d polygons. In Computer Graphics Forum, volume 32, pages 157–166. Wiley Online Library, 2013.

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/385385111226937.png =800x)

## 2 官方案例

[CGAL补洞案例](https://doc.cgal.org/latest/Polygon_mesh_processing/index.html#title22)

这个案例有一个问题，就是他是针对所有空洞全部封闭，无法选择某一个孔进行封闭。
**Hole Filling**
此软件包提供了一种算法，用于填充三角形曲面网格中或由描述多段线的点序列定义的一个闭合孔。文[6]描述了该算法的主要步骤，总结如下。

首先，在不引入任何新顶点的情况下，生成对孔边界进行三角剖分的最大面片。选择该面片是为了最小化对所有可能的三角形面片评估的质量函数。质量函数首先最小化贴片三角形之间的最坏二面角，然后将贴片的总表面积作为分层。根据文献[7]的建议，将搜索空间从所有可能的面片缩小到孔边界顶点的三维delaunay三角剖分的面，同时根据上述质量搜索最佳面片，从而显著提高了算法的性能。标准。

对于一些复杂的输入孔边界，生成的面片可能具有自相交性。填充孔后，可以使用节网格划分中描述的网格划分函数cgal：：polygon_mesh_processing：：refine（）和cgal：：polygon_mesh_processing：：fair（）对生成的面片进行细化和光顺。

triangulate_hole_polyline() ：给定一系列定义孔的点，对孔进行三角测量。
triangulate_hole() ：给定网格上孔的边界上的边界半边，对孔进行三角剖分。
triangulate_and_refine_hole()：除了对triangulate_hole()生成的补丁进行完善之外。
triangulate_refine_and_fair_hole()：除了triangulate_and_refine_hole()生成的补丁外还算公平。


```cpp
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polyhedron_3.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>
#include <iostream>
#include <fstream>
#include <vector>
#include <boost/foreach.hpp>
typedef CGAL::Exact_predicates_inexact_constructions_kernel Kernel;
typedef CGAL::Polyhedron_3<Kernel>     Polyhedron;
typedef Polyhedron::Halfedge_handle    Halfedge_handle;
typedef Polyhedron::Facet_handle       Facet_handle;
typedef Polyhedron::Vertex_handle      Vertex_handle;
int main(int argc, char* argv[])
{
  const char* filename = (argc > 1) ? argv[1] : "data/mech-holes-shark.off";
  std::ifstream input(filename);
  Polyhedron poly;
  if ( !input || !(input >> poly) || poly.empty() ) {
    std::cerr << "Not a valid off file." << std::endl;
    return 1;
  }
  // Incrementally fill the holes
  unsigned int nb_holes = 0;
  BOOST_FOREACH(Halfedge_handle h, halfedges(poly))
  {
    if(h->is_border())
    {
      std::vector<Facet_handle>  patch_facets;
      std::vector<Vertex_handle> patch_vertices;
      bool success = CGAL::cpp11::get<0>(
        CGAL::Polygon_mesh_processing::triangulate_refine_and_fair_hole(
                  poly,
                  h,
                  std::back_inserter(patch_facets),
                  std::back_inserter(patch_vertices),
     CGAL::Polygon_mesh_processing::parameters::vertex_point_map(get(CGAL::vertex_point, poly)).
                  geom_traits(Kernel())) );
      std::cout << " Number of facets in constructed patch: " << patch_facets.size() << std::endl;
      std::cout << " Number of vertices in constructed patch: " << patch_vertices.size() << std::endl;
      std::cout << " Fairing : " << (success ? "succeeded" : "failed") << std::endl;
      ++nb_holes;
    }
  }
  std::cout << std::endl;
  std::cout << nb_holes << " holes have been filled" << std::endl;
  
  std::ofstream out("filled.off");
  out.precision(17);
  out << poly << std::endl;
  return 0;
}
```

## 3 自己思路

无非就这四部：
识别网格上的洞、对每个洞三角化、网格细分、网格光滑

1. 先通过vtk手动选择需要补孔的片体（存为stl格式）
2. 把原模型（stl格式）和步骤一vtk选择的孔洞（stl文件）同时输入给CGAL
3. 把孔洞文件所有点记录在list里
4. 遍历原模型所有Halfedge_handle
5. 判断每一个Halfedge_handle是否为边界
6. 为边界的Halfedge_handle点是否是步骤三记录在list里的点
7. 是的话则修补这个洞，不是就跳过
8. 把修补好的洞进行细化和光顺


## 4 实现截图

![待修补的模型](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/381055311222691.png =800x)


![选择要封闭区域](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/502825311240571.png =800x)

![选择区域完成](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/31095411238175.png =800x)


![正在修补](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/159365411235677.png =800x)


![修补完成](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/350125411216918.png =800x)


![修补效果](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/502295411239358.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/315595511234494.png =200x)
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/495205511228040.png =200x)
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/579325511221174.png =200x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/74225611211704.png =200x)
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/149865611214208.png =200x)
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/262625611223155.png =200x)


## 5 程序源码


[app.h里是预编译文件，这个没必要用，把他去了换成自己的预编译头文件](https://blog.csdn.net/a15005784320/article/details/98480663)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%E3%80%91%E9%80%89%E6%8B%A9%E6%9F%90%E4%B8%80%E5%AD%94%E8%BF%9B%E8%A1%8C%E8%A1%A5%E6%B4%9E.md/451495611216040.png =800x)

---
 * CGALThread类
 * CGAL线程   操作基类
 * 需要特别注意仅有run函数在子线程,其余均在主线程
 ---
 * CGALThreadFill 类
 * 补洞，传入原模型的stl和需要补洞的片体stl，传出补洞完成的stl模型
 ---
 * CGALThreadFillChoice 类
 * 交互类，这个需要自己写，就是qt绑定vtkopenglwidget 事件
 * 我这里是利用vtk（vtkFillHolesFilter）进行预补洞（对每个洞三角化）选择需要的洞保存为stl
 ---


```cpp
/*
 * CGAL线程   操作基类
 * 仅有run函数在子线程,其余均在主线程
*/

#ifndef CGALTHREAD_H
#define CGALTHREAD_H

//01frame
#include "app.h"

// VTK includes
#include <vtkPolyData.h>

class CGALThread : public QThread {
    Q_OBJECT
  public:
    explicit CGALThread(QObject *parent = nullptr);
    virtual ~CGALThread() override;
    bool GetThreadResult() const;//获取结果
  protected:
    virtual void run() override;//线程
    void InitialResult();//初始化
    void SetResult(const bool result);//设置结果
    void STL2OFF(const QString off_filename, const int num = 0);
    void OFF2STL(const QString off_filename);
    vtkPolyData *CustomReader(std::istream &infile);
  protected:
    bool result_;// 执行结果
    vtkSmartPointer<vtkPolyData> polydata_;// polydata 数据
    vtkSmartPointer<vtkPolyData> polydata_region_;// polydata 数据
};

#endif // CGALTHREAD_H
```

```cpp
//01frame
#include "cgalthread.h"

// C++ includes
#include <string.h>
#include <fstream>
#include <iostream>

// VTK includes
#include <vtkPoints.h>
#include <vtkPolyData.h>
#include <vtkCellArray.h>
#include <vtkSmartPointer.h>

// CGAL includes
#include <CGAL/Timer.h>
#include <CGAL/Surface_mesh.h>
#include <boost/lexical_cast.hpp>
#include <CGAL/Simple_cartesian.h>
#include <CGAL/subdivision_method_3.h>
#include <CGAL/boost/graph/graph_traits_Surface_mesh.h>



CGALThread::CGALThread(QObject *parent) : QThread(parent) {
    this->InitialResult();
}

CGALThread::~CGALThread() {

}

bool CGALThread::GetThreadResult() const {
    return this->result_;
}

void CGALThread::run() {

}

void CGALThread::InitialResult() {
    this->result_ = false;
}

void CGALThread::SetResult(const bool result) {
    result_ |= result;
}

void CGALThread::STL2OFF(const QString off_filename, const int num) {
    qDebug();
    if (num == 0) {
        if (this->polydata_ == nullptr) {
            return;
        }
        if (off_filename.isEmpty()) {
            return;
        }

        double x[3];
        QFile file(off_filename);
        file.open(QIODevice::WriteOnly);
        file.close();
        if (file.open(QIODevice::ReadWrite | QIODevice::Text)) {
            QTextStream stream(&file);
            stream.seek(file.size());
            stream << "OFF" << "\n";
            stream << this->polydata_->GetNumberOfPoints() << " "
                   << this->polydata_->GetNumberOfCells() << " 0\n";
            for (int ww = 0; ww < this->polydata_->GetNumberOfPoints() ; ww++) {
                this->polydata_->GetPoint(ww, x);
                stream << x[0] << " " << x[1] << " " << x[2] << "\n";
            }
            for (int ww = 0; ww < this->polydata_->GetNumberOfCells() ; ww++) {
                stream << this->polydata_->GetCell(ww)->GetNumberOfPoints() << " ";
                for (int i = 0; i <
                        this->polydata_->GetCell(ww)->GetNumberOfPoints(); i++) {
                    stream << this->polydata_->GetCell(ww)->GetPointId(i) << " ";
                }
                stream << "\n";
            }
            file.close();
        }
    } else if (num == 1) {
        if (this->polydata_region_ == nullptr) {
            return;
        }
        if (off_filename.isEmpty()) {
            return;
        }

        double x[3];
        QFile file(off_filename);
        file.open(QIODevice::WriteOnly);
        file.close();
        if (file.open(QIODevice::ReadWrite | QIODevice::Text)) {
            QTextStream stream(&file);
            stream.seek(file.size());
            stream << "OFF" << "\n";
            stream << this->polydata_region_->GetNumberOfPoints() << " "
                   << this->polydata_region_->GetNumberOfCells() << " 0\n";
            for (int ww = 0; ww < this->polydata_region_->GetNumberOfPoints() ; ww++) {
                this->polydata_region_->GetPoint(ww, x);
                stream << x[0] << " " << x[1] << " " << x[2] << "\n";
            }
            for (int ww = 0; ww < this->polydata_region_->GetNumberOfCells() ; ww++) {
                stream << this->polydata_region_->GetCell(ww)->GetNumberOfPoints() << " ";
                for (int i = 0; i <
                        this->polydata_region_->GetCell(ww)->GetNumberOfPoints(); i++) {
                    stream << this->polydata_region_->GetCell(ww)->GetPointId(i) << " ";
                }
                stream << "\n";
            }
            file.close();
        }
    }
}

void CGALThread::OFF2STL(const QString off_filename) {
    std::string inputFilename = off_filename.toLocal8Bit().data();
    std::ifstream fin(inputFilename.c_str());
    if (this->polydata_ == nullptr) {
        return;
    }
    this->polydata_ = vtkSmartPointer<vtkPolyData>::Take(CustomReader(fin));
    fin.close();
}

vtkPolyData *CGALThread::CustomReader(istream &infile) {
    qDebug();
    char buf[1000];
    infile.getline(buf, 1000);
    if (strcmp(buf, "off") == 0 || strcmp(buf, "OFF") == 0) {
        vtkIdType number_of_points, number_of_triangles, number_of_lines;
        infile >> number_of_points >> number_of_triangles >> number_of_lines;
        vtkSmartPointer<vtkPoints> points
            = vtkSmartPointer<vtkPoints>::New();
        points->SetNumberOfPoints(number_of_points);
        for (vtkIdType i = 0; i < number_of_points; i++) {
            double x, y, z;
            infile >> x >> y >> z;
            points->SetPoint(i, x, y, z);
        }
        vtkSmartPointer<vtkCellArray> polys
            = vtkSmartPointer<vtkCellArray>::New();
        int n;
        vtkIdType type;
        for (vtkIdType i = 0; i < number_of_triangles; i++) {
            infile >> n;
            polys->InsertNextCell(n);
            for (; n > 0; n--) {
                infile >> type;
                polys->InsertCellPoint(type);
            }
        }
        vtkPolyData *polydata = vtkPolyData::New();
        polydata->SetPoints(points);
        polydata->SetPolys(polys);
        return polydata;
    }
    vtkPolyData *polydata = vtkPolyData::New();
    return polydata;
}
```

```cpp
/*
 * CGAL +VTK *
 * 表面补洞
 * vtk交互寻找需要补的洞
 * CGAL负责补洞
 *
 * CGALThreadFill 类
 * 补洞
 *
 * CGALThreadFillChoice 类
 * 交互选择
 *
 * */


#ifndef CGALTHREADFILL_H
#define CGALTHREADFILL_H

// 01 frame includes
#include "app.h"

// 05 CGALThread includes
#include "cgalthread.h"

class CGALThreadFill : public CGALThread {
    Q_OBJECT
  public:
    explicit CGALThreadFill(QObject *parent = nullptr);
    virtual ~CGALThreadFill() override;
    void doWork();
    void SetSurface(const vtkSmartPointer<vtkPolyData> value, int num = 0);
    vtkSmartPointer<vtkPolyData> GetSurface();
  protected:
    virtual void run() override;
  private:
    bool CGALFunctionFill();
};

#endif // CGALTHREADFILL_H
```

```cpp
// 01 frame includes
#include "cgalthreadfill.h"

// C++ includes
#include <fstream>
#include <iostream>
#include <fstream>
#include <vector>
#include <boost/foreach.hpp>

// CGAL includes
#include <CGAL/Polyhedron_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/read_vtk_image_data.h>
#include <CGAL/Polygon_mesh_processing/corefinement.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>

CGALThreadFill::CGALThreadFill(QObject *parent) :
    CGALThread(parent) {
    this->polydata_ = nullptr;
}

CGALThreadFill::~CGALThreadFill() {
}

void CGALThreadFill::doWork() {
    STL2OFF("fill.off", 0);
    STL2OFF("fill_region.off", 1);
    if (CGALFunctionFill()) {
        OFF2STL("fill.off");
        this->SetResult(true);
    } else {
        this->SetResult(false);
    }
}

void CGALThreadFill::SetSurface(const vtkSmartPointer<vtkPolyData> value, int num) {
    if (0 == num) {
        this->polydata_ = value;
    } else if (1 == num) {
        this->polydata_region_ = value;
    }
}

vtkSmartPointer<vtkPolyData> CGALThreadFill::GetSurface() {
    return this->polydata_;
}

void CGALThreadFill::run() {
    this->InitialResult();
    this->doWork();
}

bool CGALThreadFill::CGALFunctionFill() {
    typedef CGAL::Exact_predicates_inexact_constructions_kernel Kernel;
    typedef CGAL::Polyhedron_3<Kernel>     Polyhedron;
    typedef Polyhedron::Halfedge_handle    Halfedge_handle;
    typedef Polyhedron::Facet_handle       Facet_handle;
    typedef Polyhedron::Vertex_handle      Vertex_handle;
    typedef Kernel::Point_3 Point;
    typedef Polyhedron::Halfedge_iterator         Iterator;
    std::ifstream input;
    input.open("fill_region.off");
    Polyhedron poly_region;
    if (!(input >> poly_region)) {
        std::cerr << "01 Not a valid off file." << std::endl;
        return false;
    }
    input.close();
    input.open("fill.off");
    Polyhedron poly;
    if (!(input >> poly)) {
        std::cerr << "02 Not a valid off file." << std::endl;
        return false;
    }
    input.close();
    QList<Point> region_list;
    Halfedge_handle region;
    for (Iterator e = poly_region.halfedges_begin();
            e != poly_region.halfedges_end(); ++e) {
        region_list.push_back(e ->vertex()->point());
    }
    BOOST_FOREACH(Halfedge_handle h, halfedges(poly)) {
        if (h->is_border()) {
            Point tmp;
            foreach (tmp, region_list) {
                if (h->vertex()->point() == tmp) {
                    std::vector<Facet_handle>  patch_facets;
                    std::vector<Vertex_handle> patch_vertices;
                    if (CGAL::cpp11::get<0>(
                                CGAL::Polygon_mesh_processing::
                                triangulate_refine_and_fair_hole(
                                    poly, h,
                                    std::back_inserter(patch_facets),
                                    std::back_inserter(patch_vertices),
                                    CGAL::Polygon_mesh_processing::parameters::
                                    vertex_point_map(get(CGAL::vertex_point, poly)).
                                    geom_traits(Kernel())))) {
                        qDebug() << h->vertex()->point().hx() ;
                        qDebug() << patch_facets.size() ;
                    }
                    if (patch_facets.size() > 0) {
                        std::ofstream out("fill.off");
                        out << poly ;
                        out.close();
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

```
