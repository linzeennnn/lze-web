#include "public.h"

void list_all(char*share[], char *base_path) {
    key_t key=atol(share[0]);
    size_t body_size=atol(share[1]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *folder_item = cJSON_GetObjectItem(rec_json, "folder");
    char *current_folder = folder_item->valuestring;
    folder_list *folder = (folder_list*)malloc(sizeof(folder_list));
    file_list *file = (file_list*)malloc(sizeof(file_list));
    link_dir *link_d = (link_dir*)malloc(sizeof(link_dir));
    link_file *link_f = (link_file*)malloc(sizeof(link_file));
    folder->next = NULL;
    file->next = NULL;
    link_d->next = NULL;
    link_f->next = NULL;
    char *parent_folder = (char*)malloc(strlen(current_folder) + 1);
    strcpy(parent_folder, current_folder);
    get_parent_folder(parent_folder);
    if (current_folder[0] == '/') {
        int i;
        for (i = 0; i < strlen(current_folder) - 1; i++) {
            current_folder[i] = current_folder[i + 1];
        }
        current_folder[i] = '\0';
    }
    char *dest_path = concat_path(base_path, current_folder);
    dest_path = end_splash(dest_path);
    list_directory(dest_path, folder, file, link_d, link_f);
   folder_list* folder_node = folder->next;
   file_list* file_node = file->next;
   link_dir* link_d_node = link_d->next;
   link_file* link_f_node = link_f->next;
    file_array* array=sort_all(folder,file,link_d,link_f)->next;
    cJSON*output=cJSON_CreateObject();
    cJSON *file_list = cJSON_CreateArray();
    cJSON *file_name=cJSON_CreateObject();
    while (array!=NULL)
    {
        cJSON_AddStringToObject(file_name, array->name, array->type);
        array=array->next;
    }
    cJSON_AddItemToArray(file_list,file_name);
    cJSON_AddItemToObject(output,"file_list",file_list);
    cJSON_AddItemToObject(output, "currentFolder", cJSON_CreateString(current_folder));
    cJSON_AddItemToObject(output, "parentFolder", cJSON_CreateString(parent_folder));
    char *printed_json = cJSON_PrintUnformatted(output);
    free(dest_path);
    strcpy(post_data,printed_json);
        shmdt(post_data);
}