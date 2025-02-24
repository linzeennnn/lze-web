#include "../public/public.h"
int main(int argc,char*argv[]) {
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    int i=0;
    char not_key[5];
    cJSON *note_list=cJSON_CreateObject();
    char* path=NOT_PATH;
    file_list* note=(file_list*)malloc(sizeof(file_list));
    list_directory(path,NULL,note,NULL,NULL);
    sort_file(NULL,note,NULL,NULL);
    note=note->next;
    while (note!=NULL)
    {
    sprintf(not_key, "%d", i);
    cJSON_AddItemToObject(note_list,not_key, cJSON_CreateString(note->name));
    note=note->next;
    i++;
    }
    char *printed_json = cJSON_Print(note_list);
        strcpy(post_data,printed_json);
        shmdt(post_data);
    return 0;
}
