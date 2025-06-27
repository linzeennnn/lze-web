#ifndef USER_WIN_H
#define USER_WIN_H
#include <QLabel>
#include <QString>
#include<QMainWindow>
#include<QStackedWidget>
#include <QWidget>
#include <QJsonObject>
#include <QJsonDocument>
#include <QHBoxLayout>
#include <QVector>
class user_bar: public QWidget{
     Q_OBJECT
public:
    user_bar(QString name,QString password,QString time,QWidget *parent);
    QString name;
    QString password;
    QString time;
};
class user_mes{
public:
    user_mes(QString name,QString password,QString time);
    QString name;
    QString password;
    QString time;
};
class user_win : public QWidget
{
    Q_OBJECT
public:
    explicit user_win(QMainWindow *parent = nullptr,QWidget *last = nullptr,QStackedWidget*center= nullptr);
    QVector<user_mes> user_list;
    QWidget *last_page;
    void remove_user(QString username);
    void edit_user(QString name,QString pasdword,QString time);
private:
    void init_user_config();
    void remove_control_user(QJsonObject &control,QString username);
    void replace_control_user(QJsonObject &control,QString oldname,QString newname);
    void go_back();
    void new_user();
    void  reload();
    QMainWindow* parent_widget;
    QStackedWidget*center;
signals:
};
#endif // USER_WIN_H
