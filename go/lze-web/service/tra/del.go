package tra

import (
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var sendData response.Response[string]
	global.InitUserMes(c)
	if global.CheckPermit(c, "tra", "clean") {
		os.RemoveAll(global.TraPath)
		os.MkdirAll(global.TraPath, 0755)
		global.CleanDelData()
		sendData.Code = 200
		sendData.Msg = global.GetText("clean_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_clean_per", c)
		c.JSON(403, sendData)
	}

}
