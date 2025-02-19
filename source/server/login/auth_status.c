#include "../public/public.h"
void login_auth_status(struct mg_connection *c,char*post_data){
    cJSON *rec_json = cJSON_Parse(post_data);
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *token= cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_token(c,name,token);
}