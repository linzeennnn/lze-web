#include "../public/public.h"
char*gen_used_string(char*total){
    char *used=total;
while (*used!=' ')
{
    used++;
}
*used='\0';
used++;
return used;
}
int main(int argc,char*argv[]){
    key_t key=atol(argv[1]);
    size_t body_size=atol(argv[2]);
    int shmid = shmget(key, body_size, 0666); 
    char *post_data = (char *)shmat(shmid, NULL, 0); 
cJSON*data=cJSON_CreateObject();
//cpu
cJSON_AddStringToObject(data,"cpuUsage",get_cmd_output("top -b -n1 | grep 'Cpu(s)' | awk '{print $2 + $4}'"));
//mem
char *mem_total=get_cmd_output("free -m | awk 'NR==2{print $2, $3}'");
char*mem_used=gen_used_string(mem_total);
//disk
char *disk_total=get_cmd_output("df / | awk 'NR==2 {print $2, $3}'");
char *disk_used=gen_used_string(disk_total);
//net
char*net_name=get_cmd_output("ip route | awk '/default/ {print $5}'");
net_name[strcspn(net_name, "\n")] = 0; 
char net_cmd[45+strlen(net_name)];
sprintf(net_cmd,"cat /proc/net/dev | awk '/%s/ {print $2, $10}'",net_name);
char *net_rec=get_cmd_output(net_cmd);
char *net_tr=gen_used_string(net_rec);
double net_rec_value=atof(net_rec);
double net_tr_value=atof(net_tr);
sprintf(net_rec,"%.2f",net_rec_value/(1024*1024));
sprintf(net_tr,"%.2f",net_tr_value/(1024*1024));
cJSON_AddStringToObject(data,"totalMemory",mem_total);
cJSON_AddStringToObject(data,"usedMemory",mem_used);
cJSON_AddStringToObject(data,"totalDisk",disk_total);
cJSON_AddStringToObject(data,"usedDisk",disk_used);
cJSON_AddStringToObject(data,"networkRx",net_rec);
cJSON_AddStringToObject(data,"networkTx",net_tr);
        strcpy(post_data,cJSON_PrintUnformatted(data));
        shmdt(post_data);
    return 0;
}