#include "../public/public.h"
#include <signal.h>
int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(share,user,token,"not","newnote");
    cJSON *tit = cJSON_GetObjectItem(rec_json, "newTitle");
    cJSON *con = cJSON_GetObjectItem(rec_json, "newContent");
    char *base_path=NOT_PATH;
    char *ext=".txt";
    char *title= tit->valuestring;
    char *content= con->valuestring;
    title=concat_path(title,ext);
    title=file_exit(title,base_path);
    char *path=concat_path(base_path,title);
    FILE *note=fopen(path,"w");
    fputs(content, note);
    fclose(note);
        strcpy(post_data,"null");
        shmdt(post_data);
    return 0;
}