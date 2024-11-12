#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include "public.h"
#include "cJSON.h"
void list_directory(char *path, cJSON *json) {
    struct dirent *entry;
    struct stat statbuf;
    DIR *dir = opendir(path);

    if (dir == NULL) {
        perror("无法打开目录");
        return;
    }

    printf("目录：%s\n", path);

    // 遍历目录中的每个条目
    while ((entry = readdir(dir)) != NULL) {
        char filepath[1024];
        snprintf(filepath, sizeof(filepath), "%s/%s", path, entry->d_name);

        // 获取文件的属性信息
        if (stat(filepath, &statbuf) == -1) {
            perror("获取文件状态失败");
            continue;
        }

        // 排除 "." 和 ".." 目录
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }

        // 判断是否为目录
        if (S_ISDIR(statbuf.st_mode)) {
             cJSON_AddItemToArray(folders, cJSON_CreateString(entry->d_name));
        } else {
           cJSON_AddItemToArray(files, cJSON_CreateString(entry->d_name));
        }
    }
    closedir(dir);
    cJSON_AddItemToObject(json, "folders", folders);
    cJSON_AddItemToObject(json, "files", files);
}
char * concat_path(char *base_path,char * target_path){
    char *full_path=malloc(strlen(base_path)+strlen(target_path)+1);
    strcpy(full_path, base_path);
    strcat(full_path, target_path);
    return full_path;
}