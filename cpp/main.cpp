#include <iostream>
#include"clean.h"
#include"all_win.hpp"
#include <csignal>
#include"public.h"
using namespace std;
void signal_handler(int signum) {
    restore();
    std::_Exit(signum);
}
void on_exit_cleanup() {
    restore();
}
int main() {
    init();
    std::signal(SIGINT, signal_handler);
    std::atexit(on_exit_cleanup);
     create_win();
     main_win();
    return 0;
}