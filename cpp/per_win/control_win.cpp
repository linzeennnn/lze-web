#include "per_win.h"
void open_control_win(string user){
    json control_config=userData["control"];
    menu*control_win;
    vector<option*>list;
    for(auto&[key,value]:control_config.items()){
        list.push_back(new option(get_text(key),[key,user](){
            open_action_win(key,user);
        }));
    }
    control_win=new menu(user,list);
    new_win(control_win);
}