#pragma once
#include <string>
#include <functional>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;
class option {
public:
    string name;
    std::function<void()> func;  
    json* info;
    bool pause;

    option(string name, std::function<void()> f,json* info=nullptr)
        : name(name), func(f), info(info){}
};
