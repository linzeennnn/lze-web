#include"../public/public.h"
#define DOWN_DIR 1
char* download_file(struct mg_connection *c,struct mg_http_message *hm){
  int type=0;
 int url_len=hm->uri.len;
 char url_buffer[1024];  
 int len;
        mg_http_get_var(&hm->query, "file_path", url_buffer, 1024);
        len=strlen(url_buffer);
        char file_path[len+1];
        mg_url_decode(url_buffer, strlen(url_buffer), file_path, len+1, 0);  
        if(mg_match(hm->uri, mg_str("/server/doc/download_file*"), NULL)){
        mg_http_get_var(&hm->query, "token", url_buffer, 1024);
        len=strlen(url_buffer);
        char token[len+1];
        mg_url_decode(url_buffer, strlen(url_buffer), token, len+1, 0);
        mg_http_get_var(&hm->query, "user", url_buffer, 1024);
        len=strlen(url_buffer);
        char user[len+1];
        mg_url_decode(url_buffer, strlen(url_buffer), user, len+1, 0);
        snprintf(url_buffer,1024,"%s\n%s\n%s",file_path,token,user);
        }
        else{
          type=DOWN_DIR;
        snprintf(url_buffer,1024,"%s",file_path);
        }
        char new_url[url_len+1];
        strncpy(new_url,hm->uri.buf,url_len);
         new_url[url_len]='\0';
        split_long_string(new_url,'?');   
          size_t cmd_size=strlen(new_url)+21+strlen(ROOT);
          char cmd[cmd_size];   
          key_t cmd_key=gen_key();
          size_t share_size=1024*1024;
          int shmid = shmget(cmd_key, share_size, 0666 | IPC_CREAT); 
          char *path = (char *)shmat(shmid, NULL, 0);
          strcpy(path,url_buffer);
          snprintf(cmd,cmd_size,"%s%s %08ld %ld",ROOT,new_url,cmd_key,share_size);
          system(cmd);
          if(strcmp(path,"401")==0){
          shmdt(path);
          shmctl(shmid, IPC_RMID, NULL);
            return "401";
          }
          else{
         char*file_name=basename(path);
         char file_name_header[51+strlen(path)];
         sprintf(file_name_header,"Content-Disposition: attachment; filename=\"%s\"\r\n",file_name);
    mg_printf(c, "%s%s%s%s\r\n",
              "HTTP/1.1 200 OK\r\n",
              "Transfer-Encoding: chunked\r\n",
              "Content-Type: application/octet-stream\r\n",
              file_name_header
              );
         FILE *fp = fopen(path, "rb");
    char buf[1024*1024]; 
    size_t n;
    while ((n = fread(buf, 1, sizeof(buf), fp)) > 0) {
      mg_http_write_chunk(c, buf, n);
    }
    mg_http_write_chunk(c, "", 0);
    fclose(fp);
    if(type==DOWN_DIR){
      remove(path);
    }
    shmdt(path);
    shmctl(shmid, IPC_RMID, NULL);
    return "\n";
          }
}