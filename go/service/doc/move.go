package doc

import (
	copyDoc "lze-web/model/doc/copy"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Move(c *gin.Context) {
	var rec copyDoc.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "doc", "move") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		for _, files := range rec.CopyList {
			sourcePath := filepath.Join(global.DocPath, filepath.FromSlash(files))
			filename := global.UniqueName(destPath, filepath.Base(files))
			os.Rename(sourcePath, filepath.Join(destPath, filename))
		}
	} else {
		c.Status(401)
	}
}
