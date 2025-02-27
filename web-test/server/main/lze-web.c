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
key_t gen_key(){
  return (rand() % 900 + 100)*100000+time(NULL)%100000;
}
char* not_upload(struct mg_http_message *hm) {
  int err=FALSE;
    char fileName[25];
    char user[11],token[40];
    char*file_body;
    long body_len;
struct mg_http_part part;
      size_t ofs = 0;
      while ((ofs = mg_http_next_multipart(hm->body, ofs, &part)) > 0) {
        if(strncmp(part.name.buf,"user",4)==0)
          snprintf(user,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"token",5)==0)
          snprintf(token,part.body.len+1,part.body.buf);
        if(strncmp(part.name.buf,"new_note",8)==0){
          snprintf(fileName,part.filename.len+1, part.filename.buf);
          file_body=part.body.buf;
          body_len=(unsigned long)part.body.len;
        }
      }
      long send_len=strlen(fileName)+strlen(token)+strlen(user)+5;
      char share_data[send_len];
      snprintf(share_data,send_len,"%s\n%s\n%s",fileName,user,token);
        size_t cmd_size=37+strlen(ROOT);
          char cmd[cmd_size];   
          key_t cmd_key=gen_key();
          size_t share_size=1024*1024;
          int shmid = shmget(cmd_key, share_size, 0666 | IPC_CREAT); 
          char *body_data = (char *)shmat(shmid, NULL, 0);
          strcpy(body_data,share_data);
          snprintf(cmd,cmd_size,"%s%s %08ld %ld",ROOT,"server/not/upload",cmd_key,share_size);
          system(cmd);
          if (strcmp(body_data,"401")==0)
          {
            err=TURE;
          }
          else{
            char*tmp=body_data;
            char*dest=split_long_string(tmp);
            FILE*fp=fopen(tmp,"wb");
            fwrite(file_body,1,body_len,fp);
            fclose(fp);
            rename(tmp,dest);
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
          char*url_link=get_url(hm->uri.buf);
          url_link++;
          if (strcmp(url_link,"server/not/upload")==0)
          {
            if(strcmp(not_upload(hm),"401")==0)
              mg_http_reply(c, 401, "Content-Type: text/plain\r\n", "\n");
            else
              mg_http_reply(c, 200, "Content-Type: text/plain\r\n", "\n");
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
