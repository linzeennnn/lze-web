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
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "rename") {
		oldpath := filepath.FromSlash(rec.OldPath)
		newpath := filepath.FromSlash(rec.NewPath)
		filePath := filepath.Join(global.DocPath, filepath.Dir(newpath))
		fileName := global.UniqueName(filePath, filepath.Base(newpath))
		source := filepath.Join(global.DocPath, oldpath)
		dest := filepath.Join(filePath, fileName)
		os.Rename(source, dest)
	} else {
		c.Status(401)
	}
}
