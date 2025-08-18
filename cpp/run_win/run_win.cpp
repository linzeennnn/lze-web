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
        tmp_title=menu_list.top()->title;
        open_run_win(title);
    
    },&(workData["port"]));
    option *size_opt=new option(get_text("maxReSize"),[title](){
        edit_max_size();
        tmp_menu=menu_list.top();
        menu_list.pop();
        tmp_title=menu_list.top()->title;
        open_run_win(title);
    },&(workData["max_size"]));
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
#include <iostream>
#include <string>
#include <termios.h>
#include <unistd.h>

using namespace std;

void edit_port() {
    menu_list.top()->key.stop();
    edit = true;
    unsigned int port = 0;
    string line;

    create_edit_win();

    while (true) {
        std::cout << get_text("inputPort") << ": " << std::flush;
        getline(cin, line);

        // 清空输入缓冲
        tcflush(STDIN_FILENO, TCIFLUSH);

        if (!line.empty()) {
            try {
                port = std::stoi(line);
            } catch (const std::invalid_argument& e) {
                std::cout << get_text("inputErr") << std::endl;
                continue;
            } catch (const std::out_of_range& e) {
                std::cout << get_text("inputErr") << std::endl;
                continue;
            }

            if (port >= 1 && port <= 65535) {
                break; // 合法端口，跳出循环
            } else {
                std::cout << get_text("inputErr") << std::endl;
            }
        } else {
            std::cout << get_text("inputErr") << std::endl;
        }
    }

    close_edit_win();
    workData["port"] = std::to_string(port);
}


void edit_max_size(){
    menu_list.top()->key.stop();
    edit = true;
    unsigned long size = 0;
    string line;

    create_edit_win();

    while (true) {
        std::cout << get_text("inputSize") << ": " << std::flush;
        getline(cin, line);

        // 清空输入缓冲
        tcflush(STDIN_FILENO, TCIFLUSH);

        if (!line.empty()) {
            try {
                size = std::stoi(line);
            } catch (const std::invalid_argument& e) {
                std::cout << get_text("inputErr") << std::endl;
                continue;
            } catch (const std::out_of_range& e) {
                std::cout << get_text("inputErr") << std::endl;
                continue;
            }

            if (size >0) {
                break; // 合法端口，跳出循环
            } else {
                std::cout << get_text("inputErr") << std::endl;
            }
        } else {
            std::cout << get_text("inputErr") << std::endl;
        }
    }
    size *=1024*1024;
    close_edit_win();
    workData["max_size"] = std::to_string(size);
}

void edit_gzip(){
    workData["gzip"]=workData["gzip"]=="yes"?"no":"yes";
    edit=true;
    menu_list.top()->restore();
}