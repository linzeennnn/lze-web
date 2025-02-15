#include "../public/public.h"
int main(){
    char *config_path="/etc/lze-web/config.json";
    char *config=get_config();
     char post_data[100];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char *user = cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"mon","edittime");
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
    http_out(0,"\n","\n");
    return 0;
}