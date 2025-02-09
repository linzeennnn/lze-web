#include "public.h"
//生成时间戳
long get_time_stamp(){
time_t current_time;
    time_t start_time = 0;
    time(&current_time);
    long seconds = (long)difftime(current_time, start_time);
    long hours = seconds / 3600; 
    return hours;
}
//生成token
char *gen_token(){
    srand(time(NULL));
    char dict[63]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    char random[33];
    long time=get_time_stamp();
    int lenght=snprintf(NULL, 0, "%ld", time);
    char *time_string=(char*)malloc(lenght+1);
    snprintf(time_string, lenght + 1, "%ld", time);
    for(int i=0;i<32;i++){
        random[i]=dict[rand() % 62];
    }
    random[32]='\0';
    char *token=concat_path(concat_path(random,"_"),time_string ); 
    return token;
}
//检查过期
int check_time(char *token,char*time){
    char *save_token=(char*)malloc(strlen(token)+1);
    char *save_time=(char*)malloc(strlen(time)+1);
    strcpy(save_token,token);
    strcpy(save_time,time);
    long dead_line,start_time,nowtime,count;
    if(!save_token)
        return 0;
    char unit=save_time[strlen(save_time)-1];
if(strcmp(save_time,"never")==0||!save_time)
    return 1;
else{
        while (*save_token !='_')
        {
            save_token++;
        }
        save_token++;
        start_time=atol(save_token);
        nowtime=get_time_stamp();
    save_time[strlen(save_time)-1]='\0';
    dead_line=atol(save_time);
    switch (unit)
    {
    case 'y':
        count=dead_line*24*365;
        break;
    case 'm':
        count=dead_line*24*30;
        break;
    case 'd':
        count=dead_line*24;
        break;
    case 'h':
        count=dead_line;
        break;
    }
    if((nowtime-start_time)<count)
        return 1;
    else
        return 0;
}
}
//获取用户所有数据
user_data *get_user_all(char *user){
    char *config_path="/etc/lze-web/config.json";
    char *config=read_file(config_path);
    cJSON *json_config=cJSON_Parse(config);
     cJSON *json_user_list=cJSON_GetObjectItem(json_config,"user");
     cJSON *json_user=cJSON_GetObjectItem(json_user_list,user);
     char *save_token=cJSON_GetObjectItem(json_user,"token")->valuestring;
     char *save_time=cJSON_GetObjectItem(json_user,"tokentime")->valuestring;
     char *save_password=cJSON_GetObjectItem(json_user,"password")->valuestring;
     user_data *data=(user_data*)malloc(sizeof(user_data));
     data->token=save_token;
     data->token_time=save_time;
     data->password=save_password;
    return data;
}
// 更新token
void update_token(char*user,char*token){
    char *config_path="/etc/lze-web/config.json";
    char *config=read_file(config_path);
    cJSON *json_config=cJSON_Parse(config);
     cJSON *json_user_list=cJSON_GetObjectItem(json_config,"user");
     cJSON *json_user=cJSON_GetObjectItem(json_user_list,user);
     cJSON_ReplaceItemInObject(json_user,"token",cJSON_CreateString(token));
     char *output=cJSON_Print(json_config);
     FILE *fp=fopen(config_path,"w");
     fwrite(output,strlen(output),1,fp);
     fclose(fp);

}
//401
void err_401(){
    printf("Status: 401 Unauthorized\r\n");
    printf("Content-Type: text/html\r\n");
    printf("\r\n");
}