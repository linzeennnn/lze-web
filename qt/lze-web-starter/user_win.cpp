#include "user_win.h"
#include <QJsonObject>
#include <QJsonDocument>
#include <QHBoxLayout>
#include<QPushButton>
#include<QDialog>
#include<QLineEdit>
#include<QJsonArray>
#include<QMessageBox>
#include<QComboBox>
#include<QScrollArea>
#include"util.h"
user_win::user_win(QMainWindow *parent, QWidget *last, QStackedWidget *center)
    : QWidget{parent}
{
    init_user_config();
    this->parent_widget = parent;
    this->last_page = last;
    this->center = center;
    QString btn_style = "QPushButton {"
                                      "color: #6b6b6b;"
                                      "font-size: 18px;"
                                      "border-radius: 15px;"
                                      "padding: 10px;"
                                      "}";
    QVBoxLayout *main_layout = new QVBoxLayout(this);
    QScrollArea *scroll_area = new QScrollArea(this);
    scroll_area->setWidgetResizable(true);
    QWidget *scroll_content = new QWidget();
    QVBoxLayout *scroll_layout = new QVBoxLayout(scroll_content);
    for (user_mes &user_item : this->user_list) {
        user_bar *user_info = new user_bar(user_item.name, user_item.password, user_item.time, scroll_content);
        scroll_layout->addWidget(user_info);
    }

    scroll_content->setLayout(scroll_layout);
    scroll_area->setWidget(scroll_content);
    main_layout->addWidget(scroll_area);
    QWidget *foot_box = new QWidget(this);
    QHBoxLayout *foot_layout = new QHBoxLayout(foot_box);

    QPushButton *back = new QPushButton("<返回", foot_box);
    QPushButton *add = new QPushButton("添加用户+", foot_box);
    back->setObjectName("btn");
    add->setObjectName("btn");

    back->setStyleSheet(btn_style);
    add->setStyleSheet(btn_style);
    back->setFixedSize(120, 50);
    add->setFixedSize(120, 50);

    connect(back, &QPushButton::clicked, this, &user_win::go_back);
    connect(add, &QPushButton::clicked, this, &user_win::new_user);

    foot_layout->addWidget(back);
    foot_layout->addWidget(add);
    foot_box->setLayout(foot_layout);

    main_layout->addWidget(foot_box);
}

