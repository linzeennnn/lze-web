#include "../public/public.h"
int main(){
    char *base_path="../../file/Documents/";
    char*temp_path="../../file/temp/";
    // char post_data[1024];
    // int post_len = post(post_data, sizeof(post_data));


    char*post_data=read_file("test.json");
    cJSON *rec_json = cJSON_Parse(post_data);
    char *folder_path=cJSON_GetObjectItem(rec_json, "folder_path")->valuestring;
    char*full_path;
    if (*(folder_path+strlen(folder_path)-1)!='/'){
        full_path=concat_path(folder_path,"/");
    }
    char*tmp_dir=concat_path(temp_path,full_path);
    char*zip_name=concat_path(basename(folder_path),".zip");
    cp_dir(concat_path(base_path,full_path),tmp_dir);
    // char cmd[70];
    // snprintf(cmd,sizeof(cmd),"cd %s && zip -r %s %s > /dev/null 2>&1",temp_path,zip_name,basename(folder_path));
    // system(cmd);
    // delete_directory(tmp_dir);
    // printf("Content-Type: text/html\n\n");
    return 0;
}