#pragma once
#include <string>
#include <functional>
using namespace std;

class option {
public:
    string name;
    std::function<void()> func;  
    json* info;
    bool pause;

    option(string name, std::function<void()> f,json* info=nullptr)
        : name(name), func(f), info(info){}
};
