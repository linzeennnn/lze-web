#include "user_win.h"
bool user_exit(string name);
void new_user(){
    menu_list.top()->key.stop(); 
    edit = true; 
    string password;
    string username;
    create_edit_win(); 
      while (true) {
        std::cout << get_text("input_name") << ": " << std::flush; 
        getline(cin, username);
        cout << endl;

        if (user_exit(username)) {
            std::cout << get_text("user_exit") << std::endl;
        } else {
            break;
        }
    }
    std::cout << get_text("input_pas") << ": " << std::flush; 
    getline(cin, password);
     tcflush(STDIN_FILENO, TCIFLUSH); 
     close_edit_win(); 
     json new_user_data;
     new_user_data["password"]=password;
     new_user_data["tokentime"]="1m";
    new_user_data["token"]="";
    userData["user"][username]=new_user_data;
}
bool user_exit(string name){
    json user_config=userData["user"];
for(auto&[key,value]:user_config["user"].items()){
       if(key==name){
        return true;
       }
}
return false;
}