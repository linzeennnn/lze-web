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
        new option(get_text("userCon"),[&mainWin](){open_user_win(get_text("userCon"));}),
        new option(get_text("perCon"),[&mainWin](){open_per_win(get_text("perCon"));}),
        new option(get_text("runCon"), [](){open_run_win(get_text("runCon"));}),
        new option(get_text("pathCon"),[&mainWin](){open_path_win(get_text("pathCon"));}),
        new option(get_text("save"),[&mainWin](){
            if(edit){
                save_config();
                edit=false;
                cout<<get_text("success")<<endl;
            }else
                cout<<get_text("no_change")<<endl;
        
        })
    };
    mainWin=new menu("lze-config",list,NULL);
    new_win(mainWin);
    while(true){
             std::this_thread::sleep_for(std::chrono::milliseconds(100000));
        }
}