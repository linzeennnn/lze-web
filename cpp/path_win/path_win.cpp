#include "path_win.h"
#include "../public.h"
void open_path_win(string title,menu* last_win){
    vector<option*> list={
        new option("文件管理路径",[](){edit_path("doc");}),
        new option("图库路径",[](){edit_path("pic");}),
        new option("回收站路径",[](){edit_path("tra");}),
        new option("便签路径",[](){edit_path("not");}),
        new option("书签路径",[](){edit_path("bok");}),
        new option("临时文件路径",[](){edit_path("tmp");}),
        new option("日志路径",[](){edit_path("log");}),
        new option("文件目录路径",[](){edit_path("file");})
    };
    menu *path_menu=new menu(title,list,last_win);
    path_menu->open();
}
void edit_path(string type){
    string key=type+"_paht";
string cur_path=workData[key];

}