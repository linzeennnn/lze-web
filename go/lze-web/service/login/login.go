package login

import (
	"encoding/base64"
	"encoding/json"
	loginModel "lze-web/model/login/login"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var rec loginModel.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	userMesJson, _ := global.DecodeUserMes(rec.UserMes, string(global.JwtKey))
	var userMes loginModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	token, isRight := global.CheckPassword(userMes.Name, userMes.Password)
	if isRight {
		var sendData loginModel.Send
		sendData.Token = token
		c.JSON(200, sendData)
	} else {
		c.Status(401)
	}
}
func GetLogin(c *gin.Context) {
	var sendData response.Response[string]
	sendData.Code = 200
	sendData.Data = base64.StdEncoding.EncodeToString([]byte(global.JwtKey))
	c.JSON(200, sendData)
}
