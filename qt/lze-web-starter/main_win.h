#ifndef MAIN_WIN_H
#define MAIN_WIN_H

#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>
#include <QMainWindow>
#include<QStackedWidget>

class main_win : public QWidget
{
    Q_OBJECT
public:
    explicit main_win(QMainWindow *parent = nullptr,QStackedWidget*center= nullptr);
private slots:
    void to_userconfig();
    void to_pathconfig();
    void to_workconfig();
    void to_controlconfig();
private:
    QVBoxLayout *btn_layout;
    QPushButton *user_btn;
    QPushButton *path_btn;
    QPushButton *work_btn;
    QPushButton *control_btn;
    QMainWindow* parent_widget;
    QStackedWidget* center;

signals:
};

#endif // MAIN_WIN_H
