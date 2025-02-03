#include "../public/public.h"
int cgiMain() {
    char*base_path="../../file/Documents/";
    char*tmp_path="../../file/temp/";
    char fileName[256];
    char filePath[1024];
    char last[2];
    char relat_path[1024];
    char chunk_index[10];
    int index;
    FILE *fp;
    cgiFilePtr file;
    int totalChunks, currentChunk;
     cgiHeaderContentType("text/plain");
     cgiFormString("name", fileName, sizeof(fileName));
    cgiFormString("relativePath", relat_path, sizeof(relat_path));
    char*par_path=dirname(concat_path(tmp_path,relat_path));
    cgiFormString("chunkIndex", chunk_index, sizeof(chunk_index));
    cgiFormString("last", last, sizeof(last));
    if (index==0)
        dir_p(par_path);
    cgiFormFileOpen("file", &file);
    snprintf(filePath, sizeof(filePath), "%s%s.part%d", tmp_path, relat_path, index);
    fp = fopen(filePath, "wb");
    char buffer[1024];
    int got;
    while (cgiFormFileRead(file, buffer, sizeof(buffer), &got) == cgiFormSuccess) {
        fwrite(buffer, 1, got, fp);
    }
    fclose(fp);
    cgiFormFileClose(file);
  if (strcmp(last, "1") == 0) {
        snprintf(filePath, sizeof(filePath), "%s%s", tmp_path, relat_path);
        FILE *finalFile = fopen(filePath, "wb");
        for (int i = 0; i < index+1; i++) {
            char partPath[512];
            snprintf(partPath, sizeof(partPath), "%s%s.part%d", tmp_path, relat_path, i);
            FILE *partFile = fopen(partPath, "rb");
            while ((got = fread(buffer, 1, sizeof(buffer), partFile)) > 0) {
                fwrite(buffer, 1, got, finalFile);
            }
            fclose(partFile);
            remove(partPath); 
        }
        fclose(finalFile);
    }  
    return 0;
}
