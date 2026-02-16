package doc

import (
	"lze-web/model/doc/rename"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Rename(c *gin.Context) {
	var rec rename.Rec
	var sendData response.Response[rename.Send]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
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
		sendData.Code = 200
		sendData.Msg = global.GetText("rename_success", c)
		sendData.Data.FileItem = [2]string{fileName, global.FileType(dest)}
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_rename_per", c)
		c.JSON(403, sendData)
	}
}
