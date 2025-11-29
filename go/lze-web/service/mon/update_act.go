package mon

import (
	updateact "lze-web/model/mon/update_act"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func UpdateAct(c *gin.Context) {
	var rec updateact.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(200, err)
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
	} else {
		c.Status(401)
	}
}
