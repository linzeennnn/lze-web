#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include "../public/public.h"
#include "../public/cJSON.h"
extern void list_directory();
extern char* concat_path();
int main() {
    char *base_path = "../../file/Documents/upload/"; 
    char target_dir[100];
    printf("input :");
    scanf("%s",target_dir);
    char * dest_path=concat_path(base_path,target_dir);
    list_directory(dest_path);
    
    free(dest_path);
    return 0;
}
