#include <stdio.h>
#include <stdlib.h>
#include <dirent.h>
#include <sys/stat.h>
#include <string.h>
#include "../public/public.h"
#include "../public/cJSON.h"
int main() {
    int i=0;
    char key[5];
    cJSON *note_list=cJSON_CreateObject();
    char* path="../../file/Note/";
    file_list* note=(file_list*)malloc(sizeof(file_list));
    list_directory(path,NULL,note);
    note=note->next;
    while (note!=NULL)
    {
    sprintf(key, "%d", i);
    cJSON_AddItemToObject(note_list,key, cJSON_CreateString(note->name));
    note=note->next;
    i++;
    }
    char *printed_json = cJSON_Print(note_list);
    printf("Content-Type: application/json\n\n");
    printf("%s\n",printed_json);
    return 0;
}
