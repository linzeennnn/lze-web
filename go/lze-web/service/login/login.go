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
	var sendData response.Response[loginModel.Send]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	userMesJson, _ := global.DecodeUserMes(rec.UserMes, string(global.JwtKey))
	var userMes loginModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	token, isRight := global.CheckPassword(userMes.Name, userMes.Password)
	if isRight {
		var Data loginModel.Send
		Data.Token = token
		sendData.Code = 200
		sendData.Data = Data
		sendData.Msg = global.GetText("login_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("user_password_err", c)
		c.JSON(401, sendData)
	}
}
func GetLogin(c *gin.Context) {
	var sendData response.Response[string]
	sendData.Code = 200
	sendData.Data = base64.StdEncoding.EncodeToString([]byte(global.JwtKey))
	c.JSON(200, sendData)
}
