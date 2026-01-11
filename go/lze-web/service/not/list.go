package not

import (
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	var sendData response.Response[[]string]
	files := global.ScanDir(global.NotPath)
	length := len(files)
	var List []string
	for i := 0; i < length; i++ {
		List = append(List, global.SplitExt(files[i].Name))
	}
	sendData.Code = 200
	sendData.Data = List
	c.JSON(sendData.Code, sendData)
}
