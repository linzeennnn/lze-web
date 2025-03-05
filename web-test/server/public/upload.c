#include"../public/public.h"

key_t gen_key(){
  return (rand() % 900 + 100)*100000+time(NULL)%100000;
}
