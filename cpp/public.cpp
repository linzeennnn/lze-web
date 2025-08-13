#include "public.h"


json userData;
json workData;
string work_dir;
string user_config_path;
string work_config_path;
string file_path;
bool edit=false;
json langData;
json langDict;

void init(){
work_dir="/opt/lze-web";
user_config_path=work_dir+"/config/user_config.json";
work_config_path=work_dir+"/config/work_config.json";
string user_config_text=read_text(user_config_path);
string work_config_text=read_text(work_config_path);
string lang_config_text=read_text("lang.json");
langData=json::parse(lang_config_text);
userData=json::parse(user_config_text);
workData=json::parse(work_config_text);
string config_file_path=workData["file_path"];
if (config_file_path == "default") {
    file_path = work_dir + "/file";
} else {
    file_path = config_file_path;
}
}
void save_config(){
    write_text(user_config_path,userData.dump(4));
    write_text(work_config_path,workData.dump(4));
}
string read_text(string path){
std::ifstream file(path);
    if (!file) {
        std::cout << "无法打开文件\n";
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
string file_type(filesystem::path filePath){
    try {
        if (!fs::exists(filePath))
            return "other";

        if (fs::is_symlink(filePath)) {
            // 是符号链接，进一步判断它指向的类型
            fs::path target = fs::read_symlink(filePath);
            fs::file_status target_status = fs::status(filePath);

            if (fs::is_directory(target_status))
                return "dir_link";
            else if (fs::is_regular_file(target_status))
                return "file_link";
            else
                return "other";
        } else {
            if (fs::is_directory(filePath))
                return "dir";
            else if (fs::is_regular_file(filePath))
                return "file";
            else
                return "other";
        }
    } catch (...) {
        return "other"; // 发生异常时也返回 other
    }
}
string get_work_path(){
return fs::read_symlink("/proc/self/exe").parent_path().string();
}
string get_text(string key){
    return langDict[key];
}
string text_box(string text){
    return "["+get_text(text)+"]";
}
void mod_permit(string user,string control,string action,bool add){
    json control_config=userData["control"];
    json user_arr=control_config[control]["action"][action]["user"];
    if(add)
        user_arr.push_back(user);
    else
         user_arr.erase(std::remove(user_arr.begin(), user_arr.end(), user), user_arr.end());
}
