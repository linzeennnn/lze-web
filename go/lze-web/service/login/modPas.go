package login

import (
	"encoding/json"
	modPasModel "lze-web/model/login/modPas"
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
	var userMes modPasModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	if ModPassword(c, userMes.OldPas, userMes.NewPas) {

		c.Status(200)
	} else {
		c.Status(401)
	}
}
func ModPassword(c *gin.Context, oldPas string, newPas string) bool {
	if !global.CheckToken(c) {
		return false
	}
	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	userMes := global.GetUserMes(curUserMes.Name)
	if userMes.Password == oldPas {
		userMes.Password = newPas
		global.SaveUserConfig()
	} else {
		return false
	}
	return true
}
