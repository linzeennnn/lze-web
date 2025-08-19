#include "path_win.h"
void open_path_win(string title){
    menu *path_menu;
    vector<option*> list={
        new option(get_text("doc_path"),[](){edit_path("doc");},&(workData["doc_path"])),
        new option(get_text("pic_path"),[](){edit_path("pic");},&(workData["pic_path"])),
        new option(get_text("tra_path"),[](){edit_path("tra");},&(workData["tra_path"])),
        new option(get_text("not_path"),[](){edit_path("not");},&(workData["not_path"])),
        new option(get_text("bok_path"),[](){edit_path("bok");},&(workData["bok_path"])),
        new option(get_text("tmp_path"),[](){edit_path("tmp");},&(workData["tmp_path"])),
        new option(get_text("file_path"),[](){edit_path("file");},&(workData["file_path"]))
    };
    path_menu=new menu(title,list);
    new_win(path_menu);
}