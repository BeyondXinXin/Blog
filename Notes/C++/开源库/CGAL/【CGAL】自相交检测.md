# 【CGAL 】自相交检测

自相交包括三种（三角形片体），而模型有自相交则无法生成体网格等。

vcg（meshlab）有提供一个自相交检测接口，在实际使用时有些bug，比如补完部分自相交后，其余自相交检测不准确。这里用cgal测试一下效果。

思路就是vtk读取片体的stl模型，生成off文件。
cgal读取off文件，识别自相交并记录相交片体。
vtk显示自相交片体。



![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%20%E3%80%91%E8%87%AA%E7%9B%B8%E4%BA%A4%E6%A3%80%E6%B5%8B.md/481260912239916.png =800x)

![](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/c%2B%2B/%E5%BC%80%E6%BA%90%E5%BA%93/cgal/%E3%80%90cgal%20%E3%80%91%E8%87%AA%E7%9B%B8%E4%BA%A4%E6%A3%80%E6%B5%8B.md/545550912235024.png =800x)


```cpp
cmake_minimum_required(VERSION 3.1.0)
set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 11)

project(SelfIntersect)
    set(CMAKE_RUNTIME_OUTPUT_DIRECTORY_RELEASE ${PROJECT_SOURCE_DIR})
find_package(Qt5
    REQUIRED
    COMPONENTS
    Core
    Gui
    Widgets
    )

find_package(VTK 8.2.0 REQUIRED)
include(${VTK_USE_FILE})
find_package(CGAL REQUIRED)
include(${CGAL_USE_FILE})
find_package(Eigen3 REQUIRED)
include( ${EIGEN3_USE_FILE} )
option(BUILD_SHARED_LIBS "" OFF)
option(USE_SYSTEM_VTK "" ON)
option(USE_SYSTEM_ITK "" ON)

add_executable(${PROJECT_NAME} "main.cpp")

target_link_libraries(
    ${PROJECT_NAME}
    ${VTK_LIBRARIES}
    "${CGAL_LIBS}"
    Qt5::Core
    Qt5::Gui
    Qt5::Widgets
    )
```


