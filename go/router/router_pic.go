package router

import (
	"lze-web/service/pic"

	"github.com/gin-gonic/gin"
)

func RouterPic(r *gin.Engine) {
	loginGroup := r.Group("/server/pic")
	{
		loginGroup.POST("/list", pic.List)
	}

}
