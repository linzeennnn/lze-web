#include "../public/public.h"
void copy_symlink(const char* source, const char* dest) {
    char target[1024];
    ssize_t len = readlink(source, target, sizeof(target) - 1);
    if (len == -1) {
        perror("readlink");
        return;
    }
    target[len] = '\0';
    
    if (symlink(target, dest) == -1) {
        perror("symlink");
    }
}
void cp_dir(char*source,char*dest){
    mkdir(dest, 0755);
    folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
    file_list* file=(file_list*)malloc(sizeof(file_list));
    link_file*link_fi=(link_file*)malloc(sizeof(link_file));
    link_dir*link_fo=(link_dir*)malloc(sizeof(link_dir));
    folder_list *folder_count=(folder_list*)malloc(sizeof(folder_list));
    file_list* file_count=(file_list*)malloc(sizeof(file_list));
    link_file* link_file_count = (link_file*)malloc(sizeof(link_file));
    link_dir* link_dir_count = (link_dir*)malloc(sizeof(link_dir));
    folder->next=NULL;
    file->next=NULL;
    list_directory(source,folder,file,NULL,NULL);
    folder_count=folder->next;
    file_count=file->next;
    while (file_count!=NULL)
    {   
        copy(concat_path(source,file_count->name),concat_path(concat_path(dest,"/"),file_count->name));
        file_count=file_count->next;
    }
    while (link_file_count != NULL) {
        copy_symlink(concat_path(source, link_file_count->name), concat_path(concat_path(dest, "/"), link_file_count->name));
        link_file_count = link_file_count->next;
    }
    while (link_dir_count != NULL) {
        copy_symlink(concat_path(source, link_dir_count->name), concat_path(concat_path(dest, "/"), link_dir_count->name));
        link_dir_count = link_dir_count->next;
    }
    while (folder_count!=NULL)
    {
        cp_dir(concat_path(source,concat_path(folder_count->name,"/")),concat_path(concat_path(dest,"/"),folder_count->name));
        folder_count=folder_count->next;
    }
}
int main() {
    char *base_path="../../file/Documents/";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *copy_list=cJSON_GetObjectItem(rec_json, "copylist");
    cJSON *copylist_array = cJSON_Parse(copy_list->valuestring);
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char *dest_path=concat_path(base_path,nowpath->valuestring);
    for (int i=0;i<cJSON_GetArraySize(copylist_array);i++){
        cJSON *target = cJSON_GetArrayItem(copylist_array, i);
        char *source_path=concat_path(base_path,target->valuestring);
        char *file_name=file_exit(basename(source_path),dest_path);
        switch (check_type(source_path))
        {
        case 1:
            cp_dir(concat_path(source_path,"/"),concat_path(dest_path,file_name));
            break;
        case 2:
            copy(source_path,concat_path(dest_path,file_name));
        case 3:
            copy_symlink(source_path,concat_path(dest_path,file_name));
        case 4:
            copy_symlink(source_path,concat_path(dest_path,file_name));
        default:
            break;
        }   
    }
    printf("Content-Type: text/html\n\n");
    return 0;
}
