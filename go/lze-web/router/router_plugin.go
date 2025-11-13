package router

import (
	"lze-web/service/plugin"

	"github.com/gin-gonic/gin"
)

func RouterPlugin(r *gin.Engine) {
	r.GET("/server/plugin/*path", plugin.GetRun)
	r.POST("/server/plugin/*path", plugin.PostRun)
}
