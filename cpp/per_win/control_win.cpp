#include "per_win.h"
void open_control_win(string user,menu *last_win){
    json control_config=userData["control"];
    menu*control_win;
    vector<option*>list;
    for(auto&[key,value]:control_config.items()){
        list.push_back(new option(get_text(key),[](){}));
    }
    control_win=new menu(user,list,last_win);
    control_win->open();
}