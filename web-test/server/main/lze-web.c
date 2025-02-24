#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <unistd.h>
#include"../public/public.h"
#define ROOT "/home/linzeen/Documents/github/lze-web/web-test/"
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
void upload(struct mg_http_message *hm){
  struct mg_http_part part;
      size_t ofs = 0;
      while ((ofs = mg_http_next_multipart(hm->body, ofs, &part)) > 0) {
        MG_INFO(("Chunk name: [%.*s] filename: [%.*s] length: %lu bytes",
                 (int) part.name.len, part.name.buf, (int) part.filename.len,
                 part.filename.buf, (unsigned long) part.body.len));
      }
}
static void fn(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data; 
    if (mg_match(hm->uri, mg_str("/server/*/*"), NULL))  {  
          char*url_link=get_url(hm->uri.buf);
          url_link++;
          size_t cmd_size=strlen(url_link)+20+strlen(ROOT);
          char cmd[cmd_size];   
          key_t cmd_key=gen_key();
          size_t share_size;
          int shmid; 
          char *body_data;
          if (strcmp(url_link,"server/not/upload")==0)
          {
            not_upload(hm);
          mg_http_reply(c, 200, "Content-Type: text/plain\r\n", "\n");
          }
          else{
          share_size=1024*1024;
          shmid = shmget(cmd_key, share_size, 0666 | IPC_CREAT);
          body_data = (char *)shmat(shmid, NULL, 0);
          strcpy(body_data,hm->body.buf);
          snprintf(cmd,cmd_size,"%s%s %08ld %ld",ROOT,url_link,cmd_key,share_size);
          system(cmd);
          strcmp(body_data,"401")!=0?
          mg_http_reply(c, 200, "Content-Type: application/json\r\n", body_data):
          mg_http_reply(c, 401, "Content-Type: text/plain\r\n", "\n");
          shmdt(body_data);
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

struct mg_mgr mgr; 
  mg_mgr_init(&mgr); 
  mg_http_listen(&mgr, "http://0.0.0.0:8000", fn, NULL);
  mg_http_listen(&mgr, "https://0.0.0.0:8443", fn, NULL);
  for (;;) {
    mg_mgr_poll(&mgr, 1000);
  }
  mg_mgr_free(&mgr);
  free(share_config);
    return 0;
}
