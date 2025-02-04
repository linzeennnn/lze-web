#include "../public/public.h"
int main() {
    char*base_path="../../file/trash";
    delete_directory(base_path);
    mkdir(base_path,0755);
    FILE *data_file=fopen("../../file/data/deleted_metadata.json","w+");
    fclose(data_file);
    printf("Content-Type: text/html\n\n");
    return 0;
}