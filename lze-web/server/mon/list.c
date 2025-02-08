#include "../public/public.h"
int main(){
    char *json_file=read_file("/etc/lze-web/config.json");
    cJSON *config = cJSON_Parse(json_file);
    cJSON *user = cJSON_GetObjectItem(config, "user");
    if (user) {
       cJSON *child = user->child;
    while (child) {
        cJSON_DeleteItemFromObject(child, "password");
        cJSON_DeleteItemFromObject(child, "token");
        child = child->next;
    }
    }
    printf("Content-Type: application/json\n\n");
    printf("%s\n", cJSON_PrintUnformatted(config));
    cJSON_Delete(config);
    return 0;
}