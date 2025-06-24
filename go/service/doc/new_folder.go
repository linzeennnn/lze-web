package doc

import (
	newfolder "lze-web/model/doc/new_folder"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func NewFolder(c *gin.Context) {
	var rec newfolder.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(200, err.Error())
		return
	}
	global.LogOutput(rec.FolderName)
	if global.CheckPermit(rec.User, rec.Token, "doc", "newdir") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		dirName := global.UniqueName(destPath, rec.FolderName)
		os.Mkdir(filepath.Join(destPath, dirName), 0755)

	} else {
		c.Status(401)
	}
}
