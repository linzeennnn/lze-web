package router

import (
	"lze-web/service/system"

	"github.com/gin-gonic/gin"
)

func RouterSystem(r *gin.Engine) {
	loginGroup := r.Group("/server/system")
	{
		loginGroup.GET("/system", system.System)
	}
}
