package mon

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	sendConfig := global.UserConfig
	userJson := make(map[string]interface{})
	for _, userMes := range global.UserArr {
		m, _ := userJson[userMes.Name].(map[string]interface{})
		m = make(map[string]interface{})
		m["tokentime"] = userMes.Outdate
		userJson[userMes.Name] = m
	}
	sendConfig["user"] = userJson
	delete(sendConfig, "userMes")
	c.JSON(200, sendConfig)
}
