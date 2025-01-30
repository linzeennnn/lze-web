#include "../public/public.h"
int cgiMain() {
    char*base_path="../../file/Documents/";
    char*tmp_path="../../file/temp/";
    char fileName[256];
    char filePath[512];
    FILE *fp;
    cgiFilePtr file;
    int totalChunks, currentChunk;
    char nowpath[256];
     cgiHeaderContentType("text/plain");
     cgiFormString("fileName", fileName, sizeof(fileName));
     cgiFormInteger("totalChunks", &totalChunks, 0);
    cgiFormInteger("currentChunk", &currentChunk, 0);
    cgiFormString("nowpath", nowpath, sizeof(nowpath));
    char* full_path=concat_path(base_path,nowpath);
    cgiFormFileOpen("file", &file);
    snprintf(filePath, sizeof(filePath), "%s%s.part%d", tmp_path, fileName, currentChunk);
    fp = fopen(filePath, "wb");
    char buffer[1024];
    int got;
    while (cgiFormFileRead(file, buffer, sizeof(buffer), &got) == cgiFormSuccess) {
        fwrite(buffer, 1, got, fp);
    }
    fclose(fp);
    cgiFormFileClose(file);
  if (currentChunk + 1 == totalChunks) {
        snprintf(filePath, sizeof(filePath), "%s%s", tmp_path, fileName);
        FILE *finalFile = fopen(filePath, "wb");
        for (int i = 0; i < totalChunks; i++) {
            char partPath[512];
            snprintf(partPath, sizeof(partPath), "%s%s.part%d", tmp_path, fileName, i);
            FILE *partFile = fopen(partPath, "rb");
            while ((got = fread(buffer, 1, sizeof(buffer), partFile)) > 0) {
                fwrite(buffer, 1, got, finalFile);
            }
            fclose(partFile);
            remove(partPath); 
        }
        fclose(finalFile);
        char*dest_path=concat_path(base_path,nowpath);
        char *new_name=file_exit(fileName,dest_path);
        rename(concat_path(tmp_path,fileName),concat_path(dest_path,new_name));
    }     
    return 0;
}