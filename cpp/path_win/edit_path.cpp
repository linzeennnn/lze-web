#include "path_win.h"
namespace fs = std::filesystem;
using namespace std;
void switch_menu(menu *win);
void open_path_edit_win(fs::path path,fs::path default_path,string key);
void edit_path(string type){
    menu_list.top()->key.stop();
    menu_list.push(nullptr);
    string key=type+"_path";
    string cur_path=workData[key];
    string default_path;
        if(type=="file")
            default_path=file_path;
        else if(type=="doc")
            default_path=file_path+"/Documents";
        else if(type=="pic")
            default_path=file_path+"/Pictures";
        else if(type=="not")
            default_path=file_path+"/Note";
        else if(type=="bok")
            default_path=file_path+"/Bookmark";
        else if(type=="tmp")
            default_path=file_path+"/temp";
        else if(type=="tra")
            default_path=file_path+"/trash";
    if(cur_path=="default"){
        cur_path=default_path;
    }
        open_path_edit_win(cur_path,default_path,key);
}
void open_path_edit_win(
                        fs::path scan_path,
                        fs::path default_path,
                        string key
                    ){
        if(!edit)
            edit=true;
        if(scan_path==default_path)
            workData[key]="default";
        else
            workData[key]=scan_path.string();
    menu *path_edit_win;
    vector<option*> list={
        new option(text_box("backPar"),[scan_path,default_path,key]()
        {open_path_edit_win(scan_path.parent_path(),default_path,key);}),
        new option(text_box("useDefault"),[scan_path,default_path,key]()
        {open_path_edit_win(default_path,default_path,key);})
    };
 for (const auto& entry : fs::directory_iterator(scan_path)) {
            std::string fileType=file_type(entry.path());
            if(fileType=="dir"||fileType=="dir_link")
                list.push_back(new option(entry.path().filename(),[scan_path,default_path,entry,key]()
        {open_path_edit_win(entry.path(),default_path,key);}));
        }
        path_edit_win=new menu(scan_path,list,true);
        switch_menu(path_edit_win);
}
void switch_menu(menu *win){
    tmp_menu=menu_list.top();
    menu_list.pop();
    menu_list.push(win);
    menu_list.top()->open();
    if(tmp_menu){
        delete tmp_menu;
        tmp_menu=nullptr;
    }
}