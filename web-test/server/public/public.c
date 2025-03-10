#include "public.h"
// 扫描目录
void list_directory(char *path, folder_list* folder_head, file_list* file_head, link_dir *link_dir_head, link_file *link_file_head) {    
    char *new_path = (path[strlen(path) - 1] != '/') ? concat_path(path, "/") : path;

    folder_list *folder = folder_head;
    file_list *file = file_head;
    link_dir *ldir = link_dir_head;
    link_file *lfile = link_file_head;
    struct dirent *entry;
    struct stat statbuf;
    struct stat target_statbuf;
    DIR *dir = opendir(new_path);

    if (dir == NULL) {
        perror("无法打开目录");
        perror(new_path);
        if (new_path != path) free(new_path);
        return;
    }

    while ((entry = readdir(dir)) != NULL) {
        char *filename = entry->d_name;
        char *full_path = concat_path(new_path, filename);

        if (lstat(full_path, &statbuf) == -1) { 
            perror("获取文件状态失败");
            printf("%s\n", full_path);
            free(full_path);
            continue;
        }

        if (strcmp(filename, ".") == 0 || strcmp(filename, "..") == 0) {
            free(full_path);
            continue;
        }

        if (S_ISDIR(statbuf.st_mode)) {
            if (folder != NULL) {
                folder->next = (folder_list *)malloc(sizeof(folder_list));
                if (folder->next == NULL) {
                    perror("Memory allocation failed");
                    free(full_path);
                    closedir(dir);
                    return;
                }
                folder->next->name = strdup(filename);
                folder->next->time = statbuf.st_mtime;
                folder->next->next = NULL;
                folder = folder->next;
            }
        } else if (S_ISLNK(statbuf.st_mode)) { 
            int is_dir = 0;
            if (stat(full_path, &target_statbuf) == 0) { 
                if (S_ISDIR(target_statbuf.st_mode)) {
                    is_dir = 1;
                }
            }

            if (is_dir) {
                if (ldir != NULL) {
                    ldir->next = (link_dir *)malloc(sizeof(link_dir));
                    if (ldir->next == NULL) {
                        perror("Memory allocation failed");
                        free(full_path);
                        closedir(dir);
                        return;
                    }
                    ldir->next->name = strdup(filename);
                    ldir->next->time = statbuf.st_mtime;
                    ldir->next->next = NULL;
                    ldir = ldir->next;
                }
            } else {
                if (lfile != NULL) {
                    lfile->next = (link_file *)malloc(sizeof(link_file));
                    if (lfile->next == NULL) {
                        perror("Memory allocation failed");
                        free(full_path);
                        closedir(dir);
                        return;
                    }
                    lfile->next->name = strdup(filename);
                    lfile->next->time = statbuf.st_mtime;
                    lfile->next->next = NULL;
                    lfile = lfile->next;
                }
            }
        } else {
            if (file != NULL) {
                file->next = (file_list *)malloc(sizeof(file_list));
                if (file->next == NULL) {
                    perror("Memory allocation failed");
                    free(full_path);
                    closedir(dir);
                    return;
                }
                file->next->name = strdup(filename);
                file->next->time = statbuf.st_mtime;
                file->next->next = NULL;
                file = file->next;
            }
        }

        free(full_path);
    }

    closedir(dir);
    if (new_path != path) free(new_path);
}

