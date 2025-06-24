package pic

import (
	"lze-web/model/pic/list"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	files := global.ScanDir(filepath.Join(global.PicPath, filepath.FromSlash(rec.Folder)))
	length := len(files)
	picList := make([]list.FileList, length)
	for i := 0; i < length; i++ {
		picList[i].Name = files[i].Name
		picList[i].Type = files[i].FileType
	}
	var sendData list.Send
	sendData.FileList = picList
	sendData.CurrentFolder = rec.Folder
	sendData.ParentFolder = filepath.Base(rec.Folder)
	c.JSON(200, sendData)
}
