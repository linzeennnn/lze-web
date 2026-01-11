package router

import (
	"lze-web/service/login"

	"github.com/gin-gonic/gin"
)

func RouterLogin(r *gin.Engine) {
	loginGroup := r.Group("/api/login")
	{
		loginGroup.GET("/auth_status", login.AuthStatus)
		loginGroup.POST("/login", login.Login)
		loginGroup.GET("/login", login.GetLogin)
		loginGroup.POST("/modPas", login.ModPas)
		loginGroup.POST("/register", login.Reg)
		loginGroup.POST("/upload", login.Upload)
	}
}
