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
	global.ImgMap = map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".gif": true,
		".webp": true, ".bmp": true, ".ico": true, ".avif": true}
	global.VidMap = map[string]bool{".mp4": true, ".webm": true, ".ogv": true, ".mov": true}
	global.TextMap = map[string]bool{
		".txt": true, ".md": true, ".html": true, ".htm": true, ".css": true, ".js": true,
		".ts": true, ".json": true, ".xml": true, ".yaml": true, ".yml": true, ".toml": true,
		".ini": true, ".conf": true, ".cfg": true, ".csv": true, ".log": true, ".c": true, ".h": true,
		".cpp": true, ".hpp": true, ".cc": true, ".cxx": true, ".go": true, ".py": true, ".java": true,
		".cs": true, ".php": true, ".rb": true, ".swift": true, ".sh": true, ".bash": true, ".bat": true,
		".ps1": true, ".sql": true, ".vue": true, ".jsx": true, ".tsx": true, ".env": true,
		".gitignore": true,
	}
}
