#pragma once
#include "json.hpp" 
#include <string>
#include <filesystem>
#include<iostream>
#include <fstream> 
using json = nlohmann::json;
using namespace std;
namespace fs = filesystem;
extern bool edit;
extern json userData;
extern json workData;
extern string work_dir;
extern string user_config_path;
extern string work_config_path;
extern string file_path;
void write_text(std::string path, string content) ;
std::string get_work_path();
string read_text(std::string path);
void save_user_config();
void save_work_config();
void init();
string file_type(filesystem::path filePath);

