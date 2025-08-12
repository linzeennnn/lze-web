#pragma once
#include <iostream>
#include <functional>
#include <unordered_map>
#include <thread>
#include <chrono>
using namespace std;
#if defined(_WIN32) || defined(_WIN64)
    #include <conio.h>
#else
    #include <termios.h>
    #include <unistd.h>
#endif

class Key {
public:
    using Callback = std::function<void()>;

    void left(Callback fn) { handlers["left"] = fn; }
    void right(Callback fn) { handlers["right"] = fn; }
    void up(Callback fn) { handlers["up"] = fn; }
    void down(Callback fn) { handlers["down"] = fn; }
    void enter(Callback fn) { handlers["enter"] = fn; }
    void esc(Callback fn) { handlers["esc"] = fn; }

    void stop() { stoprun = true; }
    void restart() { stoprun = false; this->run(); }

    void pause() { paused = true; }
    void resume() { 
        paused = false;
    }
    bool isStop(){ return stoprun;}
    bool isPause(){ return paused;}
    void run() {
        while (!stoprun) {
            if (paused) {
                // 暂停时，等待少许时间，避免CPU占用过高
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
                continue;
            }

            std::string key = getKey();
            if (!key.empty() && handlers.count(key)) {
                handlers[key]();
                if (key == "esc") {
                    std::cout << "stop" << std::endl;
                    stoprun = true;
                }
            }
        }
    }

    Key() : stoprun(false), paused(false) {}

private:
    bool stoprun;
    bool paused;
    std::unordered_map<std::string, Callback> handlers;

#if defined(_WIN32) || defined(_WIN64)
    std::string getKey() {
        int ch = _getch();
        if (ch == 0 || ch == 224) {
            int ch2 = _getch();
            switch (ch2) {
                case 72: return "up";
                case 80: return "down";
                case 75: return "left";
                case 77: return "right";
                default: return "";
            }
        } else if (ch == 13) {
            return "enter";
        } else if (ch == 27) {
            return "esc";
        }
        return "";
    }
#else
    char getch() {
        struct termios oldt, newt;
        char ch;
        tcgetattr(STDIN_FILENO, &oldt);
        newt = oldt;
        newt.c_lflag &= ~(ICANON | ECHO);
        tcsetattr(STDIN_FILENO, TCSANOW, &newt);
        ch = getchar();
        tcsetattr(STDIN_FILENO, TCSANOW, &oldt);
        return ch;
    }

    std::string getKey() {
        char ch = getch();
        if (ch == 27) {  // ESC 或方向键
            char ch1 = getch();
            if (ch1 == '[') {
                char ch2 = getch();
                switch (ch2) {
                    case 'A': return "up";
                    case 'B': return "down";
                    case 'C': return "right";
                    case 'D': return "left";
                    default: return "";
                }
            } else {
                return "esc";
            }
        } else if (ch == '\n') {
            return "enter";
        }
        return "";
    }
#endif
};
