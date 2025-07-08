package not

import (
	"lze-web/model/not/list"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	files := global.ScanDir(global.NotPath)
	length := len(files)
	var sendData list.Send
	for i := 0; i < length; i++ {
		sendData.List = append(sendData.List, files[i].Name)
	}
	c.JSON(200, sendData)
}
