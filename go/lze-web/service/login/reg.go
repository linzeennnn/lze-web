package login

import (
	"encoding/json"
	userMes "lze-web/model/config"
	regModel "lze-web/model/login/reg"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Reg(c *gin.Context) {
	var rec regModel.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	userMesJson, _ := global.DecodeUserMes(rec.UserMes, string(global.JwtKey))
	var userMes regModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	global.InitUserMes(c)

	if checkPermit(c) {
		ok, mes := addUser(userMes.Name, userMes.Password)
		if ok {
			initPermit(userMes.Name)
			global.SaveUserConfig()
			c.Status(200)
		} else {
			c.String(401, mes)
		}
	} else {
		c.String(401, "no_per")
	}
}
func checkPermit(c *gin.Context) bool {

	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	if curUserMes.Name != "admin" {
		return false
	}
	if !global.CheckToken(c) {
		return false
	}
	return true
}
func addUser(userName, password string) (bool, string) {
	if global.CheckUserExist(userName) {
		return false, "user_ext"
	} else {
		global.UserList = append(global.UserList, userName)

		var newUser userMes.UserMes
		newUser.Name = userName
		newUser.Password = password
		newUser.Exp = 24*365 + global.GetTimeStamp()
		newUser.Outdate = "1y"
		newUser.Jti = global.GenJti()
		global.UserArr = append(global.UserArr, newUser)
		return true, "success"
	}
}
func initPermit(userName string) {
	// bok
	global.PermitAdd(userName, "bok", "newbok")

	// doc
	global.PermitAdd(userName, "doc", "copy")
	global.PermitAdd(userName, "doc", "downdir")
	global.PermitAdd(userName, "doc", "downfile")
	global.PermitAdd(userName, "doc", "link")
	global.PermitAdd(userName, "doc", "move")
	global.PermitAdd(userName, "doc", "newdir")
	global.PermitAdd(userName, "doc", "rename")
	global.PermitAdd(userName, "doc", "updir")
	global.PermitAdd(userName, "doc", "upfile")

	// home
	global.PermitAdd(userName, "home", "viewdoc")
	global.PermitAdd(userName, "home", "viewnote")
	global.PermitAdd(userName, "home", "viewpic")

	// not（无 delete）
	global.PermitAdd(userName, "not", "edit")
	global.PermitAdd(userName, "not", "newnote")
	global.PermitAdd(userName, "not", "upload")

	// pic
	global.PermitAdd(userName, "pic", "upload")

	// tra
	global.PermitAdd(userName, "tra", "clean")
	global.PermitAdd(userName, "tra", "recover")

}
