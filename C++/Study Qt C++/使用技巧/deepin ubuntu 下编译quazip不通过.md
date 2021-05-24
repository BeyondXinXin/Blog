# deepin ubuntu 下编译quazip不通过

quazaip以前好好的，程序从ubuntu搬到deepin莫名其妙报了十几个错误，纠结了好几天
原因。。。。很尴尬cmake版本太低，从cmake9升级到cmake12直接就好了，无语。
MakeFiles/quazip5.dir/quazip5_autogen/mocs_compilation.cpp.o: In function `Q
multiple definition of `QuaZipFile::qt_metacall(QMetaObject::Call, int, void