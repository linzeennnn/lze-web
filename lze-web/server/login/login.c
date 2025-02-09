#include "../public/public.h"

int main(){
     char *config_path="/etc/lze-web/config.json";
    char *config=read_file(config_path);
     char post_data[100];
int post_len = post(post_data, sizeof(post_data));
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
        printf("Content-Type: text/html\n\n");
        printf("%s\n",cJSON_PrintUnformatted(output));
    }
    else
        {
             err_401();
        }
return 0;
}