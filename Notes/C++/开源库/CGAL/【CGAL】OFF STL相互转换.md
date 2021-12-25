# CGAL OFF STL相互转换

[三角网格文件OFF的格式分析及OFF到STL的转化](http://www.doc88.com/p-8495281266662.html)


![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/off%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F.md/308762113220954.png =200x)
![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/off%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F.md/407792113238742.png =200x)

```cpp
// 01frame includes
#include "cgalthreadsubdivision.h"
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
```


功能实现了,效率肯定没有内存直接拷过去快,我再去官方帮助文档找一找,有合适的我再换.

```cpp
void CGALMethods::STL2OFF(
    QString stl_filename, QString off_filename) {

    if (stl_filename.isEmpty()) {
        return;
    }
    if (off_filename.isEmpty()) {
        return;
    }
    vtkSmartPointer<vtkSTLReader> reader =
        vtkSmartPointer<vtkSTLReader>::New();
    reader->SetFileName(stl_filename.toLocal8Bit().data());
    reader->Update();
    vtkSmartPointer<vtkPolyData> polyData =
        vtkSmartPointer<vtkPolyData>::New();
    polyData = reader->GetOutput();
    double x[3];

    QFile file(off_filename);
    file.open(QIODevice::WriteOnly);
    file.close();
    if (file.open(QIODevice::ReadWrite | QIODevice::Text)) {
        QTextStream stream(&file);
        stream.seek(file.size());
        stream << "OFF" << "\n";
        stream << polyData->GetNumberOfPoints() << " "
               << polyData->GetNumberOfCells() << " 0\n";

        for (int ww = 0; ww < polyData->GetNumberOfPoints() ; ww++) {
            polyData->GetPoint(ww, x);
            stream << x[0] << " " << x[1] << " " << x[2] << "\n";
        }

        for (int ww = 0; ww < polyData->GetNumberOfCells() ; ww++) {
            stream << "3 ";
            for (int i = 0; i < polyData->GetCell(ww)->GetNumberOfPoints(); i++) {
                stream << polyData->GetCell(ww)->GetPointId(i) << " ";
            }
            stream << "\n";
        }
        file.close();
    }
}
```

vtk读取stl

```cpp
void CGALThreadSubdivision::OFF2STL(QString off_filename) {
    std::string inputFilename = off_filename.toLocal8Bit().data();
    std::ifstream fin(inputFilename.c_str());
    if (this->polydata_ == nullptr) {
        return;
    }
    this->polydata_ = vtkSmartPointer<vtkPolyData>::Take(CustomReader(fin));
}
```

```cpp
vtkPolyData *CGALThreadSubdivision::CustomReader(istream &infile) {
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