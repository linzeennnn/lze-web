#include "../public/public.h"
int main(){
    char *config_path="/etc/lze-web/config.json";
    char *config=read_file(config_path);
     char post_data[100];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *time = cJSON_GetObjectItem(rec_json, "time")->valuestring;
    cJSON *json_config=cJSON_Parse(config);
    cJSON *config_user=cJSON_GetObjectItem(json_config,"user");
    cJSON *user=cJSON_GetObjectItem(config_user,name);
    cJSON *tokentime = cJSON_GetObjectItem(user, "tokentime");
    cJSON_ReplaceItemInObject(user, "tokentime", cJSON_CreateString(time));
    char *output=cJSON_Print(json_config);
    FILE *config_file=fopen(config_path,"w");
    fwrite(output,strlen(output),1,config_file);
    http_out(0,"\n","\n");
    return 0;
}