package doc

import (
	"lze-web/model/doc/rename"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Rename(c *gin.Context) {
	var rec rename.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "doc", "rename") {
		oldpath := filepath.FromSlash(rec.OldPath)
		newpath := filepath.FromSlash(rec.NewPath)
		source := filepath.Join(global.DocPath, oldpath)
		dest := filepath.Join(global.DocPath, newpath)
		os.Rename(source, dest)
	} else {
		c.Status(401)
	}
}
