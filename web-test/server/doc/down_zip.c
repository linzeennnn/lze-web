#include "../public/public.h"
int main(int argc,char*argv[]) {
    char*tmp_path=TMP_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*file_path=post_data;
        char*full_path=concat_path(TMP_PATH,file_path);
        strcpy(post_data,full_path);
        shmdt(post_data);
        free(full_path);
    return 0;
}