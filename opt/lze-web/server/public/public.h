#ifndef PBU_H
#define PBU_H
#include <stdio.h>
typedef struct FOLDER
{
    char *name;
    struct FOLDER *next;
}folder_list;
typedef struct FILE
{
    char *name;
    struct FILE *next;
}file_list;
int post(char *data, int max_len);
void list_directory(char *path, folder_list* folder, file_list* file); 
char * concat_path(char *base_path,char * target_path);
char* end_splash(char* path);
char* get_folder(char* path);
char * get_parent_folder(char* path);
int folder_count(char* path);
void http_out(char *format, ...); 
char* read_file(char*path);
long get_file_size(FILE * file);
#endif