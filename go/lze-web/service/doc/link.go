package doc

import (
	"lze-web/model/doc/link"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Link(c *gin.Context) {
	var rec link.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "doc", "link") {
		fullPath := filepath.Join("file", "Documents", rec.Path)
		sendData.Code = 200
		sendData.Msg = global.GetText("getLink_success", c)
		sendData.Data = fullPath
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_getLink_per", c)
		c.JSON(403, sendData)
	}
}
