#include "../public/public.h"
int main(int argc,char*argv[]) {
    char *base_path=BOK_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    cJSON *rec_json = cJSON_Parse(post_data);
    char *user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char *token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(share,user,token,"bok","delete");
    cJSON *fileName=cJSON_GetObjectItem(rec_json, "name");
    char *name=concat_path(base_path,fileName->valuestring);
    remove(name);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}
