#include "../public/public.h"
int main(int argc,char*argv[]) {
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
    char*index_str=split_long_string(token,'\n');
    char*relat_path=split_long_string(index_str,'\n');
    char*last=split_long_string(relat_path,'\n');
    check_action(share,user,token,"doc","updir");
    long index=atol(index_str);
    char*par_path=dirname(concat_path(tmp_path,relat_path));
    if (index==0)
        dir_p(par_path);
        free(par_path);
    char file_path[strlen(file_name)+strlen(tmp_path)+10];
    snprintf(file_path, sizeof(file_path), "%s%s.part%d", tmp_path, relat_path, index);
    char result[11];
    strcpy(result,"incomplete");
    if(strcmp(last,"1")==0)
        strcpy(result,"complete");
    char reply[strlen(file_path)+strlen(result)+2];
    sprintf(reply,"%s\n%s",file_path,result);
        strcpy(post_data,reply);
        shmdt(post_data);
    return 0;
}
