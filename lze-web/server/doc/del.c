#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char *trash_path="../../file/trash/";
    char *data_path="../../file/data/deleted_metadata.json";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *dellist=cJSON_GetObjectItem(rec_json, "dellist");
    cJSON *dellist_array = cJSON_Parse(dellist->valuestring);
    char *data_json=read_file(data_path);
    cJSON *data;
    if(data_json==NULL||*data_json=='\0'||strcmp(data_json,"null")==0)
    {   
         data = cJSON_CreateObject();
    }
    else{
    data=cJSON_Parse(data_json);
    }
    for (int i=0;i<cJSON_GetArraySize(dellist_array);i++){
        cJSON *target = cJSON_GetArrayItem(dellist_array, i);
        char *source_path=concat_path(base_path,target->valuestring);
        char *par_dir=(char*)malloc(strlen(source_path)+1);
        strcpy(par_dir,source_path);
        char *file_name=file_exit(basename(source_path),trash_path);
        rename(source_path,concat_path(trash_path,file_name));
        if(par_dir[strlen(par_dir)]=='/')
            par_dir[strlen(par_dir)]='\0';
        cJSON_AddStringToObject(data,file_name,dirname(par_dir));
    }
    char *data_new=cJSON_Print(data);
    FILE *data_file=fopen(data_path,"w+");
    fputs(data_new,data_file);
    fclose(data_file);
    printf("Content-Type: text/html\n\n");
    return 0;
}
