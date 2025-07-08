package login

import (
	loginModel "lze-web/model/login/login"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var rec loginModel.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	username := rec.Name
	password := rec.Password
	token, isRight := global.CheckPassword(username, password)
	if isRight {
		var sendData loginModel.Send
		sendData.Token = token
		c.JSON(200, sendData)
	} else {
		c.Status(401)
	}
}
