# 检测系统
UNAME_S := $(shell uname -s)

ifeq ($(UNAME_S), Darwin) # macOS
    CXX = clang++
    DEBUG_FLAGS = -fstandalone-debug
    DEBUGGER = lldb
else # Linux
    CXX = g++
    DEBUG_FLAGS =
    DEBUGGER = gdb
endif

CXXFLAGS = -Wall -O2 -std=c++17
SRC = $(shell find . -name "*.cpp")
OBJ = $(SRC:.cpp=.o)
TARGET = lze-web-config-cli

# 正常编译
all: CXXFLAGS += -g
all: $(TARGET) clean_obj

# 调试编译
debug: CXXFLAGS += -g $(DEBUG_FLAGS)
debug: $(TARGET)
	$(DEBUGGER) ./$(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(OBJ) -o $(TARGET)

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# 编译后删除 .o（正常模式）
clean_obj:
	rm -f $(OBJ)

# 彻底清理
clean:
	rm -f $(OBJ) $(TARGET)

.PHONY: all debug clean clean_obj
