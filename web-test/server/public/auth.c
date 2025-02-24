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
    if(!token)
        return 1;
    char *save_token=(char*)malloc(strlen(token)+1);
    char *save_time=(char*)malloc(strlen(time)+1);
    strcpy(save_token,token);
    strcpy(save_time,time);
    long dead_line,start_time,nowtime,count;
    char unit=save_time[strlen(save_time)-1];
if(strcmp(save_time,"never")==0||!save_time){
    return 1;
}
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
    if((nowtime-start_time)<count){
        return 1;
        }
    else{
        return 0;
    }
}
}
//获取用户所有数据
user_data *get_user_all(char *user){
    char *config=get_config();
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
// 更新配置文件token
void update_token(char*user,char*token){
    char *config_path="/etc/lze-web/config.json";
    char *config=get_config();
    cJSON *json_config=cJSON_Parse(config);
     cJSON *json_user_list=cJSON_GetObjectItem(json_config,"user");
     cJSON *json_user=cJSON_GetObjectItem(json_user_list,user);
     cJSON_ReplaceItemInObject(json_user,"token",cJSON_CreateString(token));
     strcpy(config,cJSON_Print(json_config));
     FILE *fp=fopen(config_path,"w");
     fwrite(config,strlen(config),1,fp);
     fclose(fp);

}
//401
void err_401(char*share[]){
    key_t key=atol(share[0]);
    size_t share_size=atol(share[1]);
    int shmid = shmget(key, share_size, 0666); 
    char *share_data = (char *)shmat(shmid, NULL, 0); 
        strcpy(share_data,"401");
        shmdt(share_data);
        exit(0);
}
//检测token
void check_token(char*share[],char *user,char*token){
    if(strcmp(user,"visitor")!=0){
    user_data*data=get_user_all(user);
    if(!check_time(data->token,data->token_time)||strcmp(token,data->token)!=0){
        err_401(share);
    }
    }
}
//检测操作
void check_action(char*share[],char*user,char*token,char*control,char*action){
check_token(share,user,token);
int permit=0;
    char *config=get_config();
    cJSON *json_config=cJSON_Parse(config);
     cJSON *json_control_list=cJSON_GetObjectItem(json_config,"control");
     cJSON *json_control=cJSON_GetObjectItem(json_control_list,control);
     cJSON *json_action_list=cJSON_GetObjectItem(json_control,"action");
     cJSON *json_action=cJSON_GetObjectItem(json_action_list,action);
     cJSON *vaild_user=cJSON_GetObjectItem(json_action,"user");
     cJSON*username=NULL;
     cJSON_ArrayForEach(username,vaild_user){
        if (strcmp(username->valuestring,user)==0)
            permit=1;
     }
     if(permit==0)
        err_401(share);
}
//获取用户拥有权限数
int get_user_access(char*user){
     char*con=get_config();
    int count=0;
    int name_len=strlen(user);
    cJSON*control=cJSON_GetObjectItem(cJSON_Parse(con),"control");
    char*match=cJSON_PrintUnformatted(control);
    while (*(match+name_len-1)!='\0')
    {
        if(strncmp(user,match,name_len)==0)
            {
                count++;
                match+=name_len-1;
            }
        else
            match++;
    }
    return count;
}
//剩余时长
int login_remain_time(char*token,char*time){
if(!token)
        return 0;
    char *save_token=(char*)malloc(strlen(token)+1);
    char *save_time=(char*)malloc(strlen(time)+1);
    strcpy(save_token,token);
    strcpy(save_time,time);
    long dead_line,start_time,nowtime,count;
    char unit=save_time[strlen(save_time)-1];
if(strcmp(save_time,"never")==0||!save_time){
    return -1;
}
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
        return count-(nowtime-start_time);
}
}
