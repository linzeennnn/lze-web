#include "path_win.h"
void open_path_win(string title,menu* last_win){
    menu *path_menu;
    vector<option*> list={
        new option("[保存更改]",[&path_menu](){edit_path("doc",path_menu);}),
        new option("文件管理路径",[&path_menu](){edit_path("doc",path_menu);}),
        new option("图库路径",[&path_menu](){edit_path("pic",path_menu);}),
        new option("回收站路径",[&path_menu](){edit_path("tra",path_menu);}),
        new option("便签路径",[&path_menu](){edit_path("not",path_menu);}),
        new option("书签路径",[&path_menu](){edit_path("bok",path_menu);}),
        new option("临时文件路径",[&path_menu](){edit_path("tmp",path_menu);}),
        new option("文件目录路径",[&path_menu](){edit_path("file",path_menu);})
    };
    path_menu=new menu(title,list,last_win);
    path_menu->open();
}