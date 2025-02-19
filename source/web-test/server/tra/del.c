#include "../public/public.h"
int main() {
    char*base_path="../../file/trash";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"tra","clean");
    delete_directory(base_path);
    mkdir(base_path,0755);
    FILE *data_file=fopen("../../file/data/deleted_metadata.json","w+");
    fclose(data_file);
    printf("Content-Type: text/html\n\n");
    return 0;
}