#pragma once
#include <iostream>
#include <vector>
#include <string>
#include"clean.h"
#include"public.h"
#include <algorithm>
#include"split_line.h"
#include"key.h"
#include "option.h"
using namespace std;
class menu{
    private:
    string content;
    vector<option*> list;
    size_t max_list_show=9;
    int index;
    menu *last_win;
    void open_confirm(menu* last_win){
    menu *confirm_win;
    vector<option*> list={
        new option("[保存]",[](){
            save_config();
            exit(0);
        }),
        new option("[不保存]",[](){exit(0);})
    };
    confirm_win=new menu("内容未保存!!",list,last_win);
    confirm_win->open();
}
    void creat_content(){
        content=">"+(last_win?last_win->title+">":"")+title+"\n"+
        split_line('-')+"\n"+
        (index==list.size()?" >[返回]":"  [返回]")+"\n";
        if(index<=max_list_show||index==list.size()){
                for(size_t i=0;
                    i<min(max_list_show+1,list.size());
                    i++){
                    if(i==index)
                        content+=" >"+list[i]->name+"\n";
                    else
                        content+="  "+list[i]->name+"\n";
                }
            }
        else{
                for(size_t i=index-max_list_show;
                    i<min(static_cast<size_t>(index+1),list.size());
                    i++)
                    {
                    if(i==index)
                        content+=" >"+list[i]->name+"\n";
                    else
                        content+="  "+list[i]->name+"\n";
                }
        }
        if(list.size()>max_list_show&&index+1<list.size())
            content+="  .....\n";
    }
    void print(){
            clean();
            cout<<content;

    }
    void back(){
        if(last_win!=NULL){
            last_win->open();
            delete this;
        }else{
            if(edit){
                open_confirm(this);
            }
            else
                exit(0);
        }
    }
    public:
    string title;
        menu(string title,vector<option*> list,menu*last_win){
            index=0;
            this->last_win=last_win;
            this->list=list;
            this->title=title;
            creat_content();
        };
        ~menu(){
            for(option* opt : list){
        delete opt;  // 释放每个 option 对象
    }
    list.clear();
        }
        void up(){
           index= index==0?list.size():index-1;
            creat_content();
            this->print();
        }
        void down(){
           index= index==list.size()?0:index+1;
            creat_content();
            this->print();
        }
        void open(){
            this->print();
            Key key;
            key.up([this](){up();});
            key.down([this](){down();});
            key.enter([this](){
                if(index==list.size())
                    this->back();
                else
                    list[index]->func();
            });
            key.run();
        }
};