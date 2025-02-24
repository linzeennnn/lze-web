#ifndef PBU_H
#define PBU_H
#include <stdio.h>          // 标准输入输出
#include <time.h>           // 时间处理
#include <utime.h>          //更新时间
#include <stdlib.h>         // 内存管理、程序退出等
#include <dirent.h>         // 目录操作
#include <sys/stat.h>       // 文件状态
#include <string.h>         // 字符串处理
#include <unistd.h>         // Unix 标准函数
#include <stdarg.h>         // 可变参数
#include "cJSON.h"          // cJSON 库
#include "cgic.h"           // cgic库
#include "mongoose.h"           // http库
#include <sys/shm.h>        //共享内存
#include <sys/ipc.h>        //共享内存通信
#include <libgen.h>  // 包含 basename() 和 dirname() 函数
#include <sys/sendfile.h>   //发送文件
#include <fcntl.h>          //open函数,操作文件
#define CON_KEY "/temp/lze_config_key" 
#define PROJ_ID 77     
#define HOME_PATH "/opt/lze-web/file/"
#define DOC_PATH "/opt/lze-web/file/Documents/"
#define PIC_PATH "/opt/lze-web/file/Pictures/"
#define NOT_PATH "/opt/lze-web/file/Note/"
#define BOK_PATH "/opt/lze-web/file/Bookmark/"
#define TRA_PATH "/opt/lze-web/file/trash/"
#define DATA_PATH "/opt/lze-web/file/data/"
#define TMP_PATH "/opt/lze-web/file/temp/" 
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
typedef struct LINK_DIR
{
    char *name;
    time_t time;
    struct LINK_DIR *next;
}link_dir;
typedef struct LINK_FILE
{
    char *name;
    time_t time;
    struct LINK_FILE *next;
}link_file;
typedef struct FILE_ARRAY
{
    char *name;
    time_t time;
    char*type;
    struct FILE_ARRAY *next;
}file_array;
typedef struct USER_DATA
{
    char *token;
    char *password;
    char* token_time;
}user_data;
int post(char *data, int max_len);// 获取POST
void list_directory(char *path, folder_list* folder_head, file_list* file_head, link_dir *link_dir_head, link_file *link_file_head); // 扫描目录
char * concat_path(char *base_path,char * target_path);// 拼接路径
char* end_splash(char* path);// 加斜杆
char* get_folder(char* path);// 获取目录名
void get_parent_folder(char* path);// 获取父目录
int folder_count(char* path);// 判断是否只有多个目录
void http_out(int type,char *format, ...); // http输出
char* read_file(char*path);// 读取文件
void sort_file(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head);// 文件排序
file_array* sort_all(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head);//排序所有类型文件
void split_exten(char*name);// 去除后缀
void split_index(char*name);
char* file_exit(char* ori_name, char* path);// 检查文件存在
void list_all(char *base_path);
void log(const char *string);// 日志
int check_exit(char*list[],char*name,int length);// 检查文件名存在
int is_file(const char *path);//列出目录所有内容并发送json
void copy (char *source,char *dest);// 复制文件
void cp_dir(char*source,char*dest);//复制目录
void copy_symlink(const char* source, const char* dest);//复制链接
long get_size(FILE *file);// 获取文件大小
char *add_file_index(char *name,int index);// 给文件加序号
int check_type(char *path);// 检测是文件还是目录还是符号链接(目录返回1文件返回2目录链接返回3文件链接返回4其他返回0)
void dir_p(char*path);//创建完整路径
void delete_directory(char *base_path);// 删除目录
int check_time(char *save_token,char*save_time);//检查过期
long get_time_stamp();//生成时间戳
char *gen_token();//生成token/
user_data *get_user_all(char *user);//获取用户所有数据
void update_token(char*user,char*token);// 更新配置文件token
void err_401(char*share[]);//401
void check_token(char*share[],char *user,char*token);//验证token
void check_action(char*share[],char*user,char*token,char*control,char*action);//检查操作权限
int login_remain_time(char*token,char*token_time);//剩余时长
int get_user_access(char*user);//获取用户拥有权限数
char *get_config();//获取配置
void free_filelist(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head);//释放文件链表内存


void not_upload(struct mg_http_message *hm);
#endif