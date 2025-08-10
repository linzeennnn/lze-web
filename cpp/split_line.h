#pragma once
#ifndef SPLIT_LINE_H
#define SPLIT_LINE_H

#include <string>

#ifdef _WIN32
#include <windows.h>
#else
#include <sys/ioctl.h>
#include <unistd.h>
#endif

inline int get_terminal_width() {
#ifdef _WIN32
    CONSOLE_SCREEN_BUFFER_INFO csbi;
    if (GetConsoleScreenBufferInfo(GetStdHandle(STD_OUTPUT_HANDLE), &csbi)) {
        return csbi.srWindow.Right - csbi.srWindow.Left + 1;
    }
    return 80; // 默认宽度
#else
    struct winsize w;
    if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &w) == 0) {
        return w.ws_col;
    }
    return 80; // 默认宽度
#endif
}

inline std::string split_line(char ch) {
    int width = get_terminal_width();
    return std::string(width, ch);
}

#endif // SPLIT_LINE_H
