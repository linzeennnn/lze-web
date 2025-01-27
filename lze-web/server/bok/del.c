#include "../public/public.h"
int main() {
    char *base_path="../../file/Bookmark/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *fileName=cJSON_GetObjectItem(rec_json, "name");
    char *name=concat_path(base_path,fileName->valuestring);
    remove(name);
    printf("Content-Type: text/html\n\n");
    return 0;
}
