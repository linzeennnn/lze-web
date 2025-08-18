#pragma once
#include <iostream>
#include <termios.h>
#include <unistd.h>
using namespace std;

static struct termios orig_termios;
static struct termios raw_termios;
static bool raw_mode_enabled = false;

// 进入备用屏幕 + raw 模式
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

// 清屏
inline void clean() {
    std::cout << "\033[2J\033[H" << std::flush;
}

// 恢复主屏幕并退出 raw 模式
inline void restore() {
    if (raw_mode_enabled) {
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios);
        raw_mode_enabled = false;
    }
    std::cout << "\033[?25h";       // 显示光标
    std::cout << "\033[?1049l" << std::flush; // 退出备用屏幕
}

// 进入可编辑模式（清屏 + 恢复终端输入输出）
inline void create_edit_win() {
    struct termios t;
    tcgetattr(STDIN_FILENO, &t);
    t.c_lflag |= (ECHO | ICANON);   // 强制打开行缓冲和回显
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &t);

    raw_mode_enabled = false;
    std::cout << "\033[?25h" << std::flush; // 显示光标
    
}


// 退出可编辑模式，回到 create_win() 状态
inline void close_edit_win() {
    if (!raw_mode_enabled) {
        // 从编辑模式切回 raw 模式
        tcgetattr(STDIN_FILENO, &orig_termios);  // 先拿到当前模式
        raw_termios = orig_termios;
        raw_termios.c_lflag &= ~(ECHO | ICANON);
        raw_termios.c_cc[VMIN] = 1;
        raw_termios.c_cc[VTIME] = 0;
        tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw_termios);

        raw_mode_enabled = true;
        // 隐藏光标，保持 UI 模式
        std::cout << "\033[?25l" << std::flush;
    }
}
