package router

import (
	"lze-web/service/pic"

	"github.com/gin-gonic/gin"
)

func RouterPic(r *gin.Engine) {
	loginGroup := r.Group("/api/pic")
	{
		loginGroup.POST("/list", pic.List)
		loginGroup.POST("/upload", pic.Upload)
		loginGroup.POST("/edit", pic.Edit)
		loginGroup.DELETE("/del", pic.Delete)
	}

}
