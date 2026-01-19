package router

import (
	"lze-web/service/bok"

	"github.com/gin-gonic/gin"
)

func RouterBok(r *gin.Engine) {
	loginGroup := r.Group("/api/bok")
	{
		loginGroup.GET("/list", bok.List)
		loginGroup.DELETE("/del", bok.Del)
		loginGroup.POST("/add", bok.Add)
		loginGroup.POST("/get_url", bok.GetUrl)
	}

}
