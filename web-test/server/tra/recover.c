#include "../public/public.h"
int main(int argc,char*argv[]) {
    char *base_path=TRA_PATH;
    char *data_path=concat_path(DATA_PATH,"deleted_metadata.json");
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(share,user,token,"tra","recover");
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
            ori_path=concat_path(DOC_PATH,target->valuestring);
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
        strcpy(post_data,"null");
        shmdt(post_data);
    free(data_path);
    return 0;
    }