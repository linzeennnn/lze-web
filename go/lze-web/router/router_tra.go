package router

import (
	"lze-web/service/tra"

	"github.com/gin-gonic/gin"
)

func RouterTra(r *gin.Engine) {
	loginGroup := r.Group("/server/tra")
	{
		loginGroup.POST("/list", tra.List)
		loginGroup.POST("/recover", tra.Recover)
		loginGroup.POST("/del", tra.Del)
	}

}
