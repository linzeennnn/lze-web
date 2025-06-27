#include "main_win.h"
#include <QMessageBox>
#include"path_win.h"
#include"work_win.h"
#include"user_win.h"
#include"control_win.h"
#include<QMainWindow>
main_win::main_win(QMainWindow *parent,QStackedWidget*center)
    : QWidget{parent}
{
    this->parent_widget=parent;
    this->center=center;
    btn_layout=new QVBoxLayout(this);
    QWidget *line_1=new QWidget(this);
    QHBoxLayout *line1_layout=new QHBoxLayout(line_1);
    user_btn=new QPushButton("用户配置",line_1);
    path_btn=new QPushButton("路径配置",line_1);
    line1_layout->addWidget(user_btn);
    line1_layout->addWidget(path_btn);
    QString btn_style=        "QPushButton {"
                        "font-size: 18px;"
                        "border-radius: 15px;"
                        "width: 100px;"
                        "height: 100px;"
                        "}";
    QWidget *line_2=new QWidget(this);
    QHBoxLayout *line2_layout=new QHBoxLayout(line_2);
    work_btn=new QPushButton("工作配置",line_2);
    control_btn=new QPushButton("权限配置",line_2);
    line2_layout->addWidget(work_btn);
    line2_layout->addWidget(control_btn);
    btn_layout->addWidget(line_1);
    btn_layout->addWidget(line_2);
    connect(user_btn,&QPushButton::clicked,this,&main_win::to_userconfig);
    connect(control_btn,&QPushButton::clicked,this,&main_win::to_controlconfig);
    connect(path_btn,&QPushButton::clicked,this,&main_win::to_pathconfig);
    connect(work_btn,&QPushButton::clicked,this,&main_win::to_workconfig);
    user_btn->setFixedSize(200,200);
    path_btn->setFixedSize(200,200);
    work_btn->setFixedSize(200,200);
    control_btn->setFixedSize(200,200);
}
void main_win::to_userconfig(){
    this->hide();
    user_win *user_widget=new user_win(this->parent_widget,this,this->center);
    user_widget->show();
    this->center->addWidget(user_widget);
    this->center->setCurrentWidget(user_widget);
}
void main_win::to_controlconfig(){
    this->hide();
    control_win *control_widget=new control_win(this->parent_widget,this,this->center);
    control_widget->show();
    this->center->addWidget(control_widget);
    this->center->setCurrentWidget(control_widget);
}
void main_win::to_pathconfig(){
    this->hide();
    path_win *path_widget=new path_win(this->parent_widget,this,this->center);
    path_widget->show();
    this->center->addWidget(path_widget);
    this->center->setCurrentWidget(path_widget);
}
void main_win::to_workconfig(){
    this->hide();
    work_win *work_widget=new work_win(this->parent_widget,this,this->center);
    work_widget->show();
    this->center->addWidget(work_widget);
    this->center->setCurrentWidget(work_widget);
}