```cpp
#include <fstream>
#include <iostream>

#include <QFile>
#include <QDebug>
#include <QTextStream>

#include <CGAL/Polyhedron_3.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/IO/OFF_reader.h>
#include <CGAL/Polyhedron_items_with_id_3.h>
#include <CGAL/Polygon_mesh_processing/orientation.h>
#include <CGAL/Polygon_mesh_processing/self_intersections.h>
#include <CGAL/Polygon_mesh_processing/orient_polygon_soup.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Polygon_mesh_processing/polygon_soup_to_polygon_mesh.h>

#include <vtkActor.h>
#include <vtkCellData.h>
#include <vtkRenderer.h>
#include <vtkProperty.h>
#include <vtkPointData.h>
#include <vtkSTLReader.h>
#include <vtkLookupTable.h>
#include <vtkRenderWindow.h>
#include <vtkPolyDataMapper.h>
#include <vtkUnsignedCharArray.h>
#include <vtkColorTransferFunction.h>
#include <vtkRenderWindowInteractor.h>
#include <vtkInteractorStyleTrackballCamera.h>





bool SelfIntersection(const char *filename, QList<quint32>  &self_intersected_list) {
    typedef CGAL::Exact_predicates_inexact_constructions_kernel K;
    typedef CGAL::Surface_mesh<K::Point_3>             Mesh;
    typedef boost::graph_traits<Mesh>::face_descriptor face_descriptor;
    namespace PMP = CGAL::Polygon_mesh_processing;
    using namespace std;
    ifstream input(filename);
    Mesh mesh;
    if (!input || !(input >> mesh) || !CGAL::is_triangle_mesh(mesh)) {
        cerr << "off文件错误" << endl;
        return 0;
    }
    bool intersecting = PMP::does_self_intersect(mesh,
                        PMP::parameters::vertex_point_map(get(CGAL::vertex_point, mesh)));
    cout << (intersecting ?
             "存在自相交" : "不存在自相交") << endl;
    QVector<pair<face_descriptor, face_descriptor> > intersected_tris;
    PMP::self_intersections(mesh, back_inserter(intersected_tris));
    cout << intersected_tris.size() << "对三角形相交" << endl;
    QVector<pair<face_descriptor, face_descriptor>>::iterator iter;
    for (iter = intersected_tris.begin(); iter != intersected_tris.end(); iter++) {
        self_intersected_list << iter->first << iter->second;
    }
    return 1;
}


bool ReadStl(const char *filename,
             vtkSmartPointer<vtkPolyData> &surface_) {
    vtkNew<vtkSTLReader> reader;
    reader->SetFileName(filename);
    reader->Update();
    surface_ = reader->GetOutput();
    return 1;
}


bool STL2OFF(const char *off_filename,
             const vtkSmartPointer<vtkPolyData> surface_) {
    using namespace std;
    double x[3];
    QFile file(off_filename);
    if (file.open(QIODevice::ReadWrite | QIODevice::Text)) {
        QTextStream stream(&file);
        stream.seek(file.size());
        stream << "OFF" << "\n";
        if (surface_->GetNumberOfPoints() == 0) {
            cerr << "stl是空的!" << endl;
            file.close();
            return 0;
        }
        stream << surface_->GetNumberOfPoints() << " "
               << surface_->GetNumberOfCells() << " 0\n";
        for (qint32 ww = 0; ww < surface_->GetNumberOfPoints() ; ww++) {
            surface_->GetPoint(ww, x);
            stream << x[0] << " " << x[1] << " " << x[2] << "\n";
        }
        for (qint32 ww = 0; ww < surface_->GetNumberOfCells() ; ww++) {
            stream << surface_->GetCell(ww)->GetNumberOfPoints() << " ";
            for (qint32 i = 0; i <
                    surface_->GetCell(ww)->GetNumberOfPoints(); i++) {
                stream << surface_->GetCell(ww)->GetPointId(i) << " ";
            }
            stream << "\n";
        }
    }
    file.close();
    return 1;
}

vtkPolyData *CustomReader(istream &infile) {
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

void OFF2STL(const char *off_filename, vtkSmartPointer<vtkPolyData> &surface_) {
    std::string inputFilename = off_filename;
    std::ifstream fin(inputFilename.c_str());
    if (surface_ == nullptr) {
        return;
    }
    surface_ = vtkSmartPointer<vtkPolyData>::Take(CustomReader(fin));
    fin.close();
}


void ShowPolydata(vtkSmartPointer<vtkPolyData> surface_,
                  QList<quint32>  self_intersected_list) {
    qSort(self_intersected_list.begin(), self_intersected_list.end());
    self_intersected_list = self_intersected_list.toSet().toList();
    unsigned char color1[3] = { 255, 0, 0 };
    unsigned char color2[3] = { 0, 0, 0 };
    vtkNew<vtkUnsignedCharArray> cellColor;
    cellColor->SetNumberOfComponents(3);
    for(quint32 i = 0; i < surface_->GetNumberOfCells(); i++) {
        if(self_intersected_list.contains(i)) {
            cellColor->InsertNextTypedTuple(color1);
        } else {
            cellColor->InsertNextTypedTuple(color2);
        }
    }
    surface_->GetCellData()->SetScalars(cellColor);
    vtkNew<vtkPolyDataMapper> polydatamapper ;
    polydatamapper->SetInputData(surface_);
    vtkNew<vtkActor> actor ;
    actor->SetMapper(polydatamapper);
    actor->GetProperty()->SetOpacity(0.1);
    vtkNew<vtkRenderer> renderer;
    renderer->AddActor(actor);
    renderer->SetBackground(0.2, 0.2, 0.2);
    vtkNew<vtkRenderWindow> renwin ;
    renwin->AddRenderer(renderer);
    renwin->SetSize(800, 800);
    vtkNew<vtkInteractorStyleTrackballCamera>style ;
    vtkNew<vtkRenderWindowInteractor> rendererwindowinteracrot ;
    rendererwindowinteracrot->SetInteractorStyle(style);
    rendererwindowinteracrot->SetRenderWindow(renwin);
    rendererwindowinteracrot->Start();
}



int main(int argc, char *argv[]) {
    using namespace std;
    cout << "自相交测试!" << endl;
    const char *filename = (argc > 1) ? argv[1] : "test/intersection2.stl";
    vtkSmartPointer<vtkPolyData> surface_;
    ReadStl(filename, surface_);
    STL2OFF("tmp.off", surface_);
    QList<quint32>  self_intersected_list;
    SelfIntersection("tmp.off", self_intersected_list);
    OFF2STL("tmp.off", surface_);
    ShowPolydata(surface_, self_intersected_list);
    return 0;
}

```
