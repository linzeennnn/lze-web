package doc

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func DownloadFile(c *gin.Context) {
	user := c.Query("file")
	token := c.Query("token")
	flie := c.Query("file_path")
	if global.CheckPermit(user, token, "doc", "downfile") {
		filePath := filepath.Join(global.DocPath, flie)
		c.FileAttachment(filePath, filepath.Base(filePath))
	} else {
		c.Status(401)
	}
}
