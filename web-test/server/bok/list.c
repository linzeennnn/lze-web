#include "../public/public.h"
int main(int argc,char*argv[]) {
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    cJSON *note_list=cJSON_CreateArray();;
    char* path=BOK_PATH;
    file_list* note=(file_list*)malloc(sizeof(file_list));
    list_directory(path,NULL,note,NULL,NULL);
    sort_file(NULL,note,NULL,NULL);
    note=note->next;
    while (note!=NULL)
    {
    char* file_path=concat_path(path,note->name);
    cJSON *item=cJSON_CreateObject();
    cJSON_AddItemToObject(item,"name", cJSON_CreateString(note->name));
    cJSON_AddItemToObject(item,"content", cJSON_CreateString(read_file(file_path)));
    cJSON_AddItemToArray(note_list, item);
    note=note->next;
    }
    char *printed_json = cJSON_PrintUnformatted(note_list);
        strcpy(post_data,printed_json);
        shmdt(post_data);
    return 0;
}
