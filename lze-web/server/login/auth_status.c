#include "../public/public.h"
int main(){
     char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *token= cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_token(name,token);
    printf("Content-Type: text/html\n\n");
    return 0;
}