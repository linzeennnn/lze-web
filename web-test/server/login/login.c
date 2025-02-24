#include "../public/public.h"

int main(int argc,char*argv[]){
    char *config=get_config();
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    char*send_token;
    cJSON *output=cJSON_CreateObject();
    cJSON *rec_json = cJSON_Parse(post_data);
    char *name = cJSON_GetObjectItem(rec_json, "name")->valuestring;
    char *password= cJSON_GetObjectItem(rec_json, "password")->valuestring;
    user_data *data=get_user_all(name);
    if (strcmp(data->password,password)==0)
    {
       if (check_time(data->token,data->token_time))
        {
            send_token=data->token;
        }
        else{
            send_token=gen_token();
            update_token(name,send_token);
        }
        cJSON_AddStringToObject(output,"token",send_token);
        strcpy(post_data,cJSON_PrintUnformatted(output));
        shmdt(post_data);
    }
    else
        {
             err_401(share);
        }
return 0;
}