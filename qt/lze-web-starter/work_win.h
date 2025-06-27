#ifndef WORK_WIN_H
#define WORK_WIN_H

#include <QWidget>
#include <QMainWindow>
#include <QStackedWidget>
#include <QString>
#include<QJsonObject>

class work_win : public QWidget
{
    Q_OBJECT
public:
    explicit work_win(QMainWindow *parent = nullptr,QWidget *last = nullptr,QStackedWidget*center= nullptr);
    long max_size;
    long port;
    QJsonObject work_config;
    QString tmp_size;
    QString tmp_port;


private:
    void init_work_config();
    int set_work_config();
    void go_back();
    QWidget *last_page;
    QMainWindow* parent_widget;
    QStackedWidget*center;
signals:
};
#endif // WORK_WIN_H
