package global

import (
	"encoding/json"
	"fmt"
	"io"
	fileSystem "lze-web/model/other/fs"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

// 获取运行时候的目录
func GetWorkDir() string {
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	runDir := filepath.Dir(exePath)
	return runDir
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

// 扫描目录
func ScanDir(path string) []fileSystem.Files {
	fileList := []fileSystem.Files{}
	entries, err := os.ReadDir(path)
	if err != nil {
		panic(err)
	}
	for _, entry := range entries {
		if strings.HasPrefix(entry.Name(), ".") {
			continue
		}
		filePath := filepath.Join(path, entry.Name())
		fileType := FileType(filePath)
		info, err := os.Lstat(filePath)
		if err != nil {
			continue
		}
		fileList = append(fileList, fileSystem.Files{
			Name:     entry.Name(),
			FileType: fileType,
			ModTime:  info.ModTime().Unix(),
		})
	}
	sort.Slice(fileList, func(i, j int) bool {
		return fileList[i].ModTime > fileList[j].ModTime
	})
	return fileList
}

// 文件类型
func FileType(path string) string {
	info, err := os.Lstat(path)
	if err != nil {
		panic(err)
	}
	mode := info.Mode()
	switch {
	case mode.IsRegular():
		return "file"
	case mode.IsDir():
		return "dir"
	case mode&os.ModeSymlink != 0:
		target, err := os.Stat(path)
		if err == nil {
			if target.IsDir() {
				return "dir_link"
			} else {
				return "file_link"
			}
		}
		return "unknow"
	default:
		return "other"
	}
}

// 获取唯一文件名
func UniqueName(path, fileName string) string {
	fullPath := filepath.Join(path, fileName)
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return fileName
	}
	ext := filepath.Ext(fileName)
	name := strings.TrimSuffix(fileName, ext)
	for i := 1; ; i++ {
		newName := fmt.Sprintf("%s(%d)%s", name, i, ext)
		fullPath = filepath.Join(path, newName)
		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			return newName
		}
	}

}

// 合并文件
func MergeFile(tempPath string, total int64) string {
	fileName := filepath.Base(tempPath)
	os.Mkdir(filepath.Join(tempPath, "target"), 0755)
	targetFile := filepath.Join(tempPath, "target", fileName)
	output, err := os.Create(targetFile)
	if err != nil {
		return ""
	}
	defer output.Close()
	var i int64
	for i = 0; i < total; i++ {
		chunkPath := filepath.Join(tempPath, strconv.FormatInt(i, 10))
		chunk, err := os.Open(chunkPath)
		if err != nil {
			return ""
		}
		io.Copy(output, chunk)
		chunk.Close()
		os.Remove(chunkPath)
	}
	return targetFile
}

// 判断粘贴目标路径是否是其子目录
func IsSub(oldPath, newPath string) bool {
	absOld, err := filepath.Abs(oldPath)
	if err != nil {
		fmt.Println("源路径解析失败:", err)
		return false
	}
	absNew, err := filepath.Abs(newPath)
	if err != nil {
		fmt.Println("目标路径解析失败:", err)
		return false
	}
	absOld = filepath.Clean(absOld)
	absNew = filepath.Clean(absNew)
	if absOld == absNew {
		return true
	}
	if strings.HasPrefix(absNew, absOld+string(filepath.Separator)) {
		return true
	}

	return false
}

// 去除后缀名
func SplitExt(fileName string) string {
	ext := filepath.Ext(fileName)
	if ext == "" {
		return fileName
	}
	return strings.TrimSuffix(fileName, ext)
}

// 检查是否包含后缀名
func IncludeExt(name string, extList []string) bool {
	ext := strings.ToLower(filepath.Ext(name))
	for _, e := range extList {
		if ext == e {
			return true
		}
	}
	return false
}

// 判断文件是否存在
func FileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil || !os.IsNotExist(err)
}
