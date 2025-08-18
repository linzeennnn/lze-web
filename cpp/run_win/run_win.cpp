#include"run_win.h"
#include "../clean.h"
void edit_port();
void edit_max_size();
void edit_gzip();
void open_run_win(string title){
    menu* run_win;
    option *port_opt=new option(get_text("runPort"),[title](){
        edit_port();
        tmp_menu=menu_list.top();
        menu_list.pop();
        open_run_win(title);
    
    },&(workData["port"]));
    option *size_opt=new option(get_text("maxReSize"),[](){edit_max_size();},&(workData["max_size"]));
    port_opt->pause=true;
    size_opt->pause=true;
    vector<option*> list={
        port_opt,
        size_opt,
        new option(get_text("gzip"),[&run_win](){edit_gzip();},&(workData["gzip"])),
    };
    run_win=new menu(title,list);
    new_win(run_win);
}
void edit_port() {
    menu_list.top()->key.stop();
    edit = true;
    unsigned int port = 0;
    string line;
    create_edit_win();
    std::cout << get_text("inputPort") << ": " << std::flush;
    getline(cin, line);
    if (!line.empty()) {
        port = std::stoi(line);
    }
    tcflush(STDIN_FILENO, TCIFLUSH);
    close_edit_win();
    workData["port"] = std::to_string(port);
}

void edit_max_size(){
    // menu_list.top()->key.stop();
    // create_edit_win();
    // std::cin.clear();

    // unsigned long size = 0;
    // std::string line;
    // while (true) {
    //     std::cout << get_text("inputSize") << ": " << std::flush;
    //     if (!std::getline(std::cin, line)) {
    //         std::cin.clear();
    //         continue;
    //     }
    //     // trim
    //     size_t start = line.find_first_not_of(" \t\r\n");
    //     if (start == std::string::npos) {
    //         std::cout << get_text("inputErr") << std::endl;
    //         continue;
    //     }
    //     size_t end = line.find_last_not_of(" \t\r\n");
    //     std::string trimmed = line.substr(start, end - start + 1);

    //     try {
    //         unsigned long v = std::stoul(trimmed);
    //         size = v;
    //         break;
    //     } catch (...) {
    //         std::cout << get_text("inputErr") << std::endl;
    //     }
    // }

    // edit = true;
    // disable_edit_mode();
    // size = size * 1024 * 1024;
    // workData["max_size"] = std::to_string(size);
    // menu_list.top()->open();
}

void edit_gzip(){
    workData["gzip"]=workData["gzip"]=="yes"?"no":"yes";
    edit=true;
    menu_list.top()->restore();
}