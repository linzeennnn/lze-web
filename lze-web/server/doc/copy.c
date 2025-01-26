#include "../public/public.h"
int main() {
    char *base_path="../../file/Documents/";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *copy_list=cJSON_GetObjectItem(rec_json, "copylist");
    cJSON *copylist_array = cJSON_Parse(copy_list->valuestring);
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char *dest_path=concat_path(base_path,nowpath->valuestring);
    printf("Content-Type: text/html\n\n");
    for (int i=0;i<cJSON_GetArraySize(copylist_array);i++){
        cJSON *target = cJSON_GetArrayItem(copylist_array, i);
        char *source_path=concat_path(base_path,target->valuestring);
        char *file_name=file_exit(basename(source_path),dest_path);
        printf("%s,%s\n",source_path,concat_path(dest_path,file_name));
        copy(source_path,concat_path(dest_path,file_name));
    }
    printf("Content-Type: text/html\n\n");
    return 0;
}
