#include"per_win.h"
void open_action_win(string control,string user,menu*last_win){
    json action_config=userData["control"][control]["action"];
    menu*action_win;
    vector<option*>list;
    for(auto&[key,value]:action_config.items()){
        list.push_back(new option(get_text(key),[](){}));
    }
    action_win=new menu(user,list,last_win);
    action_win->open();
}