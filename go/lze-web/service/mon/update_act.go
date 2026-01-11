package mon

import (
	updateact "lze-web/model/mon/update_act"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func UpdateAct(c *gin.Context) {
	var rec updateact.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "mon", "change") {
		switch rec.Change {
		case "add":
			global.PermitAdd(rec.Name, rec.Control, rec.Action)
		case "remove":
			global.PermitRemove(rec.Name, rec.Control, rec.Action)
		}
		global.SaveUserConfig()
		sendData.Code = 200
		sendData.Msg = global.GetText(rec.Change+"_per_success", c)
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_change_per", c)
		c.JSON(sendData.Code, sendData)
	}
}
