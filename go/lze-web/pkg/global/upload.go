package global

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
)

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
	targetFile := filepath.Join(tempPath, "target_"+fileName)
	output, err := os.Create(targetFile)
	if err != nil {
		fmt.Println("error")
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

// 总文件数量计数器+1
func AddTotalFileCount(token string) {
	UploadTotal[token].Lock.Lock()
	UploadTotal[token].Count++
	UploadTotal[token].Lock.Unlock()
}

// 设置总文件数量条目
func SetTotalFileCountItem(token string) {
	UploadTotal[token] = &UploadCount{
		Count: 0,
		Lock:  &sync.Mutex{},
	}
}

// 移除总文件数量条目
func RemoveTotalFileCountItem(token string) {
	delete(UploadTotal, token)
}

// 获取总文件数量
func GetTotalFileCount(token string) int {
	return UploadTotal[token].Count
}

// 是否上传完所有文件
func IsUploadFinished(token string, num int) bool {
	return UploadTotal[token].Count >= num
}
