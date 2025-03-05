#include "../public/public.h"
int main(int argc,char*argv[]) {
    char*base_path=DOC_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    char*file_path=post_data;
    char*token=split_long_string(file_path,'\n');
    char*user=split_long_string(token,'\n');
    check_action(share,user,token,"doc","downfile");
        char*full_path=concat_path(DOC_PATH,file_path);
        strcpy(post_data,full_path);
        shmdt(post_data);
        free(full_path);
    return 0;
}