package doc

import (
	movefolder "lze-web/model/doc/move_folder"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func MoveFolder(c *gin.Context) {
	var rec movefolder.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(200, err.Error())
		return
	}
	destPath := filepath.Join(global.DocPath, rec.Path)
	dirName := global.UniqueName(destPath, rec.Name)
	tempFileName := filepath.Join(global.TempPath, rec.Name)
	os.Rename(tempFileName, filepath.Join(destPath, dirName))
	os.RemoveAll(tempFileName)
}
