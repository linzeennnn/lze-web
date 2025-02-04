#include "../public/public.h"
int main(){
    char *base_path="../../file/Documents/";
    char*temp_path="../../file/temp/";
    char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char *folder_path=cJSON_GetObjectItem(rec_json, "folder_path")->valuestring;
    char *folder_name=basename(folder_path);
    char*tmp_dir=concat_path(temp_path,folder_name);
    char*zip_name=concat_path(folder_name,".zip");
    cp_dir(concat_path(base_path,folder_path),tmp_dir);
    char cmd[1024];
    snprintf(cmd,sizeof(cmd),"cd %s && zip -r %s %s > /dev/null 2>&1",temp_path,zip_name,folder_name);
    system(cmd);
    delete_directory(tmp_dir);
    printf("Content-Type: text/html\n\n");
    return 0;
}