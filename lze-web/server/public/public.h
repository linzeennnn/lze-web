#ifndef PBU_H
#define PBU_H
#include <stdio.h>          // 标准输入输出
#include <time.h>           // 时间处理
#include <stdlib.h>         // 内存管理、程序退出等
#include <dirent.h>         // 目录操作
#include <sys/stat.h>       // 文件状态
#include <string.h>         // 字符串处理
#include <unistd.h>         // Unix 标准函数
#include <stdarg.h>         // 可变参数
#include "cJSON.h"          // cJSON 库
typedef struct FOLDER
{
    char *name;
    time_t time;
    struct FOLDER *next;
}folder_list;
typedef struct FILE
{
    char *name;
    time_t time;
    struct FILE *next;
}file_list;

int post(char *data, int max_len);
void list_directory(char *path, folder_list* folder, file_list* file); 
char * concat_path(char *base_path,char * target_path);
char* end_splash(char* path);
char* get_folder(char* path);
void get_parent_folder(char* path);
int folder_count(char* path);
void http_out(int type,char *format, ...); 
char* read_file(char*path);
long get_file_size(FILE * file);
void sort_file(folder_list*folder_head,file_list*file_head);
void split_exten(char*name);
void split_index(char*name);
char* file_exit(char*name,char*path);
void list_all(char *base_path);
void log(const char *format, ...);
int check_exit(char*list[],char*name,int length);
#endif