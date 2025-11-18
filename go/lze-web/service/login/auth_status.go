package login

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func AuthStatus(c *gin.Context) {
	global.InitUserMes(c)
	if !global.CheckToken(c) {
		c.Status(401)
		return
	}
	c.Status(200)
}
