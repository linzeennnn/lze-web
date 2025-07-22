package bok

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	files := global.ScanDir(global.BokPath)
	length := len(files)
	sendData := make([]string, length)
	for i := 0; i < length; i++ {
		sendData[i] = global.SplitExt(files[i].Name)
	}
	c.JSON(200, sendData)
}
