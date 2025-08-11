# 自动检测平台
UNAME_S := $(shell uname -s)

# 根据平台选择编译器
ifeq ($(UNAME_S), Darwin)  # macOS
    CXX = clang++
    FS_LIB =               # 新版 clang/libc++ 不需要额外链接
else                        # Linux
    CXX = g++
    FS_LIB =               # 如果是 GCC < 9，可改成 -lstdc++fs
endif

CXXFLAGS = -Wall -O2 -std=c++17
SRC = $(shell find . -name "*.cpp")
OBJ = $(SRC:.cpp=.o)
TARGET = lze-web-config-cli

all: $(TARGET) clean

$(TARGET): $(OBJ)
	$(CXX) $(OBJ) -o $(TARGET) $(FS_LIB)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJ)
