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
    bool close=false;
    string content;
    vector<option*> list;
    size_t max_list_show=9;
    int index;
    void open_confirm(menu* last_win){
        menu *confirm_win;
        vector<option*> list={
            new option(text_box("save"),[](){
                save_config();
                exit(0);
            }),
            new option(text_box("dontSave"),[](){exit(0);})
        };
        confirm_win=new menu("  "+get_text("notSave"),list,true);
        menu_list.push(confirm_win);
        confirm_win->open();
}
    void creat_content(){
        content=split_line('=');
        content+=title+"\n"+
        split_line('-')+"\n"+
        (index==list.size()?(" >"+text_box("back"))
        :("  "+text_box("back")))+"\n";
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
            tmp_menu=this;
            menu_list.pop();
        if(!menu_list.empty()){
            menu_list.top()->open();
        }else{
            if(edit){
                open_confirm(this);
            }
            else
                exit(0);
        }
    }
    void key_bind(){
            key.up([this](){up();});
            key.down([this](){down();});
            key.enter([this](){enter();});
    }
    public:
    Key key;
    void pause(){
        close=true;
    }
    string title;
        menu(string title,vector<option*> list,bool uni_title=false){
            index=0;
            this->list=list;
            if(uni_title){
                this->title=title;
            }else{
                this->title=tmp_title+">"+title;
                tmp_title=this->title;
            }
        };
        ~menu(){
            for(option* opt : list){
        delete opt;  // 释放每个 option 对象
    }
        close=true;
        std::this_thread::sleep_for(std::chrono::milliseconds(101));
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
        void enter(){
                if(index==list.size()){
                    this->back();
                }
                else{
                    list[index]->func();
                }

        }
        void restore(){
           

            creat_content();
            this->print();
            key.resume();
        }
        void open(){
                 if(tmp_menu){
                delete tmp_menu;
                tmp_menu=nullptr;
            }
            key_bind();
            creat_content();
            this->print();
            key.run();
        }
};