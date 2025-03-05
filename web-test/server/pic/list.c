#include "../public/public.h"
int main(int argc,char*argv[]) {
    char*share[2];
    share[0]=argv[1];
    share[1]=argv[2];
    list_all(share,PIC_PATH);
    return 0;
}
