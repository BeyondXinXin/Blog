# QT自定义属性Q_PROPERTY
Q_PROPERTY  继承于 QObject  相当于自定义了一个控件

他的优势就是注册之后的类转为qt元属性，可以在designer看到和修改，并且方便注册到qml中。
当然了如果你想qlabel，qbtn这些常用的类也有这个属性，并且可以在designer修改，那需要自己全部重定义，让后每个类前边注册Q_PROPERTY和READ  WRITE两个函数。

具体方法  

```javascript
//类前边加（直接放在Q_OBJECT后即可）

Q_OBJECT

Q_PROPERTY(bool canMove READ canMove )  
Q_PROPERTY(bool canMove READ canMove WRITE setcanMove )   
Q_PROPERTY(bool canMove READ canMove WRITE setcanMove USER true) 
Q_PROPERTY(QCursor cursor READ cursor WRITE setCursor RESET unsetCursor)  
```
**这个也可以注册用已有的属性**
```javascript
Q_PROPERTY(type name READ getFunction [WRITE setFunction] [RESET resetFunction] [NOTIFY notifySignal] [DESIGNABLE bool] [SCRIPTABLE bool] [STORED bool] [USER bool] [CONSTANT] [FINAL])  
```
type   类型
name  自定义属性名字
READ 读取实现函数
WRITE 写入实现函数
RESET  复位函数，把设置还原
NOTIFY （参数改变时）发送信号
STODE 一直存在的
DESIGNABLE  designer用（或者designer里设置也可以）
USER  是否可以被用户编辑
CONST 是否可以修改（不能修改的话，WRITE 就不能有）
FINAL 不能被重写


**如果你注册的上边的函数，记得实现**
```javascript
public:   
    void setcanMove(bool e) { enabled = e; update();}    
    bool canMove() const { return enabled; }
```

-------------------------------------------------------------------------------------------------------------------
估计一般大家使用widget写的话的话，完全不用这么多功能，qml的需要方便注册属性。
** 其实自定义属性不用注册也可以直接用**

```javascript
bool QObject::setProperty(const char *name, const QVariant &value)
QVariant QObject::property(const char *name) const
```
setProperty直接添加属性就可以了，property用来读取属性


```javascript
//声明一个自定义属性my_canMove
  ui->pushButton->setProperty("my_canMove",0);//不可以任意拖动
  ui->pushButton_2->setProperty("my_canMove",1);//可以任意拖动
```

```javascript
//属性判断
qApp->installEventFilter(this);

bool AppInit::eventFilter(QObject *obj, QEvent *evt)
{
    QWidget *w = static_cast<QWidget *> (obj);    
    if (!w->property("my_canMove").toBool()) {
        return QObject::eventFilter(obj, evt);
    } 
    /*属性实现*/
    return QObject::eventFilter(obj, evt);
}

```
