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
        confirm_win=new menu("  内容未保存!!",list,last_win,true);
        confirm_win->open();
}
    void creat_content(){
        content=split_line('=');
        content+=title+"\n"+
        split_line('-')+"\n"+
        (index==list.size()?" >[返回]":"  [返回]")+"\n";
        if(index<=max_list_show||index==list.size()){
                for(size_t i=0;
                    i<min(max_list_show+1,list.size());
                    i++){
                    if(i==index)
                        content+=" >"+list[i]->name+get_info(i)+"\n";
                    else
                        content+="  "+list[i]->name+get_info(i)+"\n";
                }
            }
        else{
                for(size_t i=index-max_list_show;
                    i<min(static_cast<size_t>(index+1),list.size());
                    i++)
                    {
                    if(i==index)
                        content+=" >"+list[i]->name+get_info(i)+"\n";
                    else
                        content+="  "+list[i]->name+get_info(i)+"\n";
                }
        }
        if(list.size()>max_list_show&&index+1<list.size())
            content+="  .....\n";
        content+=split_line('=')+"\n";
    }
    string get_info(int index){
        return list[index]->info?std::string(" [") + (*(list[index]->info)).get<std::string>() + "]"
    : std::string("");
    }
    void print(){
            clean();
            cout<<content;

    }
    void back(){
        if(last_win!=NULL){
            last_win->restore(this);
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
    Key key;
        menu(string title,vector<option*> list,menu*last_win,bool uni_title=false){
            index=0;
            this->last_win=last_win;
            this->list=list;
            this->title=uni_title?
            title:(last_win?last_win->title+">":"")+title;
        };
        ~menu(){
            for(option* opt : list){
        delete opt;  // 释放每个 option 对象
    }
    list.clear();
    key.stop();
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
        void restore(menu *del_win=nullptr){
            creat_content();
            this->print();
            if(del_win){
                delete del_win;}
            if(key.isStop()){
                key.restart();}
            if(key.isPause()){
                key.resume();
            }
        }
        void open(){
            creat_content();
            this->print();
            key.up([this](){up();});
            key.down([this](){down();});
            key.enter([this](){
                if(index==list.size()){
                    this->back();
                    key.stop();
                }
                else{
                    if(list[index]->pause)
                        key.pause();
                    else
                        key.stop();
                    list[index]->func();
                }
            });
            key.run();
        }
};