#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char*tmp_path="../../file/temp/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *name=cJSON_GetObjectItem(rec_json, "name");
    cJSON *path = cJSON_GetObjectItem(rec_json, "path");
    char *dest_path=concat_path(base_path,path->valuestring);
    char*folder_name=name->valuestring;
    char*new_name=file_exit(folder_name,dest_path);
    rename(concat_path(tmp_path,folder_name),concat_path(dest_path,new_name));
    printf("Content-Type: text/html\n\n");
    return 0;
}
