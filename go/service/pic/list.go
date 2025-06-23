package pic

import (
	"lze-web/model/pic/list"
	"lze-web/pkg/global"
	"strings"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var rec list.Rec
	if err := c.ShouldBind(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	files := global.ScanDir(global.PicPath + rec.Folder + "/")
	length := len(files)
	picList := make([]list.FileList, length)
	for i := 0; i < length; i++ {
		picList[i].Name = files[i].Name
		picList[i].Type = files[i].FileType
	}
	cleanPath := strings.Trim(rec.Folder, "/")
	curFolder := strings.Split(cleanPath, "/")[0]
	var sendData list.Send
	sendData.FileList = picList
	sendData.CurrentFolder = curFolder
	c.JSON(200, sendData)
}
