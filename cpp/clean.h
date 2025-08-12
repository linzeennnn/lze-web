#pragma once
#include <iostream>
#include <termios.h>
#include <unistd.h>
using namespace std;

static struct termios orig_termios;
static struct termios raw_termios;
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
        raw_termios = orig_termios;
        raw_termios.c_lflag &= ~(ECHO | ICANON);  // 保留 ISIG，允许 ctrl+c 产生信号
        raw_termios.c_cc[VMIN] = 1;
        raw_termios.c_cc[VTIME] = 0;
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw_termios);
        raw_mode_enabled = true;
    }
}

inline void clean() {
    // 清除备用屏幕缓冲区内容，光标移回左上
    std::cout << "\033[2J\033[H" << std::flush;
}

inline void restore() {
    if (raw_mode_enabled) {
        // 恢复终端属性
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios);
        raw_mode_enabled = false;
    }

    // 显示光标
    std::cout << "\033[?25h";
    // 退出备用屏幕缓冲区，恢复主屏幕内容
    std::cout << "\033[?1049l" << std::flush;
}

// 开启编辑模式（恢复 ECHO 和 ICANON）
inline void edit_mode() {
    struct termios t;
    tcgetattr(STDIN_FILENO, &t);
    t.c_lflag |= (ICANON | ECHO);  // 打开标准输入和回显
    tcsetattr(STDIN_FILENO, TCSANOW, &t);
}


// 禁用编辑模式（回到 raw 模式）
inline void disable_edit_mode() {
    if (raw_mode_enabled) {
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw_termios);
        // 隐藏光标
        std::cout << "\033[?25l" << std::flush;
    }
}