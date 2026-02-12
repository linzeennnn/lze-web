package doc

import (
	copyDoc "lze-web/model/doc/copy"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Move(c *gin.Context) {
	var rec copyDoc.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "move") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		for _, files := range rec.CopyList {
			sourcePath := filepath.Join(global.DocPath, filepath.FromSlash(rec.Source), files)
			filename := global.UniqueName(destPath, filepath.Base(files))
			os.Rename(sourcePath, filepath.Join(destPath, filename))
		}
		sendData.Code = 200
		sendData.Msg = global.GetText("move_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_move_per", c)
		c.JSON(403, sendData)
	}
}