// 全部类型排序
file_array* sort_all(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head){
    int swap;
    file_array*array_head=(file_array*)malloc(sizeof(file_array));
    array_head->next=NULL;
    file_array*array=array_head->next;
    if(file_head!=NULL)
    file_head=file_head->next;
    if(folder_head!=NULL)
    folder_head=folder_head->next;
    if(link_dir_head!=NULL)
    link_dir_head=link_dir_head->next;
    if(link_file_head!=NULL)
    link_file_head=link_file_head->next;
    while (file_head!=NULL)
    {
        array=(file_array*)malloc(sizeof(file_array));
        array->name=file_head->name;
        array->time=file_head->time;
        array->type="file";
        array->next=array_head->next;
        array_head->next=array;
        file_head=file_head->next;
    }
     while (folder_head != NULL) {
        array = (file_array*)malloc(sizeof(file_array));
        array->name = folder_head->name;
        array->time = folder_head->time;
        array->type = "folder";
        array->next=array_head->next;
        array_head->next=array;
        folder_head = folder_head->next;
    }
    while (link_dir_head != NULL) {
        array = (file_array*)malloc(sizeof(file_array));
        array->name = link_dir_head->name;
        array->time = link_dir_head->time;
        array->type = "link_dir";
        array->next=array_head->next;
        array_head->next=array;
        link_dir_head = link_dir_head->next;
    }
    while (link_file_head != NULL) {
        array = (file_array*)malloc(sizeof(file_array));
        array->name = link_file_head->name;
        array->time = link_file_head->time;
        array->type = "link_file"; 
        array->next=array_head->next;
        array_head->next=array;
        link_file_head = link_file_head->next;
    }
    file_array *tmp = (file_array*)malloc(sizeof(file_array));
    do
    {
        swap=0;
        while (array!=NULL&&array->next!=NULL)
        {
            if ((array->time)<(array->next->time))
            {   
                swap=1;
                tmp->name=array->name;
                tmp->time=array->time;
                tmp->type=array->type;
                array->name=array->next->name;
                array->time=array->next->time;
                array->type=array->next->type;
                array->next->name=tmp->name;
                array->next->time=tmp->time;
                array->next->type=tmp->type;
                array=array->next;
            }
            else
                array=array->next;
        }
        array=array_head->next;
    } while (swap!=0);
    free(tmp);
    return array_head;
}
// 各个类型文件排序
void sort_file(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head) {
    int swap;
    if (folder_head != NULL) {
        folder_list* folder = folder_head->next;
        if (folder != NULL) {
            folder_list* tmp = (folder_list*)malloc(sizeof(folder_list));
            do {
                swap = 0;
                folder = folder_head->next;
                while (folder->next != NULL) {
                    if (folder->time < folder->next->time) {
                        swap = 1;
                        tmp->name = folder->next->name;
                        tmp->time = folder->next->time;
                        folder->next->name = folder->name;
                        folder->next->time = folder->time;
                        folder->name = tmp->name;
                        folder->time = tmp->time;
                    }
                    folder = folder->next;
                }
            } while (swap);
            free(tmp);
        }
    }
    if (file_head != NULL) {
        file_list* file = file_head->next;
        if (file != NULL) {
            file_list* tmp = (file_list*)malloc(sizeof(file_list));
            do {
                swap = 0;
                file = file_head->next;
                while (file->next != NULL) {
                    if (file->time < file->next->time) {
                        swap = 1;
                        tmp->name = file->next->name;
                        tmp->time = file->next->time;
                        file->next->name = file->name;
                        file->next->time = file->time;
                        file->name = tmp->name;
                        file->time = tmp->time;
                    }
                    file = file->next;
                }
            } while (swap);
            free(tmp);
        }
    }
    if (link_dir_head != NULL) {
        link_dir* link_d = link_dir_head->next;
        if (link_d != NULL) {
            link_dir* tmp = (link_dir*)malloc(sizeof(link_dir));
            do {
                swap = 0;
                link_d = link_dir_head->next;
                while (link_d->next != NULL) {
                    if (link_d->time < link_d->next->time) {
                        swap = 1;
                        tmp->name = link_d->next->name;
                        tmp->time = link_d->next->time;
                        link_d->next->name = link_d->name;
                        link_d->next->time = link_d->time;
                        link_d->name = tmp->name;
                        link_d->time = tmp->time;
                    }
                    link_d = link_d->next;
                }
            } while (swap);
            free(tmp);
        }
    }
    if (link_file_head != NULL) {
        link_file* link_f = link_file_head->next;
        if (link_f != NULL) {
            link_file* tmp = (link_file*)malloc(sizeof(link_file));
            do {
                swap = 0;
                link_f = link_file_head->next;
                while (link_f->next != NULL) {
                    if (link_f->time < link_f->next->time) {
                        swap = 1;
                        tmp->name = link_f->next->name;
                        tmp->time = link_f->next->time;
                        link_f->next->name = link_f->name;
                        link_f->next->time = link_f->time;
                        link_f->name = tmp->name;
                        link_f->time = tmp->time;
                    }
                    link_f = link_f->next;
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
    long content_length = 0;
    char *content_len_str = getenv("CONTENT_LENGTH");
    if (content_len_str != NULL) {
        content_length = atol(content_len_str);
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
    if (file == NULL) {
        return NULL;
    }
   long size = get_size(file);
    char *content = (char *)malloc(size + 1);
    if (content == NULL) {
        fclose(file);
        return NULL;
    }
    fread(content,1,size,file);
    fclose(file);
    content[size]='\0';
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
void lze_log(const char *format, ...) {
    FILE *log_file = fopen("/etc/lze-web/lze-web.log", "a");
    if (log_file == NULL) {
        perror("Unable to open or create log file");
        return;
    }
    
    va_list args;
    va_start(args, format);
    int needed_length = vsnprintf(NULL, 0, format, args) + 2;
    va_end(args);
    
    char log_string[needed_length];
    va_start(args, format);
    vsnprintf(log_string, needed_length, format, args);
    va_end(args);
    
    strcat(log_string, "\n"); 
    
    fwrite(log_string, 1, strlen(log_string), log_file);
    fclose(log_file);
}
// 给文件加序号
char *add_file_index(char *name,int index){
    char num[7];
    sprintf(num,"(%d)",index);
    return concat_path(name,num);
}
// 检查文件存在
char* file_exit(char* ori_name, char* path) {
    char*name_count;
    char*name=(char*)malloc(strlen(ori_name)+1);
    strcpy(name,ori_name);
    typedef struct list {
        char *name;
        struct list *next;
    } name_list;
    name_list *list_head = (name_list*)malloc(sizeof(name_list));
    name_list *list_node;
    list_head->next = NULL;
    int count = 0;
    char *base_name = (char*)malloc(strlen(name) + 1);
    strcpy(base_name, name);
    char *dot = strrchr(name, '.');
    
    int ext_length = dot ? strlen(dot) + 1 : 1;
    char ext[ext_length];

    if (dot == NULL || dot == name || !dot) {
        *ext = '\0';  // 无扩展名
    } else {
        strcpy(ext, dot);
    }
    char *base_end = strrchr(base_name, '.');
    if (base_end && base_end != base_name) {
        *base_end = '\0';  // 去除扩展名
    }
    folder_list *folder = (folder_list*)malloc(sizeof(folder_list));
    file_list *file = (file_list*)malloc(sizeof(file_list));
    link_dir *link_dir_head = (link_dir*)malloc(sizeof(link_dir));
    link_file *link_file_head = (link_file*)malloc(sizeof(link_file));
    folder->name = NULL;
    file->name = NULL;
    link_dir_head->name = NULL;
    link_file_head->name = NULL;
    folder->next = NULL;
    file->next = NULL;
    link_dir_head->next = NULL;
    link_file_head->next = NULL;
    list_directory(path, folder, file, link_dir_head, link_file_head);
    folder_list *folder_count = folder->next;
    file_list *file_count = file->next;
    link_dir *link_dir_count = link_dir_head->next;
    link_file *link_file_count = link_file_head->next;
    while (file_count != NULL) {   
        list_node = (name_list*)malloc(sizeof(name_list));
        list_node->name = file_count->name;
        list_node->next = list_head->next;
        list_head->next = list_node;
        file_count = file_count->next;
    }
    while (folder_count != NULL) {
        list_node = (name_list*)malloc(sizeof(name_list));
        list_node->name = folder_count->name;
        list_node->next = list_head->next;
        list_head->next = list_node;
        folder_count = folder_count->next;
    }
    while (link_file_count != NULL) {
        list_node = (name_list*)malloc(sizeof(name_list));
        list_node->name = link_file_count->name;
        list_node->next = list_head->next;
        list_head->next = list_node;
        link_file_count = link_file_count->next;
    }
    while (link_dir_count != NULL) {
        list_node = (name_list*)malloc(sizeof(name_list));
        list_node->name = link_dir_count->name;
        list_node->next = list_head->next;
        list_head->next = list_node;
        link_dir_count = link_dir_count->next;
    }
    list_node = list_head->next;
    while (list_node != NULL) {
        if (strcmp(name, list_node->name) == 0) {   
            count++;
            name_count=add_file_index(base_name, count);
            free(name);
            name = concat_path(name_count, ext);
            free(name_count);
            list_node = list_head->next; // 重新检查
        }
        else
            list_node = list_node->next;
    }
    name_list *temp;
    //释放内存
while (list_head != NULL) {
    temp = list_head;
    list_head = list_head->next;
    free(temp);
}
free(base_name);
free_filelist(folder, file, link_dir_head, link_file_head);
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
//复制链接
void copy_symlink(const char* source, const char* dest) {
    char target[1024];
    ssize_t len = readlink(source, target, sizeof(target) - 1);
    if (len == -1) {
        perror("readlink");
        return;
    }
    target[len] = '\0';
    
    if (symlink(target, dest) == -1) {
        perror("symlink");
    }
}
//复制目录
void cp_dir(char*source,char*dest){
    mkdir(dest, 0755);
    folder_list *folder=(folder_list*)malloc(sizeof(folder_list));
    file_list* file=(file_list*)malloc(sizeof(file_list));
    link_file*link_fi=(link_file*)malloc(sizeof(link_file));
    link_dir*link_fo=(link_dir*)malloc(sizeof(link_dir));
    folder_list *folder_count=(folder_list*)malloc(sizeof(folder_list));
    file_list* file_count=(file_list*)malloc(sizeof(file_list));
    link_file* link_file_count = (link_file*)malloc(sizeof(link_file));
    link_dir* link_dir_count = (link_dir*)malloc(sizeof(link_dir));
    folder->next=NULL;
    file->next=NULL;
    link_fi->next=NULL;
    link_fo->next=NULL;
    list_directory(source,folder,file,link_fo,link_fi);
    folder_count=folder->next;
    file_count=file->next; 
    link_file_count=link_fi->next;
    link_dir_count=link_fo->next;
    while (file_count!=NULL)
    {   
        copy(concat_path(concat_path(source,"/"),file_count->name),concat_path(concat_path(dest,"/"),file_count->name));
        file_count=file_count->next;
    }
    while (link_file_count != NULL) {
        copy_symlink(concat_path(concat_path(source,"/"), link_file_count->name), concat_path(concat_path(dest, "/"), link_file_count->name));
        link_file_count = link_file_count->next;
    }
    while (link_dir_count != NULL) {
        copy_symlink(concat_path(concat_path(source,"/"), link_dir_count->name), concat_path(concat_path(dest, "/"), link_dir_count->name));
        link_dir_count = link_dir_count->next;
    }
    while (folder_count!=NULL)
    {
        cp_dir(concat_path(concat_path(source,"/"),concat_path(folder_count->name,"/")),concat_path(concat_path(dest,"/"),folder_count->name));
        folder_count=folder_count->next;
    }
}
   
// 获取文件大小
long get_size(FILE *file){
    fseek(file,0,SEEK_END);
    long size=ftell(file);
    fseek(file,0,SEEK_SET);
    return size;
}
// 检测是文件还是目录还是符号链接(目录返回1文件返回2链接返回3其他返回0)
int check_type(char *path) {
    struct stat path_stat;
    if (lstat(path, &path_stat) != 0) {
        perror("lstat");
        return 0;  
    }
    if (S_ISDIR(path_stat.st_mode))
        return 1;
    else if (S_ISREG(path_stat.st_mode)) 
        return 2;
    else if (S_ISLNK(path_stat.st_mode)) {
        char target[1024];
        ssize_t len = readlink(path, target, sizeof(target) - 1);
        if (len == -1) {
            perror("readlink");
            return 0; 
        }
        target[len] = '\0'; 
        struct stat link_stat;
        if (stat(target, &link_stat) == 0) {  
            if (S_ISDIR(link_stat.st_mode)) {
                return 3; 
            } else if (S_ISREG(link_stat.st_mode)) {
                return 4; 
            } else {
                return 5;  
            }
        } else {
            perror("stat failed");
            return -1;  
        }
    }
    
    return 0;  // 未知类型
}
//创建完整路径 
void dir_p(char*path){
    char*par_path;
struct stat st;
    if (stat(path, &st) == 0 && S_ISDIR(st.st_mode)) {
        return;
    }
    else{
        par_path=(char*)malloc(strlen(path)+1);
        strcpy(par_path,path);
        dir_p(dirname(par_path));
        mkdir(path,0755);
    }
}
// 删除目录
void delete_directory(char *base_path) {
    base_path=concat_path(base_path,"/");
     folder_list *folder_head = (folder_list*)malloc(sizeof(folder_list));
    file_list *file_head = (file_list*)malloc(sizeof(file_list));
    link_dir *link_dir_head = (link_dir*)malloc(sizeof(link_dir));
    link_file *link_file_head = (link_file*)malloc(sizeof(link_file));
    folder_head->next = NULL;
    file_head->next = NULL;
    link_dir_head->next = NULL;
    link_file_head->next = NULL;
    folder_list *folder;
    file_list *file;
    link_dir *link_dir;
    link_file *link_file;
    list_directory(base_path,folder_head,file_head,link_dir_head,link_file_head);
    file=file_head->next;
    folder=folder_head->next;
    link_dir=link_dir_head->next;
    link_file=link_file_head->next;
    while (file!=NULL)
    {
        remove(concat_path(base_path,file->name));
        file=file->next;
    }
    while (link_dir!=NULL)
    {
        remove(concat_path(base_path,link_dir->name));
        link_dir=link_dir->next;
    }
    while (link_file!=NULL)
    {
        remove(concat_path(base_path,link_file->name));
        link_file=link_file->next;
    }
    while (folder!=NULL)
    {   
        delete_directory(concat_path(base_path,folder->name));
        rmdir(concat_path(base_path,folder->name));
        folder=folder->next;
    }
    rmdir(base_path);
}
//获取配置
char *get_config(){
    key_t shm_key = ftok(CON_KEY, PROJ_ID);
    int shm_id = shmget(shm_key, 1024, IPC_CREAT | 0666);
    char *config = (char *)shmat(shm_id, NULL, 0);
    return config;
}
//释放文件列表
void free_filelist(folder_list* folder_head, file_list* file_head, link_dir* link_dir_head, link_file* link_file_head) {
    folder_list* fod_tmp;
    file_list* fi_tmp;
    link_dir* li_dir_tmp;
    link_file* li_fi_tmp;

    while (folder_head != NULL) {   
        fod_tmp = folder_head;
        folder_head = folder_head->next;
        if(fod_tmp->name!=NULL)
            free(fod_tmp->name);  
        free(fod_tmp);       
    }
    while (file_head != NULL) {
        fi_tmp = file_head;
        file_head = file_head->next;
        if(fi_tmp->name!=NULL)
            free(fi_tmp->name);
        free(fi_tmp);
    }
    while (link_dir_head != NULL) {
        li_dir_tmp = link_dir_head;
        link_dir_head = link_dir_head->next;
        if(li_dir_tmp->name!=NULL)
            free(li_dir_tmp->name);
        free(li_dir_tmp);
    }
    while (link_file_head != NULL) {
        li_fi_tmp = link_file_head;
        link_file_head = link_file_head->next;
        if(li_fi_tmp->name!=NULL)
            free(li_fi_tmp->name);
        free(li_fi_tmp);
    }
}

//分离带换行长字符串
char* split_long_string(char* ori,char split) {
    if (ori == NULL) return NULL; 

    char* next = ori;
    while (*next != split && *next != '\0') {
        next++;
    }
    if (*next == split) {
        *next = '\0';
        next++;  
    } else {
        next = NULL;
    }

    return next;
}
//获取命令输出
char *get_cmd_output(char*cmd){
char *output=(char*)malloc(1024);
FILE *fp = popen(cmd, "r");
fread(output,1,1024,fp);
pclose(fp);
return output;
}