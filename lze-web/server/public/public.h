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
#include <libgen.h>  // 包含 basename() 和 dirname() 函数
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

int post(char *data, int max_len);// 获取POST
void list_directory(char *path, folder_list* folder, file_list* file); // 扫描目录
char * concat_path(char *base_path,char * target_path);// 拼接路径
char* end_splash(char* path);// 加斜杆
char* get_folder(char* path);// 获取目录名
void get_parent_folder(char* path);// 获取父目录
int folder_count(char* path);// 判断是否只有多个目录
void http_out(int type,char *format, ...); // http输出
char* read_file(char*path);// 读取文件
void sort_file(folder_list*folder_head,file_list*file_head);// 文件排序
void split_exten(char*name);// 去除后缀
void split_index(char*name);
char* file_exit(char*name,char*path);// 检查文件存在
void list_all(char *base_path);
void log(const char *format, ...);// 日志
int check_exit(char*list[],char*name,int length);// 检查文件名存在
int is_file(const char *path);//列出目录所有内容并发送json
void copy (char *source,char *dest);// 复制文件
long get_size(FILE *file);// 获取文件大小
char *add_file_index(char *name,int index);// 给文件加序号
#endif