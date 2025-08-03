package router

import (
	"lze-web/service/login"

	"github.com/gin-gonic/gin"
)

func RouterLogin(r *gin.Engine) {
	loginGroup := r.Group("/server/login")
	{
		loginGroup.POST("/auth_status", login.AuthStatus)
		loginGroup.POST("/login", login.Login)
		loginGroup.POST("/upload", login.Upload)
	}
}
