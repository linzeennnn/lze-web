#include "../public/public.h"
int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    char*file_name=post_data;
    char*user=split_long_string(file_name);
    char*token=split_long_string(user);
    check_action(share,user,token,"not","upload");
    char*tmp_dir=TMP_PATH;
    char*dest_dir=NOT_PATH;
    char*new_name=file_exit(file_name,dest_dir);
    long tmp_len=strlen(tmp_dir)+strlen(file_name)+2;
    long dest_len=strlen(dest_dir)+strlen(new_name)+2;
    char tmp[tmp_len];
    char dest[dest_len];
    snprintf(tmp,tmp_len,"%s%s",tmp_dir,file_name);
    snprintf(dest,dest_len,"%s%s",dest_dir,new_name);
    free(new_name);
    char reply[strlen(tmp)+strlen(dest)+2];
    sprintf(reply,"%s\n%s",tmp,dest);
        strcpy(post_data,reply);
        shmdt(post_data);
    return 0;
}