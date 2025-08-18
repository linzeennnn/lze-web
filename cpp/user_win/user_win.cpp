#include "user_win.h"
void open_user_win(string title){
    menu*user_win;
    vector <option*>list={
        new option(get_text("new_user"),[](){}),
        new option(get_text("del_user"),[](){}),
        new option(get_text("mod_pas"),[](){open_mod_pass_win(get_text("mod_pas"));})
    };
    user_win=new menu(title,list);
    new_win(user_win);
}