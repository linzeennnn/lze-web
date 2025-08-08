#pragma once
#include <iostream>

#if defined(_WIN32) || defined(_WIN64)
#include <windows.h>
static HANDLE hOld;
inline void enter_run_win() {
    hOld = GetStdHandle(STD_OUTPUT_HANDLE);
    HANDLE hNew = CreateConsoleScreenBuffer(
        GENERIC_READ | GENERIC_WRITE,
        0, NULL, CONSOLE_TEXTMODE_BUFFER, NULL
    );
    SetConsoleActiveScreenBuffer(hNew);
}
inline void leave_run_win() {
    SetConsoleActiveScreenBuffer(hOld);
}
#else
inline void enter_run_win() {
    std::cout << "\033[?1049h" << std::flush; // 备用缓冲区
}
inline void leave_run_win() {
    std::cout << "\033[?1049l" << std::flush; // 恢复缓冲区
}
#endif
