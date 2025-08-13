#include "lang_win.h"
void open_lang(lang_win** win){
    vector<option*> list={
        new option("简体中文",[&win](){
            langDict=langData["zh"];
        }),
        new option("English",[&win](){
            langDict=langData["en"];
        })
    };
    *win =new lang_win(list);
    (*win)->open();
}