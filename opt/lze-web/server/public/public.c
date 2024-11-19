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
    folder_list*folder=folder_head->next;
    file_list*file=file_head->next;
    int swap;
        if(folder!=NULL){
            folder_list*tmp=(folder_list*)malloc(sizeof(folder_list));
            do
            {
               swap=0;
               folder=folder_head->next;
                while (folder!=NULL)
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
            
        }
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
char * get_parent_folder(char* path){
    char * cpy_path=(char*)malloc(strlen(path));
    strcpy(cpy_path,path);
        int i=strlen(cpy_path)-1;
        cpy_path[i]='\0';
    for(i;cpy_path[i]!='/';i--){
        cpy_path[i]='\0';
    }
    return get_folder(cpy_path);
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
void http_out(char *format, ...) {
    printf("Content-Type: application/json\n\n");
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

// 保存文件
