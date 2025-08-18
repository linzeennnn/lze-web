#include"menu.h"
#include"option.h"
#include"all_win.hpp"
#include "lang_win/lang_win.h"
#include "public.h"
using namespace std;
void tmp(){
}
void main_win(){
    lang_win* langWin;
    open_lang(&langWin);
    delete langWin;
    menu *mainWin;
    vector<option*> list={
        new option(get_text("userCon"),tmp),
        new option(get_text("perCon"),[&mainWin](){open_per_win(get_text("perCon"),mainWin);}),
        new option(get_text("runCon"), [&mainWin](){open_run_win(get_text("runCon"));}),
        new option(get_text("pathCon"),[&mainWin](){open_path_win(get_text("pathCon"),mainWin);})
    };
    mainWin=new menu("lze-config",list,NULL);
    new_win(mainWin);
    while(true){
             std::this_thread::sleep_for(std::chrono::milliseconds(100000));
        }
}