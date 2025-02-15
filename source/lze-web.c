#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <unistd.h>
#define CON_KEY "/temp/lze_config_key" 
#define PROJ_ID 77        
long get_size(FILE *file){
    fseek(file,0,SEEK_END);
    long size=ftell(file);
    fseek(file,0,SEEK_SET);
    return size;
}  
char* read_file(char*path){
    FILE*file=fopen(path,"r");
    if (file == NULL) {
        return NULL;
    }
   long size = get_size(file);
    char *content = (char *)malloc(size + 1);
    if (content == NULL) {
        fclose(file);
        return NULL;
    }
    fread(content,1,size,file);
    fclose(file);
    content[size]='\0';
    return content;
}
int main() {
    char*config=read_file("/etc/lze-web/config.json");
    key_t shm_key = ftok(CON_KEY, PROJ_ID);
    int shm_id = shmget(shm_key, 1024, IPC_CREAT | 0666);
    char *share_config = (char *)shmat(shm_id, NULL, 0);
    strcpy(share_config, config);
    while (1) {
        sleep(1);
    }

    return 0;
}
