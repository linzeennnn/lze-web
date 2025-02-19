#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"doc","newdir");
    cJSON *folderName=cJSON_GetObjectItem(rec_json, "folderName");
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char *path=concat_path(base_path,nowpath->valuestring);
    char*name=file_exit(folderName->valuestring,path);
    mkdir(concat_path(path,name),0755);
    printf("Content-Type: text/html\n\n");
    return 0;
}