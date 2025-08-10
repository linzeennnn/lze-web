#pragma once
#include <iostream>
#include <termios.h>
#include <unistd.h>
using namespace std;
// termios struct is defined in termios.h.
// 保存终端原始设置，保证恢复时能用
static struct termios orig_termios;
static bool raw_mode_enabled = false;

inline void create_win() {
    // 进入备用屏幕缓冲区
    std::cout << "\033[?1049h";
    // 清屏并光标移到左上
    std::cout << "\033[2J\033[H";
    // 隐藏光标
    std::cout << "\033[?25l" << std::flush;

    if (!raw_mode_enabled) {
        tcgetattr(STDIN_FILENO, &orig_termios);
        struct termios raw = orig_termios;
        raw.c_lflag &= ~(ECHO | ICANON);  // 保留 ISIG，允许 ctrl+c 产生信号
        raw.c_cc[VMIN] = 1;
        raw.c_cc[VTIME] = 0;
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw);
        raw_mode_enabled = true;
    }
}

inline void clean() {
    // 清除备用屏幕缓冲区内容，光标移回左上
    std::cout << "\033[2J\033[H" << std::flush;
}

inline void restore() {
    if (raw_mode_enabled) {
        cout<<11111<<endl;
        // 将终端设置为原始模式时的状态
        // 恢复终端属性
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios);
        raw_mode_enabled = false;
    }

    // 显示光标
    std::cout << "\033[?25h";

    // 退出备用屏幕缓冲区，恢复主屏幕内容
    std::cout << "\033[?1049l" << std::flush;
}
