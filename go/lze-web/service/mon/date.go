package mon

import (
	"lze-web/model/mon/date"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Date(c *gin.Context) {
	var rec date.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, err)
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "mon", "edittime") {
		userMes := global.GetUserMes(rec.Name)
		userMes.Outdate = rec.Time
		global.SaveUserConfig()
		c.Status(200)
	} else {
		c.Status(401)
	}
}
