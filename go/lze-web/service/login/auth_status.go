package login

import (
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func AuthStatus(c *gin.Context) {
	var sendData response.Response[string]
	global.InitUserMes(c)
	if !global.CheckToken(c) {
		sendData.Code = 401
		sendData.Msg = global.GetText("user_auth_fail", c)
		c.JSON(401, sendData)
		return
	}
	sendData.Code = 200
	sendData.Msg = global.GetText("user_auth_success", c)
	c.JSON(200, sendData)
}
