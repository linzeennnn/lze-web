#include"menu.h"
#include"option.h"
#include"all_win.hpp"
#include "public.h"
using namespace std;
void tmp(){
}
void main_win(){
    menu *mainWin;
    vector<option*> list={
        new option("用户配置",tmp),
        new option("权限配置",tmp),
        new option("运行配置", [&mainWin](){open_run_win("运行配置",mainWin);}),
        new option("路径配置",[&mainWin](){open_path_win("路径配置",mainWin);})
    };
    mainWin=new menu("lze-web配置",list,NULL);
    mainWin->open();
}