#include "../public/public.h"
int main(int argc,char*argv[]) {
    char *base_path=DOC_PATH;
    char*tmp_path=TMP_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *name=cJSON_GetObjectItem(rec_json, "name");
    cJSON *path = cJSON_GetObjectItem(rec_json, "path");
    char *dest_path=concat_path(base_path,path->valuestring);
    char*folder_name=name->valuestring;
    char*new_name=file_exit(folder_name,dest_path);
    rename(concat_path(tmp_path,folder_name),concat_path(dest_path,new_name));
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}
