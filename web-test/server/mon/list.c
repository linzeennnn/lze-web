#include "../public/public.h"
int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char *json_file=get_config();
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
        strcpy(post_data,cJSON_PrintUnformatted(config));
        shmdt(post_data);
    cJSON_Delete(config);
    return 0;
}