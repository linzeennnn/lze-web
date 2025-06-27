#ifndef CONTROL_WIN_H
#define CONTROL_WIN_H

#include <QWidget>
#include <QMainWindow>
#include <QStackedWidget>
#include <QJsonObject>
#include <QString>
class control_win : public QWidget
{
    Q_OBJECT
public:
    explicit control_win(QMainWindow *parent,QWidget *last,QStackedWidget*center);
    QWidget *last_page;
    void go_back();
    void  reload();
    QJsonObject con_config;
    QVector<QString> user_list;
    QStringList doc_list;
    QStringList pic_list;
    QStringList tra_list;
    QStringList mon_list;
    QStringList not_list;
    QStringList bok_list;
private:
    void init_control_config();
    QMainWindow* parent_widget;
    QStackedWidget*center;
signals:
};

class control_bar: public QWidget
{
    Q_OBJECT
public:
    explicit control_bar(control_win*parent,QStringList action_list,QString control_type);


};
class action_bar: public QWidget
{
    Q_OBJECT
public:
    explicit action_bar(control_win*parent,QStringList action_list,QString action_type,QString show_name);
};
class user_control_bar: public QWidget
{
    Q_OBJECT
public:
    explicit user_control_bar(control_win*parent,QString control,QString action,QString show_name);
private:
    QJsonArray get_action_user(control_win*parent,QString control,QString action);
};
#endif // CONTROL_WIN_H
