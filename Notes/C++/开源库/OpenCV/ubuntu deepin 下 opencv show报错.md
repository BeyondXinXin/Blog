编译opencv之前没有安装 libgtk2.0-dev

```bash
sudo aptinstall libgtk2.0-dev
cd "opencv_release_path"
cmake
make -j12
sudo make install
```
