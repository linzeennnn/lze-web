package mon

import (
	userlist "lze-web/model/mon/userList"
	"lze-web/pkg/global"

	"github.com/gin-gonic/gin"
)

func UserList(c *gin.Context) {
	global.InitUserMes(c)
	ok, status := checkPermit(c, "")
	if ok {
		c.JSON(status, global.UserList)
	} else {
		c.Status(status)
	}

}
func DelUserList(c *gin.Context) {
	var rec userlist.Rec
	if err := c.ShouldBindJSON(&rec); err != nil {
		c.JSON(200, err)
		return
	}
	global.InitUserMes(c)
	ok, status := checkPermit(c, rec.Name)
	if ok {
		global.RemoveUser(rec.Name)
		c.JSON(status, global.UserList)
	} else {
		c.Status(status)
	}
}
func checkPermit(c *gin.Context, name string) (bool, int) {

	curUserMes, _ := c.MustGet("curUserMes").(*global.Claims)
	if curUserMes.Name != "admin" {
		return false, 403
	}
	if !global.CheckToken(c) {
		return false, 401
	}
	if name == "admin" || name == "guest" {
		return false, 405
	}
	return true, 200
}
