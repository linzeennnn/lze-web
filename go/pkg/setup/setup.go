package setup

import "lze-web/pkg/global"

func Setup() {
	global.WorkDir = global.GetWorkDir()
	userConfigStr := global.ReadText(global.WorkDir + "config/user_config.json")
	workConfigStr := global.ReadText(global.WorkDir + "config/work_config.json")
	global.UserConfig = global.JsonToMap(userConfigStr)
	UserJson := global.UserConfig["user"].(map[string]interface{})
	for user := range UserJson {
		global.UserList = append(global.UserList, user)
	}
	WorkConfig := global.JsonToMap(workConfigStr)
	global.Port = WorkConfig["port"].(string)
	global.MaxUploadSize = WorkConfig["max_size"].(string)
	global.FilePath = WorkConfig["file_path"].(string)
	if global.FilePath == "default" {
		global.FilePath = global.WorkDir + "file/"
	}
	global.LogPath = WorkConfig["log_path"].(string)
	if global.LogPath == "default" {
		global.LogPath = global.WorkDir + "lze-web.log"
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
		return global.FilePath + defaultPath + "/"
	}
	return path

}
