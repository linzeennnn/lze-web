#include "key.h"
#include"split_line.h"
#include <iostream>
#include"option.h"
#include "menu.h"
#include "run_win.h"
using namespace std;

void test(){

}
int main() {
enter_run_win();
option* test_opt1 = new option("str1", test);
option* test_opt2 = new option("str2", test);
option* test_opt3 = new option("str3", test);
vector<option*> opt_list={test_opt1,test_opt2,test_opt3};
menu test("test",opt_list);
test.open();
Key key;
key.up([&test](){test.up();});
key.down([&test](){test.down();});
key.run();
leave_run_win();
    return 0;
}