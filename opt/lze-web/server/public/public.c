#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include <unistd.h> 
#include "public.h"
#include "cJSON.h"
// 扫描目录
void list_directory(char *path, folder_list* folder, file_list* file) {
    struct dirent *entry;
    struct stat statbuf;
    DIR *dir = opendir(path);
    if (dir == NULL) {
        perror("无法打开目录");
        return;
    }
    while ((entry = readdir(dir)) != NULL) {
        char *filename = entry->d_name;
            char *full_path = concat_path(path, filename);
        if (stat(full_path, &statbuf) == -1) {
            perror("获取文件状态失败");
            free(full_path);
            continue;
        }
        free(full_path);
        if (strcmp(filename, ".") == 0 || strcmp(filename, "..") == 0) {
            continue;
        }
        if (S_ISDIR(statbuf.st_mode)) {
            if (folder != NULL) {
            folder->next=(folder_list*)malloc(sizeof(folder_list));
            folder->next->name=(char*)malloc(strlen(filename)+1);
            folder->next->name=strcpy(folder->next->name,filename);
            folder->next->next=NULL;
            folder=folder->next;
            }
        } else {
            file->next=(file_list*)malloc(sizeof(file_list));
            file->next->name=(char*)malloc(strlen(filename)+1);
            file->next->name=strcpy(file->next->name,filename);
            file->next->next=NULL;
            file=file->next;
        }
    }
    closedir(dir);
}
// 加斜杆
char* end_splash(char* path){
  int lenght=strlen(path)-1;
  if(path[lenght]!='/')
    strcat(path,"/");
else if (path[lenght]=='/'&&path[lenght-1]=='/')
    path[lenght]='\0';
else if (path[lenght]==' '&&path[lenght-1]=='/')
    path[lenght]='\0';
  return path;
}
// 获取目录名
char* get_folder(char* path){
int end_name=strlen(path)-2,i,head_index,end_index=strlen(path)-1;
for(i=end_name;i>=0;i--){
    if(path[i]=='/'){
        head_index=i;
        break;
    }
    else
        continue;
}
char *folder_name=(char*)malloc(end_index-head_index+1);
head_index++;
for(i=0;head_index!=end_index;head_index++,i++){
    folder_name[i]=path[head_index];
}
return folder_name;
}
// 获取父目录
char * get_parent_folder(char* path){
    char * cpy_path=(char*)malloc(strlen(path));
    strcpy(cpy_path,path);
        int i=strlen(cpy_path)-1;
        cpy_path[i]='\0';
    for(i;cpy_path[i]!='/';i--){
        cpy_path[i]='\0';
    }
    return get_folder(cpy_path);
}
// 判断是否只有多个目录
int folder_count(char* path){
    int status=0;
    int head=0,end=strlen(path)-1;
    path = (path == '/') ? path + 1 : path;
    path[end]=(path[end]=='/')? path[end]='\0':path[end];
    while (*path)
    {   
        if(*path=='/'){
            status=1;
            break;;
        }
        path++;
    }
    return status;
}
// 拼接路径
char * concat_path(char *base_path,char * target_path){
    char *full_path=malloc(strlen(base_path)+strlen(target_path)+2);
    strcpy(full_path, base_path);
    strcat(full_path, target_path);
    return full_path;
}

// 获取POST
int post(char *data, int max_len) {
    int content_length = 0;
    char *content_len_str = getenv("CONTENT_LENGTH");
    
    if (content_len_str != NULL) {
        content_length = atoi(content_len_str);
    }
    if (content_length == 0) {
        return 0;
    }
    int bytes_read = 0;
    while (bytes_read < content_length) {
        int n = read(STDIN_FILENO, data + bytes_read, max_len - bytes_read);
        if (n == -1) {
            return -1;
        }
        bytes_read += n;
    }
    data[bytes_read] = '\0'; 
    return bytes_read;
}