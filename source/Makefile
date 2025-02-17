CC = gcc
CFLAGS = -Wall -O2 
LDFLAGS = -lm

SRC_DIR = server
SRCS = $(wildcard $(SRC_DIR)/**/*.c) lze-web.c
OBJS = $(SRCS:.c=.o)

TARGET = lze-web

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET)