void user_win::remove_control_user(QJsonObject &control,QString username){
    for (auto moduleIt = control.begin(); moduleIt != control.end(); ++moduleIt) {
        QJsonObject moduleObj = moduleIt.value().toObject();

        if (!moduleObj.contains("action") || !moduleObj["action"].isObject())
            continue;

        QJsonObject actionObj = moduleObj["action"].toObject();

        for (auto actionIt = actionObj.begin(); actionIt != actionObj.end(); ++actionIt) {
            QJsonObject actionDetail = actionIt.value().toObject();

            if (!actionDetail.contains("user") || !actionDetail["user"].isArray())
                continue;

            QJsonArray userArray = actionDetail["user"].toArray();
            QJsonArray newUserArray;

            for (const QJsonValue &val : userArray) {
                if (val.toString() != username) {
                    newUserArray.append(val);
                }
            }

            actionDetail["user"] = newUserArray;
            actionObj[actionIt.key()] = actionDetail;
        }

        moduleObj["action"] = actionObj;
        control[moduleIt.key()] = moduleObj;
    }
}
void user_win::replace_control_user(QJsonObject &control,QString oldname,QString newname){
    for (auto moduleIt = control.begin(); moduleIt != control.end(); ++moduleIt) {
        QJsonObject moduleObj = moduleIt.value().toObject();

        if (!moduleObj.contains("action") || !moduleObj["action"].isObject())
            continue;

        QJsonObject actionObj = moduleObj["action"].toObject();

        for (auto actionIt = actionObj.begin(); actionIt != actionObj.end(); ++actionIt) {
            QJsonObject actionDetail = actionIt.value().toObject();

            if (!actionDetail.contains("user") || !actionDetail["user"].isArray())
                continue;

            QJsonArray userArray = actionDetail["user"].toArray();
            QJsonArray newUserArray;

            for (const QJsonValue &val : userArray) {
                if (val.toString() != oldname) {
                    newUserArray.append(val);
                }
            }
            newUserArray.append(newname);
            actionDetail["user"] = newUserArray;
            actionObj[actionIt.key()] = actionDetail;
        }

        moduleObj["action"] = actionObj;
        control[moduleIt.key()] = moduleObj;
    }
}
void user_win::init_user_config(){
    QString user_config_path=concat_path(get_work_dir(),"config/user_config.json");
    QJsonObject user_config_all=json_to_obj(read_text(user_config_path));
    QJsonObject user_config=user_config_all["user"].toObject();
    for (auto it = user_config.begin(); it != user_config.end(); ++it) {
       QString name= it.key();
        QJsonObject user_obj=it.value().toObject();
       QString password=user_obj["password"].toString();
        QString time=user_obj["tokentime"].toString();
       this->user_list.append(user_mes(name,password,time));
    }
}
void user_win::go_back(){
    this->hide();
    this->center->setCurrentWidget(this->last_page);
    this->center->removeWidget(this);
}
void user_win::new_user(){
    QDialog *dialog = new QDialog(this);
    dialog->setWindowTitle("新用户信息");
    dialog->resize(300, 200);
    QLineEdit *name_input = new QLineEdit(dialog);
    name_input->setPlaceholderText("用户名");
    QLineEdit *pas_input = new QLineEdit(dialog);
    pas_input->setEchoMode(QLineEdit::Password);
    pas_input->setPlaceholderText("密码");
    QWidget*foot_box=new QWidget(dialog);
    QHBoxLayout * foot_layout= new QHBoxLayout(foot_box);
    QPushButton *cancel=new QPushButton("取消",foot_box);
    QPushButton *comfirm=new QPushButton("确定",foot_box);
    connect(cancel, &QPushButton::clicked, dialog, &QDialog::reject);
    connect(comfirm, &QPushButton::clicked, dialog, [=](){
        QString new_name=name_input->text();
        QString new_pas=pas_input->text();
        for (user_mes &user_item : this->user_list) {
            if(user_item.name==new_name){
                 QMessageBox::warning(this, "警告", "用户已存在");
                return;
            }
        }
        QString config_path=concat_path(get_work_dir(),"config/user_config.json");
        QJsonObject user_con_all=json_to_obj(read_text(config_path));
        QJsonObject user_con=user_con_all["user"].toObject();
        QJsonObject con_con=user_con_all["control"].toObject();
        QJsonObject new_user;
        new_user_default_action(con_con,new_name);
        new_user.insert("password",QJsonValue(new_pas));
        new_user.insert("token",QJsonValue(gen_token()));
        new_user.insert("tokentime",QJsonValue("1m"));
        user_con.insert(new_name,QJsonValue(new_user));
        user_con_all["user"]=user_con;
        user_con_all["control"]=con_con;
        write_text(config_path,obj_to_json(user_con_all));
        QMessageBox::information(this, "新用户", "用户已添加");
        dialog->reject();
        reload();
    });
    foot_layout->addWidget(cancel);
    foot_layout->addWidget(comfirm);
    QVBoxLayout * login_layout= new QVBoxLayout(dialog);
    login_layout->addWidget(name_input);
    login_layout->addWidget(pas_input);
    login_layout->addWidget(foot_box);
    dialog->setLayout(login_layout);
     dialog->exec();

}
void  user_win::reload(){
    user_win *user_widget=new user_win(this->parent_widget,this->last_page,this->center);
    user_widget->show();
    this->center->addWidget(user_widget);
    this->center->setCurrentWidget(user_widget);
    this->center->removeWidget(this);

}
void user_win::remove_user(QString username){
    QMessageBox::StandardButton reply;
    reply = QMessageBox::question(this, "删除用户", "你确定要删除["+username+"]吗?",
                                  QMessageBox::Yes | QMessageBox::No);

    if (reply == QMessageBox::Yes) {
        QString config_path=concat_path(get_work_dir(),"config/user_config.json");
        QJsonObject user_con_all=json_to_obj(read_text(config_path));
        QJsonObject user_con=user_con_all["user"].toObject();
        QJsonObject control_con=user_con_all["control"].toObject();
        remove_control_user(control_con,username);
        user_con.remove(username);
        user_con_all["user"]=user_con;
        user_con_all["control"]=control_con;
        write_text(config_path,obj_to_json(user_con_all));
        reload();
    } else {
        return;
    }
}
void user_win::edit_user(QString name,QString password,QString time){
    QString old_name=name;
    QDialog *dialog = new QDialog(this);
    dialog->setWindowTitle("用户信息");
    dialog->resize(300, 200);
    QLineEdit *name_input = new QLineEdit(dialog);
    name_input->setText(name);
    name_input->setPlaceholderText("用户名");
    QLineEdit *pas_input = new QLineEdit(dialog);
    pas_input->setPlaceholderText("密码");
    pas_input->setText(password);
    QWidget*time_box=new QWidget(dialog);
    QHBoxLayout * time_layout= new QHBoxLayout(time_box);
    QLineEdit *time_input = new QLineEdit(time_box);
    time_input->setPlaceholderText("用户登陆期限");
    QComboBox *comboBox = new QComboBox(time_box);
    comboBox->addItem("小时");
    comboBox->addItem("天");
    comboBox->addItem("月");
    comboBox->addItem("年");
    comboBox->addItem("永不过期");
    time_layout->addWidget(time_input);
    time_layout->addWidget(comboBox);
    QWidget*foot_box=new QWidget(dialog);
    QHBoxLayout * foot_layout= new QHBoxLayout(foot_box);
    QPushButton *cancel=new QPushButton("取消",foot_box);
    QPushButton *comfirm=new QPushButton("确定",foot_box);
    foot_layout->addWidget(cancel);
    foot_layout->addWidget(comfirm);
    QVBoxLayout * login_layout= new QVBoxLayout(dialog);
    login_layout->addWidget(name_input);
    login_layout->addWidget(pas_input);
    login_layout->addWidget(time_box);
    login_layout->addWidget(foot_box);
    dialog->setLayout(login_layout);
    connect(cancel, &QPushButton::clicked, dialog, &QDialog::reject);
    connect(comfirm, &QPushButton::clicked, dialog, [=](){
        QString new_name=name_input->text();
        QString new_pas=pas_input->text();
        for (user_mes &user_item : this->user_list) {
            if(user_item.name==new_name&&user_item.name!=old_name){
                QMessageBox::warning(this, "警告", "用户已存在");
                return;
            }
        }
        char unit;
        QString tmp_time;
        switch(comboBox->currentIndex()){
        case 0:
            unit='h';
            break;
        case 1:
            unit='d';
            break;
        case 2:
            unit='m';
            break;
        case 3:
            unit='y';
            break;
        case 4:
            tmp_time="never";
             unit = '\0';
            break;
        default:
            tmp_time=time;
             unit = '\0';
            break;
        }
        if(tmp_time!="never"&&tmp_time!=time){
            bool ok;
            long time_num=time_input->text().toLong(&ok);
            if(!ok){
                QMessageBox::warning(this, "警告", "用户登陆期限输入有误！");
                return;
            }
            QString num_str=time_input->text();
            tmp_time=num_str+unit;
        }
        QString config_path=concat_path(get_work_dir(),"config/user_config.json");
        QJsonObject user_con_all=json_to_obj(read_text(config_path));
        QJsonObject user_con=user_con_all["user"].toObject();
        QJsonObject control_con=user_con_all["control"].toObject();
        replace_control_user(control_con,old_name,new_name);
        QJsonObject new_user;
        new_user.insert("password",QJsonValue(new_pas));
        new_user.insert("token",QJsonValue(gen_token()));
        new_user.insert("tokentime",QJsonValue(tmp_time));
        user_con.remove(old_name);
        user_con.insert(new_name,QJsonValue(new_user));
        user_con_all["user"]=user_con;
        user_con_all["control"]=control_con;
        write_text(config_path,obj_to_json(user_con_all));
        QMessageBox::information(this, "用户信息", "用户信息已经更新");
        dialog->reject();
        reload();
    });

    dialog->exec();
}
user_bar::user_bar(QString name,QString password,QString time,QWidget *parent){
    this->name=name;
    this->password=password;
    this->time=time;
    QString user_info_style =
                              "color: #6b6b6b;"
                              "font-size: 18px;"
                              "border-radius: 15px;"
                              "padding: 10px;"
                              "}"
                              "QPushButton:hover {"
                              "background-color: #f479c0;"
                              "color:#ffffff;";
    this->setStyleSheet(user_info_style);
    QHBoxLayout * user_layout= new QHBoxLayout(this);
    QString tit;
    QString name_style;
    if (name=="admin"){
        tit="管理员:";
        name_style=" background-color: #b69da3";
    }
    else if(name=="visitor"){
        tit="未登录访客:";
        name_style=" background-color: #b69da3";
    }

    else{
        tit="普通用户:";
        name_style="";
    }
    QLabel *tit_text=new QLabel(tit+name,this);
    tit_text->setStyleSheet(name_style);
    tit_text->setFixedHeight(60);
    user_win* win = qobject_cast<user_win*>(parent);
    QPushButton* edit_user=new QPushButton("更改用户信息",this);
    QPushButton* del_user=new QPushButton("删除用户",this);
    edit_user->setFixedSize(150,50);
    del_user->setFixedSize(150,50);
    connect(del_user, &QPushButton::clicked, this, [=](){
        win->remove_user(name);
    });
    connect(edit_user, &QPushButton::clicked, this, [=](){
        win->edit_user(name,password,time);
    });
    user_layout->addWidget(tit_text);
    user_layout->addWidget(edit_user);
    user_layout->addWidget(del_user);
    if(name=="visitor"){
        edit_user->hide();


    }
    if(name=="admin"||name=="visitor"){
        del_user->hide();
    }

}
user_mes::user_mes(QString name,QString password,QString time){
    this->name=name;
    this->password=password;
    this->time=time;
}
