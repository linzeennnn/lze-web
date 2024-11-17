#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include "../public/public.h"
#include "../public/cJSON.h"
int main() {
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *folder_item = cJSON_GetObjectItem(rec_json, "folder");
    char *current_folder= folder_item->valuestring;
    cJSON *file_message=cJSON_CreateObject();
    cJSON *files = cJSON_CreateArray();
    cJSON *folders = cJSON_CreateArray();
   folder_list *folder;
   file_list * file;
   folder=(folder_list*)malloc(sizeof(folder_list));
   file=(file_list*)malloc(sizeof(file_list));
   folder->next=NULL;
   file->next=NULL;
    char *base_path = "../../file/trash/"; 
   char *parent_folder;
    if(current_folder[0]=='/'){
        int i;
        for(i=0;i<strlen(current_folder)-1;i++){
            current_folder[i]=current_folder[i+1];
        }
        current_folder[i]='\0';
    }
    char * dest_path=concat_path(base_path,current_folder);
    dest_path=end_splash(dest_path);
    if(current_folder[0] == '\0' || strcmp(current_folder, " ") == 0 || strcmp(current_folder, "/") == 0){
        parent_folder="";
}
    else {
        if(folder_count(current_folder)==1){
            parent_folder=get_parent_folder(dest_path);
        }
        else
            parent_folder="";
    }
    list_directory(dest_path,folder,file);
        folder=folder->next;
        file=file->next;
    while (folder!=NULL)
    {
        cJSON_AddItemToArray(folders, cJSON_CreateString(folder->name));
        folder=folder->next;
    }
    while (file)
    {
        cJSON_AddItemToArray(files, cJSON_CreateString(file->name));
        file=file->next;
    }
    cJSON_AddItemToObject(file_message, "files", files);
    cJSON_AddItemToObject(file_message, "folders", folders);
    cJSON_AddItemToObject(file_message, "currentFolder", cJSON_CreateString(current_folder));
    cJSON_AddItemToObject(file_message, "parentFolder", cJSON_CreateString(parent_folder));
    char *printed_json = cJSON_Print(file_message);
    http_out("%s\n", printed_json);
    free(dest_path);
    return 0;
}
