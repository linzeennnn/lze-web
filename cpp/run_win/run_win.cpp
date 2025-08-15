#include"run_win.h"
#include "../clean.h"
void edit_port();
void edit_max_size();
void edit_gzip();
void open_run_win(string title,menu* last_win){
    menu* run_win;
    option *port_opt=new option(get_text("runPort"),[](){edit_port();},&(workData["port"]));
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
void edit_port(){
    menu_list.top()->key.stop();
    edit_mode();  // 开启 ICANON + ECHO

    // 丢弃内核输入队列中残留的字符（非阻塞）
    tcflush(STDIN_FILENO, TCIFLUSH);
    std::cin.clear();

    unsigned int port = 0;
    std::string line;

    while (true) {
        std::cout << get_text("inputPort") << ": " << std::flush;
        if (!std::getline(std::cin, line)) {
            // 遇到 EOF 或错误，做适当处理（这里退出）
            std::cin.clear();
            continue;
        }
        // 去掉首尾空白（可选）
        size_t start = line.find_first_not_of(" \t\r\n");
        if (start == std::string::npos) { 
            std::cout << get_text("inputErr") << std::endl;
            continue;
        }
        size_t end = line.find_last_not_of(" \t\r\n");
        std::string trimmed = line.substr(start, end - start + 1);

        try {
            unsigned long v = std::stoul(trimmed);
            if (v > 0 && v <= 65535) {
                port = static_cast<unsigned int>(v);
                break;
            }
        } catch (...) { /* 转换失败 */ }

        std::cout << get_text("inputErr") << std::endl;
    }

    edit = true;
    disable_edit_mode();
    workData["port"] = std::to_string(port);
    menu_list.top()->open();
}

void edit_max_size(){
    menu_list.top()->key.stop();
    edit_mode();

    tcflush(STDIN_FILENO, TCIFLUSH);
    std::cin.clear();

    unsigned long size = 0;
    std::string line;
    while (true) {
        std::cout << get_text("inputSize") << ": " << std::flush;
        if (!std::getline(std::cin, line)) {
            std::cin.clear();
            continue;
        }
        // trim
        size_t start = line.find_first_not_of(" \t\r\n");
        if (start == std::string::npos) {
            std::cout << get_text("inputErr") << std::endl;
            continue;
        }
        size_t end = line.find_last_not_of(" \t\r\n");
        std::string trimmed = line.substr(start, end - start + 1);

        try {
            unsigned long v = std::stoul(trimmed);
            size = v;
            break;
        } catch (...) {
            std::cout << get_text("inputErr") << std::endl;
        }
    }

    edit = true;
    disable_edit_mode();
    size = size * 1024 * 1024;
    workData["max_size"] = std::to_string(size);
    menu_list.top()->open();
}

void edit_gzip(){
    workData["gzip"]=workData["gzip"]=="yes"?"no":"yes";
    edit=true;
    menu_list.top()->restore();
}