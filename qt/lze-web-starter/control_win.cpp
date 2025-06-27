#include "control_win.h"
#include"util.h"
#include<QVBoxLayout>
#include<QLabel>
#include<QPushButton>
#include<QDialog>
#include <QScrollArea>
#include<QComboBox>
#include <QJsonArray>
#include<QMessageBox>

control_win::control_win(QMainWindow *parent,QWidget *last,QStackedWidget*center)
    : QWidget{parent}
{

    this->last_page=last;
    this->parent_widget=parent;
    this->center=center;
    init_control_config();

    control_bar*doc_bar=new control_bar(this,this->doc_list,"doc");
    control_bar*pic_bar=new control_bar(this,this->pic_list,"pic");
    control_bar*tra_bar=new control_bar(this,this->tra_list,"tra");
    control_bar*mon_bar=new control_bar(this,this->mon_list,"mon");
    control_bar*not_bar=new control_bar(this,this->not_list,"not");
    control_bar*bok_bar=new control_bar(this,this->bok_list,"bok");
    QPushButton *back=new QPushButton("返回",this);
    back->setObjectName("btn");
    back->setFixedSize(100,60);
    QVBoxLayout *con_bar_layout=new  QVBoxLayout(this);
    con_bar_layout->addWidget(doc_bar);
    con_bar_layout->addWidget(pic_bar);
    con_bar_layout->addWidget(tra_bar);
    con_bar_layout->addWidget(mon_bar);
    con_bar_layout->addWidget(not_bar);
    con_bar_layout->addWidget(bok_bar);
    con_bar_layout->addWidget(back,0,Qt::AlignHCenter);

    connect(back,&QPushButton::clicked,this,&control_win::go_back);

}
void control_win::init_control_config(){
    int i;
    QString config_path=concat_path(get_work_dir(),"config/user_config.json");
    QJsonObject main_config=json_to_obj(read_text(config_path));
    QJsonObject user_config=main_config["user"].toObject();
    this->con_config=main_config["control"].toObject();
    for (auto it = user_config.begin(); it != user_config.end(); ++it) {
        this->user_list.append(it.key());
    }
    for (auto it = this->con_config.begin(); it != this->con_config.end(); ++it) {
        QString name= it.key();
         QJsonObject control_ojb=con_config[name].toObject();
        QJsonObject action_ojb=control_ojb["action"].toObject();
         for (auto ita = action_ojb.begin(); ita != action_ojb.end(); ++ita){
            if(name=="doc")
                this->doc_list.append(ita.key());
            if(name=="pic")
                this->pic_list.append(ita.key());
            if(name=="tra")
                this->tra_list.append(ita.key());
            if(name=="mon")
                this->mon_list.append(ita.key());
            if(name=="not")
                this->not_list.append(ita.key());
            if(name=="bok")
                this->bok_list.append(ita.key());
         }
    }
}
void  control_win::reload(){
    control_win *control_widget=new control_win(this->parent_widget,this->last_page,this->center);
    control_widget->show();
    this->center->addWidget(control_widget);
    this->center->setCurrentWidget(control_widget);
    this->center->removeWidget(this);

}
void control_win::go_back(){
    this->last_page->show();
    this->center->setCurrentWidget(this->last_page);
    this->center->removeWidget(this);
}
control_bar::control_bar(control_win*parent,QStringList action_list,QString control_type): QWidget{parent}{
    QVBoxLayout *con_bar_layout=new  QVBoxLayout(this);
    QJsonObject con=parent->con_config[control_type].toObject();
    QString title=con["name"].toString();
    QLabel *titleLabel = new QLabel(title, this);
    titleLabel->setStyleSheet(" padding: 2px; background-color: #e1869b;");
    QPushButton *change = new QPushButton("更改["+title+"]授权用户", this);
    change->setFixedSize(200,60);
    connect(change, &QPushButton::clicked, this, [=]() {
        action_bar* change_win=new action_bar(parent,action_list,control_type,title);

    });
    con_bar_layout->addWidget(titleLabel);
    con_bar_layout->addWidget(change,0,Qt::AlignHCenter);

}
action_bar::action_bar(control_win*parent,QStringList action_list,QString control_type,QString show_name): QWidget{parent}{
    QDialog *dialog = new QDialog(this);
    dialog->setWindowTitle(show_name);
    dialog->resize(600, 400);
    QScrollArea *scrollArea = new QScrollArea(dialog);
    scrollArea->setWidgetResizable(true);
    QWidget *container = new QWidget;
    QVBoxLayout *scroll_layout = new QVBoxLayout(container);
    for (const QString &action_name : action_list) {
        QWidget *action_box = new QWidget(container);
        QVBoxLayout *item_layout = new QVBoxLayout(action_box);
        QString action_show_name=parent->con_config[control_type].toObject()["action"].
                                   toObject()[action_name].toObject()["name"].toString();
        QLabel *titleLabel = new QLabel(action_show_name, action_box);
        QPushButton *change = new QPushButton("更改授权用户", action_box);
        connect(change, &QPushButton::clicked, this, [=]() {
            user_control_bar * user_widget=new user_control_bar(parent,control_type,action_name,action_show_name);
            user_widget->show();
        });
        item_layout->addWidget(titleLabel);
        item_layout->addWidget(change);
        action_box->setLayout(item_layout);
        scroll_layout->addWidget(action_box);
    }
    container->setLayout(scroll_layout);
    scrollArea->setWidget(container);
    QVBoxLayout *mainLayout = new QVBoxLayout(dialog);
    mainLayout->addWidget(scrollArea);
    dialog->setLayout(mainLayout);

    dialog->exec();
}
user_control_bar::user_control_bar(control_win*parent,QString control,QString action,QString show_name) : QWidget{parent}{

    QDialog *dialog = new QDialog(parent);
    dialog->setWindowTitle(show_name);
    dialog->resize(600, 400);
    QVBoxLayout * user_bar_layout=new QVBoxLayout(dialog);
    QWidget *add_user_box=new QWidget(dialog);
    QHBoxLayout * add_layout=new QHBoxLayout(add_user_box);
    QLabel *titleLabel = new QLabel("添加授权用户:", add_user_box);
    QComboBox *user_list_box = new QComboBox(add_user_box);
    QPushButton *add=new QPushButton("添加",add_user_box);
    for (const QString &username : parent->user_list) {
        user_list_box->addItem(username);
    }
    add_layout->addWidget(titleLabel);
    add_layout->addWidget(user_list_box);
    add_layout->addWidget(add);



    QWidget *remove_user_box=new QWidget(dialog);
    QHBoxLayout * remove_layout=new QHBoxLayout(remove_user_box);
    QLabel *remove_title = new QLabel("移除授权用户:", remove_user_box);
    QComboBox *action_user_list_box = new QComboBox(remove_user_box);
    QPushButton *remove=new QPushButton("移除",remove_user_box);
    const QJsonArray &act_user_list=get_action_user(parent,control,action);

    for (const QJsonValue &val : act_user_list) {
        if (val.isString()) {
            action_user_list_box->addItem(val.toString());
        }
    }
    remove_layout->addWidget(remove_title);
    remove_layout->addWidget(action_user_list_box);
    remove_layout->addWidget(remove);

    connect(add, &QPushButton::clicked, this, [=]() {
        QString add_name=user_list_box->currentText();
        for (const QJsonValue &val : act_user_list) {
                if(add_name==val.toString()){
                    QMessageBox::warning(this, "警告", "用户已存在");
                    return;
                }
        }
        add_action_user(parent->con_config,control,action,add_name);
        QString config_path=concat_path(get_work_dir(),"config/user_config.json");
        QJsonObject config_all=json_to_obj(read_text(config_path));
        config_all["control"]=parent->con_config;
        write_text(config_path,obj_to_json(config_all));
        QMessageBox::warning(this, "提示", "用户添加成功");
        dialog->close();
        parent->reload();
    });
    connect(remove, &QPushButton::clicked, this, [=]() {
        QString remove_name=action_user_list_box->currentText();
        remove_action_user(parent->con_config,control,action,remove_name);
        QString config_path=concat_path(get_work_dir(),"config/user_config.json");
        QJsonObject config_all=json_to_obj(read_text(config_path));
        config_all["control"]=parent->con_config;
        write_text(config_path,obj_to_json(config_all));
        QMessageBox::warning(this, "提示", "用户移除成功");
        dialog->close();
        parent->reload();
    });
    user_bar_layout->addWidget(add_user_box);
    user_bar_layout->addWidget(remove_user_box);
    dialog->exec();
}
QJsonArray user_control_bar::get_action_user(control_win*parent,QString control,QString action){
    QJsonObject con_con=parent->con_config[control].toObject();
    QJsonObject act_con=con_con["action"].toObject()[action].toObject();
    const QJsonArray &act_list = act_con["user"].toArray();

    return act_list;
}
