# Qt 析构机制

最近发现写的程序,结束后会出现异常关闭,了解下qt的析构机制
c++  谁new的谁delete是最基本的规范
qt则帮忙封装好了析构,一直认为qt随便new  析构自己解决,现在看来不是

qt只有qobject才会析构,其他的 比如最常见的qpixmap就不会自己析构需要手动析构
所以qt类下new了之后析构方法

继承qobject的 不用管或者  

    deleteLater

没有继承qobject的  

    delete

判断是否存在的

```javascript
      if (extrach_) {
            delete extrach_;
            extrach_ = nullptr;
        }
```

线程

```javascript
if (thread_extrach_->isRunning()) {
        thread_extrach_->quit();
        thread_extrach_->wait();
    }
    delete thread_extrach_;
    thread_extrach_ = nullptr;
```
