#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <unistd.h>
#include"../public/public.h"
char*get_url(char*fd){
    char *url=(char*)malloc(strlen(fd)+1);
    strcpy(url,fd);
    char*p=url;
    while (*p!=' ')
    {
        p++;
    }
    *p='\0';
    return url;
}

#define DOC_UPLOAD 0
#define PIC_UPLOAD 1
#define NOT_UPLOAD 2 
#define DOC_DIR_UPLOAD 3 
char* upload(struct mg_http_message *hm,char*link) {
  int type=0;
  if(strcmp(link,"server/doc/upload_file")==0)
    type=DOC_UPLOAD;
  else if(strcmp(link,"server/pic/upload")==0)
    type=PIC_UPLOAD;
  else if(strcmp(link,"server/not/upload")==0)
    type=NOT_UPLOAD;
  else if(strcmp(link,"server/doc_upload_folder")==0)
    type=DOC_DIR_UPLOAD;
  int err=FALSE;
    char fileName[25];
    char user[11],token[40];
    char nowpath[256],relat_path[256];
    char totalChunks[10],currentChunk[10],chunk_index[10];
    char last[2];
    char*file_body;
    long body_len;
struct mg_http_part part;
      size_t ofs = 0;
      strcpy(fileName,"no");
      while ((ofs = mg_http_next_multipart(hm->body, ofs, &part)) > 0) {
        if(strncmp(part.name.buf,"user",4)==0)//not pic doc
          snprintf(user,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"token",5)==0)//not pic doc
          snprintf(token,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"nowpath",7)==0)//pic doc
          snprintf(nowpath,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"totalChunks",11)==0)//pic doc
          snprintf(totalChunks,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"currentChunk",8)==0)//pic doc
          snprintf(currentChunk,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"fileName",8)==0)//pic doc
          snprintf(fileName,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"name",4)==0)//doc_dir
          snprintf(fileName,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"chunkIndex",10)==0)//doc_dir
          snprintf(chunk_index,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"relativePath",12)==0)//doc_dir
          snprintf(chunk_index,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"last",4)==0)//doc_dir
          snprintf(last,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"new_note",8)==0){//not
          snprintf(fileName,part.filename.len+1, part.filename.buf);
          file_body=part.body.buf;
          body_len=(unsigned long)part.body.len;
        }
        if(part.name.len == 4 && strncmp(part.name.buf, "file", 4) == 0){//pic
          file_body=part.body.buf;
          body_len=(unsigned long)part.body.len;
        }
        lze_log(fileName);
      }
      long send_len;
      char*share_data;
      if(type==PIC_UPLOAD||type==DOC_UPLOAD){
        send_len=strlen(fileName)+strlen(token)+strlen(user)+strlen(nowpath)+strlen(currentChunk)+strlen(totalChunks)+5;
      share_data=(char*)malloc(send_len);
      snprintf(share_data,send_len,"%s\n%s\n%s\n%s\n%s\n%s",fileName,user,token,currentChunk,totalChunks,nowpath);
      }
      else if (type==NOT_UPLOAD){
        send_len=strlen(fileName)+strlen(token)+strlen(user)+5;
      share_data=(char*)malloc(send_len);
      snprintf(share_data,send_len,"%s\n%s\n%s",fileName,user,token);
      }
      else if (type==DOC_DIR_UPLOAD){
        send_len=strlen(fileName)+strlen(token)+strlen(user)+strlen(chunk_index)+strlen(last)+strlen(relat_path)+5;
      share_data=(char*)malloc(send_len);
      snprintf(share_data,send_len,"%s\n%s\n%s\n%s\n%s\n%s",fileName,user,token,chunk_index,relat_path,last);
      }
        size_t cmd_size=20+strlen(ROOT)+strlen(link);
          char cmd[cmd_size];   
          key_t cmd_key=gen_key();
          size_t share_size=1024*1024;
          int shmid = shmget(cmd_key, share_size, 0666 | IPC_CREAT); 
          char *body_data = (char *)shmat(shmid, NULL, 0);
          strcpy(body_data,share_data);
          free(share_data);
          snprintf(cmd,cmd_size,"%s%s %08ld %ld",ROOT,link,cmd_key,share_size);
          system(cmd);
          if (strcmp(body_data,"401")==0)
          {
            err=TURE;
          }
          else{
            char*tmp=body_data;
            char*dest=split_long_string(tmp,'\n');
            FILE*fp=fopen(tmp,"wb");
            fwrite(file_body,1,body_len,fp);
            fclose(fp);
            if(type==NOT_UPLOAD)
              rename(tmp,dest);
            else if (type==PIC_UPLOAD||type==DOC_UPLOAD||type==DOC_DIR_UPLOAD)
            {
              if(strcmp(dest,"incomplete")!=0){
                long file_name_len=strlen(tmp);
                char merg_file[file_name_len+1];
                char part_file[file_name_len+1];
                long total_count=atol(totalChunks);
                long cur_count;
                snprintf(merg_file,file_name_len,"%s%s",TMP_PATH,fileName);
                size_t byte;
                FILE *merg_fp=fopen(merg_file,"ab");
                char buffer[512];
                for (cur_count = 0; cur_count < total_count; cur_count++)
                {
                  snprintf(part_file,file_name_len+1,"%s%s%s%ld",TMP_PATH,fileName,".part",cur_count);
                  FILE *part_fp=fopen(part_file,"rb");
                  while ((byte=fread(buffer,1,sizeof(buffer),part_fp))>0)
                  {
                    fwrite(buffer,1,byte,merg_fp);
                  }
                  fclose(part_fp);
                  remove(part_file);
                }
                fclose(merg_fp);
                if(type!=DOC_DIR_UPLOAD)
                  rename(merg_file,dest);
              }
                
            }
            
          }
          shmdt(body_data);
          shmctl(shmid, IPC_RMID, NULL);
          switch (err)
          {
          case TURE:
            return "401";
            break;
          case FALSE:
            return "\n";
            break;
          }
}
static void fn(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data; 
    if (mg_match(hm->uri, mg_str("/server/*/*"), NULL))  {  
          char *status_code;
          char*url_link=get_url(hm->uri.buf);
          url_link++;
          if(mg_match(hm->uri, mg_str("/server/doc/down*"), NULL)){
            strcmp("401",download_file(c,hm))!=0?
            mg_http_reply(c, 200, "Content-Type: text/plain\r\n", "\n"):
            mg_http_reply(c, 401, "Content-Type: text/plain\r\n", "\n");
          }
          else if (strcmp(url_link,"server/not/upload")==0||
              strcmp(url_link,"server/pic/upload")==0||
              strcmp(url_link,"server/doc/upload_file")==0||
              strcmp(url_link,"server/doc/upload_folder")==0)
          {
            strcmp("401",upload(hm,url_link))!=0?
            mg_http_reply(c, 200, "Content-Type: text/plain\r\n", "\n"):
            mg_http_reply(c, 401, "Content-Type: text/plain\r\n", "\n");
          }
          else{
          size_t cmd_size=strlen(url_link)+20+strlen(ROOT);
          char cmd[cmd_size];   
          key_t cmd_key=gen_key();
          size_t share_size=1024*1024;
          int shmid = shmget(cmd_key, share_size, 0666 | IPC_CREAT); 
          char *body_data = (char *)shmat(shmid, NULL, 0);
          strcpy(body_data,hm->body.buf);
          snprintf(cmd,cmd_size,"%s%s %08ld %ld",ROOT,url_link,cmd_key,share_size);
          system(cmd);
          strcmp(body_data,"401")!=0?
          mg_http_reply(c, 200, "Content-Type: application/json\r\n", body_data):
          mg_http_reply(c, 401, "Content-Type: text/plain\r\n", "\n");
          shmdt(body_data);
          shmctl(shmid, IPC_RMID, NULL);
          }
          url_link--;
          free(url_link);
    } else{
    struct mg_http_serve_opts opts;
    memset(&opts, 0, sizeof(opts));
    opts.root_dir = ROOT;  
    mg_http_serve_dir(c, hm, &opts);
    }
  }
}
int main() {
    srand(time(NULL));
    char*config=read_file("/etc/lze-web/config.json");
    key_t shm_key = ftok(CON_KEY, PROJ_ID);
    int shm_id = shmget(shm_key, 1024, IPC_CREAT | 0666);
    char *share_config = (char *)shmat(shm_id, NULL, 0);
    strcpy(share_config, config);
free(config); 
struct mg_mgr mgr; 
  mg_mgr_init(&mgr); 
  mg_http_listen(&mgr, "http://0.0.0.0:8000", fn, NULL);
  mg_http_listen(&mgr, "https://0.0.0.0:8443", fn, NULL);
  for (;;) {
    mg_mgr_poll(&mgr, 1000);
  }
  mg_mgr_free(&mgr);
 shmdt(share_config); 
    shmctl(shm_id, IPC_RMID, NULL);
    return 0;
}
