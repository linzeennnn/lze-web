package bok

import (
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var sendData response.Response[[]string]
	files := global.ScanDir(global.BokPath)
	length := len(files)
	sendData.Data = make([]string, length)
	for i := 0; i < length; i++ {
		sendData.Data[i] = global.SplitExt(files[i].Name)
	}
	sendData.Code = 200
	c.JSON(sendData.Code, sendData)
}
