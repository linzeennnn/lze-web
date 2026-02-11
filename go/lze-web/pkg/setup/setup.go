package setup

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strconv"
)

//go:embed lang.json
var LangJson string

func setLang() {
	err := json.Unmarshal([]byte(LangJson), &global.Lang)
	if err != nil {
		panic(err)
	}

}
func Setup() {
	// 获取配置文件的路径
	global.WorkDir = global.GetWorkDir()
	userConfigStr := global.ReadText(filepath.Join(global.WorkDir, "config", "user_config.json"))
	workConfigStr := global.ReadText(filepath.Join(global.WorkDir, "config", "work_config.json"))
	global.CmdPath = filepath.Join(global.WorkDir, "config", "cmd_config.json")

	// 解析用户配置
	global.UserConfig = global.JsonToMap(userConfigStr)
	userMesValue := global.UserConfig["userMes"]
	UserMap, _ := userMesValue.([]interface{})
	UserJson, _ := json.Marshal(UserMap)
	json.Unmarshal(UserJson, &global.UserArr)
	for _, user := range global.UserArr {
		global.UserList = append(global.UserList, user.Name)
	}
	// 初始化命令缓存表
	global.CmdCacheMap.MaxDummy = 10
	global.CmdCacheMap.DummyIndex = 1
	global.CmdCacheMap.CmdMap = make(map[string]*global.CmdObj, global.CmdCacheMap.MaxDummy)
	for i := 1; i <= global.CmdCacheMap.MaxDummy; i++ {
		key := fmt.Sprintf("dummy%d", i) // 生成字符串 key
		global.CmdCacheMap.CmdMap[key] = &global.CmdObj{
			CmdStr: "",
			IsAuth: false,
			Time:   0,
		}
	}
	global.CmdCacheMap.OldestCmd = "dummy1"
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
	// 清空临时目录
	os.RemoveAll(global.TempPath)
	os.Mkdir(global.TempPath, 0755)
	// 设置语言
	setLang()
	//设置后缀名
	setFileType()
}
func setPath(pathType, defaultPath string, WorkConfig map[string]interface{}) string {
	path := WorkConfig[pathType].(string)
	if path == "default" {
		return filepath.Join(global.FilePath, defaultPath)
	}
	return path

}
func setFileType() {
	global.WebTypeMap = map[string]bool{
		".html": true, ".htm": true, ".css": true, ".js": true, ".mjs": true,
		".json": true, ".xml": true, ".rss": true, ".svg": true, ".webmanifest": true,
		".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true,
		".bmp": true, ".ico": true, ".avif": true,
		".mp3": true, ".wav": true, ".ogg": true, ".oga": true,
		".m4a": true, ".aac": true, ".flac": true,
		".mp4": true, ".webm": true, ".ogv": true, ".mov": true,
		".pdf": true, ".csv": true, ".md": true,
		".woff": true, ".woff2": true, ".ttf": true, ".otf": true,
		".eot": true, ".wasm": true}
	global.FileTypeMap = map[string]string{
		// 文本
		".txt": "not", ".md": "not", ".html": "not", ".htm": "not", ".css": "not", ".js": "not",
		".ts": "not", ".json": "not", ".xml": "not", ".yaml": "not", ".yml": "not", ".toml": "not",
		".ini": "not", ".conf": "not", ".cfg": "not", ".csv": "not", ".log": "not", ".c": "not", ".h": "not",
		".cpp": "not", ".hpp": "not", ".cc": "not", ".cxx": "not", ".go": "not", ".py": "not", ".java": "not",
		".cs": "not", ".php": "not", ".rb": "not", ".swift": "not", ".sh": "not", ".bash": "not", ".bat": "not",
		".ps1": "not", ".sql": "not", ".vue": "not", ".jsx": "not", ".tsx": "not", ".env": "not",
		".gitignore": "not",
		// 图片
		".jpg": "img", ".jpeg": "img", ".png": "img", ".gif": "img",
		".webp": "img", ".bmp": "img", ".ico": "img", ".avif": "img",
		// 视频
		".mp4": "vid", ".webm": "vid", ".ogv": "vid", ".mov": "vid",
	}
}
