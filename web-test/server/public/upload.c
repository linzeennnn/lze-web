#include "../public/public.h"
void not_upload(struct mg_http_message *hm) {

    char*base_path=NOT_PATH;
    char*tmp_path=TMP_PATH;
    char fileName[25];
    char user[11],token[40];
    char *filePath;
    cgiFilePtr file;
    int totalChunks, currentChunk;
struct mg_http_part part;
      size_t ofs = 0;
      while ((ofs = mg_http_next_multipart(hm->body, ofs, &part)) > 0) {
        if(strncmp(part.name.buf,"user",4)==0)
          snprintf(user,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"token",5)==0)
          snprintf(token,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"new_note",8)==0){
          snprintf(fileName,part.filename.len+1, part.filename.buf);
          filePath=concat_path(TMP_PATH,fileName);
          FILE*fp=fopen(filePath,"wb");
          fwrite(part.body.buf,1,(unsigned long)part.body.len,fp);
          fclose(fp);
        }
      }
        char *new_name=file_exit(fileName,base_path);
        char *new_path=concat_path(base_path,new_name);
        rename(filePath,new_path);
     free(new_name);
     free(new_path);
     free(filePath);
}