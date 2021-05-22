# 问题
---

看CGAL官方说明,有表面平滑和表面补洞的案例.官方案例死活跑不通,总是报这两个错误,很抓狂
不跟我说哪里错了,就是一堆未声明.搜索好久终于找到有人跟我一样的错误,有人回复了解决办法.
[https://github.com/CGAL/cgal/issues/266](https://github.com/CGAL/cgal/issues/266)
[https://github.com/CGAL/cgal/issues/2622](https://github.com/CGAL/cgal/issues/2622)

XXXXXis not a class, struct, or union type
   typedef typename Sparse_linear_solver::Matrix Solver_matrix;
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190929134255588.png)

> /home/yx/文档/CGAL-4.13.1/include/CGAL/Polygon_mesh_processing/internal/fair_impl.h:56: error: ‘CGAL::Polygon_mesh_processing::internal::Fair_Polyhedron_3<CGAL::Polyhedron_3<CGAL::Epick>, bool, CGAL::internal::Cotangent_weight_with_voronoi_area_fairing<CGAL::Polyhedron_3<CGAL::Epick>, CGAL::internal::Point_accessor<CGAL::internal::In_place_list_iterator<CGAL::HalfedgeDS_in_place_list_vertex<CGAL::I_Polyhedron_vertex<CGAL::HalfedgeDS_vertex_base<CGAL::HalfedgeDS_list_types<CGAL::Epick, CGAL::I_Polyhedron_derived_items_3<CGAL::Polyhedron_items_3>, std::allocator<int> >, CGAL::Boolean_tag<true>, CGAL::Point_3<CGAL::Epick> > > >, std::allocator<CGAL::HalfedgeDS_in_place_list_vertex<CGAL::I_Polyhedron_vertex<CGAL::HalfedgeDS_vertex_base<CGAL::HalfedgeDS_list_types<CGAL::Epick, CGAL::I_Polyhedron_derived_items_3<CGAL::Polyhedron_items_3>, std::allocator<int> >, CGAL::Boolean_tag<true>, CGAL::Point_3<CGAL::Epick> > > > > >, CGAL::Point_3<CGAL::Epick>, CGAL::Point_3<CGAL::Epick>&> >, CGAL::internal::Point_accessor<CGAL::internal::In_place_list_iterator<CGAL::HalfedgeDS_in_place_list_vertex<CGAL::I_Polyhedron_vertex<CGAL::HalfedgeDS_vertex_base<CGAL::HalfedgeDS_list_types<CGAL::Epick, CGAL::I_Polyhedron_derived_items_3<CGAL::Polyhedron_items_3>, std::allocator<int> >, CGAL::Boolean_tag<true>, CGAL::Point_3<CGAL::Epick> > > >, std::allocator<CGAL::HalfedgeDS_in_place_list_vertex<CGAL::I_Polyhedron_vertex<CGAL::HalfedgeDS_vertex_base<CGAL::HalfedgeDS_list_types<CGAL::Epick, CGAL::I_Polyhedron_derived_items_3<CGAL::Polyhedron_items_3>, std::allocator<int> >, CGAL::Boolean_tag<true>, CGAL::Point_3<CGAL::Epick> > > > > >, CGAL::Point_3<CGAL::Epick>, CGAL::Point_3<CGAL::Epick>&> >::Sparse_linear_solver {aka bool}’ is not a class, struct, or union type
   typedef typename Sparse_linear_solver::Vector Solver_vector;
                                                 ^~~~~~~~~~~~~
---
# 解决办法
安装Eigen3,这是一个用于矩阵和线性代数运算的计算机编程库.CGAL 安装文档有说明,
[Poisson Surface Reconstruction Reference](https://doc.cgal.org/latest/Poisson_surface_reconstruction_3/group__PkgPoissonSurfaceReconstruction3Ref.html) 
[Triangulated Surface Mesh Parameterization](https://doc.cgal.org/latest/Surface_mesh_parameterization/group__PkgSurfaceMeshParameterizationRef.html)

这两个包中用到了EIGEN,需要安装eigen 库才可以
属于线性代数的C++模板库。own支持所有矩阵大小、各种矩阵分解方法和稀疏线性解算器。
在cgal中，eigen在poisson曲面重建参考和三角化曲面网格参数化参考包中提供稀疏线性解算器。
此外，特征值分解还提供了奇异值分解，用于估计点采样曲面参考的局部微分性质，以及三角化曲面网格参考包上脊线和脐点的近似。
http://eigen.tuxfamily.org


###### Eigen3介绍
[Eigen3官网](http://eigen.tuxfamily.org/index.php?title=Main_Page)    维基百科截图![用于矩阵和线性代数运算的计算机编程库](https://img-blog.csdnimg.cn/20190929135015159.png)

###### 安装EIGEN
sudo apt-get install libeigen3-dev
这个我看了下以后我估计也用不到我就直接安装编译好的了.
自己编译去这里下载
http://eigen.tuxfamily.org/index.php?title=Main_Page  


###### CGAL  +  EIGEN
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190929140001747.png)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20190929135940157.png)

```cpp
find_package(Eigen3 REQUIRED)
include( ${EIGEN3_USE_FILE} )
```
