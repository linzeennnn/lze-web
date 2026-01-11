package mon

import (
	"lze-web/model/mon/date"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Date(c *gin.Context) {
	var rec date.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "mon", "edittime") {
		userMes := global.GetUserMes(rec.Name)
		userMes.Outdate = rec.Time
		global.SaveUserConfig()
		sendData.Code = 200
		sendData.Msg = global.GetText("update_date_success", c)
		c.JSON(sendData.Code, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_update_date_per", c)
		c.JSON(sendData.Code, sendData)
	}
}
