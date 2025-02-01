#include "../public/public.h"
int main() {
    cJSON *note_list=cJSON_CreateArray();;
    char* path="../../file/Bookmark/";
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
    char *printed_json = cJSON_Print(note_list);
    http_out(1,"%s\n",printed_json);
    return 0;
}
