#include "../public/public.h"
#include <signal.h>
int main(){
   char post_data[1048576];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"not","newnote");
    cJSON *tit = cJSON_GetObjectItem(rec_json, "newTitle");
    cJSON *con = cJSON_GetObjectItem(rec_json, "newContent");
    char *base_path="../../file/Note/";
    char *ext=".txt";
    char *title= tit->valuestring;
    char *content= con->valuestring;
    title=concat_path(title,ext);
    title=file_exit(title,base_path);
    char *path=concat_path(base_path,title);
    FILE *note=fopen(path,"w");
    fputs(content, note);
    fclose(note);
    http_out(0,"\n","\n");
    return 0;
}