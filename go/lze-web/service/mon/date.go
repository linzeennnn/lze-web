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
	if global.CheckPermit(rec.User, rec.Token, "mon", "edittime") {
		userMes := global.UserConfig["user"].(map[string]interface{})
		userInfo := userMes[rec.Name].(map[string]interface{})
		userInfo["tokentime"] = rec.Time
		global.SaveUserConfig()
		c.Status(200)
	} else {
		c.Status(401)
	}
}
