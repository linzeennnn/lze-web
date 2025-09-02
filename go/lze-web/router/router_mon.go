package router

import (
	"lze-web/service/mon"

	"github.com/gin-gonic/gin"
)

func RouterMon(r *gin.Engine) {
	loginGroup := r.Group("/server/mon")
	{
		loginGroup.GET("/list", mon.List)
		loginGroup.POST("/date", mon.Date)
		loginGroup.POST("/cmd", mon.Cmd)
		loginGroup.POST("/update_act", mon.UpdateAct)
	}
}
