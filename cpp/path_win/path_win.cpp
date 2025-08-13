#include "path_win.h"
void open_path_win(string title,menu* last_win){
    menu *path_menu;
    vector<option*> list={
        new option(get_text("doc_path"),[&path_menu](){edit_path("doc",path_menu);},&(workData["doc_path"])),
        new option(get_text("pic_path"),[&path_menu](){edit_path("pic",path_menu);},&(workData["pic_path"])),
        new option(get_text("tra_path"),[&path_menu](){edit_path("tra",path_menu);},&(workData["tra_path"])),
        new option(get_text("not_path"),[&path_menu](){edit_path("not",path_menu);},&(workData["not_path"])),
        new option(get_text("bok_path"),[&path_menu](){edit_path("bok",path_menu);},&(workData["bok_path"])),
        new option(get_text("tmp_path"),[&path_menu](){edit_path("tmp",path_menu);},&(workData["tmp_path"])),
        new option(get_text("file_path"),[&path_menu](){edit_path("file",path_menu);},&(workData["file_path"]))
    };
    path_menu=new menu(title,list,last_win);
    path_menu->open();
}