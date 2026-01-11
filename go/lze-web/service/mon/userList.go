package mon

import (
	userlist "lze-web/model/mon/userList"
	"lze-web/model/public/response"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func UserList(c *gin.Context) {
	global.InitUserMes(c)
	var sendData response.Response[[]string]
	code, _ := checkPermit(c, "")
	if code == 200 {
		sendData.Data = global.UserList
	}
	sendData.Code = 200
	c.JSON(sendData.Code, sendData)

}
func DelUserList(c *gin.Context) {
	var rec userlist.Rec
	var msg string
	var sendData response.Response[[]string]
	if err := c.ShouldBindJSON(&rec); err != nil {
		sendData.Code = 400
		sendData.Msg = err.Error()
		c.JSON(400, sendData)
		return
	}
	global.InitUserMes(c)
	sendData.Code, msg = checkPermit(c, rec.Name)
	sendData.Msg = global.GetText(msg, c)
	if sendData.Code == 200 {
		global.RemoveUser(rec.Name)
	}
	sendData.Data = global.UserList
	c.JSON(sendData.Code, sendData)
}
func checkPermit(c *gin.Context, name string) (int, string) {
	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	if curUserMes.Name != "admin" {
		return 403, "no_delUser_per"
	}
	if !global.CheckToken(c) {
		return 401, "login_outdate"
	}
	if name == "admin" || name == "guest" {
		return 405, "delUser_not_allowed"
	}
	return 200, "delUser_success"
}
