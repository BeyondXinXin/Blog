# QtCreator利用cmake组织项目列表



之前纠结过**Qt creator**项目结构树的问题，今天才认识到**cmaek**有**source_group**，又增加了新知识。


* 之前困惑写的博客：[Qt creator 项目结构树Header Files、Source Files](https://blog.csdn.net/a15005784320/article/details/105925291?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522162677505316780261941354%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=162677505316780261941354&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-3-105925291.pc_v2_rank_blog_default&utm_term=QtCreator&spm=1018.2226.3001.4450)
* **source_group** 介绍：[source_group](https://cmake.org/cmake/help/latest/command/source_group.html)




## 使用和效果

不同版本的**Qt creator**管理camke项目，如果不分组则会使用不同的分组。设置了**source_group**则一致。



```cmake
project(CmakeSourceGroup)

file(GLOB_RECURSE SOURCES "*.cpp" "*.cxx" "*.cc")
file(GLOB_RECURSE HEADERS "*.h")
file(GLOB_RECURSE RESOURCES "*.qrc")
file(GLOB_RECURSE FORMS *.ui)

set(SRCS ${SOURCES} ${HEADERS} ${RESOURCES} ${FORMS})

# 图一

# 图二
# source_group("" FILES ${SRCS})
# 图三
# source_group("SOURCES" FILES ${SRCS})
# 图四
# source_group(TREE ${CMAKE_SOURCE_DIR} ${SRCS})

if(WIN32)
  set(exec_flag WIN32)
elseif(MACOS)
  set(exec_flag MACOSX_BUNDLE)
else()
  set(exec_flag)
endif()

add_executable(${PROJECT_NAME} ${exec_flag} ${SRCS})

target_link_libraries(${PROJECT_NAME} Qt5::Gui Qt5::Widgets)

```









![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.24ugl1hb5fpc.png)


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.77d28jedkqg0.png)

![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.2879xpnxeh1c.png)


![xxx](https://raw.githubusercontent.com/BeyondXinXin/BeyondXinXIn/main/PixX/xxx.44sunt0z03c0.png)



项目  [https://github.com/BeyondXinXin/study_qt](https://github.com/BeyondXinXin/study_qt)