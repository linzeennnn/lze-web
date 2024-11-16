#ifndef PBU_H
#define PBU_H
int post();
void list_directory(); 
char * concat_path();
char* end_splash();
char* get_folder();
char * get_parent_folder();
int folder_count();
typedef struct FOLDER
{
    char *name;
    struct FOLDER *next;
}folder_list;
typedef struct FILE
{
    char *name;
    struct FILE *next;
}file_list;
#endif