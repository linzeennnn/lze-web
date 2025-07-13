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
	_, err = io.Copy(c.Writer, file)
	if err != nil {
		c.JSON(500, gin.H{"error": "文件传输失败"})
		return
	}
	c.Writer.Flush()
	go func() {
		time.Sleep(60 * time.Second)
		os.RemoveAll(filepath.Dir(path))
	}()
}
