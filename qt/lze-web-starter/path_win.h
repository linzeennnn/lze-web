#ifndef PATH_WIN_H
#define PATH_WIN_H
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QWidget>
#include <QVBoxLayout>
#include <QLabel>
#include <QString>
#include<QMainWindow>
#include<QStackedWidget>
#include <QLineEdit>
class path_win : public QWidget
{
    Q_OBJECT
public:
    explicit path_win(QMainWindow *parent = nullptr,QWidget *last = nullptr,QStackedWidget*center= nullptr);
    QWidget *last_page;
    QJsonObject path_config;
    QString file_path;
    QString doc_path;
    QString pic_path;
    QString tra_path;
    QString not_path;
    QString bok_path;
    QString tmp_path;
    void go_back();
    void set_path(QString path,QString type);

private:
    void init_work_config();
    QMainWindow* parent_widget;
    QStackedWidget*center;


signals:
};
class select_bar : public QWidget {
    Q_OBJECT
public:
    explicit select_bar(QWidget *parent = nullptr, QString title = nullptr, QString type = nullptr, QString ori_path = nullptr);

private:
    QVBoxLayout *path_layout;
    QLineEdit *pathLabel;  // 改为 QLineEdit

protected:
    bool eventFilter(QObject* obj, QEvent* event) override;
};

#endif // PATH_WIN_H
