#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *oldpath=cJSON_GetObjectItem(rec_json, "oldpath");
    cJSON *newpath = cJSON_GetObjectItem(rec_json, "newpath");
    char*source=concat_path(base_path,oldpath->valuestring);
    char *dest=concat_path(base_path,newpath->valuestring);
    rename(source,dest);
    printf("Content-Type: text/plain\n\n");
    return 0;
}