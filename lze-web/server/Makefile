CC = gcc
CFLAGS = -Wall -O2 -g
SRC_DIR = .
PUBLIC_SRC = $(SRC_DIR)/public/*

# 查找 src 目录下的所有 .c 文件，排除 public 子目录
SRCS = $(shell find $(SRC_DIR) -type f -name '*.c' -not -path '$(SRC_DIR)/public/*')
# 生成对应的可执行文件名（去掉 .c 后缀）
OBJS = $(SRCS:.c=)

# 默认目标
all: $(OBJS)

# 编译规则，每个 .c 文件链接 public/public.c
$(SRC_DIR)/%: $(SRC_DIR)/%.c $(PUBLIC_SRC)
	$(CC) -g $(CFLAGS) -o $@ $< $(PUBLIC_SRC)

# 清理目标
clean:
	rm -f $(OBJS)

.PHONY: all clean
