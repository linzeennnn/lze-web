#pragma once
#include <string>
#include <functional>
using namespace std;

class option {
public:
    string name;
    std::function<void()> func;  

    option(string name, std::function<void()> f)
        : name(name), func(f) {}
};
