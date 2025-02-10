#include "../public/public.h"
void send_file(const char *filepath, const char *filename) {
    int file_fd = open(filepath, O_RDONLY);
    struct stat file_stat;
    fstat(file_fd, &file_stat);
    printf("Content-Type: application/octet-stream\r\n");
    printf("Content-Disposition: attachment; filename=\"%s\"\r\n", filename);
    printf("Content-Length: %ld\r\n", file_stat.st_size);
    printf("Connection: close\r\n\r\n");
    fflush(stdout);
    off_t offset = 0;
    ssize_t sent_bytes;
    while ((sent_bytes = sendfile(STDOUT_FILENO, file_fd, &offset, file_stat.st_size - offset)) > 0) {
    }
    close(file_fd);
}
int cgiMain() {
    char*base_path="../../file/Documents/";
    char path[1024],token[50],user[10];
    cgiFormString("token", token, sizeof(token));
    cgiFormString("user", user, sizeof(user));
    check_action(user,token,"doc","downfile");
    cgiFormString("file_path", path, sizeof(path));
    send_file(concat_path(base_path,path),basename(path));
    return 0;
}