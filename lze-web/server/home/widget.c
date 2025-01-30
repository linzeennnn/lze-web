#include "../public/public.h"
void sort_widget(int time,char*folder_name,int scan_dir,char*json_name,cJSON **json_p){
    
char *base_path="../../file/";
cJSON *data = *json_p;
folder_list *folder_head;
if(scan_dir){
folder_head=(folder_list*)malloc(sizeof(folder_list));
folder_head->next=NULL;
}
else{
   folder_head=NULL; 
}
file_list *file_head=(file_list*)malloc(sizeof(file_list));
file_head->next=NULL;
folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
file_list *file=(file_list*)malloc(sizeof(file_list));
    list_directory(concat_path(base_path,folder_name),folder_head,file_head);
if(scan_dir)
    folder=folder_head->next;
else
    folder=NULL;
file=file_head->next; 
    char **list = malloc(time * sizeof(char*));
    file_list *tmp_head=(file_list*)malloc(sizeof(file_list));
    file_list*tmp=tmp_head;
    tmp->next=NULL;
folder_list *fod_p;
if(scan_dir)
   fod_p = folder_head->next;
else
    fod_p=NULL;
    file_list *file_p = file_head->next;
    for (int i = 0; i < time; i++)
    {
     if (fod_p!=NULL)
        {   
            tmp->next=(file_list*)malloc(sizeof(file_list));
            tmp=tmp->next;
            tmp->name=fod_p->name;
            tmp->time=fod_p->time;
            tmp->next=NULL;
            fod_p=fod_p->next;
        }   
      else
        break;
    }
    for (int i = 0; i < time; i++)
    {
     if (file_p!=NULL)
        {   
            tmp->next=(file_list*)malloc(sizeof(file_list));
            tmp=tmp->next;
            tmp->name=file_p->name;
            tmp->time=file_p->time;
            tmp->next=NULL;
            file_p=file_p->next;
        }   
      else
        break;
    }
    tmp=tmp_head->next;
    int step,length=0;
    while (tmp!=NULL)
    {
        length++;
        tmp=tmp->next;
    }
    
    tmp=tmp_head->next;
    file_list *p= (file_list*)malloc(sizeof(file_list));
    do
    {
            step=0;
        for (int i = 0; i < length-1; i++)
        {   
            if ((tmp->time)<(tmp->next->time))
            {
                p->name=tmp->name;
                p->next=tmp->next;
                tmp->name=tmp->next->name;
                tmp->time=tmp->next->time;
                tmp->next->name=p->name;
                tmp->next->time=p->time;
                step=1;
            }
                tmp=tmp->next;
        }
        tmp=tmp_head->next;
    } while (step==1);
for (int i = 0; i < time; i++)
{
    if (tmp!=NULL)
        {
            list[i]=tmp->name;
            tmp=tmp->next;
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

int main(){
cJSON *data = cJSON_CreateObject();
cJSON **json_p=&data;
sort_widget(3,"Documents/",1,"doc",json_p);
sort_widget(3,"Note/",0,"not",json_p);
sort_widget(1,"Bookmark/",0,"bok",json_p);
sort_widget(1,"Pictures/",0,"pic",json_p);
sort_widget(1,"trash/",1,"tra",json_p);
// mon
char buffer[50];
FILE *fp = popen("top -b -n 1 | awk 'NR>7 && $12 !~ /[kK]ernel/ && $12 !~ /irq/ && $12 !~ /kworker/ {print $12}' | sort | uniq", "r");
char str_name[5]="moni";
char *index=str_name+3;
for (int i = 0; i < 3; i++)
{
    *index='1'+i;
    if (fgets(buffer, sizeof(buffer), fp) != NULL) {
        buffer[strcspn(buffer, "\n")] = '\0';  
        cJSON_AddStringToObject(data, str_name, buffer);
    }
    else
        cJSON_AddNullToObject(data, str_name);
}
pclose(fp);
// disk
fp = popen("df / | awk 'NR==2 {print $2, $3}'", "r");
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
char*all_data=cJSON_Print(data);
http_out(1,"%s\n", all_data);
    return 0;
}