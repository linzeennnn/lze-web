#pragma once
#include <iostream>

#if defined(_WIN32) || defined(_WIN64)
#include <windows.h>
#endif

inline void clean() {
#if defined(_WIN32) || defined(_WIN64)
    HANDLE hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hConsole == INVALID_HANDLE_VALUE) return;

    CONSOLE_SCREEN_BUFFER_INFO csbi;
    if (!GetConsoleScreenBufferInfo(hConsole, &csbi)) return;

    // 将缓冲区高度设置为窗口高度，清除滚动历史
    csbi.dwSize.Y = csbi.srWindow.Bottom - csbi.srWindow.Top + 1;
    SetConsoleScreenBufferSize(hConsole, csbi.dwSize);

    DWORD cellCount = csbi.dwSize.X * csbi.dwSize.Y;
    DWORD count;
    COORD homeCoords = {0, 0};

    FillConsoleOutputCharacter(hConsole, (TCHAR)' ', cellCount, homeCoords, &count);
    FillConsoleOutputAttribute(hConsole, csbi.wAttributes, cellCount, homeCoords, &count);
    SetConsoleCursorPosition(hConsole, homeCoords);
#else
    // Linux/macOS: 清除历史缓冲区 + 清屏
    std::cout << "\033[3J\033[H\033[2J" << std::flush;
#endif
}
