package not

import (
	"lze-web/model/not/add"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Add(c *gin.Context) {
	var rec add.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "not", "newnote") {
		name := global.UniqueName(global.NotPath, rec.NewTitle+".txt")
		global.WriteText(filepath.Join(global.NotPath, name), rec.NewContent)
		sendData.Code = 200
		sendData.Msg = global.GetText("add_note_success", c)
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_add_note_per", c)
		c.JSON(sendData.Code, sendData)
	}
}
