#include"per_win.h"
bool include(json arr,string userName);
void open_action_win(string control,string user){
    json action_config=userData["control"][control]["action"];
    menu*action_win;
    vector<option*>list;
    for(auto&[key,value]:action_config.items()){
        if(include(value["user"],user)){
            action_mes[key]="yes";
            list.push_back(new option(get_text(value["name"]),[user,control,key](){
                edit=true;
                mod_permit(user,control,key,false);
                action_mes[key]="no";
                menu_list.top()->restore();
            },&action_mes[key]));
        }
        else{
            action_mes[key]="no";
            list.push_back(new option(get_text(value["name"]),[user,control,key](){
                edit=true;
                mod_permit(user,control,key,true);
                action_mes[key]="yes";
                menu_list.top()->restore();
            },&action_mes[key]));
        }

    }
    action_win=new menu(get_text(control),list);
    new_win(action_win);
}
bool include(json arr,string userName){
  auto it = std::find(arr.begin(), arr.end(), userName);
    if (it != arr.end()) 
        return true;
    else
        return false;
    
}