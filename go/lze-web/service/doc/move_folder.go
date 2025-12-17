package doc

import (
	movefolder "lze-web/model/doc/move_folder"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func MoveFolder(c *gin.Context) {
	var rec movefolder.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	destPath := filepath.Join(global.DocPath, rec.Path)
	dirName := global.UniqueName(destPath, rec.Name)
	tempFileName := filepath.Join(global.TempPath, rec.Name)
	os.Rename(tempFileName, filepath.Join(destPath, dirName))
	os.RemoveAll(tempFileName)
	sendData.Code = 200
	sendData.Msg = global.GetText("move_dir_success", c)
	c.JSON(200, sendData)
}
