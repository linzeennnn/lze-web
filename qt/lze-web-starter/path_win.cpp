#include "path_win.h"
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
#include <QEvent>
#include "util.h"
path_win::path_win(QMainWindow *parent,QWidget *last,QStackedWidget*center)
    : QWidget{parent}
{
    this->last_page=last;
    this->parent_widget=parent;
    this->center=center;
    init_work_config();
    QVBoxLayout * select_layout=new QVBoxLayout(this);
    select_bar* file_path_select=new select_bar(this,"主目录:","file",this->file_path);
    select_bar* doc_path_select=new select_bar(this,"文件管理:","doc",this->doc_path);
    select_bar* pic_path_select=new select_bar(this,"图库:","pic",this->pic_path);
    select_bar* tra_path_select=new select_bar(this,"回收站:","tra",this->tra_path);
    select_bar* not_path_select=new select_bar(this,"便签:","not",this->not_path);
    select_bar* bok_path_select=new select_bar(this,"书签:","bok",this->bok_path);
    select_bar* tmp_path_select=new select_bar(this,"临时目录:","tmp",this->tmp_path);
    QPushButton * back_btn=new QPushButton("返回",this);
    back_btn->setObjectName("btn");
    back_btn->setFixedSize(100,60);
    connect(back_btn,&QPushButton::clicked,this,&path_win::go_back);
    select_layout->addWidget(file_path_select);
    select_layout->addWidget(doc_path_select);
    select_layout->addWidget(pic_path_select);
    select_layout->addWidget(tra_path_select);
    select_layout->addWidget(not_path_select);
    select_layout->addWidget(bok_path_select);
    select_layout->addWidget(tmp_path_select);
    select_layout->addWidget(back_btn, 0, Qt::AlignHCenter);

}




select_bar::select_bar(QWidget *parent, QString title, QString type, QString ori_path)
    : QWidget{parent}
{
    QLabel *titleLabel = new QLabel(title, this);

    pathLabel = new QLineEdit(ori_path, this);
    pathLabel->setReadOnly(true);  // 设置只读，不能编辑
    pathLabel->setStyleSheet("border: 1px solid #9d4973; padding: 2px; border-radius: 15px;");
    pathLabel->setCursor(Qt::IBeamCursor);

    QPushButton *selectBtn = new QPushButton("选择路径", this);

    QHBoxLayout *layout = new QHBoxLayout(this);
    layout->addWidget(titleLabel);
    layout->addWidget(pathLabel);
    layout->addWidget(selectBtn);
    layout->setContentsMargins(0, 0, 0, 0);

    auto updateMaxWidth = [this]() {
        if (parentWidget()) {
            int maxWidth = parentWidget()->width() * 0.6;
            pathLabel->setMaximumWidth(maxWidth);
        }
    };
    updateMaxWidth();

    if (parentWidget()) {
        parentWidget()->installEventFilter(this);
    }

    connect(selectBtn, &QPushButton::clicked, this, [=]() {
        QString dir = QFileDialog::getExistingDirectory(this, "选择文件夹", QDir::homePath());
        if (!dir.isEmpty()) {
            pathLabel->setText(dir);

            // 如果 parent 是你自定义的 path_win，可以直接调用：
            path_win* win = qobject_cast<path_win*>(parent);
            if (win) {
                win->set_path(dir, type);
            }
        }
    });
}

bool select_bar::eventFilter(QObject* obj, QEvent* event)
{
    if (obj == parentWidget() && event->type() == QEvent::Resize) {
        int maxWidth = parentWidget()->width() * 0.6;
        pathLabel->setMaximumWidth(maxWidth);
    }
    return QWidget::eventFilter(obj, event);
}
void path_win::set_path(QString path,QString type){
    if (type=="file")
        this->file_path=path;
    if (type=="doc")
        this->doc_path=path;
    if (type=="pic")
        this->pic_path=path;
    if (type=="tra")
        this->tra_path=path;
    if (type=="not")
        this->not_path=path;
    if (type=="bok")
        this->bok_path=path;
    if (type=="tmp")
        this->tmp_path=path;
    QString key=type+"_path";
    this->path_config[key]=path;
    QString json_str= obj_to_json(this->path_config);
    write_text(concat_path(get_work_dir(),"config/work_config.json"),json_str);
}

void path_win::init_work_config(){
    QString work_config_path=concat_path(get_work_dir(),"config/work_config.json");
    QString json_str=read_text(work_config_path);
    this->path_config=json_to_obj(json_str);
    this->file_path = this->path_config.value("file_path").toString();
    this->doc_path  = this->path_config.value("doc_path").toString();
    this->pic_path  = this->path_config.value("pic_path").toString();
    this->tra_path  = this->path_config.value("tra_path").toString();
    this->not_path  = this->path_config.value("not_path").toString();
    this->bok_path  = this->path_config.value("bok_path").toString();
    this->tmp_path  = this->path_config.value("tmp_path").toString();
    if (this->file_path == "default")
        this->file_path = concat_path(get_work_dir(), "file");
    if (this->doc_path == "default")
        this->doc_path = concat_path(this->file_path, "Documents");
    if (this->pic_path == "default")
        this->pic_path = concat_path(this->file_path, "Pictures");
    if (this->tra_path == "default")
        this->tra_path = concat_path(this->file_path, "trash");
    if (this->not_path == "default")
        this->not_path = concat_path(this->file_path, "Note");
    if (this->bok_path == "default")
        this->bok_path = concat_path(this->file_path, "Bookmark");
    if (this->tmp_path == "default")
        this->tmp_path = concat_path(this->file_path, "temp");
}
void path_win::go_back(){
    this->last_page->show();
    this->center->setCurrentWidget(this->last_page);
    this->center->removeWidget(this);
}
