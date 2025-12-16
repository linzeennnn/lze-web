package login

import (
	"encoding/json"
	modPasModel "lze-web/model/login/modPas"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func ModPas(c *gin.Context) {
	var rec modPasModel.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	global.InitUserMes(c)
	userMesJson, _ := global.DecodeUserMes(rec.UserMes, string(global.JwtKey))
	var sendData response.Response[modPasModel.Send]
	var userMes modPasModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	ok, token := ModPassword(c, userMes.OldPas, userMes.NewPas)
	if ok {
		sendData.Code = 200
		sendData.Data.Token = token
		sendData.Msg = global.GetText("mod_pas_success", c)
		c.JSON(200, sendData)
	} else {
		sendData.Code = 401
		sendData.Msg = global.GetText("mod_pas_fail", c)
		c.JSON(401, sendData)
	}
}
func ModPassword(c *gin.Context, oldPas string, newPas string) (bool, string) {
	if !global.CheckToken(c) {
		return false, ""
	}
	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	userMes := global.GetUserMes(curUserMes.Name)
	if userMes.Password == oldPas {
		userMes.Password = newPas
		return true, global.UpdateJwt(userMes.Name)
	} else {
		return false, ""
	}
}
