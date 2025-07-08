package login

import (
	authstatus "lze-web/model/login/auth_status"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func AuthStatus(c *gin.Context) {
	var rec authstatus.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	token := rec.Token
	username := rec.Name
	if !global.CheckToken(username, token) {
		c.Status(401)
		return
	}
	c.Status(200)
}
