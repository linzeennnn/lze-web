package bok

import (
	"lze-web/model/bok/list"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	files := global.ScanDir(global.BokPath)
	length := len(files)
	sendData := make([]list.Send, length)
	for i := 0; i < length; i++ {
		sendData[i].Name = files[i].Name
		sendData[i].Content = global.ReadText(filepath.Join(global.BokPath, files[i].Name))
	}
	c.JSON(200, sendData)
}
