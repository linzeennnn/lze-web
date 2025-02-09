#include "../public/public.h"
int main(){
    char *base_path="../../file/Documents/";
     char post_data[100];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char*full_path=concat_path(base_path,name);
    int type=check_type(full_path);
    cJSON *data=cJSON_CreateObject();
folder_list *folder_head;
link_dir* link_fo_head;
file_list *file_head;
link_file*link_fi_head;
folder_head=(folder_list*)malloc(sizeof(folder_list));
link_fo_head=(link_dir*)malloc(sizeof(link_dir));
file_head=(file_list*)malloc(sizeof(file_list));
link_fi_head=(link_file*)malloc(sizeof(link_file));
folder_head->next=NULL;
link_fo_head->next=NULL;
file_head->next=NULL;
link_fi_head->next=NULL;
    if (type==1||type==3)
    {
        cJSON_AddStringToObject(data,"type","dir");
       cJSON *array=cJSON_CreateArray();
        list_directory(full_path,folder_head,file_head,link_fo_head,link_fi_head);
   file_array* all_file= sort_all(folder_head,file_head,link_fo_head,link_fi_head)->next;
        while (all_file!=NULL)
        {
            cJSON_AddItemToArray(array,cJSON_CreateString(all_file->name));
            all_file=all_file->next;
        }
        cJSON_AddItemToObject(data,"list",array);
        
    }
    else if (type==2||type==4)
    {
        cJSON_AddStringToObject(data,"type","file");
    }
    printf("Content-Type: application/json\n\n");
    printf("%s\n",cJSON_PrintUnformatted(data));
    
    return 0;
}