package doc

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func DownloadFile(c *gin.Context) {
	flie := c.Query("file_path")
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "downfile") {
		filePath := filepath.Join(global.DocPath, flie)
		c.FileAttachment(filePath, filepath.Base(filePath))
	} else {
		c.Status(401)
	}
}
