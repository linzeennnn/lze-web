#include "../public/public.h"
void sort_widget(int time,char*folder_name,int scan_dir,char*json_name,cJSON **json_p){
    
char *base_path=HOME_PATH;
cJSON *data = *json_p;
folder_list *folder_head;
link_dir* link_fo_head;
if(scan_dir){
folder_head=(folder_list*)malloc(sizeof(folder_list));
link_fo_head=(link_dir*)malloc(sizeof(link_dir));
folder_head->next=NULL;
link_fo_head->next=NULL;
}
else{
   folder_head=NULL; 
   link_fo_head=NULL;
}
file_list *file_head=(file_list*)malloc(sizeof(file_list));
link_file*link_fi_head=(link_file*)malloc(sizeof(link_file));
file_head->next=NULL;
link_fi_head->next=NULL;
list_directory(concat_path(base_path,folder_name),folder_head,file_head,link_fo_head,link_fi_head);
    char **list = malloc(time * sizeof(char*));
   file_array* all_file= sort_all(folder_head,file_head,link_fo_head,link_fi_head)->next;
for (int i = 0; i < time; i++)
{
    if (all_file!=NULL)
    {
        list[i]=all_file->name;
        all_file=all_file->next;
    }
    else
    list[i]=NULL;
    
}
char*str_name=concat_path(json_name,"i");
char *index=str_name+3;
for (int i = 0; i < time; i++)
{   
    *index='1'+i;
    if (list[i]==NULL)
        cJSON_AddNullToObject(data, str_name);
    else
        cJSON_AddStringToObject(data,str_name,list[i]);
}


}

int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
cJSON *data = cJSON_CreateObject();
cJSON **json_p=&data;
sort_widget(3,"Documents/",1,"doc",json_p);
sort_widget(3,"Note/",0,"not",json_p);
sort_widget(1,"Bookmark/",0,"bok",json_p);
sort_widget(1,"Pictures/",0,"pic",json_p);
sort_widget(1,"trash/",1,"tra",json_p);
// mon

user_data* da=get_user_all(user);
int remain_time=login_remain_time(da->token,da->token_time);
int count=get_user_access(user);
char*full_time=(char*)malloc(10);
if(!da->token_time)
    full_time="none";
else
    full_time=da->token_time;
cJSON_AddStringToObject(data,"mon1",full_time);
cJSON_AddNumberToObject(data,"mon2",remain_time);
cJSON_AddNumberToObject(data,"mon3",count);
// disk
char buffer[50];
FILE*fp = popen("df / | awk 'NR==2 {print $2, $3}'", "r");
char* disk_out=fgets(buffer,sizeof(buffer),fp);
char*used=disk_out;
while (*used!=' ')
{
    used++;
}
used++;
used[strcspn(used, "\n")] = '\0';
char*total=disk_out;
cJSON_AddStringToObject(data, "used", used);
while (*disk_out!=' ')
{
    disk_out++;
}
*disk_out='\0';
cJSON_AddStringToObject(data, "total", total);
char*all_data=cJSON_PrintUnformatted(data);
strcpy(post_data,all_data);
shmdt(post_data);
    return 0;
}