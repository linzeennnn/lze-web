package doc

import (
	"lze-web/model/doc/del"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
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
			sendData.Code = 200
			sendData.Msg = global.GetText("del_success", c)
			c.JSON(200, sendData)
		}
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_del_per", c)
		c.JSON(403, sendData)
	}

}
