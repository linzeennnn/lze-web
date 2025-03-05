#include "../public/public.h"
int main(int argc,char*argv[]) {
    char*base_path=PIC_PATH;
    char*tmp_path=TMP_PATH;
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    char*file_name=post_data;
    char*user=split_long_string(file_name,'\n');
    char*token=split_long_string(user,'\n');
    char*cur_chunk_string=split_long_string(token,'\n');
    char*total_chunk_string=split_long_string(cur_chunk_string,'\n');
    char*now_path=split_long_string(total_chunk_string,'\n');
    check_action(share,user,token,"pic","upload");
    if(now_path==NULL)
        now_path="";
    long cur_chunk=atol(cur_chunk_string);
    long total_chunk=atol(total_chunk_string);
    long tmp_len=strlen(file_name)+strlen(TMP_PATH)+strlen(cur_chunk_string)+6;
    char tmp_file[tmp_len];
    char *dest_file,*path_p;
    snprintf(tmp_file,tmp_len,"%s%s%s%ld",TMP_PATH,file_name,".part",cur_chunk);
    if(cur_chunk+1==total_chunk){
        char*path_p=concat_path(PIC_PATH,now_path);
        char*dest_dir=concat_path(path_p,"/");
        free(path_p);
        char*new_name=file_exit(file_name,dest_dir);
        dest_file=concat_path(dest_dir,new_name);
        free(dest_dir);
        free(new_name);
    }
    else{
        dest_file=(char*)malloc(11);
        strcpy(dest_file,"incomplete");
    }
    char reply[strlen(tmp_file)+strlen(dest_file)+2];
    sprintf(reply,"%s\n%s",tmp_file,dest_file);
        strcpy(post_data,reply);
        shmdt(post_data);
    return 0;
}