package doc

import (
	copyDoc "lze-web/model/doc/copy"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/otiai10/copy"
)

func Copy(c *gin.Context) {
	var rec copyDoc.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "copy") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		for _, files := range rec.CopyList {
			sourcePath := filepath.Join(global.DocPath, filepath.FromSlash(rec.Source), files)
			filename := global.UniqueName(destPath, filepath.Base(files))
			destPath := filepath.Join(destPath, filename)
			if !global.IsSub(sourcePath, destPath) {
				copy.Copy(sourcePath, destPath)
			}
		}
		sendData.Code = 200
		sendData.Msg = global.GetText("copy_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_copy_per", c)
		c.JSON(403, sendData)
	}
}
