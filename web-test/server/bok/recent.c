#include "../public/public.h"
int main(int argc,char*argv[]) {
    char *base_path=BOK_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *fileName=cJSON_GetObjectItem(rec_json, "filename");
    char *name=concat_path(base_path,fileName->valuestring);
    struct utimbuf new_times;
    new_times.actime = time(NULL);  
    new_times.modtime = time(NULL); 
    utime(name, &new_times);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}
