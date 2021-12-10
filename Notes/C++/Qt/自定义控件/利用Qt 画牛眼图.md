# 利用Qt 画牛眼图

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200213193714244.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200213193728894.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2ExNTAwNTc4NDMyMA==,size_16,color_FFFFFF,t_70#pic_center)

代码注释比较齐全，主要参考 [一去二三里的博客](https://me.csdn.net/u011012932)。
**:/Analysis/gradient.png**  就是画的这个渐变色条，我把它保存出来了。  
**ui_bulleyespatternwidget.h** 什么也没有，就是默认新建的
测试代码在最下边，自己关联下信号和槽



```cpp
#ifndef BULLEYESPATTERNWIDGET_H
#define BULLEYESPATTERNWIDGET_H

#include "stable.h"
/*!
 @brief BullEyesPatternWidget 类
 @details 牛眼图窗口
 @details current_value       含义 每块牛眼图具体数值     类型 QList<double>
 @details bg_color_start      含义 背景渐变起始色        类型 QColor
 @details bg_color_end        含义 背景渐变结束色        类型 QColor
 @details bar_color_start     含义 牛眼图色带起始色      类型 QColor
 @details bar_color_end       含义 牛眼图色带终止色      类型 QColor

        背景是否渐变带确定、牛眼图色带渐变色待确定。
        目前背景渐变取消
        目前色带渐变采用
            颜色   数值      rgb
            紫     1.0      128,0,255
            红     0.80     255,0,0
            橙     0.64     255,128,0
            黄     0.48     255,255,0
            绿     0.32     0,255,255
            青     0.16     0,128,255
            蓝     0.0      0,0,255
*/

namespace Ui {
    class BullEyesPatternWidget;
}

class BullEyesPatternWidget : public QWidget {
    Q_OBJECT

    Q_PROPERTY(QList<double> current_value READ GetCurrentValue WRITE SetCurrentValue)
    Q_PROPERTY(QColor bg_color_start READ GetBgColorStart WRITE SetBgColorStart)
    Q_PROPERTY(QColor bg_color_end READ GetBgColorEnd WRITE SetBgColorEnd)
    Q_PROPERTY(QColor bar_color_start READ GetBarColorStart WRITE SetBarColorStart)
    Q_PROPERTY(QColor bar_color_end READ GetBarColorEnd WRITE SetBarColorEnd)

  public:
    explicit BullEyesPatternWidget(QWidget *parent = nullptr);
    ~BullEyesPatternWidget();
  public :
    QColor GetBgColorStart()                const;
    QColor GetBgColorEnd()                  const;
    QColor GetBarColorStart()               const;
    QColor GetBarColorEnd()                 const;
    QList<double> GetCurrentValue()         const;
    QRgb GetGradient(const double value);

  public Q_SLOTS:
    void SetBgColorStart(const QColor &bg_color_start);
    void SetBgColorEnd(const QColor &bg_color_end);
    void SetBarColorStart(const QColor &bar_color_start);
    void SetBarColorEnd(const QColor &bar_color_end);
    void SetCurrentValue(const QList<double> &value);


  protected:
    /*!
     @brief paintEvent
     @details 万物皆可 paint！！！
     @details DrawBackground             画背景
     @details DrawBar                    画色带和标签
     @details DrawBullEyesPatternFrame   画牛眼图
    */
    void paintEvent(QPaintEvent *);
    void DrawBackground(QPainter *painter);
    void DrawBar(QPainter *painter);
    void DrawBullEyesPatternFrame(QPainter *painter);


    /*!
     @brief DrawGradientArc
     @details 画一个梯形环，颜色渐变。圆心位置通过painter->translate设置
     @details radius          半径
     @details startAngle      起始角度 水平为0度
     @details angleLength     顺时针扫描角度
     @details arcHeight       厚度
     @details color           颜色
    */
    void DrawGradientArc(QPainter *painter, qint32 radius, qint32 startAngle,
                         qint32 angleLength, qint32 arcHeight, QRgb color);
  private:
    /*!
     @brief Initial Initialization
     @details 初始值、初始化操作
    */
    void Initial();
    void Initialization();

  private:
    Ui::BullEyesPatternWidget *ui;
    QColor bg_color_start_;
    QColor bg_color_end_;
    QColor bar_color_start_;
    QColor bar_color_end_;
    QList<double> current_value_;

    /*!
     @brief gradient_
     @details 色带查找图片（尺寸 715*24）
    */
    QImage gradient_;


};


#endif // BULLEYESPATTERNWIDGET_H

```


```cpp
#include "bulleyespatternwidget.h"
#include "ui_bulleyespatternwidget.h"

BullEyesPatternWidget::BullEyesPatternWidget(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::BullEyesPatternWidget) {
    ui->setupUi(this);
    this->Initial();
    this->Initialization();
}

BullEyesPatternWidget::~BullEyesPatternWidget() {
    delete ui;
}

QColor BullEyesPatternWidget::GetBgColorStart() const {
    return this->bg_color_start_;
}

QColor BullEyesPatternWidget::GetBgColorEnd() const {
    return  this->bg_color_end_;
}

QColor BullEyesPatternWidget::GetBarColorStart() const {
    return this->bar_color_start_;
}

QColor BullEyesPatternWidget::GetBarColorEnd() const {
    return  this->bar_color_end_;
}

QList<double> BullEyesPatternWidget::GetCurrentValue() const {
    return this->current_value_;
}

QRgb BullEyesPatternWidget::GetGradient(const double value) {
    /*!
     @details   根据牛眼图中每块的数值（0-1），去色带查找具体颜色
    */
    QRgb color = this->gradient_.pixel(15, 715 - static_cast<qint32>(value * 715));
    return  color;
}


void BullEyesPatternWidget::SetBgColorStart(const QColor &bg_color_start) {
    this->bg_color_start_ = bg_color_start;
}

void BullEyesPatternWidget::SetBgColorEnd(const QColor &bg_color_end) {
    this->bg_color_end_ = bg_color_end;
}

void BullEyesPatternWidget::SetBarColorStart(const QColor &bar_color_start) {
    this->bar_color_start_ = bar_color_start;
}

void BullEyesPatternWidget::SetBarColorEnd(const QColor &bar_color_end) {
    this->bar_color_end_ = bar_color_end;
}

void BullEyesPatternWidget::SetCurrentValue(const QList<double> &value) {
    this->current_value_ = value;
    this->update();
}

void BullEyesPatternWidget::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    /*!
     @details   设置反锯齿效果
    */
    painter.setRenderHints(QPainter::Antialiasing | QPainter::TextAntialiasing);
    this->DrawBackground(&painter);
    this->DrawBar(&painter);
    this->DrawBullEyesPatternFrame(&painter);
}

void BullEyesPatternWidget::DrawBackground(QPainter *painter) {
    painter->save();
    painter->setPen(Qt::NoPen);
    QLinearGradient bgGradient(QPointF(0, 0), QPointF(0, height()));
    bgGradient.setColorAt(0.0, bg_color_start_);
    bgGradient.setColorAt(1.0, bg_color_end_);
    painter->setBrush(bgGradient);
    painter->drawRect(rect());
    painter->restore();
}

void BullEyesPatternWidget::DrawBar(QPainter *painter) {
    /*!
     @details   根据widget宽计算色带大小
    */
    painter->save();
    painter->setPen(Qt::NoPen);
    QLinearGradient color_gradient(QPointF(width() / 8, height() / 10),
                                   QPointF(width() / 8, 9 * height() / 10));
    QRectF bar_rect(QPointF(width() / 8, height() / 10),
                    QPointF(20 + width() / 8, 9 * height() / 10));
    color_gradient.setColorAt(0.0,  qRgb(128, 0, 255));
    color_gradient.setColorAt(0.16, qRgb(255, 0, 0));
    color_gradient.setColorAt(0.32, qRgb(255, 128, 0));
    color_gradient.setColorAt(0.48, qRgb(255, 255, 0));
    color_gradient.setColorAt(0.64, qRgb(0, 255, 255));
    color_gradient.setColorAt(0.80, qRgb(0, 128, 255));
    color_gradient.setColorAt(1.0,  qRgb(0, 0, 255));
    painter->setBrush(color_gradient);
    painter->drawRect(bar_rect);

    /*!
     @details   根据widget宽计算文字大小和位置
    */
    QFont f(font());
    f.setPixelSize( static_cast<qint32>((width() / 10) * 0.25));
    painter->setFont(f);
    painter->setPen(Qt::white);
    painter->drawText(width() / 18, 9 * height() / 10, "    0%");
    painter->drawText(width() / 18, 5 * height() / 10, "   50%");
    painter->drawText(width() / 18, 1 * height() / 10 + 12, "100%");
    painter->drawText(-f.pixelSize() * 20 + 18 * width() / 20, 19 * height() / 20,
                      "percent wall thickening (ED vs ES)");

    painter->restore();
}

void BullEyesPatternWidget::DrawBullEyesPatternFrame(QPainter *painter) {
    painter->save();
    /*!
     @details   根据widget宽计算牛眼图尺寸
    */
    qint32 arc_height = width() / 16;
    qint32 radius_4 = 4 * arc_height;
    qint32 radius_3 = 3 * arc_height;
    qint32 radius_2 = 2 * arc_height;
    qint32 radius_1 = arc_height;

    /*!
     @details 设计圆心以及画牛眼图
    */
    painter->translate((width() >> 1) * 1.2, height() >> 1);

    DrawGradientArc(painter, radius_4, 0,  60, arc_height,
                    GetGradient(current_value_[0]));
    DrawGradientArc(painter, radius_4, 60,  60, arc_height,
                    GetGradient(current_value_[1]));
    DrawGradientArc(painter, radius_4, 120,  60, arc_height,
                    GetGradient(current_value_[2]));
    DrawGradientArc(painter, radius_4, 180,  60, arc_height,
                    GetGradient(current_value_[3]));
    DrawGradientArc(painter, radius_4, 240,  60, arc_height,
                    GetGradient(current_value_[4]));
    DrawGradientArc(painter, radius_4, 300,  60, arc_height,
                    GetGradient(current_value_[5]));
    DrawGradientArc(painter, radius_3, 0,  60, arc_height,
                    GetGradient(current_value_[6]));
    DrawGradientArc(painter, radius_3, 60,  60, arc_height,
                    GetGradient(current_value_[7]));
    DrawGradientArc(painter, radius_3, 120,  60, arc_height,
                    GetGradient(current_value_[8]));
    DrawGradientArc(painter, radius_3, 180,  60, arc_height,
                    GetGradient(current_value_[9]));
    DrawGradientArc(painter, radius_3, 240,  60, arc_height,
                    GetGradient(current_value_[10]));
    DrawGradientArc(painter, radius_3, 300,  60, arc_height,
                    GetGradient(current_value_[11]));
    DrawGradientArc(painter, radius_2, 45,  90, arc_height,
                    GetGradient(current_value_[12]));
    DrawGradientArc(painter, radius_2, 135,  90, arc_height,
                    GetGradient(current_value_[13]));
    DrawGradientArc(painter, radius_2, 225,  90, arc_height,
                    GetGradient(current_value_[14]));
    DrawGradientArc(painter, radius_2, 315,  90, arc_height,
                    GetGradient(current_value_[15]));
    DrawGradientArc(painter, radius_1, 0,  360, arc_height,
                    GetGradient(current_value_[16]));

    painter->restore();
}

void BullEyesPatternWidget::DrawGradientArc(
    QPainter *painter,
    qint32 radius,
    qint32 startAngle,
    qint32 angleLength,
    qint32 arcHeight,
    QRgb color) {

    /*!
     @details 梯形环计算
    */
    painter->save();
    QRadialGradient gradient(0, 0, radius);
    gradient.setColorAt(0, Qt::white);
    gradient.setColorAt(1, color);
    painter->setBrush(gradient);
    QRectF rect(-radius, -radius, radius << 1, radius << 1);
    QPainterPath path;
    path.arcTo(rect, startAngle, angleLength);
    QPainterPath subPath;
    subPath.addEllipse(rect.adjusted(arcHeight, arcHeight, -arcHeight, -arcHeight));
    path -= subPath;
    painter->setPen(Qt::NoPen);
    painter->drawPath(path);
    painter->restore();
}

void BullEyesPatternWidget::Initial() {
    bg_color_start_ = QColor(53, 53, 53);
    bg_color_end_ = QColor(53, 53, 53);
    bar_color_start_ = QColor(255, 0, 0);
    bar_color_end_ = QColor(0, 0, 255);
    current_value_ << 0.01 << 0.01 << 0.01 << 0.01 << 0.01 << 0.01
                   << 0.01 << 0.01 << 0.01 << 0.01 << 0.01 << 0.01
                   << 0.01 << 0.01 << 0.01 << 0.01 << 0.01;
    gradient_.load(":/Analysis/gradient.png");
}

void BullEyesPatternWidget::Initialization() {

}

```

测试

```cpp
void LVWindow::on_pushButton_3_clicked() {
    QList<double> value;
    value << 0.06 << 0.12 << 0.18 << 0.24 << 0.29 << 0.35
          << 0.41 << 0.47 << 0.53 << 0.59 << 0.65 << 0.71
          << 0.76 << 0.82 << 0.88 << 0.94 << 1.00;
    emit SignalSetBullEyesPatternValue(value);
}

void LVWindow::on_pushButton_clicked() {
    QList<double> value;
    value << 0.76 << 0.82 << 0.88 << 0.94 << 1.00 << 0.06
          << 0.12 << 0.18 << 0.24 << 0.29 << 0.35
          << 0.41 << 0.47 << 0.53 << 0.59 << 0.65 << 0.71;
    emit SignalSetBullEyesPatternValue(value);
}

void LVWindow::on_pushButton_4_clicked() {
    QList<double> value;
    value << 0.41 << 0.47 << 0.53 << 0.59 << 0.65 << 0.71
          << 0.06 << 0.12 << 0.18 << 0.24 << 0.29 << 0.35
          << 0.76 << 0.82 << 0.88 << 0.94 << 1.00;
    emit SignalSetBullEyesPatternValue(value);
}
```
