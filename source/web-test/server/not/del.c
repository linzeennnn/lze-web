#include "../public/public.h"
int main() {
    char *base_path="../../file/Note/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"not","delete");
    cJSON *fileName=cJSON_GetObjectItem(rec_json, "fileName");
    char *name=concat_path(base_path,fileName->valuestring);
    remove(name);
    printf("Content-Type: text/html\n\n");
    return 0;
}
