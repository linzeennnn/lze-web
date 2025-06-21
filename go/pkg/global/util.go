package global

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// 获取运行时候的目录
func GetWorkDir() string {
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	exeDir := filepath.Dir(exePath) + "/"
	return exeDir
}

// 从文件读取文本
func ReadText(path string) string {
	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	return string(data)
}

// 写入文本到文件
func WriteText(path, text string) {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		fmt.Println("打开文件失败:", err)
		return
	}
	defer file.Close()
	_, err = file.WriteString(text)
	if err != nil {
		fmt.Println("写入失败:", err)
		return
	}
}

// 输出日志到文件
func LogOutput(logtext string) {
	now := time.Now()
	formattime := now.Format("[2006/01/02-15:04:05]")
	file, err := os.OpenFile(LogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		fmt.Println("打开文件失败:", err)
		return
	}
	defer file.Close()
	_, err = file.WriteString(formattime + " " + logtext + "\n")
	if err != nil {
		fmt.Println("写入失败:", err)
		return
	}
}

// json转map
func JsonToMap(jsonStr string) map[string]interface{} {
	var data map[string]interface{}
	err := json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		panic(err)
	}
	return data
}
