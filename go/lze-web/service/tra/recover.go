package tra

import (
	"fmt"
	"lze-web/model/tra/recover"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Recover(c *gin.Context) {
	var rec recover.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	if global.CheckPermit(rec.User, rec.Token, "tra", "recover") {
		if rec.SourcePath {
			fmt.Println("source")
			delData := global.GetDeldata()
			for _, files := range rec.RecoverList {
				oriPathStr := delData[filepath.Base(files)].(string)
				oriPath := filepath.FromSlash(oriPathStr)
				dest := filepath.Join(global.DocPath, oriPath)
				parentPath := filepath.Dir(dest)
				os.MkdirAll(parentPath, 0755)
				fileName := global.UniqueName(parentPath, filepath.Base(files))
				source := filepath.Join(global.TraPath, files)
				targetPath := filepath.Join(parentPath, fileName)
				os.Rename(source, targetPath)
				delete(delData, filepath.Base(files))
			}
			global.SaveDelData(delData)
		} else {
			fmt.Println("no source")
			for _, files := range rec.RecoverList {
				dest := filepath.Join(global.DocPath, "Recover_file")
				os.Mkdir(dest, 0755)
				fileName := global.UniqueName(dest, filepath.Base(files))
				source := filepath.Join(global.TraPath, files)
				targetPath := filepath.Join(dest, fileName)
				os.Rename(source, targetPath)
			}

		}
	} else {
		c.Status(401)
	}
}
