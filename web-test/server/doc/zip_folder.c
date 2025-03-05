#include "../public/public.h"
int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    char *base_path=DOC_PATH;
    char*temp_path=TMP_PATH;
    cJSON *rec_json = cJSON_Parse(post_data);
    char *user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char *token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(share,user,token,"doc","downdir");
    char *folder_path=cJSON_GetObjectItem(rec_json, "folder_path")->valuestring;
    char *folder_name=basename(folder_path);
    char*tmp_dir=concat_path(temp_path,folder_name);
    char*zip_name=concat_path(folder_name,".zip");
    cp_dir(concat_path(base_path,folder_path),tmp_dir);
    char cmd[1024];
    snprintf(cmd,sizeof(cmd),"cd %s && zip -r '%s' '%s' > /dev/null 2>&1",temp_path,zip_name,folder_name);
    system(cmd);
    delete_directory(tmp_dir);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}