#include "user_win.h"
void del_user(string user);
void open_del_usr_win(string title,string notify){
    menu*mod_pass_win;
    vector<option*>list;
    json user_config=userData["user"];
    for(auto&[key,value]:user_config.items()){
        list.push_back(new option(key,[key,title](){
            if(key=="visitor"||key=="admin"){
                cout<<get_text("cant_del")<<endl;
            }else{
            del_user(key);
            tmp_menu=menu_list.top();
            menu_list.pop();
            tmp_title=menu_list.top()->title;
            open_del_usr_win(title,get_text("success"));
        }
        }));
    }
    mod_pass_win=new menu(title,list);
    mod_pass_win->notify=notify;
    new_win(mod_pass_win);
    
}
void del_user(string user){
    edit=true;
userData["user"].erase(user);
json control_config=userData["control"];
for(auto&[key,value]:control_config.items()){
    json action_config=value["action"];
        for(auto&[act_key,act_value]:action_config.items()){
            if(find(act_value["user"].begin(), act_value["user"].end(), user) !=  act_value["user"].end())
                mod_permit(user,key,act_key,false);
        }
}
}