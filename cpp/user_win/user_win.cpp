#include "user_win.h"
void open_user_win(string title,string notify){
    menu*user_win;
    vector <option*>list={
        new option(get_text("new_user"),[title](){ 
            new_user();
            tmp_menu=menu_list.top();
            menu_list.pop();
            tmp_title=menu_list.top()->title;
           open_user_win(title,get_text("success"));

        }),
        new option(get_text("del_user"),[](){
            open_del_usr_win(get_text("del_user"));
        }),
        new option(get_text("mod_pas"),[](){
            open_mod_pass_win(get_text("mod_pas"));
        })
    };
    user_win=new menu(title,list);
     user_win->notify=notify;
    new_win(user_win);
}