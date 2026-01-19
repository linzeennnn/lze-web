package login

import (
	"encoding/json"
	"fmt"
	userMes "lze-web/model/config"
	regModel "lze-web/model/login/reg"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func Reg(c *gin.Context) {
	var rec regModel.Rec
	var sendData response.Response[string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(sendData.Code, sendData)
		return
	}
	userMesJson, _ := global.DecodeUserMes(rec.UserMes, string(global.JwtKey))
	var userMes regModel.UserMes
	json.Unmarshal([]byte(userMesJson), &userMes)
	global.InitUserMes(c)

	if checkPermit(c) {
		ok, msg := addUser(userMes.Name, userMes.Password)
		if ok {
			initPermit(userMes.Name)
			global.SaveUserConfig()
			sendData.Code = 200
			sendData.Msg = global.GetText(msg, c)
			c.JSON(200, sendData)
		} else {
			sendData.Code = 401
			sendData.Msg = global.GetText("reg_fail", c) + ":" + global.GetText(msg, c)
			c.JSON(401, sendData)
		}
	} else {
		sendData.Code = 403
		sendData.Msg = global.GetText("reg_fail", c) + ":" + global.GetText("no_per", c)
		c.JSON(403, sendData)
	}
}
func checkPermit(c *gin.Context) bool {

	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	fmt.Println(curUserMes.Name)
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
		return true, "reg_success"
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
