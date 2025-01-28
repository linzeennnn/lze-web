#include "../public/public.h"
char **sort_three(folder_list*folder_head,file_list*file_head){
    char *list[3];
    folder_list *fod_p=(folder_list*)malloc(sizeof(folder_list));
    file_list *file_p=(file_list*)malloc(sizeof(file_list));
    fod_p=folder_head->next;
for (int i = 0; i < 3; i++)
{
    if (file_p!=NULL)
    {
     list[i]=file_p->name;
     file_p=file_p->next;  
    }
    else
        list[i]=NULL;
}
file_p=file_head->next;
for (int i = 0; i < 3; i++)
{
    if (fod_p!=NULL&&file_p!=NULL)
    {
        if (fod_p->time>file_p)
            list[i]=fod_p->name;
        fod_p=fod_p->next;
        file_p=file_p->next;        
    }
    else if (fod_p!=NULL&&file_p==NULL)
    {
        list[i]=fod_p->name;
        fod_p=fod_p->next;
    }
}

}
int main(){
char *base_path="../../file/";
cJSON *data = cJSON_CreateObject();
folder_list *folder_head=(folder_list*)malloc(sizeof(folder_list));
file_list *file_head=(file_list*)malloc(sizeof(file_list));
folder_head->next=NULL;
file_head->next=NULL;
folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
file_list *file=(file_list*)malloc(sizeof(file_list));
list_directory(concat_path(base_path,"Documents"),folder_head,file_head);
folder=folder_head->next;
file=file_head->next;
for (int i = 0; i < 3; i++)
{
    
}

    return 0;
}