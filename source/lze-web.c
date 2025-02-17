#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/shm.h>
#include <sys/ipc.h>
#include <unistd.h>
#include"server/public/public.h"
#define ROOT "web-test/"
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
typedef struct MOUDLE
{
  char *type;
  char *action;
}moudule;

moudule*get_moudule(char*path){
  char*type=(char*)malloc(strlen(path)+1);
  strcpy(type,path);
  type++;
  while (*type!='/')
  {
    type++;
  }
  type++;
  char*action=type;
  while (*action!='/')
  {
    action++;
  }
  *action='\0';
  action++;
  moudule*get_mod=(moudule*)malloc(sizeof(moudule));
  get_mod->type=type;
  get_mod->action=action;
  return get_mod;
}
void home(struct mg_connection *c, char*act,char*data){
  if(strcmp(act,"widget.cgi")==0){
    mg_http_reply(c, 200, "Content-Type: text/json\r\n", widget(c,data));
  }
  else if(strcmp(act,"doc_list.cgi")==0){
    mg_http_reply(c, 200, "Content-Type: text/json\r\n", home_doc_list(c,data));
  }
}
void login(struct mg_connection *c, char*act,char*data){
  if(strcmp(act,"auth_status.cgi")==0){
    mg_http_reply(c, 200, "Content-Type: text/json\r\n", widget(c,data));
  }
}
static void fn(struct mg_connection *c, int ev, void *ev_data) {
  if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;  
    struct mg_http_serve_opts opts;
    memset(&opts, 0, sizeof(opts));
    opts.root_dir = "./web-test";  
    mg_http_serve_dir(c, hm, &opts);
    char*url_link=get_url(hm->uri.buf);
    printf("%s\n",url_link);
    if (strncmp(url_link,"/server",7)==0) {       
          moudule*get_mod=get_moudule(url_link);
        printf("%s\n",get_mod->action);       
          if(strcmp(get_mod->type,"home")==0)
            home(c,get_mod->action,hm->body.buf);
          else if(strcmp(get_mod->type,"login")==0)
            login(c,get_mod->action,hm->body.buf);
          mg_http_reply(c, 200, "Content-Type: text/plain\r\n", get_mod->type);
    } 
  }
}
int main() {
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
