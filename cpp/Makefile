CXX = g++
CXXFLAGS = -Wall -std=c++17

SRC = main.cpp key.cpp
OBJ = $(SRC:.cpp=.o)
TARGET = app

all: $(TARGET)

$(TARGET): $(OBJ)
	$(CXX) $(OBJ) -o $(TARGET)

clean:
	rm -f $(OBJ) $(TARGET)

