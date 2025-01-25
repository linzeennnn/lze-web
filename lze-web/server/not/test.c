#include "../public/public.h"
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>

int main() {
    char post_data[1024];

    // 从 test.json 文件中读取 JSON 数据
    FILE *json_file = fopen("test.json", "r");
    if (!json_file) {
        perror("Failed to open test.json");
        return 1;
    }

    fread(post_data, 1, sizeof(post_data) - 1, json_file);
    fclose(json_file);
    post_data[sizeof(post_data) - 1] = '\0'; // 确保字符串以 '\0' 结尾

    cJSON *rec_json = cJSON_Parse(post_data);
    cJSON *tit = cJSON_GetObjectItem(rec_json, "newTitle");
    cJSON *con = cJSON_GetObjectItem(rec_json, "newContent");
    char *base_path = "../../file/Note/";
    char *ext = ".txt";
    char *title = tit->valuestring;
    char *content = con->valuestring;
    title = concat_path(title, ext);
    title = file_exit(title, base_path);
    char *path = concat_path(base_path, title);
    FILE *note = fopen(path, "w");
    fputs(content, note);
    fclose(note);
    http_out(0, "\n", "\n");
    return 0;
}
