#include "public.h"
// 扫描目录
void list_directory(char *path, folder_list* folder_head, file_list* file_head) {
    folder_list* folder=folder_head;
    file_list* file=file_head;
    struct dirent *entry;
    struct stat statbuf;
    DIR *dir = opendir(path);
    if (dir == NULL) {
        perror("无法打开目录");
        return;
    }
    while ((entry = readdir(dir)) != NULL) {
        char *filename = entry->d_name;
            char *full_path = concat_path(path, filename);
        if (stat(full_path, &statbuf) == -1) {
            perror("获取文件状态失败");
            free(full_path);
            continue;
        }
        free(full_path);
        if (strcmp(filename, ".") == 0 || strcmp(filename, "..") == 0) {
            continue;
        }
        if (S_ISDIR(statbuf.st_mode)) {
            if (folder != NULL) {
            folder->next=(folder_list*)malloc(sizeof(folder_list));
            folder->next->name=(char*)malloc(strlen(filename)+1);
            folder->next->name=strcpy(folder->next->name,filename);
            folder->next->time=statbuf.st_mtime;
            folder->next->next=NULL;
            folder=folder->next;
            }
        } else {
            file->next=(file_list*)malloc(sizeof(file_list));
            file->next->name=(char*)malloc(strlen(filename)+1);
            file->next->name=strcpy(file->next->name,filename);
            file->next->time=statbuf.st_mtime;
            file->next->next=NULL;
            file=file->next;
        }
    }
    closedir(dir);
    sort_file(folder_head,file_head);
}
// 文件排序
void sort_file(folder_list*folder_head,file_list*file_head){
    int swap;
    if(folder_head!=NULL){
    folder_list*folder=folder_head->next;
        if(folder!=NULL){
            folder_list*tmp=(folder_list*)malloc(sizeof(folder_list));
            do
            {
               swap=0;
               folder=folder_head->next;
                while (folder->next!=NULL)
                {
                    if (folder->time<folder->next->time)
                    {
                        swap=1;
                       tmp->name=folder->next->name;
                       tmp->time=folder->next->time;
                       folder->next->name=folder->name;
                       folder->next->time=folder->time;
                       folder->name=tmp->name;
                       folder->time=tmp->time;
                       folder=folder->next;
                    }
                    else{
                        folder=folder->next;
                    }
                }
            } while (swap);
        free(tmp);
        }
    }
    if (file_head!=NULL)
    {
    file_list*file=file_head->next;
   if(file!=NULL){
            file_list*tmp=(file_list*)malloc(sizeof(file_list));
            do
            {
               swap=0;
               file=file_head->next;
                while (file->next!=NULL)
                {
                    if (file->time<file->next->time)
                    {
                       swap=1;
                       tmp->name=file->next->name;
                       tmp->time=file->next->time;
                       file->next->name=file->name;
                       file->next->time=file->time;
                       file->name=tmp->name;
                       file->time=tmp->time;
                       file=file->next;
                    }
                    else{
                        file=file->next;
                    }
                }
            } while (swap);
        free(tmp);
        }
    }
}
// 加斜杆
char* end_splash(char* path){
  int lenght=strlen(path)-1;
  if(path[lenght]!='/')
    strcat(path,"/");
else if (path[lenght]=='/'&&path[lenght-1]=='/')
    path[lenght]='\0';
else if (path[lenght]==' '&&path[lenght-1]=='/')
    path[lenght]='\0';
  return path;
}
// 获取目录名
char* get_folder(char* path){
int end_name=strlen(path)-2,i,head_index,end_index=strlen(path)-1;
for(i=end_name;i>=0;i--){
    if(path[i]=='/'){
        head_index=i;
        break;
    }
    else
        continue;
}
char *folder_name=(char*)malloc(end_index-head_index+1);
head_index++;
for(i=0;head_index!=end_index;head_index++,i++){
    folder_name[i]=path[head_index];
}
return folder_name;
}
// 获取父目录
void get_parent_folder(char* path){
    int find=0;
    char *i=path;
    while (*i!='\0')
    {
       if (*i=='/')
       {
        find=1;
        break;
       }
       i++;
    }
    if(find){
    char*splash=strrchr(path,'/');
    *splash='\0';
    }
    else
        *path='\0';
}
// 判断是否只有多个目录
int folder_count(char* path){
    int status=0;
    int head=0,end=strlen(path)-1;
    path = (path == '/') ? path + 1 : path;
    path[end]=(path[end]=='/')? path[end]='\0':path[end];
    while (*path)
    {
        if(*path=='/'){
            status=1;
            break;;
        }
        path++;
    }
    return status;
}
// 拼接路径
char * concat_path(char *base_path,char * target_path){
    char *full_path=malloc(strlen(base_path)+strlen(target_path)+2);
    strcpy(full_path, base_path);
    strcat(full_path, target_path);
    return full_path;
}
// 获取POST
int post(char *data, int max_len) {
    int content_length = 0;
    char *content_len_str = getenv("CONTENT_LENGTH");
    if (content_len_str != NULL) {
        content_length = atoi(content_len_str);
    }
    if (content_length == 0) {
        return 0;
    }
    int bytes_read = 0;
    while (bytes_read < content_length) {
        int n = read(STDIN_FILENO, data + bytes_read, max_len - bytes_read);
        if (n == -1) {
            return -1;
        }
        bytes_read += n;
    }
    data[bytes_read] = '\0';
    return bytes_read;
}
// http输出
void http_out(int type,char *format, ...) {
    switch (type)
    {
    case 0:
    printf("Content-Type: text/plain\n\n");
        break;
    case 1:
    printf("Content-Type: application/json\n\n");
    break;
    default:
    printf("Content-Type: text/plain\n\n");
        break;
    }
    va_list args;
    va_start(args, format);
    vprintf(format, args);
    va_end(args);
}
// 读取文件
char* read_file(char*path){
    FILE*file=fopen(path,"r");
    long size=get_file_size(file);
    char *content=(char*)malloc(size);
    fgets(content,size,file);
    fclose(file);
    return content;
}
// 获取文件大小
long get_file_size(FILE * file){
    fseek(file,0,SEEK_END);
    long size=ftell(file)+1;
    rewind(file);
    return size;
}
// 去除后缀
void split_exten(char*name){
    char*dot=strrchr(name,'.');
    if(dot!=NULL)
        *dot='\0';
}
void split_index(char*name){
    char*splash=strrchr(name,'(');
    if(splash!=NULL)
        *splash='\0';
}
// 日志
void log(const char *format, ...) {
    // 打开日志文件，如果文件不存在则创建它
    FILE *log_file = fopen("/etc/lze-web/lze-web.log", "a");
    if (log_file == NULL) {
        perror("Unable to open or create log file");
        return;
    }

    // 处理可变参数
    va_list args;
    va_start(args, format);
    vfprintf(log_file, format, args);
    va_end(args);

    // 换行并关闭文件
    fprintf(log_file, "\n");
    fclose(log_file);
}
// 检查文件名存在
int check_exit(char*list[],char*name,int length){
    int i;
    for(i=0;i<=length;i++){
        if(strcmp(list[i],name)==0)
            return 1;
    }
    return 0;
}
// 检查文件存在
char* file_exit(char*name,char*path){
    char*ext=strrchr(name,'.');
    int i=0,fi=0,fo=0;
    char count[7];
    char*new_name=(char*)malloc(strlen(name)+7);
    strcpy(new_name,name);
    folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
    file_list* file=(file_list*)malloc(sizeof(file_list));
    folder_list *folder_count=(folder_list*)malloc(sizeof(folder_list));
     file_list* file_count=(file_list*)malloc(sizeof(file_list));
    folder->next=NULL;
    file->next=NULL;
    list_directory(path,folder,file);
    folder_count=folder->next;
     file_count=file->next;
     while (folder_count!=NULL||file_count!=NULL)
     {
        if(folder_count!=NULL){
            i++;
            folder_count=folder_count->next;
        }
        if(file_count!=NULL){
            i++;
            file_count=file_count->next;
        }
     }
     char*name_list[i];
     i=0;
     folder_count=folder->next;
     file_count=file->next;
     if(folder_count==NULL&&file_count==NULL){
        return name;
     }
      while (folder_count!=NULL||file_count!=NULL)
     {
        if(folder_count!=NULL){
            fo=1;
            name_list[i]=folder_count->name;
            i++;
            folder_count=folder_count->next;
        }
        if(file_count!=NULL){
            fi=1;
            name_list[i]=file_count->name;
            i++;
            file_count=file_count->next;
        }
     }
    if(fo)
        i--;
    if(fi)
        i--;
    int length=i;
     i=0;  
     check_exit(name_list,new_name,length);
     while (check_exit(name_list,new_name,length))
     {  i++;
        split_exten(new_name);
        split_index(new_name);
        sprintf(count, "(%d)", i);
        strcat(new_name,count);
        if(ext!=NULL)
        strcat(new_name,ext);
     }
     return new_name;
}