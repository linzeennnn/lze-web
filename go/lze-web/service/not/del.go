package not

import (
	"lze-web/model/not/del"
	"lze-web/model/public/response"
	"lze-web/pkg/global"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func Del(c *gin.Context) {
	var rec del.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	global.InitUserMes(c)
	if global.CheckPermit(c, "not", "delete") {
		err := os.Remove(filepath.Join(global.NotPath, rec.FileName+".txt"))
		if err != nil {
			sendData.Code = 400
			sendData.Msg = global.GetText("del_fail", c) + err.Error()
			c.JSON(sendData.Code, sendData)
		} else {
			sendData.Code = 200
			sendData.Msg = global.GetText("del_success", c)
			c.JSON(sendData.Code, sendData)
		}

	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("no_del_per", c)
		c.JSON(sendData.Code, sendData)
		c.Status(sendData.Code)
	}

}
