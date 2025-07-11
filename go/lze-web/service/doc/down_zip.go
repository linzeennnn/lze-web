package doc

import (
	"io"
	"lze-web/pkg/global"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

func DownZip(c *gin.Context) {
	downToken := c.Query("downToken")
	zipDir := filepath.Join(global.TempPath, downToken)
	files := global.ScanDir(zipDir)
	fileName := files[0].Name
	sendFile(filepath.Join(zipDir, fileName), fileName, c)

}
func sendFile(path, name string, c *gin.Context) {
	encodedName := url.PathEscape(name)
	c.Writer.Header().Set("Content-Disposition",
		"attachment; filename=\""+name+"\"; filename*=UTF-8''"+encodedName)
	c.Writer.Header().Set("Content-Type", "application/octet-stream")

	file, err := os.Open(path)
	if err != nil {
		c.JSON(500, gin.H{"error": "文件打开失败"})
		return
	}
	defer file.Close()

	// ⚠️ 重点：只在 io.Copy 成功后再删
	if _, err = io.Copy(c.Writer, file); err != nil {
		// 插件下载失败或未消费内容
		c.JSON(500, gin.H{"error": "文件传输失败"})
		return
	}

	c.Writer.Flush()

	// 现在可以删了，确保数据已写出
	go func() {
		// 可以加一点缓冲时间，防止插件写入缓存
		time.Sleep(10 * time.Second)
		os.RemoveAll(filepath.Dir(path))
	}()
}
