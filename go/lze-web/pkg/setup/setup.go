package setup

import (
	"encoding/json"
	"lze-web/pkg/global"
	"path/filepath"
	"strconv"
)

func Setup() {
	// 获取配置文件的路径
	global.WorkDir = global.GetWorkDir()
	userConfigStr := global.ReadText(filepath.Join(global.WorkDir, "config", "user_config.json"))
	workConfigStr := global.ReadText(filepath.Join(global.WorkDir, "config", "work_config.json"))
	global.CmdPath = filepath.Join(global.WorkDir, "config", "cmd_config.json")

	// 解析用户配置
	global.UserConfig = global.JsonToMap(userConfigStr)
	UserMap := global.UserConfig["userMes"].(map[string]interface{})
	UserJson, _ := json.Marshal(UserMap)
	json.Unmarshal(UserJson, &global.UserArr)
	for _, user := range global.UserArr {
		global.UserList = append(global.UserList, user.Name)
	}

	//解析work配置
	WorkConfig := global.JsonToMap(workConfigStr)
	global.Port = WorkConfig["port"].(string)
	global.Gzip = WorkConfig["gzip"].(string)
	global.JwtKey = []byte(WorkConfig["secretKey"].(string))
	maxSiztStr := WorkConfig["max_size"].(string)
	global.MaxUploadSize, _ = strconv.ParseInt(maxSiztStr, 10, 64)

	// 路径配置赋值
	global.FilePath = WorkConfig["file_path"].(string)
	if global.FilePath == "default" {
		global.FilePath = filepath.Join(global.WorkDir, "file")
	}
	global.LogPath = WorkConfig["log_path"].(string)
	if global.LogPath == "default" {
		global.LogPath = filepath.Join(global.WorkDir, "lze-web.log")
	}
	global.DocPath = setPath("doc_path", "Documents", WorkConfig)
	global.PicPath = setPath("pic_path", "Pictures", WorkConfig)
	global.NotPath = setPath("not_path", "Note", WorkConfig)
	global.BokPath = setPath("bok_path", "Bookmark", WorkConfig)
	global.TraPath = setPath("tra_path", "trash", WorkConfig)
	global.TempPath = setPath("tmp_path", "temp", WorkConfig)

}
func setPath(pathType, defaultPath string, WorkConfig map[string]interface{}) string {
	path := WorkConfig[pathType].(string)
	if path == "default" {
		return filepath.Join(global.FilePath, defaultPath)
	}
	return path

}
