package doc

import (
	copyDoc "lze-web/model/doc/copy"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/otiai10/copy"
)

func Copy(c *gin.Context) {
	var rec copyDoc.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "doc", "copy") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		for _, files := range rec.CopyList {
			sourcePath := filepath.Join(global.DocPath, filepath.FromSlash(files))
			filename := global.UniqueName(destPath, filepath.Base(files))
			destPath := filepath.Join(destPath, filename)
			if !global.IsSub(sourcePath, destPath) {
				copy.Copy(sourcePath, destPath)
			}
		}
	} else {
		c.Status(401)
	}
}
