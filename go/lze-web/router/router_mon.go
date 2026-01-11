package router

import (
	"lze-web/service/mon"

	"github.com/gin-gonic/gin"
)

func RouterMon(r *gin.Engine) {
	loginGroup := r.Group("/api/mon")
	{
		loginGroup.GET("/list", mon.List)
		loginGroup.GET("/userList", mon.UserList)
		loginGroup.DELETE("/userList", mon.DelUserList)
		loginGroup.PATCH("/date", mon.Date)
		loginGroup.POST("/cmd", mon.Cmd)
		loginGroup.PATCH("/update_act", mon.UpdateAct)
	}
}
