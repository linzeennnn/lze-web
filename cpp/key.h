#pragma once
#include <iostream>
#include <thread>
#include <atomic>
#include <functional>
#include <termios.h>
#include <unistd.h>
class Key {
public:
    Key() : running(false), paused(false) {}
    ~Key() { stop(); }

    void run() {
        if (running) return;
        running = true;
        listenerThread = std::thread(&Key::listen, this);
    }

    void stop() {
    running = false;
    if (listenerThread.joinable()) {
        if (std::this_thread::get_id() == listenerThread.get_id()) {
            listenerThread.detach(); // 线程自己调用就 detach
        } else {
            listenerThread.join();
        }
    }
}
    void pause() { paused = true; }
    void resume() { paused = false; }

    void up(std::function<void()> func) { upFunc = func; }
    void down(std::function<void()> func) { downFunc = func; }
    void enter(std::function<void()> func) { enterFunc = func; }

private:
    std::atomic<bool> running;
    std::atomic<bool> paused;
    std::thread listenerThread;

    std::function<void()> upFunc;
    std::function<void()> downFunc;
    std::function<void()> enterFunc;

    void listen() {
        termios orig_termios;
        tcgetattr(STDIN_FILENO, &orig_termios);
        termios new_termios = orig_termios;
        new_termios.c_lflag &= ~(ICANON | ECHO);
        tcsetattr(STDIN_FILENO, TCSANOW, &new_termios);

        while (running) {
            if (!paused) {
                char ch;
                if (read(STDIN_FILENO, &ch, 1) == 1) {
                    if (ch == '\033') { // ESC 开头的方向键
                        char seq[2];
                        if (read(STDIN_FILENO, &seq[0], 1) == 0) continue;
                        if (read(STDIN_FILENO, &seq[1], 1) == 0) continue;
                        if (seq[0] == '[') {
                            if (seq[1] == 'A' && upFunc) upFunc();    // 上
                            if (seq[1] == 'B' && downFunc) downFunc(); // 下
                        }
                    } else if (ch == '\n' && enterFunc) {
                        enterFunc();
                    }
                }
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }

        tcsetattr(STDIN_FILENO, TCSANOW, &orig_termios);
    }
};
