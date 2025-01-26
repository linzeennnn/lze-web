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
        log("CONTENT_LENGTH: %d\n", content_length);
log("Bytes read so far: %d\n", bytes_read);
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
    long size=get_size(file);
    char *content=(char*)malloc(size);
    fgets(content,size,file);
    fclose(file);
    return content;
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
// 给文件加序号
char *add_file_index(char *name,int index){
    char num[7];
    sprintf(num,"(%d)",index);
    return concat_path(name,num);
}
// 检查文件存在
char* file_exit(char*name,char*path){
   typedef struct list
    {
        char *name;
        struct list *next;
    }name_list;
    name_list *list_head=(name_list*)malloc(sizeof(name_list));
    name_list *list_node;
    list_head->next=NULL;
    int count=0;
    char *base_name=(char*)malloc(strlen(name)+1);
    strcpy(base_name,name);
    char*dot=strrchr(name,'.');
    char ext[strlen(dot)+1];
    if(dot==NULL||dot==name){
        *ext='\0';
    }
      
    else 
        strcpy(ext, dot);
    char*base_end=strrchr(base_name,'.');
    if(base_end!=base_name)
        *base_end='\0';
    folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
    file_list* file=(file_list*)malloc(sizeof(file_list));
    folder_list *folder_count=(folder_list*)malloc(sizeof(folder_list));
     file_list* file_count=(file_list*)malloc(sizeof(file_list));
    folder->next=NULL;
    file->next=NULL;
    list_directory(path,folder,file);
    folder_count=folder->next;
    file_count=file->next;
    while (file_count!=NULL)
    {   
        list_node=(name_list*)malloc(sizeof(name_list));
        list_node->name=file_count->name;
        list_node->next=list_head->next;
        list_head->next=list_node;
        file_count=file_count->next;
    }
     while (folder_count!=NULL)
    {
        list_node=(name_list*)malloc(sizeof(name_list));
        list_node->name=folder_count->name;
        list_node->next=list_head->next;
        list_head->next=list_node;
        folder_count=folder_count->next;
    }
    list_node=list_head->next;
    while (list_node!=NULL)
    {
        if (strcmp(name,list_node->name)==0)
        {   
            count++;
            name=concat_path(add_file_index(base_name,count),ext);
            list_node=list_head->next;
        }
        
        list_node=list_node->next;
    }
    return name;
}
// 复制文件
void copy (char *source_path,char *dest_path){
    size_t buffer_size;
    char *buffer;
    FILE *source, *dest;
    source=fopen(source_path,"rb");
    dest=fopen(dest_path,"wb");
    long file_size=get_size(source);
    if(file_size<1024*1024)
        buffer_size=4096;
    else if(file_size<10*1024*1024)
        buffer_size=16384;
    else if(file_size<100*1024*1024)
        buffer_size=262144;
    else if(file_size<500*1024*1024)
        buffer_size=524288;
    else if(file_size<1024*1024*1024)
        buffer_size=1048576;
    else if(file_size<2048*1024*1024)
        buffer_size=2097152;
    else
        buffer_size=4194304;
    buffer=(char*)malloc(buffer_size);
    size_t byte;
    while ((byte = fread(buffer, 1, buffer_size, source)) > 0)
    {
        fwrite(buffer,1,byte,dest);
    }
    fclose(source);
    fclose(dest);
    free(buffer);
}
// 获取文件大小
long get_size(FILE *file){
    fseek(file,0,SEEK_END);
    long size=ftell(file);
    fseek(file,0,SEEK_SET);
    return size;
}