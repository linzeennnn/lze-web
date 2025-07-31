package login

import (
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func AuthStatus(c *gin.Context) {
	user, token := global.GetAuthMes(c)
	if !global.CheckToken(user, token) {
		c.Status(401)
		return
	}
	c.Status(200)
}
