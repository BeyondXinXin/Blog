cgla提供了四种细化方式,这是第一天测试结果,明天四种都测试完在更新这一块,这是其中一种细化方法


```javascript
// 01frame includes
#include "cgalmethods.h"

// VTK includes
#include <vtkSTLReader.h>
#include <vtkSmartPointer.h>

// CGAL includes
#include <CGAL/Simple_cartesian.h>

// CGAL includes
#include <CGAL/Simple_cartesian.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/boost/graph/graph_traits_Surface_mesh.h>
#include <CGAL/subdivision_method_3.h>
#include <CGAL/Timer.h>
#include <boost/lexical_cast.hpp>
#include <iostream>
#include <fstream>
```

```javascript
void CGALMethods::CatmullClarkSubdivision(QString off_filename) {
    typedef CGAL::Simple_cartesian<double>         Kernel;
    typedef CGAL::Surface_mesh<Kernel::Point_3>    PolygonMesh;
    using namespace std;
    using namespace CGAL;
    namespace params = CGAL::parameters;

    PolygonMesh pmesh;
    std::ifstream in(off_filename.toLocal8Bit().data());
    if (in.fail()) {
        qWarning() << "Could not open input file ";
        return ;
    }
    in >> pmesh;
    Timer t;
    t.start();
    Subdivision_method_3::CatmullClark_subdivision(
        pmesh, params::number_of_iterations(1));
    std::ofstream out(off_filename.toLocal8Bit().data());
    out << pmesh;
}
```



细化前结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190925185149607.png)

细化后结果
![在这里插入图片描述](https://img-blog.csdnimg.cn/2019092518515754.png)

---

完整代码
    Source/05CGALThread/cgalthread.h
    Source/05CGALThread/cgalthread.cpp
    Source/05CGALThread/cgalthreadsubdivision.h
    Source/05CGALThread/cgalthreadsubdivision.cpp


    
```cpp
/*
 * CGAL线程   操作基类
 * 仅有run函数在子线程,其余均在主线程
*/

#ifndef CGALTHREAD_H
#define CGALTHREAD_H

//01frame
#include "app.h"

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
  protected:
    bool result_;//执行结果
};

#endif // CGALTHREAD_H
```

```cpp
// 01frame includes
#include "cgalthread.h"

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
```

```cpp
/*
 * CGAL 表面细分算法
 * */

#ifndef CGALTHREADSUBDIVISIONMETHODS_H
#define CGALTHREADSUBDIVISIONMETHODS_H

// 01frame includes
#include "app.h"

// 05CGALThread includes
#include "cgalthread.h"

// VTK includes
#include <vtkPolyData.h>

class CGALThreadSubdivision : public CGALThread {
    Q_OBJECT
  public:
    explicit CGALThreadSubdivision(QObject *parent = nullptr);
    virtual ~CGALThreadSubdivision() override;
    void doWork();
    void SetSurface(const vtkSmartPointer<vtkPolyData> value);
    vtkSmartPointer<vtkPolyData> GetSurface();
  protected:
    virtual void run() override;
  private:
    void STL2OFF(QString off_filename);
    void OFF2STL(QString off_filename);
    void CatmullClarkSubdivision(QString off_filename);
    vtkPolyData *CustomReader(std::istream &infile);
  private:
    vtkSmartPointer<vtkPolyData> polydata_;

};

#endif // CGALSURFACESUBDIVISIONMETHODS_H

```

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

CGALThreadSubdivision::CGALThreadSubdivision(QObject *parent) :
    CGALThread(parent) {
    this->polydata_ = nullptr;
}

CGALThreadSubdivision::~CGALThreadSubdivision() {

}

void CGALThreadSubdivision::doWork() {
    STL2OFF("STL2OFF.off");
    CatmullClarkSubdivision("STL2OFF.off");
    OFF2STL("STL2OFF.off");
    this->SetResult(true);
}

void CGALThreadSubdivision::SetSurface(const vtkSmartPointer<vtkPolyData> value) {
    this->polydata_ = value;
}

vtkSmartPointer<vtkPolyData> CGALThreadSubdivision::GetSurface() {
    return this->polydata_;
}

void CGALThreadSubdivision::run() {
    this->InitialResult();
    this->doWork();
}

void CGALThreadSubdivision::STL2OFF(QString off_filename) {
    qDebug();

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
}

void CGALThreadSubdivision::OFF2STL(QString off_filename) {
    std::string inputFilename = off_filename.toLocal8Bit().data();
    std::ifstream fin(inputFilename.c_str());
    if (this->polydata_ == nullptr) {
        return;
    }
    this->polydata_ = vtkSmartPointer<vtkPolyData>::Take(CustomReader(fin));
}

void CGALThreadSubdivision::CatmullClarkSubdivision(QString off_filename) {
    typedef CGAL::Simple_cartesian<double>         Kernel;
    typedef CGAL::Surface_mesh<Kernel::Point_3>    PolygonMesh;
    using namespace std;
    using namespace CGAL;
    namespace params = CGAL::parameters;
    PolygonMesh pmesh;
    std::ifstream in(off_filename.toLocal8Bit().data());
    if (in.fail()) {
        qWarning() << "Could not open input file ";
        return ;
    }
    in >> pmesh;

    Subdivision_method_3::CatmullClark_subdivision(
        pmesh, params::number_of_iterations(1));
    Timer t;
    t.start();
    Subdivision_method_3::CatmullClark_subdivision(
        pmesh, params::number_of_iterations(1));
    std::cerr << "Done (" << t.time() << " s)" << std::endl;
    std::ofstream out(off_filename.toLocal8Bit().data());
    out << pmesh;
}

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