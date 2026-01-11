package router

import (
	"lze-web/service/not"

	"github.com/gin-gonic/gin"
)

func RouterNot(r *gin.Engine) {
	loginGroup := r.Group("/api/not")
	{
		loginGroup.GET("/list", not.List)
		loginGroup.DELETE("/del", not.Del)
		loginGroup.POST("/add", not.Add)
		loginGroup.POST("/edit", not.Edit)
		loginGroup.POST("/getText", not.GetText)
		loginGroup.POST("/upload", not.Upload)
	}

}
