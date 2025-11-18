package doc

import (
	"lze-web/model/doc/del"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.String(400, err.Error())
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "delete") {
		delData := global.GetDeldata()
		for _, files := range rec.DelList {
			cleanPath := strings.TrimPrefix(files, "./")
			docPath := filepath.FromSlash(cleanPath)
			sourcePath := filepath.Join(global.DocPath, docPath)
			filename := global.UniqueName(global.TraPath, filepath.Base(docPath))
			destPath := filepath.Join(global.TraPath, filename)
			os.Rename(sourcePath, destPath)
			delData[filename] = files
			global.SaveDelData(delData)
		}
	} else {
		c.Status(401)
	}

}
