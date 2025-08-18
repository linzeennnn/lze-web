#include"user_win.h"
void change_pas(string user);
void open_mod_pass_win(string title){
    menu*mod_pass_win;
    vector<option*>list;
    json user_config=userData["user"];
    for(auto&[key,value]:user_config.items()){
        list.push_back(new option(key,[key](){
            change_pas(key);
        }));
    }
    mod_pass_win=new menu(title,list);
    new_win(mod_pass_win);
}
void change_pas(string user){
    menu_list.top()->key.stop(); 
    edit = true; 
    string password;
    create_edit_win(); 
    std::cout << get_text("inputPort") << ": " << std::flush; 
    getline(cin, password);
     tcflush(STDIN_FILENO, TCIFLUSH); 
     close_edit_win(); 
     userData["user"][user]["password"]=password;
}