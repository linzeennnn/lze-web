package tra

import (
	"lze-web/model/public/response"
	"lze-web/model/tra/recover"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Recover(c *gin.Context) {
	var rec recover.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "tra", "recover") {
		if rec.SourcePath {
			// 原目录存在
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
			// 原目录已经不存在
			for _, files := range rec.RecoverList {
				dest := filepath.Join(global.DocPath, "Recover_file")
				os.Mkdir(dest, 0755)
				fileName := global.UniqueName(dest, filepath.Base(files))
				source := filepath.Join(global.TraPath, files)
				targetPath := filepath.Join(dest, fileName)
				os.Rename(source, targetPath)
			}

		}
		sendData.Code = 200
		sendData.Msg = global.GetText("recover_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_recover_per", c)
		c.JSON(403, sendData)
	}
}
