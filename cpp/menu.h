#include <iostream>
#include <vector>
#include <string>
#include"clean.h"
#include"split_line.h"
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
        split_line('-')+"\n";
        for(int i=0;i<list.size();i++){
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
            cout<<"关闭成功!";
            exit(0);
        }
    }
    public:
        menu(string title,vector<option*> list,menu*last_win){
            index=0;
            this->last_win=last_win;
            this->list.push_back(new option("返回",[this]() {
            this->back();
        }));
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
           index= index==0?list.size()-1:index-1;
            creat_content();
            this->print();
        }
        void down(){
           index= index==list.size()-1?0:index+1;
            creat_content();
            this->print();
        }
        void open(){
            this->print();
        }
};