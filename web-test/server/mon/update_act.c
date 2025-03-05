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
    check_action(share,user,token,"mon","change");
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *change=cJSON_GetObjectItem(rec_json, "change")->valuestring;
    char *action= cJSON_GetObjectItem(rec_json, "action")->valuestring;
    char *control=cJSON_GetObjectItem(rec_json, "control")->valuestring;
    cJSON *json_config=cJSON_Parse(config);
    cJSON *json_root = cJSON_GetObjectItem(json_config, "control");
    cJSON *json_control = cJSON_GetObjectItem(json_root, control);
    cJSON *json_action_root = cJSON_GetObjectItem(json_control, "action");
    cJSON *json_action = cJSON_GetObjectItem(json_action_root, action);
    cJSON *userArray = cJSON_GetObjectItem(json_action, "user");
    if (strcmp(change,"add")==0)
    {
        cJSON_AddItemToArray(userArray, cJSON_CreateString(name));
    }
    else if (strcmp(change,"remove")==0)
    {
        int array_size = cJSON_GetArraySize(userArray);  
    for (int i = 0; i < array_size; i++) {
        cJSON *item = cJSON_GetArrayItem(userArray, i); 
        if (cJSON_IsString(item) && strcmp(item->valuestring, name) == 0) {
            cJSON_DeleteItemFromArray(userArray, i);
            i--; 
            array_size--;  
        }
    }
    }
    strcpy(config,cJSON_Print(json_config));
    FILE *config_file=fopen(config_path,"w");
    fwrite(config,strlen(config),1,config_file);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}