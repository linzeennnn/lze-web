package doc

import (
	newfolder "lze-web/model/doc/new_folder"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func NewFolder(c *gin.Context) {
	var rec newfolder.Rec
	var sendData response.Response[newfolder.Send]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "newdir") {
		destPath := filepath.Join(global.DocPath, rec.NowPath)
		dirName := global.UniqueName(destPath, rec.FolderName)
		os.Mkdir(filepath.Join(destPath, dirName), 0755)
		sendData.Code = 200
		sendData.Msg = global.GetText("new_dir_success", c)
		sendData.Data.FileItem = [2]string{dirName, "dir"}
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_new_dir_per", c)
		c.JSON(403, sendData)
	}
}
