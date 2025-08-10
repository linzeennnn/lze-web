#pragma once
#include <iostream>
#include <vector>
#include <string>
#include"clean.h"
#include"split_line.h"
#include"key.h"
#include "option.h"
using namespace std;
class menu{
    private:
    string title;
    string content;
    vector<option*> list;
    int index;
    menu *last_win;
    void creat_content(){
        content=">"+title+"\n"+
        split_line('-')+"\n"+
        (index==list.size()?" >[返回]":"  [返回]")+"\n";
        for(size_t i=0;i<list.size();i++){
            if(i==index)
                content+=" >"+list[i]->name+"\n";
            else
                content+="  "+list[i]->name+"\n";
        }

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
            exit(0);
        }
    }
    public:
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