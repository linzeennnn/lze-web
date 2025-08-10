#pragma once
#include "json.hpp" 
#include <string>
#include <filesystem>
#include <fstream> 
using namespace std;
using json = nlohmann::json;
namespace fs = std::filesystem;
bool edit=false;
json userData;
json workData;
string user_config_path="/opt/lze-web/config/user_config.json";
string work_config_path="/opt/lze-web/config/work_config.json";
void write_text(string path, string content) ;
string get_work_path();
string read_text(string path);
void save_user_config();
void save_work_config();
void init();



string get_work_path(){
return fs::read_symlink("/proc/self/exe").parent_path();
}
void init(){
userData=json::parse(read_text(user_config_path));
workData=json::parse(read_text(work_config_path));
}
void save_user_config(){
    write_text(user_config_path,userData.dump(4));
}
void save_work_config(){    
    write_text(work_config_path,workData.dump(2));
}
string read_text(string path){
std::ifstream file(path);
    if (!file) {
        std::cerr << "无法打开文件\n";
        return "";
    }

    std::ostringstream buffer;
    buffer << file.rdbuf();
    std::string content = buffer.str();

    return content; 
}
void write_text(string path, string content) {
    try {
        // 自动创建目录
        filesystem::path p(path);
        if (p.has_parent_path()) {
            filesystem::create_directories(p.parent_path());
        }

        // 以覆盖模式写入
        ofstream file(path, ios::out | ios::trunc);
        if (!file) {
            throw runtime_error("无法打开文件: " + path);
        }

        file << content;  // 写入内容
        file.close();     // 关闭文件

    } catch (const exception& e) {
        cerr << "写入文件失败: " << e.what() << endl;
    }
}