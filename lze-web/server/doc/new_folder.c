#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *folderName=cJSON_GetObjectItem(rec_json, "folderName");
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char*name=folderName->valuestring;
    char *path=concat_path(base_path,nowpath->valuestring);
    mkdir(concat_path(path,name),0755);
    printf("Content-Type: text/html\n\n");
    return 0;
}