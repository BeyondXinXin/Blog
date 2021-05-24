# QT 任意拖拽窗口（帮助、关于）

一般程序经常需要弹出一个帮助窗口，展示程序的信息比如帮助、关于等。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190807101634542.gif)
有多种办法来实现，我这里给出我常用的两种：
一种是定义自定义属性，这样所有空间界面都可以任意定义是否可以拖拽，当有大量空间需要移动时候，可以用这种
https://blog.csdn.net/a15005784320/article/details/98589674



另一种就是新建一个可以支持任意拖动的类，如果主界面本身是固定的，只有几个窗口支持拖拽，可以这样用

```javascript
//自定义子界面
class QUICustomWindow : public QDialog
{
    Q_OBJECT

public:
    QUICustomWindow(QWidget *parent = 0);
    ~QUICustomWindow();
protected:
    virtual void mousePressEvent(QMouseEvent *event);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void mouseReleaseEvent(QMouseEvent *event);

private:
    bool        mMoveing;
    QPoint      mMovePosition;
};
```

```javascript
QUICustomWindow::QUICustomWindow(QWidget *parent)
{
    mMoveing = false;
    //Qt::FramelessWindowHint 无边框
    //Qt::WindowStaysOnTopHint 窗口在最顶端，不会拖到任务栏下面
    setWindowFlags(Qt::FramelessWindowHint | Qt::WindowMinimizeButtonHint | Qt::WindowStaysOnTopHint);
}
QUICustomWindow::~QUICustomWindow()
{
}
//重写鼠标按下事件
void QUICustomWindow::mousePressEvent(QMouseEvent *event)
{
    mMoveing = true;
    //记录下鼠标相对于窗口的位置
    //event->globalPos()鼠标按下时，鼠标相对于整个屏幕位置
    //pos() this->pos()鼠标按下时，窗口相对于整个屏幕位置
    mMovePosition = event->globalPos() - pos();
    return QDialog::mousePressEvent(event);
}
//重写鼠标移动事件
void QUICustomWindow::mouseMoveEvent(QMouseEvent *event)
{
    //(event->buttons() && Qt::LeftButton)按下是左键
    //鼠标移动事件需要移动窗口，窗口移动到哪里呢？就是要获取鼠标移动中，窗口在整个屏幕的坐标，然后move到这个坐标，怎么获取坐标？
    //通过事件event->globalPos()知道鼠标坐标，鼠标坐标减去鼠标相对于窗口位置，就是窗口在整个屏幕的坐标
    if (mMoveing && (event->buttons() && Qt::LeftButton)
        && (event->globalPos() - mMovePosition).manhattanLength() > QApplication::startDragDistance())
    {
        move(event->globalPos() - mMovePosition);
        mMovePosition = event->globalPos() - pos();
    }
    return QDialog::mouseMoveEvent(event);
}
void QUICustomWindow::mouseReleaseEvent(QMouseEvent *event)
{
    mMoveing = false;
}

```
使用方法也很简单，new一下就可以了
```javascript
void MainWindow::on_About_triggered()
{
    QUICustomWindow *helpWin = new QUICustomWindow();
    helpWin->resize(600, 400);
    QLabel *label_about = new QLabel(helpWin);
    label_about->setText(tr("相机位置调整 1.0 版"));
    QLabel *label_right = new QLabel(helpWin);
    label_right->setText(tr("Copyright (C) 2019  杭州 ATR"));
    QLabel *label_author = new QLabel(helpWin);
    label_author->setText(tr("作者：Beyond欣	  https://blog.csdn.net/a15005784320/"));
    QPushButton *button_ok = new QPushButton(helpWin);
    button_ok->setText(tr("确定"));
    connect(button_ok, SIGNAL(clicked()), helpWin, SLOT(close()));
    label_about->move(100, 100);
    label_right->move(100, 180);
    label_author->move(100, 260);
    button_ok->move(400, 180);
    helpWin->exec();
}

```
