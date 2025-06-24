package mon

import (
	"lze-web/pkg/global"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func List(c *gin.Context) {
	sendConfig := global.JsonToMap(global.ReadText(filepath.Join(global.WorkDir, "config", "user_config.json")))
	userConfig := sendConfig["user"].(map[string]interface{})
	for _, userMes := range userConfig {
		if userMap, ok := userMes.(map[string]interface{}); ok {
			delete(userMap, "token")
			delete(userMap, "password")
		}
	}
	c.JSON(200, sendConfig)
}
