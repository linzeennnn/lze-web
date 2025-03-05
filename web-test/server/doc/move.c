#include "../public/public.h"
int main(int argc,char*argv[]) {
    char *base_path=DOC_PATH;
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
    check_action(share,user,token,"doc","move");
    cJSON *copy_list=cJSON_GetObjectItem(rec_json, "copylist");
    cJSON *copylist_array = cJSON_Parse(copy_list->valuestring);
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char *dest_path=concat_path(base_path,nowpath->valuestring);
    for (int i=0;i<cJSON_GetArraySize(copylist_array);i++){
        cJSON *target = cJSON_GetArrayItem(copylist_array, i);
        char *source_path=concat_path(base_path,target->valuestring);
        char *file_name=file_exit(basename(source_path),dest_path);
        rename(source_path,concat_path(dest_path,file_name));
    }
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}
