#include "../public/public.h"

int main() {
    char *base_path="../../file/Documents/";
    char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
        
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"doc","copy");
    cJSON *copy_list=cJSON_GetObjectItem(rec_json, "copylist");
    cJSON *copylist_array = cJSON_Parse(copy_list->valuestring);
    cJSON *nowpath = cJSON_GetObjectItem(rec_json, "nowpath");
    char *dest_path=concat_path(base_path,nowpath->valuestring);
    for (int i=0;i<cJSON_GetArraySize(copylist_array);i++){
        cJSON *target = cJSON_GetArrayItem(copylist_array, i);
        char *source_path=concat_path(base_path,target->valuestring);
        char *file_name=file_exit(basename(source_path),dest_path);
        switch (check_type(source_path))
        {
        case 1:
            cp_dir(concat_path(source_path,"/"),concat_path(dest_path,file_name));
            break;
        case 2:
            copy(source_path,concat_path(dest_path,file_name));
        case 3:
            copy_symlink(source_path,concat_path(dest_path,file_name));
        case 4:
            copy_symlink(source_path,concat_path(dest_path,file_name));
        default:
            break;
        }   
    }
    printf("Content-Type: text/html\n\n");
    return 0;
}
