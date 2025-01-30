#include "../public/public.h"
void delete_directory(char *base_path) {
    base_path=concat_path(base_path,"/");
    file_list*file_head=(file_list*)malloc(sizeof(file_list));
    folder_list*folder_head=(folder_list*)malloc(sizeof(folder_list));
    folder_list *folder;
    file_list* file;
    folder_head->next=NULL;
    file_head->next=NULL;
    list_directory(base_path,folder_head,file_head);
    file=file_head->next;
    folder=folder_head->next;
    while (file!=NULL)
    {
        remove(concat_path(base_path,file->name));
        file=file->next;
    }
    while (folder!=NULL)
    {   
        delete_directory(concat_path(base_path,folder->name));
        rmdir(concat_path(base_path,folder->name));
        folder=folder->next;
    }
}
int main() {
    char*base_path="../../file/trash";
    delete_directory(base_path);
    FILE *data_file=fopen("../../file/data/deleted_metadata.json","w+");
    fclose(data_file);
    printf("Content-Type: text/html\n\n");
    return 0;
}