package router

import (
	"lze-web/service/home"

	"github.com/gin-gonic/gin"
)

func RouterHome(r *gin.Engine) {
	loginGroup := r.Group("/server/home")
	{
		loginGroup.POST("/widget", home.Widget)
	}
}
