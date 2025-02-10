#include "../public/public.h"
#include <signal.h>
int main(){
   char post_data[1024];
    int post_len = post(post_data, sizeof(post_data));
    cJSON *rec_json = cJSON_Parse(post_data);
    char*user=cJSON_GetObjectItem(rec_json, "user")->valuestring;
    char*token=cJSON_GetObjectItem(rec_json, "token")->valuestring;
    check_action(user,token,"bok","newbok");
    cJSON *tit = cJSON_GetObjectItem(rec_json, "name");
    cJSON *con = cJSON_GetObjectItem(rec_json, "text");
    char *base_path="../../file/Bookmark/";
    char *title= tit->valuestring;
    char *content= con->valuestring;
    title=file_exit(title,base_path);
    char *path=concat_path(base_path,title);
    FILE *note=fopen(path,"w");
    fputs(content, note);
    fclose(note);
    http_out(0,"\n","\n");
    return 0;
}