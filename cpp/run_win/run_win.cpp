#include"run_win.h"
#include "../clean.h"
void edit_port(menu* run_win);
void edit_max_size(menu* run_win);
void edit_gzip(menu* run_win);
void open_run_win(string title,menu* last_win){
    menu* run_win;
    option *port_opt=new option(get_text("runPort"),[&run_win](){edit_port(run_win);},&(workData["port"]));
    option *size_opt=new option(get_text("maxReSize"),[&run_win](){edit_max_size(run_win);},&(workData["max_size"]));
    port_opt->pause=true;
    size_opt->pause=true;
    vector<option*> list={
        port_opt,
        size_opt,
        new option(get_text("gzip"),[&run_win](){edit_gzip(run_win);},&(workData["gzip"])),
    };
    run_win=new menu(title,list,last_win);
    run_win->open();
}
void edit_port(menu* run_win){
    edit_mode();
    unsigned int port;
    cout << get_text("inputPort")+":" << std::flush;
    while (true)
    {
    if (cin >> port && port > 0 && port <= 65535)  break; 
    cout<<"\n"+get_text("inputErr")+":";
    cin.clear(); 
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
    cin.ignore(numeric_limits<std::streamsize>::max(), '\n');
    edit=true;
    disable_edit_mode();
    workData["port"]=to_string(port);
    run_win->restore();
}
void edit_max_size(menu* run_win){
    edit_mode();
    unsigned long size;
    cout<<get_text("inputSize")+":";
    while (true)
    {
        if(cin >> size)break;
    cout<<"\n"+get_text("inputErr")+":";
    cin.clear(); 
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }
    cin.ignore(numeric_limits<std::streamsize>::max(), '\n');
    edit=true;
    disable_edit_mode();
    size=size*1024*1024;
    workData["max_size"]=to_string(size);
    run_win->restore();
}
void edit_gzip(menu* run_win){
    workData["gzip"]=workData["gzip"]=="yes"?"no":"yes";
    edit=true;
    run_win->restore();
}