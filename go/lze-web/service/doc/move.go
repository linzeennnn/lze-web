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
	var sendData response.Response[copyDoc.Send]
	var fileList [][2]string
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
			targetPath := filepath.Join(destPath, filename)
			os.Rename(sourcePath, targetPath)
			fileList = append(fileList, [2]string{filename, global.FileType(targetPath)})
		}
		sendData.Code = 200
		sendData.Msg = global.GetText("move_success", c)
		sendData.Data.FileList = fileList
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_move_per", c)
		c.JSON(403, sendData)
	}
}
