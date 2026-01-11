package router

import (
	"lze-web/service/plugin"

	"github.com/gin-gonic/gin"
)

func RouterPlugin(r *gin.Engine) {
	r.GET("/api/plugin/*path", plugin.GetRun)
	r.POST("/api/plugin/*path", plugin.PostRun)
}
