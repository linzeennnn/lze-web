#include "../public/public.h"
int cgiMain() {
    char*base_path="../../file/Note/";
    char*tmp_path="../../file/temp/";
    char fileName[256];
    FILE *fp;
    cgiFilePtr file;
    int totalChunks, currentChunk;
    char nowpath[256];
     cgiHeaderContentType("text/plain");
    cgiFormFileName("new_note", fileName, sizeof(fileName));
    char* full_path=concat_path(base_path,nowpath);
    cgiFormFileOpen("new_note", &file);
    char *filePath=concat_path(tmp_path,fileName);
   fp = fopen(filePath, "wb");
    char buffer[1024];
    int got;
    while (cgiFormFileRead(file, buffer, sizeof(buffer), &got) == cgiFormSuccess) {
        fwrite(buffer, 1, got, fp);
    }
    fclose(fp);
    cgiFormFileClose(file);
        char *new_name=file_exit(fileName,base_path);
        rename(filePath,concat_path(base_path,new_name));
    return 0;
}