#include "work_win.h"
#include <QWidget>
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QHBoxLayout>
#include <QFileDialog>
#include <QVBoxLayout>
#include <QDebug>
#include <QFile>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include "util.h"
#include<QMessageBox>
work_win::work_win(QMainWindow *parent,QWidget *last,QStackedWidget*center)
    : QWidget{parent}
{
    init_work_config();
    this->parent_widget=parent;
    this->last_page=last;
    this->center=center;
    QVBoxLayout* work_layout=new QVBoxLayout(this);

    QWidget *size_box=new QWidget(this);
    QHBoxLayout* size_layout=new QHBoxLayout(size_box);
    QLabel *szie_tit=new QLabel("允许最大请求大小(MB):",size_box);
    QLineEdit *size_input = new QLineEdit(size_box);
    size_input->setText(QString::number(this->max_size));
    size_layout->addWidget(szie_tit);
    size_layout->addWidget(size_input);

    QWidget *port_box=new QWidget(this);
    QHBoxLayout* port_layout=new QHBoxLayout(port_box);
    QLabel *port_tit=new QLabel("服务运行端口:",port_box);
    QLineEdit *port_input = new QLineEdit(port_box);
    port_input->setText(QString::number(this->port));
    port_layout->addWidget(port_tit);
    port_layout->addWidget(port_input);

    QWidget *foot_box=new QWidget(this);
    QHBoxLayout* foot_layout=new QHBoxLayout(foot_box);
    QPushButton * back_btn=new QPushButton("返回",foot_box);
    QPushButton * save_btn=new QPushButton("保存",foot_box);
    back_btn->setObjectName("btn");
    save_btn->setObjectName("btn");
    connect(back_btn,&QPushButton::clicked,this,&work_win::go_back);
    connect(save_btn,&QPushButton::clicked,this,[=](){
        this->tmp_port=port_input->text();
        this->tmp_size=size_input->text();
        this->set_work_config();
    });
    foot_layout->addWidget(back_btn);
    foot_layout->addWidget(save_btn);

    work_layout->addWidget(size_box);
    work_layout->addWidget(port_box);
    work_layout->addWidget(foot_box);

}
void work_win::init_work_config(){
    QJsonParseError parseError;
    QString work_config_path=concat_path(get_work_dir(),"config/work_config.json");
    QString json_str=read_text(work_config_path);
    QJsonDocument doc = QJsonDocument::fromJson(json_str.toUtf8(), &parseError);
    this->work_config=doc.object();
    QString max_size_str=this->work_config["max_size"].toString();
    QString port_str=this->work_config["port"].toString();
    this->max_size=max_size_str.toLong()/1024/1024;
    this->port=port_str.toLong();
}
int work_win::set_work_config(){
    bool ok;
    long size=this->tmp_size.toLong(&ok);
    if (!ok||size<0){
        QMessageBox::warning(this, "警告", "请求大小输入有误！");
        return 1;
    }
    long port=this->tmp_port.toLong(&ok);
    if(!ok||port<0||port>65535){
        QMessageBox::warning(this, "警告", "端口输入有误！");
        return 1;
    }
    this->max_size=size*1024*1024;
    this->port=port;
    this->work_config["max_size"]=QString::number(this->max_size);
    this->work_config["port"]=QString::number(this->port);
    QString work_config_path=concat_path(get_work_dir(),"config/work_config.json");
    write_text(work_config_path,obj_to_json(this->work_config));
    QMessageBox::information(this, "提示", "保存成功!");
    return 0;
}
void work_win::go_back(){
    this->hide();
    this->center->setCurrentWidget(this->last_page);
    this->center->removeWidget(this);
}
