#include"user_win.h"
void change_pas(string user);
void open_mod_pass_win(string title,string notify){
    menu*mod_pass_win;
    vector<option*>list;
    json user_config=userData["user"];
    for(auto&[key,value]:user_config.items()){
        list.push_back(new option(key,[key,title](){
            if(key=="visitor"){
                cout<<get_text("cant_change_pas")<<endl;
            }else{
            change_pas(key);
            tmp_menu=menu_list.top();
            menu_list.pop();
            tmp_title=menu_list.top()->title;
            open_mod_pass_win(title,get_text("success"));
        }
        }));
    }
    mod_pass_win=new menu(title,list);
    mod_pass_win->notify=notify;
    new_win(mod_pass_win);
}
void change_pas(string user){
    menu_list.top()->key.stop(); 
    edit = true; 
    string password;
    create_edit_win(); 
    std::cout << get_text("input_pas") << ": " << std::flush; 
    getline(cin, password);
     tcflush(STDIN_FILENO, TCIFLUSH); 
     close_edit_win(); 
     userData["user"][user]["password"]=password;
}