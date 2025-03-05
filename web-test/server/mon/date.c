#include "../public/public.h"
int main(int argc,char*argv[]){
    char *config_path="/etc/lze-web/config.json";
    char *config=get_config();
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    cJSON *rec_json = cJSON_Parse(post_data);
    char *user = cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(share,user,token,"mon","edittime");
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *time = cJSON_GetObjectItem(rec_json, "time")->valuestring;
    cJSON *json_config=cJSON_Parse(config);
    cJSON *config_user=cJSON_GetObjectItem(json_config,"user");
    cJSON *username=cJSON_GetObjectItem(config_user,name);
    cJSON *tokentime = cJSON_GetObjectItem(username, "tokentime");
    cJSON_ReplaceItemInObject(username, "tokentime", cJSON_CreateString(time));
    strcpy(config,cJSON_Print(json_config));
    FILE *config_file=fopen(config_path,"w");
    fwrite(config,strlen(config),1,config_file);
    fclose(config_file);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}