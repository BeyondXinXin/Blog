# qt  排序

有一组 double 需要排序，每个double有一个序号（不连续） 
比如：
key ：5  ，value：10.0
key ：9  ，value：11.0
key ：15  ，value：9.0
key ：35  ，value：12.0
key ：25  ，value：8.0
key ：8  ，value：4.0
key ：66  ，value：5.0
想根据value的大小对key进行排序

```cpp
// 两个list对应

class SortCLass {
  public:
    SortCLass(double a, qint32 b): first(a), second(b) {}
    double first;
    qint32 second;
    bool operator < (const SortCLass &m)const {
        return first > m.first;
    }
};


void MatUtil::GetDotCurvatureSort(QList<double> value, QList<qint32> &serial_number) {
    vector<SortCLass> vect;
    for(int i = 0 ; i < value.count(); i++) {
        SortCLass my(value.at(i), serial_number.at(i));
        vect.push_back(my);
    }
    sort(vect.begin(), vect.end());
    serial_number.clear();
    for(qint32 i = 0 ; i < vect.size(); i ++) {
        serial_number << vect[i].second;
    }
}
```
