#include"per_win.h"
void open_per_win(string title,menu*last_win){
    menu * per_win;
    vector<option*> list;
    json user_config=userData["user"];
    for (auto& [key, value] : user_config.items()) {
        list.push_back(new option(key,[key,&per_win](){open_control_win(key,per_win);}));
}
    per_win=new menu(title,list,last_win);
    per_win->open();
}