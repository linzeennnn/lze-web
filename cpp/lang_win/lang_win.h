#include "../option.h"
#include "../menu.h"
#include "../public.h"
#include "../key.h"
#include "../clean.h"
class lang_win{
    private:
    int index;
    string content;
    vector<option*>list;
    menu * last_win;
    void creat_content(){
        content=split_line('=')+'\n';
        for(size_t i=0;i<list.size();i++){
            if(i==index)
                content+=" >"+list[i]->name+'\n';
            else
                content+="  "+list[i]->name+'\n';
        }
        content+=split_line('=');
    }
    void print(){
        clean();
        cout<<content;
    }
    public:
    Key key;
    void open(){
        creat_content();
        print();
        key.down([this](){this->down();});
        key.up([this](){this->up();});
        key.enter([this](){this->enter();});
        key.run();
    }
    void up(){
        index=index==0?(list.size()-1):index-1;
        creat_content();
        print();
    }
    void down(){
        index=index==list.size()-1?0:index+1;
        creat_content();
        print();
    }
    void enter(){
        list[index]->func();
        key.stop();
    }
    lang_win(vector<option*> list){
        index=0;
        this->list=list;
    }
    ~lang_win(){
            for(option* opt : list){
        delete opt;  // 释放每个 option 对象
    }
    list.clear();
}
};


void open_lang(lang_win** win);