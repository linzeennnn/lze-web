#include "mainwindow.h"
#include <QApplication>
#include <QCoreApplication>
#include "util.h"
#include <QFile>
#include <QString>
void check_config();
int main(int argc, char *argv[])
{
    check_config();
    QApplication a(argc, argv);

    // 设置全局样式
    a.setStyleSheet(R"(
    QMainWindow {
        background-color: #aa7a96;
    }QScrollArea {
        background-color: #aa7a96;
        border: none;
    }

    /* 垂直滚动条 */
    QScrollBar:vertical {
        background: #f0e6f5;
        width: 12px;
        margin: 0px;
        border-radius: 6px;
    }

    QScrollBar::handle:vertical {
        background: #d594b9;
        min-height: 20px;
        border-radius: 6px;
    }

    QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
        height: 0px;
        background: none;
        border: none;
    }

    QScrollBar::add-page:vertical, QScrollBar::sub-page:vertical {
        background: none;
    }

    /* 水平滚动条 */
    QScrollBar:horizontal {
        background: #f0e6f5;
        height: 12px;
        margin: 0px;
        border-radius: 6px;
    }

    QScrollBar::handle:horizontal {
        background: #d594b9;
        min-width: 20px;
        border-radius: 6px;
    }

    QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {
        width: 0px;
        background: none;
        border: none;
    }

    QScrollBar::add-page:horizontal, QScrollBar::sub-page:horizontal {
        background: none;
    }
    QLineEdit {
        border: 2px solid #d594b9;
        border-radius: 8px;
        padding: 6px 10px;
        background-color: #fff0fa;
        color: #6b6b6b;
        font-size: 16px;
    }

    QLineEdit:focus {
        border: 2px solid #f479c0;
        background-color: #ffffff;
    }

    QLineEdit::placeholder {
        color: #aaaaaa;
    }
 QDialog {
        background-color: #fff0fa;
        color: #222222;
    }
QWidget {
        color: #ffaedd;
        background-color: #aa7a96;
            font-size: 18px;
    }
        QPushButton {
            background-color: #d594b9;
            color: #6b6b6b;
            font-size: 15px;
            border-radius: 15px;
            padding: 10px;
            width:30px;
            heigth:60px;
        }
        QPushButton:hover {
            background-color: #f479c0;
            color: #ffffff;
        }QLabel {

            border-radius: 15px;
    qproperty-alignment: 'AlignCenter';
}
#btn{
background-color: #f67fba;
}

    )");
    MainWindow w;
    w.show();
    return a.exec();
}
void check_config(){

    QString user_config=R"({"control":{"bok":{"action":{"delete":{"name":"删除书签","user":["admin","user"]},"newbok":{"name":"添加书签","user":["admin","user"]}},"name":"书签"},"doc":{"action":{"copy":{"name":"复制文件","user":["admin","user"]},"delete":{"name":"删除文件","user":["admin","user"]},"downdir":{"name":"下载文件夹","user":["admin","visitor","user"]},"downfile":{"name":"下载文件","user":["admin","visitor","user"]},"move":{"name":"移动文件","user":["admin","user"]},"newdir":{"name":"新建文件夹","user":["admin","user"]},"rename":{"name":"重命名","user":["admin","user"]},"updir":{"name":"上传文件夹","user":["admin","user"]},"upfile":{"name":"上传文件","user":["admin","user"]}},"name":"文件"},"home":{"action":{"viewdoc":{"name":"预览文件","user":["admin","visitor","user"]},"viewnote":{"name":"预览便签","user":["admin","visitor","user"]},"viewpic":{"name":"预览图片","user":["admin","visitor","user"]}},"name":"主页"},"mon":{"action":{"change":{"name":"修改权限","user":["admin","user"]},"edittime":{"name":"修改时间","user":["admin","user"]}},"name":"控制面板"},"not":{"action":{"delete":{"name":"删除便签","user":["admin","user"]},"edit":{"name":"编辑便签","user":["admin","user"]},"newnote":{"name":"添加便签","user":["admin","visitor","user"]},"upload":{"name":"上传便签","user":["admin","user"]}},"name":"便签"},"pic":{"action":{"upload":{"name":"上传图片和视频","user":["admin","visitor","user"]}},"name":"相册"},"tra":{"action":{"clean":{"name":"清空回收站","user":["admin","user"]},"recover":{"name":"恢复文件","user":["admin","user"]}},"name":"回收站"}},"user":{"admin":{"password":"lze-web-admin","token":"T5h2YpBijYoLVLGVHSn2Ca7Nou0gVLyp_000000","tokentime":"never"},"user":{"password":"web-user","token":"w5FXzfcSzTDnlZFmzaV1KmvRVJL2tIVD_000000","tokentime":"1y"},"visitor":{"password":null,"token":null,"tokentime":null}}})";
    QString work_config=R"({"file_path":"default","doc_path":"default","pic_path":"default","tra_path":"default","not_path":"default","bok_path":"default","tmp_path":"default","log_path":"default","port":"80","max_size":"104857600"})";
    QString user_config_path=concat_path(get_work_dir(),"config/user_config.json");
    QString work_config_path=concat_path(get_work_dir(),"config/work_config.json");
    if(!QFile::exists(user_config_path))
        write_text(user_config_path,pretty_json(user_config));
    if(!QFile::exists(work_config_path))
        write_text(work_config_path,pretty_json(work_config));

}
