#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>

void list_directory(const char *path) {
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
            printf("[目录] %s\n", entry->d_name);
        } else {
            printf("[文件] %s\n", entry->d_name);
        }
    }

    closedir(dir);
}

int main() {
    char *path = "../../file/Documents/upload/"; // 指定目录路径
    char *target_dir;
    printf("input :");
    scanf("%s",target_dir);
    char *full_path=malloc(strlen(path) + strlen(target_dir) + 1);
    strcpy(full_path, path);
    strcat(full_path, target_dir);
    list_directory(full_path);
    return 0;
}
