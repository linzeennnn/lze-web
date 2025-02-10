#include "../public/public.h"
int main() {
    char *base_path="../../file/trash/";
    char *data_path="../../file/data/deleted_metadata.json";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"tra","recover");
    cJSON *recover_list=cJSON_GetObjectItem(rec_json, "recover_list");
    char *data_json=read_file(data_path);
    cJSON *data=cJSON_Parse(data_json);
     cJSON*ori_json;
    char *ori_path,*par_path,*file_name;
    for (int i=0;i<cJSON_GetArraySize(recover_list);i++){
        cJSON *target = cJSON_GetArrayItem(recover_list, i);
        char *source_path=concat_path(base_path,target->valuestring++);
        ori_json=cJSON_GetObjectItem(data,target->valuestring);
        if(ori_json)
            ori_path=ori_json->valuestring;
        else
            ori_path=concat_path("../../file/Documents/",target->valuestring);
        par_path=(char*)malloc(strlen(ori_path)+1);
        strcpy(par_path,ori_path);
        file_name=basename(ori_path);
        strcpy(file_name,file_exit(file_name,dirname(par_path)));
        rename(source_path,ori_path);
        cJSON_DeleteItemFromObject(data, target->valuestring);
    }
    char *data_new=cJSON_Print(data);
    FILE *data_file=fopen(data_path,"w+");
    fputs(data_new,data_file);
    fclose(data_file);
    printf("Content-Type: text/html\n\n");
    return 0;
    }